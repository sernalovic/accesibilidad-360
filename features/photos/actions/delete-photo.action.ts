"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { ForbiddenPhotoError, PhotoNotFoundError, deletePhoto } from "../services/photo.service";
import type { DeletePhotoActionResult } from "./delete-photo.types";

// Server Action de eliminación de fotografía (SPEC-110).
// Solo su autor o ADMIN. Revalida la ficha, que vuelve a mostrar
// automáticamente el formulario de subida.
export async function deletePhotoAction(id: unknown): Promise<DeletePhotoActionResult> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    return { success: false, message: "Debes iniciar sesión para eliminar una fotografía." };
  }
  if (typeof id !== "string" || id === "") {
    return { success: false, message: "La fotografía no existe." };
  }

  try {
    const { establishmentId } = await deletePhoto(id, { id: user.id, role: user.role });
    revalidatePath(`/establishments/${establishmentId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof PhotoNotFoundError || error instanceof ForbiddenPhotoError) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: "No se ha podido eliminar la fotografía. Inténtalo de nuevo.",
    };
  }
}
