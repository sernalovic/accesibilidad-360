import { z } from "zod";

// Límites técnicos documentados en SPEC-050.
export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const photoFileSchema = z
  .instanceof(File, { message: "Debes seleccionar una imagen." })
  .refine((file) => file.size > 0, "El archivo está vacío.")
  .refine((file) => file.size <= MAX_PHOTO_SIZE_BYTES, "La imagen no puede superar los 5 MB.")
  .refine(
    (file) => (ACCEPTED_PHOTO_TYPES as readonly string[]).includes(file.type),
    "Formato no válido. Usa JPG, PNG o WebP.",
  );

// Validación de la subida (SPEC-050). Las dimensiones mínimas se
// comprueban en el servicio con la respuesta de Cloudinary.
export const uploadPhotoSchema = z.object({
  establishmentId: z.string().trim().min(1),
  photo: photoFileSchema,
});

export type UploadPhotoInput = z.infer<typeof uploadPhotoSchema>;
