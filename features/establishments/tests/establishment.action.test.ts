import { beforeEach, describe, expect, it, vi } from "vitest";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { createEstablishmentAction } from "@/features/establishments/actions/create-establishment.action";

vi.mock("@/lib/auth/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    category: { findUnique: vi.fn() },
    establishment: { create: vi.fn() },
  },
}));

const authMock = vi.mocked(auth);
const findCategory = vi.mocked(prisma.category.findUnique);
const create = vi.mocked(prisma.establishment.create);

beforeEach(() => {
  vi.clearAllMocks();
});

const validInput = {
  name: "Restaurante Ejemplo",
  categoryId: "cat-1",
  address: "Calle Mayor 1",
  municipality: "Madrid",
  province: "Madrid",
  description: "",
};

describe("createEstablishmentAction (SPEC-030)", () => {
  it("rechaza sin sesión sin tocar la base de datos", async () => {
    authMock.mockResolvedValue(null);

    const result = await createEstablishmentAction(validInput);

    expect(result).toEqual({
      success: false,
      message: "Debes iniciar sesión para crear un establecimiento.",
    });
    expect(findCategory).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  it("crea con sesión válida usando el id de la sesión como autor", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", name: "María", email: "maria@example.com", role: "USER" },
    });
    findCategory.mockResolvedValue({ id: "cat-1", name: "Restaurante" });
    create.mockResolvedValue({ id: "est-1", name: "Restaurante Ejemplo" });

    const result = await createEstablishmentAction(validInput);

    expect(result).toEqual({ success: true, id: "est-1" });
    expect(create.mock.calls[0]?.[0]?.data.createdById).toBe("user-1");
  });

  it("devuelve errores de campo con entrada inválida sin tocar la base de datos", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", name: "María", email: "maria@example.com", role: "USER" },
    });

    const result = await createEstablishmentAction({ ...validInput, name: "AB" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.name).toBeDefined();
    }
    expect(findCategory).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });
});
