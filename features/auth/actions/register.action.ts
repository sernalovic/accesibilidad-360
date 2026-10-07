"use server";

import { registerSchema } from "../schemas/register.schema";
import { EmailAlreadyExistsError, registerUser } from "../services/register.service";

export interface RegisterActionSuccess {
  success: true;
}

export interface RegisterActionFailure {
  success: false;
  message: string;
  fieldErrors?: Partial<
    Record<"name" | "email" | "password" | "confirmPassword", string[] | undefined>
  >;
}

export type RegisterActionResult = RegisterActionSuccess | RegisterActionFailure;

// Server Action de registro (SPEC-010 fase 010.3).
// Revalida siempre en servidor y nunca expone detalles técnicos.
// No crea sesión: el cliente navega a /login tras el éxito.
export async function registerUserAction(input: unknown): Promise<RegisterActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Revisa los datos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = parsed.data;

  try {
    await registerUser({ name, email, password });
    return { success: true };
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      return {
        success: false,
        message: error.message,
        fieldErrors: { email: [error.message] },
      };
    }
    return {
      success: false,
      message: "No se ha podido completar el registro. Inténtalo de nuevo.",
    };
  }
}
