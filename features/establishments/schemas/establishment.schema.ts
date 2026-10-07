import { z } from "zod";

// Validación de la ficha de establecimiento (SPEC-030).
// Se aplica en cliente (UX) y siempre en servidor (seguridad).
// `createdById` nunca forma parte del formulario: lo aporta la sesión.
export const establishmentSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(120, "El nombre debe tener como máximo 120 caracteres."),
  categoryId: z
    .string({ required_error: "La categoría es obligatoria." })
    .trim()
    .min(1, "La categoría es obligatoria."),
  address: z
    .string({ required_error: "La dirección es obligatoria." })
    .trim()
    .min(1, "La dirección es obligatoria."),
  municipality: z
    .string({ required_error: "El municipio es obligatorio." })
    .trim()
    .min(1, "El municipio es obligatorio."),
  province: z
    .string({ required_error: "La provincia es obligatoria." })
    .trim()
    .min(1, "La provincia es obligatoria."),
  description: z.string().trim().optional(),
});

export type EstablishmentInput = z.infer<typeof establishmentSchema>;
