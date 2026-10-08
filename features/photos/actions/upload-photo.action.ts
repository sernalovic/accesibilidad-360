"use server";

import { auth } from "@/lib/auth/auth";
import { uploadPhotoSchema } from "../schemas/photo.schema";
import {
  EstablishmentNotFoundError,
  PhotoAlreadyExistsError,
  PhotoTooSmallError,
  uploadEstablishmentPhoto,
} from "../services/photo.service";

export interface UploadPhotoState {
  success: boolean;
  message: string | null;
}

export const initialUploadPhotoState: UploadPhotoState = { success: false, message: null };

// Server Action de subida (SPEC-050). Compatible con useActionState:
// recibe el FormData del formulario (establishmentId + photo).
export async function uploadPhotoAction(
  _prevState: UploadPhotoState,
  formData: FormData,
): Promise<UploadPhotoState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { success: false, message: "Debes iniciar sesión para subir una fotografía." };
  }

  const parsed = uploadPhotoSchema.safeParse({
    establishmentId: formData.get("establishmentId"),
    photo: formData.get("photo"),
  });
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "Revisa la imagen seleccionada.";
    return { success: false, message: firstIssue };
  }

  try {
    await uploadEstablishmentPhoto(parsed.data.establishmentId, userId, parsed.data.photo);
    return { success: true, message: "Fotografía publicada correctamente." };
  } catch (error) {
    if (
      error instanceof EstablishmentNotFoundError ||
      error instanceof PhotoAlreadyExistsError ||
      error instanceof PhotoTooSmallError
    ) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: "No se ha podido subir la fotografía. Inténtalo de nuevo.",
    };
  }
}
