import { prisma } from "@/lib/db/prisma";
import { canManageOwnerOrAdmin, type Actor } from "@/lib/permissions";
import { deleteUploadedPhoto, uploadPhotoBuffer } from "./photo-storage.service";

// Dimensiones mínimas documentadas en SPEC-050.
export const MIN_PHOTO_WIDTH = 800;
export const MIN_PHOTO_HEIGHT = 600;

// Máximo de fotografías por establecimiento (SPEC-120).
export const MAX_PHOTOS_PER_ESTABLISHMENT = 10;

export class EstablishmentNotFoundError extends Error {
  readonly code = "ESTABLISHMENT_NOT_FOUND" as const;

  constructor() {
    super("El establecimiento no existe.");
    this.name = "EstablishmentNotFoundError";
  }
}

export class PhotoAlreadyExistsError extends Error {
  readonly code = "PHOTO_ALREADY_EXISTS" as const;

  constructor() {
    super("Este establecimiento ya tiene una fotografía.");
    this.name = "PhotoAlreadyExistsError";
  }
}

export class PhotoTooSmallError extends Error {
  readonly code = "PHOTO_TOO_SMALL" as const;

  constructor() {
    super("La imagen debe tener al menos 800 × 600 píxeles.");
    this.name = "PhotoTooSmallError";
  }
}

export class PhotoLimitReachedError extends Error {
  readonly code = "PHOTO_LIMIT_REACHED" as const;

  constructor() {
    super("Has alcanzado el máximo de 10 fotografías por establecimiento.");
    this.name = "PhotoLimitReachedError";
  }
}

export interface StoredPhoto {
  id: string;
  url: string;
}

export interface EstablishmentPhotoItem {
  id: string;
  url: string;
  userId: string;
  isPrimary: boolean;
}

// Sube una fotografía a la galería (SPEC-050 + SPEC-120).
// `userId` procede siempre de la sesión. La primera es principal;
// las siguientes, secundarias. Máximo 10 por establecimiento.
export async function uploadEstablishmentPhoto(
  establishmentId: string,
  userId: string,
  file: File,
): Promise<StoredPhoto> {
  const establishment = await prisma.establishment.findUnique({
    where: { id: establishmentId },
    select: { id: true },
  });
  if (!establishment) {
    throw new EstablishmentNotFoundError();
  }

  const photoCount = await prisma.photo.count({ where: { establishmentId } });
  if (photoCount >= MAX_PHOTOS_PER_ESTABLISHMENT) {
    throw new PhotoLimitReachedError();
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await uploadPhotoBuffer(buffer);
  if (uploaded.width < MIN_PHOTO_WIDTH || uploaded.height < MIN_PHOTO_HEIGHT) {
    await deleteUploadedPhoto(uploaded.publicId);
    throw new PhotoTooSmallError();
  }

  const photo = await prisma.photo.create({
    data: {
      establishmentId,
      userId,
      url: uploaded.url,
      publicId: uploaded.publicId,
      isPrimary: photoCount === 0,
    },
    select: { id: true, url: true },
  });
  return photo;
}

// Lista las fotografías para la ficha y la galería (SPEC-050 + SPEC-120).
// Orden estable documentado: principal primero, resto por antigüedad.
export async function listPhotosByEstablishment(
  establishmentId: string,
): Promise<EstablishmentPhotoItem[]> {
  return prisma.photo.findMany({
    where: { establishmentId },
    orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
    select: { id: true, url: true, userId: true, isPrimary: true },
  });
}

export class PhotoNotFoundError extends Error {
  readonly code = "PHOTO_NOT_FOUND" as const;

  constructor() {
    super("La fotografía no existe.");
    this.name = "PhotoNotFoundError";
  }
}

export class ForbiddenPhotoError extends Error {
  readonly code = "FORBIDDEN_PHOTO" as const;

  constructor() {
    super("No tienes permiso para eliminar esta fotografía.");
    this.name = "ForbiddenPhotoError";
  }
}

// Elimina una fotografía (SPEC-110 + SPEC-120).
// Solo su autor o ADMIN. Primero Cloudinary y después la BD:
// si Cloudinary falla, el registro se conserva (reintentable).
// Si era la principal y quedan más, la más antigua promociona.
export async function deletePhoto(id: string, actor: Actor): Promise<{ establishmentId: string }> {
  const photo = await prisma.photo.findUnique({
    where: { id },
    select: { id: true, userId: true, publicId: true, establishmentId: true, isPrimary: true },
  });
  if (!photo) {
    throw new PhotoNotFoundError();
  }
  if (!canManageOwnerOrAdmin(actor, photo.userId)) {
    throw new ForbiddenPhotoError();
  }

  await deleteUploadedPhoto(photo.publicId);
  await prisma.photo.delete({ where: { id } });

  if (photo.isPrimary) {
    const next = await prisma.photo.findFirst({
      where: { establishmentId: photo.establishmentId },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });
    if (next) {
      await prisma.photo.update({ where: { id: next.id }, data: { isPrimary: true } });
    }
  }
  return { establishmentId: photo.establishmentId };
}

// Establece la fotografía principal (SPEC-120).
// Solo su autor o ADMIN. Desmarca la actual en la misma transacción.
export async function setPrimaryPhoto(
  id: string,
  actor: Actor,
): Promise<{ establishmentId: string }> {
  const photo = await prisma.photo.findUnique({
    where: { id },
    select: { id: true, userId: true, establishmentId: true },
  });
  if (!photo) {
    throw new PhotoNotFoundError();
  }
  if (!canManageOwnerOrAdmin(actor, photo.userId)) {
    throw new ForbiddenPhotoError();
  }

  await prisma.$transaction([
    prisma.photo.updateMany({
      where: { establishmentId: photo.establishmentId },
      data: { isPrimary: false },
    }),
    prisma.photo.update({ where: { id }, data: { isPrimary: true } }),
  ]);
  return { establishmentId: photo.establishmentId };
}
