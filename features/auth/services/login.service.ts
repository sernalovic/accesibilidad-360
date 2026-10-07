import { compare } from "bcrypt";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export interface VerifiedUser {
  id: string;
  name: string | null;
  email: string;
  role: Role;
}

// Verifica unas credenciales sin revelar qué dato falló (SPEC-010 fase 010.4).
// Retorna null tanto si el correo no existe como si la contraseña es
// incorrecta o el usuario no tiene hash (p. ej. futura cuenta OAuth).
// El mensaje genérico lo decide la Server Action.
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<VerifiedUser | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash) {
    return null;
  }

  const valid = await compare(password, user.passwordHash);
  if (!valid) {
    return null;
  }

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
