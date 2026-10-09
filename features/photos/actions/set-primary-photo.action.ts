"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import {
  ForbiddenPhotoError,
  PhotoNotFoundError,
  setPrimaryPhoto,
} from "../services/photo.service";
import type { SetPrimaryPhotoActionResult } from "./set-primary-photo.types";

// Server Action de fotografía principal (SPEC-120).
// Solo su autor o ADMIN. Revalida la ficha.
export async function setPrimaryPhotoAction(id: unknown): Promise<SetPrimaryPhotoActionResult> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    return { success: false, message: "Debes iniciar sesión para gestionar fotografías." };
  }
  if (typeof id !== "string" || id === "") {
    return { success: false, message: "La fotografía no existe." };
  }

  try {
    const { establishmentId } = await setPrimaryPhoto(id, { id: user.id, role: user.role });
    revalidatePath(`/establishments/${establishmentId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof PhotoNotFoundError) {
      return { success: false, message: error.message };
    }
    if (error instanceof ForbiddenPhotoError) {
      return { success: false, message: "No tienes permiso para gestionar esta fotografía." };
    }
    return {
      success: false,
      message: "No se ha podido actualizar la fotografía. Inténtalo de nuevo.",
    };
  }
}
