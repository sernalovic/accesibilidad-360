import { prisma } from "@/lib/db/prisma";
import { deleteUploadedPhoto, uploadPhotoBuffer } from "./photo-storage.service";

// Dimensiones mínimas documentadas en SPEC-050.
export const MIN_PHOTO_WIDTH = 800;
export const MIN_PHOTO_HEIGHT = 600;

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

export interface StoredPhoto {
  id: string;
  url: string;
}

export interface EstablishmentPhotoItem {
  id: string;
  url: string;
}

// Sube la fotografía de un establecimiento (SPEC-050, 1.ª entrega).
// `userId` procede siempre de la sesión. La regla "una por
// establecimiento" vive aquí para no bloquear la futura galería.
export async function uploadEstablishmentPhoto(
  establishmentId: string,
  userId: string,
  file: File,
): Promise<StoredPhoto> {
  // TEMP-DEBUG (retirar tras verificar en Vercel).
  console.log("[debug-upload] 5.1. inicio del servicio", {
    establishmentId,
    userId,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  });
  const establishment = await prisma.establishment.findUnique({
    where: { id: establishmentId },
    select: { id: true },
  });
  // TEMP-DEBUG (retirar tras verificar en Vercel).
  console.log("[debug-upload] 5.2. establecimiento", establishment ? "encontrado" : "NO_EXISTE");
  if (!establishment) {
    throw new EstablishmentNotFoundError();
  }

  const existing = await prisma.photo.findFirst({
    where: { establishmentId },
    select: { id: true },
  });
  // TEMP-DEBUG (retirar tras verificar en Vercel).
  console.log("[debug-upload] 5.3. duplicado", existing ? "EXISTE" : "no");
  if (existing) {
    throw new PhotoAlreadyExistsError();
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  // TEMP-DEBUG (retirar tras verificar en Vercel).
  console.log("[debug-upload] 5.4. buffer creado", { bytes: buffer.length });
  // TEMP-DEBUG (retirar tras verificar en Vercel).
  console.log("[debug-upload] 5.5. invocando subida a Cloudinary");
  const uploaded = await uploadPhotoBuffer(buffer);
  // TEMP-DEBUG (retirar tras verificar en Vercel).
  console.log("[debug-upload] 5.6. dimensiones", {
    width: uploaded.width,
    height: uploaded.height,
    publicId: uploaded.publicId,
  });
  if (uploaded.width < MIN_PHOTO_WIDTH || uploaded.height < MIN_PHOTO_HEIGHT) {
    await deleteUploadedPhoto(uploaded.publicId);
    throw new PhotoTooSmallError();
  }

  // TEMP-DEBUG (retirar tras verificar en Vercel).
  console.log("[debug-upload] 8. escritura en Prisma");
  const photo = await prisma.photo.create({
    data: {
      establishmentId,
      userId,
      url: uploaded.url,
      publicId: uploaded.publicId,
      isPrimary: true,
    },
    select: { id: true, url: true },
  });
  // TEMP-DEBUG (retirar tras verificar en Vercel).
  console.log("[debug-upload] 8. foto persistida", { id: photo.id });
  return photo;
}

// Lista las fotografías para la ficha (SPEC-050).
// Hoy at most una; preparado para la futura galería.
export async function listPhotosByEstablishment(
  establishmentId: string,
): Promise<EstablishmentPhotoItem[]> {
  return prisma.photo.findMany({
    where: { establishmentId },
    orderBy: { createdAt: "asc" },
    select: { id: true, url: true },
  });
}
