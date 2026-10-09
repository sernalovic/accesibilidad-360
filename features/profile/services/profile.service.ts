import { compare, hash } from "bcrypt";
import { Prisma, type Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

// Coste de bcrypt: mismo equilibrio que el registro (SPEC-010).
const BCRYPT_COST = 12;

export class UserNotFoundError extends Error {
  readonly code = "USER_NOT_FOUND" as const;

  constructor() {
    super("El usuario no existe.");
    this.name = "UserNotFoundError";
  }
}

export class InvalidCurrentPasswordError extends Error {
  readonly code = "INVALID_CURRENT_PASSWORD" as const;

  constructor() {
    super("La contraseña actual no es correcta.");
    this.name = "InvalidCurrentPasswordError";
  }
}

export class NoLocalPasswordError extends Error {
  readonly code = "NO_LOCAL_PASSWORD" as const;

  constructor() {
    super("Tu cuenta depende de un proveedor externo y no tiene contraseña local.");
    this.name = "NoLocalPasswordError";
  }
}

export interface ProfileStats {
  establishments: number;
  reviews: number;
  photos: number;
}

export interface ProfileData {
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  provider: string;
  hasPassword: boolean;
  stats: ProfileStats;
}

// Etiqueta del proveedor a partir de las cuentas OAuth vinculadas.
// Sin cuentas y con hash: Credenciales (único caso real hoy).
function providerLabel(providers: string[], hasPassword: boolean): string {
  const labels = providers.map((provider) =>
    provider === "google" ? "Google" : provider === "credentials" ? "Credenciales" : provider,
  );
  if (labels.length === 0) {
    return hasPassword ? "Credenciales" : "Proveedor externo";
  }
  if (hasPassword && !labels.includes("Credenciales")) {
    return [...labels, "Credenciales"].join(" y ");
  }
  return labels.join(" y ");
}

// Perfil del usuario autenticado (SPEC-125).
// Una única consulta: datos + cuentas + recuentos vía `_count`.
// El hash nunca sale del servicio: se mapea a `hasPassword`.
export async function getProfileData(userId: string): Promise<ProfileData | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      role: true,
      createdAt: true,
      passwordHash: true,
      accounts: { select: { provider: true } },
      _count: { select: { establishments: true, reviews: true, photos: true } },
    },
  });
  if (!user) {
    return null;
  }

  const hasPassword = user.passwordHash !== null;
  return {
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    provider: providerLabel(
      user.accounts.map((account) => account.provider),
      hasPassword,
    ),
    hasPassword,
    stats: {
      establishments: user._count.establishments,
      reviews: user._count.reviews,
      photos: user._count.photos,
    },
  };
}

// Actualiza únicamente el nombre (SPEC-125).
// El `userId` procede siempre de la sesión, nunca del cliente.
export async function updateProfileName(userId: string, name: string): Promise<{ name: string }> {
  try {
    return await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: { name: true },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw new UserNotFoundError();
    }
    throw error;
  }
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Cambia la contraseña verificando la actual (SPEC-125).
// Mensaje genérico ante actual incorrecta, sin revelar detalles.
export async function changePassword(userId: string, data: ChangePasswordData): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });
  if (!user) {
    throw new UserNotFoundError();
  }
  if (!user.passwordHash) {
    throw new NoLocalPasswordError();
  }

  const valid = await compare(data.currentPassword, user.passwordHash);
  if (!valid) {
    throw new InvalidCurrentPasswordError();
  }

  const passwordHash = await hash(data.newPassword, BCRYPT_COST);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
}
