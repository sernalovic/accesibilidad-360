import { hash } from "bcrypt";
import { Prisma, Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import type { RegisterData } from "../schemas/register.schema";

// Coste de bcrypt: equilibrio entre seguridad y rendimiento en servidor.
const BCRYPT_COST = 12;

export class EmailAlreadyExistsError extends Error {
  readonly code = "EMAIL_ALREADY_EXISTS" as const;

  constructor() {
    super("El correo electrónico ya está registrado.");
    this.name = "EmailAlreadyExistsError";
  }
}

export interface RegisteredUser {
  id: string;
  name: string | null;
  email: string;
}

// Crea un usuario con rol USER (SPEC-010 fase 010.3).
// Almacena únicamente el hash; la contraseña nunca llega a Prisma.
// No inicia sesión: la autenticación llegará en la fase de login.
export async function registerUser(data: RegisterData): Promise<RegisteredUser> {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new EmailAlreadyExistsError();
  }

  const passwordHash = await hash(data.password, BCRYPT_COST);

  try {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: Role.USER,
      },
      select: { id: true, name: true, email: true },
    });
  } catch (error) {
    // Carrera entre la comprobación previa y la inserción.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new EmailAlreadyExistsError();
    }
    throw error;
  }
}
