"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { isAdmin } from "@/lib/permissions";
import { categoryNameSchema } from "../schemas/category.schema";
import {
  CategoryExistsError,
  CategoryNotFoundError,
  renameCategory,
} from "../services/category.service";
import type { UpdateCategoryActionResult } from "./update-category.types";

// Server Action de renombrado de categoría (SPEC-110, solo ADMIN).
export async function updateCategoryAction(
  id: unknown,
  input: unknown,
): Promise<UpdateCategoryActionResult> {
  const session = await auth();
  const user = session?.user;
  if (!user || !isAdmin(user)) {
    return { success: false, message: "No tienes permiso para gestionar categorías." };
  }
  if (typeof id !== "string" || id === "") {
    return { success: false, message: "La categoría no existe." };
  }

  const parsed = categoryNameSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Revisa el nombre de la categoría." };
  }

  try {
    const category = await renameCategory(id, parsed.data);
    revalidatePath("/admin");
    return { success: true, id: category.id };
  } catch (error) {
    if (error instanceof CategoryNotFoundError || error instanceof CategoryExistsError) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: "No se ha podido guardar la categoría. Inténtalo de nuevo.",
    };
  }
}
