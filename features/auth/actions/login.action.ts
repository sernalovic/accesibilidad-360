"use server";

import { AuthError, CredentialsSignin } from "next-auth";
import { signIn } from "@/lib/auth/auth";
import { loginSchema } from "../schemas/login.schema";

export interface LoginActionFailure {
  success: false;
  message: string;
}

// Server Action de inicio de sesión (SPEC-010 fase 010.4).
// El éxito nunca retorna: Auth.js redirige a /dashboard.
// Por eso el resultado es siempre un fallo controlado o una redirección
// (cualquier otro error se relanza para no tragar el redirect).
export async function loginUserAction(input: unknown): Promise<LoginActionFailure> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Revisa los datos del formulario." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return { success: false, message: "Correo electrónico o contraseña incorrectos." };
    }
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "No se ha podido iniciar sesión. Inténtalo de nuevo.",
      };
    }
    throw error;
  }

  // Inalcanzable cuando la redirección funciona; exigido por el tipado.
  return {
    success: false,
    message: "No se ha podido iniciar sesión. Inténtalo de nuevo.",
  };
}
