import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadedPhoto {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export class PhotoUploadError extends Error {
  constructor() {
    super("No se ha podido subir la imagen. Inténtalo de nuevo.");
    this.name = "PhotoUploadError";
  }
}

// Almacenamiento en Cloudinary (SPEC-050, ADR-004).
// Siempre desde el servidor; el API secret nunca sale de aquí.
export async function uploadPhotoBuffer(buffer: Buffer): Promise<UploadedPhoto> {
  const result = await new Promise<UploadedPhoto | undefined>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "accesibilidad360", resource_type: "image" },
      (error, uploaded) => {
        if (error || !uploaded) {
          reject(error ?? new PhotoUploadError());
          return;
        }
        resolve({
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
          width: uploaded.width,
          height: uploaded.height,
        });
      },
    );
    stream.end(buffer);
  });

  if (!result) {
    throw new PhotoUploadError();
  }
  return result;
}

// Elimina una subida para revertir validaciones posteriores
// (p. ej. dimensiones insuficientes). Sin exponer errores técnicos.
export async function deleteUploadedPhoto(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
