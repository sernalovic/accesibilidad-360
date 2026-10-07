import { beforeEach, describe, expect, it, vi } from "vitest";
import { hash } from "bcrypt";
import { prisma } from "@/lib/db/prisma";
import { verifyCredentials } from "@/features/auth/services/login.service";

vi.mock("@/lib/db/prisma", () => ({
  prisma: { user: { findUnique: vi.fn() } },
}));

const findUnique = vi.mocked(prisma.user.findUnique);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("verifyCredentials (SPEC-010 fase 010.4)", () => {
  it("retorna el usuario sin el hash con credenciales correctas", async () => {
    findUnique.mockResolvedValue({
      id: "user-1",
      name: "María García",
      email: "maria@example.com",
      passwordHash: await hash("Segura123456", 4),
      role: "USER",
    });

    await expect(verifyCredentials("maria@example.com", "Segura123456")).resolves.toEqual({
      id: "user-1",
      name: "María García",
      email: "maria@example.com",
      role: "USER",
    });
  });

  it("retorna null con correo inexistente", async () => {
    findUnique.mockResolvedValue(null);

    await expect(verifyCredentials("nadie@example.com", "Segura123456")).resolves.toBeNull();
  });

  it("retorna null con contraseña incorrecta", async () => {
    findUnique.mockResolvedValue({
      id: "user-1",
      name: "María García",
      email: "maria@example.com",
      passwordHash: await hash("Segura123456", 4),
      role: "USER",
    });

    await expect(verifyCredentials("maria@example.com", "Otra12345678")).resolves.toBeNull();
  });

  it("retorna null si el usuario no tiene hash (futura cuenta OAuth)", async () => {
    findUnique.mockResolvedValue({
      id: "user-1",
      name: "María García",
      email: "maria@example.com",
      passwordHash: null,
      role: "USER",
    });

    await expect(verifyCredentials("maria@example.com", "Segura123456")).resolves.toBeNull();
  });
});
