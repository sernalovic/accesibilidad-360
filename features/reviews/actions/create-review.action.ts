"use server";

import { auth } from "@/lib/auth/auth";
import { reviewSchema } from "../schemas/review.schema";
import {
  DuplicateReviewError,
  EstablishmentNotFoundError,
  IncompleteScoresError,
  createReview,
} from "../services/review.service";

export interface CreateReviewActionSuccess {
  success: true;
  id: string;
}

export interface CreateReviewActionFailure {
  success: false;
  message: string;
  fieldErrors?: Partial<Record<"comment" | "scores", string[] | undefined>>;
}

export type CreateReviewActionResult = CreateReviewActionSuccess | CreateReviewActionFailure;

// Server Action de valoración (SPEC-040).
// Solo usuarios autenticados; `userId` siempre de la sesión.
// El cliente refresca la ficha tras el éxito.
export async function createReviewAction(input: unknown): Promise<CreateReviewActionResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { success: false, message: "Debes iniciar sesión para valorar." };
  }

  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Revisa los datos de la valoración.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const review = await createReview(parsed.data, userId);
    return { success: true, id: review.id };
  } catch (error) {
    if (error instanceof DuplicateReviewError || error instanceof IncompleteScoresError) {
      return { success: false, message: error.message };
    }
    if (error instanceof EstablishmentNotFoundError) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: "No se ha podido guardar la valoración. Inténtalo de nuevo.",
    };
  }
}
