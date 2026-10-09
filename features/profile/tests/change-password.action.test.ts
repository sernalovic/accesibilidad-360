import { beforeEach, describe, expect, it, vi } from "vitest";
import { hash } from "bcrypt";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { changePasswordAction } from "@/features/profile/actions/change-password.action";

vi.mock("@/lib/db/prisma", () => ({
  prisma: { user: { findUnique: vi.fn(), update: vi.fn() } },
}));

vi.mock("@/lib/auth/auth", () => ({
  auth: vi.fn(),
  unstable_update: vi.fn(),
}));

const mockedAuth = vi.mocked(auth);
const findUnique = vi.mocked(prisma.user.findUnique);
const update = vi.mocked(prisma.user.update);

beforeEach(() => {
  vi.clearAllMocks();
  mockedAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
});

const validInput = {
  currentPassword: "Actual123456",
  newPassword: "Nueva1234567",
  confirmPassword: "Nueva1234567",
};

describe("changePasswordAction (SPEC-125)", () => {
  it("cambia la contraseña con datos válidos", async () => {
    findUnique.mockResolvedValue({ passwordHash: await hash("Actual123456", 4) });
    update.mockResolvedValue({ passwordHash: "nuevo" });

    await expect(changePasswordAction(validInput)).resolves.toEqual({ success: true });
  });

  it("devuelve el mensaje controlado con la actual incorrecta", async () => {
    findUnique.mockResolvedValue({ passwordHash: await hash("Actual123456", 4) });

    const result = await changePasswordAction({ ...validInput, currentPassword: "Otra12345678" });

    expect(result).toEqual({
      success: false,
      message: "La contraseña actual no es correcta.",
    });
  });

  it("devuelve errores de campo sin tocar la base de datos", async () => {
    const result = await changePasswordAction({ ...validInput, confirmPassword: "Distinta1234" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.confirmPassword).toBeDefined();
    }
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("exige sesión", async () => {
    mockedAuth.mockResolvedValue(null);

    const result = await changePasswordAction(validInput);

    expect(result).toEqual({ success: false, message: "Debes iniciar sesión." });
    expect(findUnique).not.toHaveBeenCalled();
  });
});
