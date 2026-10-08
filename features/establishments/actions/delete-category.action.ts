"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { isAdmin } from "@/lib/permissions";
import {
  CategoryInUseError,
  CategoryNotFoundError,
  deleteCategory,
} from "../services/category.service";
import type { DeleteCategoryActionResult } from "./delete-category.types";

// Server Action de eliminación de categoría (SPEC-110, solo ADMIN).
// Sin borrado en cascada: en uso → error de dominio específico.
export async function deleteCategoryAction(id: unknown): Promise<DeleteCategoryActionResult> {
  const session = await auth();
  const user = session?.user;
  if (!user || !isAdmin(user)) {
    return { success: false, message: "No tienes permiso para gestionar categorías." };
  }
  if (typeof id !== "string" || id === "") {
    return { success: false, message: "La categoría no existe." };
  }

  try {
    await deleteCategory(id);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    if (error instanceof CategoryNotFoundError || error instanceof CategoryInUseError) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: "No se ha podido eliminar la categoría. Inténtalo de nuevo.",
    };
  }
}
