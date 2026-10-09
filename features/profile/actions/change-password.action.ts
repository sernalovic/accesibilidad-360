"use server";

import { auth } from "@/lib/auth/auth";
import { changePasswordSchema } from "../schemas/change-password.schema";
import {
  InvalidCurrentPasswordError,
  NoLocalPasswordError,
  UserNotFoundError,
  changePassword,
} from "../services/profile.service";
import type { ChangePasswordActionResult } from "./change-password.types";

// Server Action de cambio de contraseña (SPEC-125).
// Revalida siempre en servidor y nunca expone detalles técnicos.
// Solo para cuentas con contraseña local; las OAuth no llegan aquí
// (la página no renderiza el formulario en ese caso).
export async function changePasswordAction(input: unknown): Promise<ChangePasswordActionResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { success: false, message: "Debes iniciar sesión." };
  }

  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Revisa los datos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await changePassword(userId, {
      currentPassword: parsed.data.currentPassword,
      newPassword: parsed.data.newPassword,
    });
    return { success: true };
  } catch (error) {
    if (
      error instanceof InvalidCurrentPasswordError ||
      error instanceof NoLocalPasswordError ||
      error instanceof UserNotFoundError
    ) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: "No se ha podido cambiar la contraseña. Inténtalo de nuevo.",
    };
  }
}
