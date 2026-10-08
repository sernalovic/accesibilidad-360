import { prisma } from "@/lib/db/prisma";
import type { EstablishmentInput } from "../schemas/establishment.schema";
import { geocodeAddress } from "./geocoding.service";
import { deleteUploadedPhoto } from "@/features/photos/services/photo-storage.service";
import {
  EstablishmentNotFoundError,
  ForbiddenEstablishmentError,
  canManageEstablishment,
  type EstablishmentActor,
} from "./establishment-permissions";

// Reexportados para las Server Actions (evitan importar dos módulos).
export { EstablishmentNotFoundError, ForbiddenEstablishmentError };

export class CategoryNotFoundError extends Error {
  readonly code = "CATEGORY_NOT_FOUND" as const;

  constructor() {
    super("La categoría seleccionada no es válida.");
    this.name = "CategoryNotFoundError";
  }
}

export class ProvinceNotFoundError extends Error {
  readonly code = "PROVINCE_NOT_FOUND" as const;

  constructor() {
    super("La provincia seleccionada no es válida.");
    this.name = "ProvinceNotFoundError";
  }
}

export class MunicipalityNotFoundError extends Error {
  readonly code = "MUNICIPALITY_NOT_FOUND" as const;

  constructor() {
    super("El municipio seleccionado no es válido para esa provincia.");
    this.name = "MunicipalityNotFoundError";
  }
}

export interface CreatedEstablishment {
  id: string;
  name: string;
}

export interface EstablishmentListItem {
  id: string;
  name: string;
  municipality: string;
  province: string;
  createdAt: Date;
  category: { name: string };
  createdBy: { name: string | null };
  // Media dinámica (SPEC-040): siempre number (0 sin valoraciones).
  averageScore: number;
  reviewCount: number;
  hasReviews: boolean;
}

export interface EstablishmentDetail extends EstablishmentListItem {
  address: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  categoryId: string;
  provinceId: string;
  municipalityId: string;
  createdById: string;
}

// Crea un establecimiento (SPEC-030) con geocodificación (SPEC-060).
// `userId` procede siempre de la sesión, nunca del cliente.
// Provincia y municipio normalizados (SPEC-035): se verifican y sus
// nombres oficiales alimentan la geocodificación. Si esta falla,
// los campos quedan a null sin impedir la creación.
export async function createEstablishment(
  data: EstablishmentInput,
  userId: string,
): Promise<CreatedEstablishment> {
  const { province, municipality } = await validateEstablishmentReferences(data);

  const coordinates = await geocodeAddress({
    address: data.address,
    municipality: municipality.name,
    province: province.name,
  });

  return prisma.establishment.create({
    data: {
      name: data.name,
      description: data.description || null,
      address: data.address,
      provinceId: province.id,
      municipalityId: municipality.id,
      latitude: coordinates?.latitude ?? null,
      longitude: coordinates?.longitude ?? null,
      categoryId: data.categoryId,
      createdById: userId,
    },
    select: { id: true, name: true },
  });
}

interface ValidatedReferences {
  province: { id: string; name: string };
  municipality: { id: string; name: string };
}

// Verificación compartida por creación y edición (SPEC-080).
// Garantiza categoría, provincia y municipio-perteneciente válidos.
async function validateEstablishmentReferences(
  data: EstablishmentInput,
): Promise<ValidatedReferences> {
  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) {
    throw new CategoryNotFoundError();
  }

  const province = await prisma.province.findUnique({ where: { id: data.provinceId } });
  if (!province) {
    throw new ProvinceNotFoundError();
  }

  const municipality = await prisma.municipality.findUnique({
    where: { id: data.municipalityId },
    select: { id: true, name: true, provinceId: true },
  });
  if (!municipality || municipality.provinceId !== province.id) {
    throw new MunicipalityNotFoundError();
  }

  return {
    province: { id: province.id, name: province.name },
    municipality: { id: municipality.id, name: municipality.name },
  };
}

// Actualiza un establecimiento (SPEC-080).
// Solo creador o ADMIN (verificado contra BD). Recalcula coordenadas
// únicamente si cambian dirección, municipio o provincia; si no,
// preserva las existentes sin llamar a geocodificación.
// Fotografías, valoraciones y Cloudinary no se tocan.
export async function updateEstablishment(
  id: string,
  data: EstablishmentInput,
  actor: EstablishmentActor,
): Promise<CreatedEstablishment> {
  const current = await prisma.establishment.findUnique({
    where: { id },
    select: {
      createdById: true,
      address: true,
      municipalityId: true,
      provinceId: true,
      latitude: true,
      longitude: true,
    },
  });
  if (!current) {
    throw new EstablishmentNotFoundError();
  }
  if (!canManageEstablishment(actor, current.createdById)) {
    throw new ForbiddenEstablishmentError();
  }

  const { province, municipality } = await validateEstablishmentReferences(data);

  const geoChanged =
    data.address !== current.address ||
    data.municipalityId !== current.municipalityId ||
    data.provinceId !== current.provinceId;

  const coordinates = geoChanged
    ? await geocodeAddress({
        address: data.address,
        municipality: municipality.name,
        province: province.name,
      })
    : { latitude: current.latitude, longitude: current.longitude };

  return prisma.establishment.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description || null,
      address: data.address,
      provinceId: province.id,
      municipalityId: municipality.id,
      latitude: coordinates?.latitude ?? null,
      longitude: coordinates?.longitude ?? null,
      categoryId: data.categoryId,
    },
    select: { id: true, name: true },
  });
}

// Elimina un establecimiento (SPEC-080).
// Solo creador o ADMIN. Las filas asociadas (valoraciones, fotos)
// caen por las cascadas documentadas (ADR-002/003); los ficheros de
// Cloudinary se eliminan antes con su publicId para no dejar huérfanos.
export async function deleteEstablishment(id: string, actor: EstablishmentActor): Promise<void> {
  const current = await prisma.establishment.findUnique({
    where: { id },
    select: {
      createdById: true,
      photos: { select: { publicId: true } },
    },
  });
  if (!current) {
    throw new EstablishmentNotFoundError();
  }
  if (!canManageEstablishment(actor, current.createdById)) {
    throw new ForbiddenEstablishmentError();
  }

  for (const photo of current.photos) {
    await deleteUploadedPhoto(photo.publicId);
  }
  await prisma.establishment.delete({ where: { id } });
}

// Filtros de búsqueda (SPEC-070, 1.ª entrega). Todos opcionales y
// combinables; se reflejan tal cual en la URL.
export interface EstablishmentFilters {
  search?: string;
  categoryId?: string;
  provinceId?: string;
  municipalityId?: string;
  sort?: string;
}

export type EstablishmentSort = "recent" | "oldest" | "name-asc" | "name-desc" | "rating";

const DEFAULT_SORT: EstablishmentSort = "recent";

const SORT_OPTIONS: EstablishmentSort[] = ["recent", "oldest", "name-asc", "name-desc", "rating"];

function normalizeSort(sort: string | undefined): EstablishmentSort {
  const candidate = sort?.trim() ?? "";
  return (SORT_OPTIONS as string[]).includes(candidate)
    ? (candidate as EstablishmentSort)
    : DEFAULT_SORT;
}

function normalizeFilter(value: string | undefined): string | undefined {
  const trimmed = value?.trim() ?? "";
  return trimmed === "" ? undefined : trimmed;
}

// Lista los establecimientos para /establishments (SPEC-030, 2.ª entrega).
// Envoltorio semántico de searchEstablishments({}) para preservar la API.
export async function listEstablishments(): Promise<EstablishmentListItem[]> {
  return searchEstablishments({});
}

// Búsqueda con filtros dinámicos (SPEC-070, 1.ª entrega).
// Un único constructor del `where`: solo las condiciones con valor.
// `select` explícito en todo (sin `include`); la media se calcula en JS.
export async function searchEstablishments(
  filters: EstablishmentFilters,
): Promise<EstablishmentListItem[]> {
  const search = normalizeFilter(filters.search);
  const categoryId = normalizeFilter(filters.categoryId);
  const provinceId = normalizeFilter(filters.provinceId);
  const municipalityId = normalizeFilter(filters.municipalityId);
  const sort = normalizeSort(filters.sort);

  const rows = await prisma.establishment.findMany({
    where: {
      ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(provinceId ? { provinceId } : {}),
      ...(municipalityId ? { municipalityId } : {}),
    },
    orderBy:
      sort === "oldest"
        ? { createdAt: "asc" as const }
        : sort === "name-asc"
          ? { name: "asc" as const }
          : sort === "name-desc"
            ? { name: "desc" as const }
            : { createdAt: "desc" as const },
    select: {
      id: true,
      name: true,
      municipality: { select: { name: true } },
      province: { select: { name: true } },
      createdAt: true,
      category: { select: { name: true } },
      createdBy: { select: { name: true } },
      reviews: { select: { scores: { select: { score: true } } } },
    },
  });
  // Se aplana a strings para no cambiar la forma consumida (SPEC-035).
  const items = rows.map(({ reviews, municipality, province, ...rest }) => ({
    ...rest,
    municipality: municipality.name,
    province: province.name,
    ...summarizeScores(reviews),
  }));

  // Limitación conocida del MVP (SPEC-070): Prisma no puede ordenar por
  // la media calculada en JS, así que "rating" se ordena en memoria.
  // Con el volumen actual es despreciable; si los datos crecen, la
  // evolución prevista es una media materializada o agregación en BD.
  if (sort !== "rating") {
    return items;
  }
  return [...items].sort(
    (a, b) => b.averageScore - a.averageScore || b.createdAt.getTime() - a.createdAt.getTime(),
  );
}

export interface MappedEstablishment {
  id: string;
  name: string;
  category: string;
  municipality: string;
  province: string;
  latitude: number;
  longitude: number;
  averageScore: number;
  reviewCount: number;
  hasReviews: boolean;
  photoUrl: string | null;
}

// Establecimientos geolocalizados para el mapa global (SPEC-090).
// Una única consulta: solo con coordenadas, con la primera fotografía
// y las puntuaciones para la media (reutiliza summarizeScores).
// `select` explícito en todo, sin `include`.
export async function listMappedEstablishments(): Promise<MappedEstablishment[]> {
  const rows = await prisma.establishment.findMany({
    where: { latitude: { not: null }, longitude: { not: null } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
      createdAt: true,
      category: { select: { name: true } },
      municipality: { select: { name: true } },
      province: { select: { name: true } },
      photos: {
        select: { url: true },
        orderBy: { createdAt: "asc" },
        take: 1,
      },
      createdBy: { select: { name: true } },
      reviews: { select: { scores: { select: { score: true } } } },
    },
  });
  return rows.map(({ reviews, municipality, province, category, photos, ...rest }) => ({
    id: rest.id,
    name: rest.name,
    category: category.name,
    municipality: municipality.name,
    province: province.name,
    // Garantizados por el `where`, pero tipados como anulables.
    latitude: rest.latitude ?? 0,
    longitude: rest.longitude ?? 0,
    photoUrl: photos[0]?.url ?? null,
    ...summarizeScores(reviews),
  }));
}

// Detalle para /establishments/[id] (SPEC-030, 2.ª entrega).
// Retorna null si no existe; la página responde con notFound().
export async function getEstablishmentById(id: string): Promise<EstablishmentDetail | null> {
  const row = await prisma.establishment.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      address: true,
      municipality: { select: { name: true } },
      province: { select: { name: true } },
      description: true,
      latitude: true,
      longitude: true,
      categoryId: true,
      provinceId: true,
      municipalityId: true,
      createdById: true,
      createdAt: true,
      category: { select: { name: true } },
      createdBy: { select: { name: true } },
      reviews: { select: { scores: { select: { score: true } } } },
    },
  });
  if (!row) {
    return null;
  }
  const { reviews, municipality, province, ...rest } = row;
  return {
    ...rest,
    municipality: municipality.name,
    province: province.name,
    ...summarizeScores(reviews),
  };
}

interface ReviewScores {
  scores: { score: number | null }[];
}

// Media redondeada a un decimal sobre una lista de puntuaciones.
// Exportada para reutilizar el mismo cálculo fuera del módulo
// (p. ej. dashboard) sin duplicar la fórmula.
export function averageScoreOf(scores: number[]): number {
  if (scores.length === 0) {
    return 0;
  }
  const total = scores.reduce((sum, score) => sum + score, 0);
  return Math.round((total / scores.length) * 10) / 10;
}

// Media redondeada a un decimal sobre todas las puntuaciones.
// Sin valoraciones: averageScore 0 y hasReviews false (nunca null).
function summarizeScores(reviews: ReviewScores[]): {
  averageScore: number;
  reviewCount: number;
  hasReviews: boolean;
} {
  const allScores = reviews.flatMap((review) =>
    review.scores.map((entry) => entry.score).filter((score): score is number => score !== null),
  );
  return {
    averageScore: averageScoreOf(allScores),
    reviewCount: reviews.length,
    hasReviews: allScores.length > 0,
  };
}
