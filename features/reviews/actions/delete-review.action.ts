"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import {
  ForbiddenReviewError,
  ReviewNotFoundError,
  deleteReview,
} from "../services/review.service";
import type { DeleteReviewActionResult } from "./delete-review.types";

// Server Action de eliminación de valoración (SPEC-110). Sin edición.
// Solo su autor o ADMIN. La media se recalcula sola al ser dinámica.
export async function deleteReviewAction(id: unknown): Promise<DeleteReviewActionResult> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    return { success: false, message: "Debes iniciar sesión para eliminar una valoración." };
  }
  if (typeof id !== "string" || id === "") {
    return { success: false, message: "La valoración no existe." };
  }

  try {
    const { establishmentId } = await deleteReview(id, { id: user.id, role: user.role });
    revalidatePath(`/establishments/${establishmentId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof ForbiddenReviewError || error instanceof ReviewNotFoundError) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: "No se ha podido eliminar la valoración. Inténtalo de nuevo.",
    };
  }
}
