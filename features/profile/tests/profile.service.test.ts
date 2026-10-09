import { beforeEach, describe, expect, it, vi } from "vitest";
import { hash } from "bcrypt";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  InvalidCurrentPasswordError,
  NoLocalPasswordError,
  UserNotFoundError,
  changePassword,
  getProfileData,
  updateProfileName,
} from "@/features/profile/services/profile.service";

vi.mock("@/lib/db/prisma", () => ({
  prisma: { user: { findUnique: vi.fn(), update: vi.fn() } },
}));

const findUnique = vi.mocked(prisma.user.findUnique);
const update = vi.mocked(prisma.user.update);

beforeEach(() => {
  vi.clearAllMocks();
});

function userRow(overrides: Record<string, unknown> = {}) {
  return {
    name: "María García",
    email: "maria@example.com",
    role: "USER",
    createdAt: new Date("2026-01-01"),
    passwordHash: "hash",
    accounts: [],
    _count: { establishments: 2, reviews: 3, photos: 1 },
    ...overrides,
  };
}

describe("getProfileData (SPEC-125)", () => {
  it("compone el DTO sin exponer el hash", async () => {
    findUnique.mockResolvedValue(userRow());

    const data = await getProfileData("user-1");

    expect(data).toEqual({
      name: "María García",
      email: "maria@example.com",
      role: "USER",
      createdAt: new Date("2026-01-01"),
      provider: "Credenciales",
      hasPassword: true,
      stats: { establishments: 2, reviews: 3, photos: 1 },
    });
    expect(data).not.toHaveProperty("passwordHash");
  });

  it("etiqueta el proveedor Google con contraseña local", async () => {
    findUnique.mockResolvedValue(userRow({ accounts: [{ provider: "google" }] }));

    const data = await getProfileData("user-1");

    expect(data).toEqual(
      expect.objectContaining({ provider: "Google y Credenciales", hasPassword: true }),
    );
  });

  it("retorna null si el usuario no existe", async () => {
    findUnique.mockResolvedValue(null);

    await expect(getProfileData("inexistente")).resolves.toBeNull();
  });
});

describe("updateProfileName (SPEC-125)", () => {
  it("actualiza solo el nombre", async () => {
    update.mockResolvedValue({ name: "María López" });

    await expect(updateProfileName("user-1", "María López")).resolves.toEqual({
      name: "María López",
    });
    expect(update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { name: "María López" },
      select: { name: true },
    });
  });

  it("lanza UserNotFoundError si el usuario no existe", async () => {
    update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("No existe", {
        code: "P2025",
        clientVersion: "test",
      }),
    );

    await expect(updateProfileName("inexistente", "X")).rejects.toBeInstanceOf(UserNotFoundError);
  });
});

describe("changePassword (SPEC-125)", () => {
  it("cambia la contraseña con la actual correcta", async () => {
    findUnique.mockResolvedValue({ passwordHash: await hash("Actual123456", 4) });
    update.mockResolvedValue({ passwordHash: "nuevo" });

    await changePassword("user-1", {
      currentPassword: "Actual123456",
      newPassword: "Nueva1234567",
    });

    expect(update).toHaveBeenCalledOnce();
  });

  it("rechaza la contraseña actual incorrecta sin actualizar", async () => {
    findUnique.mockResolvedValue({ passwordHash: await hash("Actual123456", 4) });

    await expect(
      changePassword("user-1", { currentPassword: "Otra12345678", newPassword: "Nueva1234567" }),
    ).rejects.toBeInstanceOf(InvalidCurrentPasswordError);
    expect(update).not.toHaveBeenCalled();
  });

  it("rechaza cuentas OAuth sin contraseña local", async () => {
    findUnique.mockResolvedValue({ passwordHash: null });

    await expect(
      changePassword("user-1", { currentPassword: "X", newPassword: "Nueva1234567" }),
    ).rejects.toBeInstanceOf(NoLocalPasswordError);
    expect(update).not.toHaveBeenCalled();
  });

  it("rechaza usuarios inexistentes", async () => {
    findUnique.mockResolvedValue(null);

    await expect(
      changePassword("inexistente", { currentPassword: "X", newPassword: "Nueva1234567" }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
