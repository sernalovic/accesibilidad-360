"use server";

import { auth } from "@/lib/auth/auth";
import { uploadPhotoSchema } from "../schemas/photo.schema";
import {
  EstablishmentNotFoundError,
  PhotoLimitReachedError,
  PhotoTooSmallError,
  uploadEstablishmentPhoto,
} from "../services/photo.service";
import type { UploadPhotoState } from "./upload-photo.types";

// Server Action de subida (SPEC-050). Compatible con useActionState:
// recibe el FormData del formulario (establishmentId + photo).
export async function uploadPhotoAction(
  _prevState: UploadPhotoState,
  formData: FormData,
): Promise<UploadPhotoState> {
  // TEMP-DEBUG (retirar tras verificar en Vercel): instrumentación del flujo.
  const rawPhoto = formData.get("photo");
  console.log("[debug-upload] 1+3. entrada en action y FormData recibido", {
    establishmentId: formData.get("establishmentId"),
    photoKind: rawPhoto instanceof File ? "File" : typeof rawPhoto,
    photoName: rawPhoto instanceof File ? rawPhoto.name : null,
    photoType: rawPhoto instanceof File ? rawPhoto.type : null,
    photoSize: rawPhoto instanceof File ? rawPhoto.size : null,
  });
  const session = await auth();
  const userId = session?.user?.id;
  console.log("[debug-upload] 2. usuario autenticado", userId ?? "SIN_SESION");
  if (!userId) {
    return { success: false, message: "Debes iniciar sesión para subir una fotografía." };
  }

  const parsed = uploadPhotoSchema.safeParse({
    establishmentId: formData.get("establishmentId"),
    photo: rawPhoto,
  });
  // TEMP-DEBUG (retirar tras verificar en Vercel).
  console.log("[debug-upload] 4. validación Zod", parsed.success ? "ok" : parsed.error.issues);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "Revisa la imagen seleccionada.";
    return { success: false, message: firstIssue };
  }

  try {
    // TEMP-DEBUG (retirar tras verificar en Vercel).
    console.log("[debug-upload] 5. llamada al servicio");
    await uploadEstablishmentPhoto(parsed.data.establishmentId, userId, parsed.data.photo);
    return { success: true, message: "Fotografía publicada correctamente." };
  } catch (error) {
    // TEMP-DEBUG (retirar tras verificar en Vercel): registra el error
    // completo para Vercel manteniendo el mensaje genérico al usuario.
    console.error("[debug-upload] 9. excepción capturada", error);
    if (
      error instanceof EstablishmentNotFoundError ||
      error instanceof PhotoLimitReachedError ||
      error instanceof PhotoTooSmallError
    ) {
      return { success: false, message: error.message };
    }

    console.error(error);

    return {
      success: false,
      message: "No se ha podido subir la fotografía. Inténtalo de nuevo.",
    };
  }
}
