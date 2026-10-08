"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { establishmentSchema } from "../schemas/establishment.schema";
import {
  CategoryNotFoundError,
  EstablishmentNotFoundError,
  ForbiddenEstablishmentError,
  MunicipalityNotFoundError,
  ProvinceNotFoundError,
  updateEstablishment,
} from "../services/establishment.service";
import type { UpdateEstablishmentActionResult } from "./update-establishment.types";

// Server Action de edición (SPEC-080).
// Actor siempre de la sesión. Revalida ficha y listado; el cliente
// navega a la ficha actualizada.
export async function updateEstablishmentAction(
  id: unknown,
  input: unknown,
): Promise<UpdateEstablishmentActionResult> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    return { success: false, message: "Debes iniciar sesión para editar un establecimiento." };
  }
  if (typeof id !== "string" || id === "") {
    return { success: false, message: "El establecimiento no existe." };
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
    const establishment = await updateEstablishment(id, parsed.data, {
      id: user.id,
      role: user.role,
    });
    revalidatePath(`/establishments/${id}`);
    revalidatePath("/establishments");
    return { success: true, id: establishment.id };
  } catch (error) {
    if (
      error instanceof EstablishmentNotFoundError ||
      error instanceof ForbiddenEstablishmentError
    ) {
      return { success: false, message: error.message };
    }
    if (error instanceof CategoryNotFoundError) {
      return {
        success: false,
        message: error.message,
        fieldErrors: { categoryId: [error.message] },
      };
    }
    if (error instanceof ProvinceNotFoundError) {
      return {
        success: false,
        message: error.message,
        fieldErrors: { provinceId: [error.message] },
      };
    }
    if (error instanceof MunicipalityNotFoundError) {
      return {
        success: false,
        message: error.message,
        fieldErrors: { municipalityId: [error.message] },
      };
    }
    return {
      success: false,
      message: "No se ha podido guardar el establecimiento. Inténtalo de nuevo.",
    };
  }
}
