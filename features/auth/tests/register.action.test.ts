import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { registerUserAction } from "@/features/auth/actions/register.action";

vi.mock("@/lib/db/prisma", () => ({
  prisma: { user: { findUnique: vi.fn(), create: vi.fn() } },
}));

const findUnique = vi.mocked(prisma.user.findUnique);
const create = vi.mocked(prisma.user.create);

beforeEach(() => {
  vi.clearAllMocks();
});

const validInput = {
  name: "María García",
  email: "maria@example.com",
  password: "Segura123456",
  confirmPassword: "Segura123456",
};

describe("registerUserAction (SPEC-010 fase 010.3)", () => {
  it("registra con datos válidos", async () => {
    findUnique.mockResolvedValue(null);
    create.mockResolvedValue({ id: "user-1", name: "María García", email: "maria@example.com" });

    await expect(registerUserAction(validInput)).resolves.toEqual({ success: true });
  });

  it("devuelve error controlado con correo duplicado", async () => {
    findUnique.mockResolvedValue({ id: "existing", name: "X", email: "maria@example.com" });

    const result = await registerUserAction(validInput);

    expect(result).toEqual({
      success: false,
      message: "El correo electrónico ya está registrado.",
      fieldErrors: { email: ["El correo electrónico ya está registrado."] },
    });
    expect(create).not.toHaveBeenCalled();
  });

  it("devuelve errores de campo con entrada inválida sin tocar la base de datos", async () => {
    const result = await registerUserAction({ ...validInput, email: "no-es-un-email" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.email).toBeDefined();
    }
    expect(findUnique).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });
});
