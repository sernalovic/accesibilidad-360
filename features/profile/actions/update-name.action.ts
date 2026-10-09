"use server";

import { revalidatePath } from "next/cache";
import { auth, unstable_update } from "@/lib/auth/auth";
import { profileNameSchema } from "../schemas/profile-name.schema";
import { UserNotFoundError, updateProfileName } from "../services/profile.service";
import type { UpdateNameActionResult } from "./update-name.types";

// Server Action de edición del nombre (SPEC-125).
// Revalida siempre en servidor; el `userId` procede de la sesión.
// Sincroniza la sesión JWT con `unstable_update` para que el nombre
// se actualice de inmediato sin leer la base de datos en cada petición.
export async function updateNameAction(input: unknown): Promise<UpdateNameActionResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { success: false, message: "Debes iniciar sesión." };
  }

  const parsed = profileNameSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Revisa los datos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const { name } = await updateProfileName(userId, parsed.data.name);
    await unstable_update({ user: { name } });
    revalidatePath("/profile");
    return { success: true, name };
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: "No se ha podido actualizar el nombre. Inténtalo de nuevo.",
    };
  }
}
