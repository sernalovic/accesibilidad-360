"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import {
  EstablishmentNotFoundError,
  ForbiddenEstablishmentError,
  deleteEstablishment,
} from "../services/establishment.service";
import type { DeleteEstablishmentActionResult } from "./delete-establishment.types";

// Server Action de eliminación (SPEC-080).
// Actor siempre de la sesión. Revalida el listado; el cliente navega a él.
export async function deleteEstablishmentAction(
  id: unknown,
): Promise<DeleteEstablishmentActionResult> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    return { success: false, message: "Debes iniciar sesión para eliminar un establecimiento." };
  }
  if (typeof id !== "string" || id === "") {
    return { success: false, message: "El establecimiento no existe." };
  }

  try {
    await deleteEstablishment(id, { id: user.id, role: user.role });
    revalidatePath("/establishments");
    return { success: true };
  } catch (error) {
    if (
      error instanceof EstablishmentNotFoundError ||
      error instanceof ForbiddenEstablishmentError
    ) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: "No se ha podido eliminar el establecimiento. Inténtalo de nuevo.",
    };
  }
}
