import { prisma } from "@/lib/db/prisma";
import type { EstablishmentInput } from "../schemas/establishment.schema";

export class CategoryNotFoundError extends Error {
  readonly code = "CATEGORY_NOT_FOUND" as const;

  constructor() {
    super("La categoría seleccionada no es válida.");
    this.name = "CategoryNotFoundError";
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
}

export interface EstablishmentDetail extends EstablishmentListItem {
  address: string;
  description: string | null;
}

// Crea un establecimiento (SPEC-030).
// `userId` procede siempre de la sesión, nunca del cliente.
// Solo datos básicos de ficha; fotografías, valoraciones y
// accesibilidad llegarán en sus fases.
export async function createEstablishment(
  data: EstablishmentInput,
  userId: string,
): Promise<CreatedEstablishment> {
  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) {
    throw new CategoryNotFoundError();
  }

  return prisma.establishment.create({
    data: {
      name: data.name,
      description: data.description || null,
      address: data.address,
      municipality: data.municipality,
      province: data.province,
      categoryId: data.categoryId,
      createdById: userId,
    },
    select: { id: true, name: true },
  });
}

// Lista los establecimientos para /establishments (SPEC-030, 2.ª entrega).
// Orden fijo createdAt DESC. `select` explícito: nunca el User completo.
export async function listEstablishments(): Promise<EstablishmentListItem[]> {
  return prisma.establishment.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      municipality: true,
      province: true,
      createdAt: true,
      category: { select: { name: true } },
      createdBy: { select: { name: true } },
    },
  });
}

// Detalle para /establishments/[id] (SPEC-030, 2.ª entrega).
// Retorna null si no existe; la página responde con notFound().
export async function getEstablishmentById(id: string): Promise<EstablishmentDetail | null> {
  return prisma.establishment.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      address: true,
      municipality: true,
      province: true,
      description: true,
      createdAt: true,
      category: { select: { name: true } },
      createdBy: { select: { name: true } },
    },
  });
}
