import { beforeEach, describe, expect, it, vi } from "vitest";
import { compare } from "bcrypt";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { EmailAlreadyExistsError, registerUser } from "@/features/auth/services/register.service";

vi.mock("@/lib/db/prisma", () => ({
  prisma: { user: { findUnique: vi.fn(), create: vi.fn() } },
}));

const findUnique = vi.mocked(prisma.user.findUnique);
const create = vi.mocked(prisma.user.create);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("registerUser (SPEC-010 fase 010.3)", () => {
  it("crea el usuario con el hash y el rol USER", async () => {
    findUnique.mockResolvedValue(null);
    create.mockImplementation(async (args) => ({
      id: "user-1",
      name: args.data.name ?? null,
      email: args.data.email ?? "",
    }));

    const user = await registerUser({
      name: "María García",
      email: "maria@example.com",
      password: "Segura123456",
    });

    expect(user).toEqual({ id: "user-1", name: "María García", email: "maria@example.com" });
    expect(create).toHaveBeenCalledOnce();
    const storedHash = create.mock.calls[0]?.[0]?.data.passwordHash ?? "";
    expect(storedHash).not.toBe("Segura123456");
    expect(await compare("Segura123456", storedHash)).toBe(true);
    expect(create.mock.calls[0]?.[0]?.data.role).toBe("USER");
  });

  it("rechaza el correo ya registrado sin crear nada", async () => {
    findUnique.mockResolvedValue({
      id: "existing",
      name: "Existente",
      email: "maria@example.com",
    });

    await expect(
      registerUser({ name: "María", email: "maria@example.com", password: "Segura123456" }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError);
    expect(create).not.toHaveBeenCalled();
  });

  it("convierte la carrera de inserción (P2002) en el mismo error controlado", async () => {
    findUnique.mockResolvedValue(null);
    create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed.", {
        code: "P2002",
        clientVersion: "test",
      }),
    );

    await expect(
      registerUser({ name: "María", email: "maria@example.com", password: "Segura123456" }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError);
  });
});
