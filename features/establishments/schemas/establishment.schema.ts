import { z } from "zod";

// Validación de la ficha de establecimiento (SPEC-030 + SPEC-035).
// Provincia y municipio normalizados: solo identificadores de las
// entidades oficiales. Se aplica en cliente (UX) y siempre en servidor.
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
  provinceId: z
    .string({ required_error: "La provincia es obligatoria." })
    .trim()
    .min(1, "La provincia es obligatoria."),
  municipalityId: z
    .string({ required_error: "El municipio es obligatorio." })
    .trim()
    .min(1, "El municipio es obligatorio."),
  description: z.string().trim().optional(),
});

export type EstablishmentInput = z.infer<typeof establishmentSchema>;
