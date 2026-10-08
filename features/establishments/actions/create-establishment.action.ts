"use server";

import { auth } from "@/lib/auth/auth";
import { establishmentSchema } from "../schemas/establishment.schema";
import { CategoryNotFoundError, createEstablishment } from "../services/establishment.service";
import type { CreateEstablishmentActionResult } from "./create-establishment.types";

// Server Action de creación (SPEC-030).
// Solo usuarios autenticados; `createdById` siempre de la sesión.
// El éxito lo confirma el cliente navegando a /establishments.
export async function createEstablishmentAction(
  input: unknown,
): Promise<CreateEstablishmentActionResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { success: false, message: "Debes iniciar sesión para crear un establecimiento." };
  }

  const parsed = establishmentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Revisa los datos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const establishment = await createEstablishment(parsed.data, userId);
    return { success: true, id: establishment.id };
  } catch (error) {
    if (error instanceof CategoryNotFoundError) {
      return {
        success: false,
        message: error.message,
        fieldErrors: { categoryId: [error.message] },
      };
    }
    return {
      success: false,
      message: "No se ha podido crear el establecimiento. Inténtalo de nuevo.",
    };
  }
}
