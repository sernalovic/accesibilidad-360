"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { isAdmin } from "@/lib/permissions";
import { categoryNameSchema } from "../schemas/category.schema";
import { CategoryExistsError, createCategory } from "../services/category.service";
import type { CreateCategoryActionResult } from "./create-category.types";

// Server Action de creación de categoría (SPEC-110, solo ADMIN).
export async function createCategoryAction(input: unknown): Promise<CreateCategoryActionResult> {
  const session = await auth();
  const user = session?.user;
  if (!user || !isAdmin(user)) {
    return { success: false, message: "No tienes permiso para gestionar categorías." };
  }

  const parsed = categoryNameSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Revisa el nombre de la categoría." };
  }

  try {
    const category = await createCategory(parsed.data);
    revalidatePath("/admin");
    return { success: true, id: category.id };
  } catch (error) {
    if (error instanceof CategoryExistsError) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: "No se ha podido crear la categoría. Inténtalo de nuevo.",
    };
  }
}
