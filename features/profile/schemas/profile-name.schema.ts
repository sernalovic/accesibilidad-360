import { z } from "zod";

// Validación del nombre del perfil (SPEC-125).
// Mismas reglas que el registro: se aplica en cliente (UX)
// y siempre en servidor (seguridad).
export const profileNameSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(100, "El nombre debe tener como máximo 100 caracteres."),
});

export type ProfileNameInput = z.infer<typeof profileNameSchema>;
