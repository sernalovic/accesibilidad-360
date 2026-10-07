import { z } from "zod";

// Validación del registro (SPEC-010 fase 010.3).
// Se aplica en cliente (UX) y siempre en servidor (seguridad).
const passwordSchema = z
  .string({ required_error: "La contraseña es obligatoria." })
  .min(12, "La contraseña debe tener al menos 12 caracteres.")
  .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula.")
  .regex(/[a-z]/, "La contraseña debe contener al menos una minúscula.")
  .regex(/[0-9]/, "La contraseña debe contener al menos un número.");

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: "El nombre es obligatorio." })
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres.")
      .max(100, "El nombre debe tener como máximo 100 caracteres."),
    email: z
      .string({ required_error: "El correo electrónico es obligatorio." })
      .trim()
      .toLowerCase()
      .email("El correo electrónico no tiene un formato válido."),
    password: passwordSchema,
    confirmPassword: z.string({ required_error: "La confirmación es obligatoria." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// Datos que recibe el servicio (sin la confirmación).
export type RegisterData = Omit<RegisterInput, "confirmPassword">;
