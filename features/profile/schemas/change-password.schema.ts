import { z } from "zod";

// Validación del cambio de contraseña (SPEC-125).
// Nueva contraseña con las mismas reglas que el registro.
// Se aplica en cliente (UX) y siempre en servidor (seguridad).
const newPasswordSchema = z
  .string({ required_error: "La nueva contraseña es obligatoria." })
  .min(12, "La contraseña debe tener al menos 12 caracteres.")
  .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula.")
  .regex(/[a-z]/, "La contraseña debe contener al menos una minúscula.")
  .regex(/[0-9]/, "La contraseña debe contener al menos un número.");

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: "La contraseña actual es obligatoria." })
      .min(1, "La contraseña actual es obligatoria."),
    newPassword: newPasswordSchema,
    confirmPassword: z.string({ required_error: "La confirmación es obligatoria." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
