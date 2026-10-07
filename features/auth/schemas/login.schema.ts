import { z } from "zod";

// Validación del inicio de sesión (SPEC-010 fase 010.4).
// Intencionadamente mínima: la contraseña solo se exige presente.
// Si es incorrecta, la respuesta será siempre el mensaje genérico.
export const loginSchema = z.object({
  email: z
    .string({ required_error: "El correo electrónico es obligatorio." })
    .trim()
    .toLowerCase()
    .email("El correo electrónico no tiene un formato válido."),
  password: z.string({ required_error: "La contraseña es obligatoria." }).min(1, {
    message: "La contraseña es obligatoria.",
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
