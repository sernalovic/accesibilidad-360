import { z } from "zod";

// Validación del nombre de categoría (SPEC-110).
export const categoryNameSchema = z
  .string({ required_error: "El nombre es obligatorio." })
  .trim()
  .min(2, "El nombre debe tener al menos 2 caracteres.")
  .max(100, "El nombre debe tener como máximo 100 caracteres.");

export type CategoryNameInput = z.infer<typeof categoryNameSchema>;
