import { PrismaClient } from "@prisma/client";

// Singleton del cliente Prisma (SPEC-010 fase 010.2).
// Evita agotar conexiones durante el desarrollo con Hot Reload.
// Será consumido por el PrismaAdapter de Auth.js y por los servicios
// cuando existan las fases que los necesiten.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
