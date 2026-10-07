import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db/prisma";
import {
  CategoryNotFoundError,
  createEstablishment,
} from "@/features/establishments/services/establishment.service";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    category: { findUnique: vi.fn() },
    establishment: { create: vi.fn() },
  },
}));

const findCategory = vi.mocked(prisma.category.findUnique);
const create = vi.mocked(prisma.establishment.create);

beforeEach(() => {
  vi.clearAllMocks();
});

const validData = {
  name: "Restaurante Ejemplo",
  categoryId: "cat-1",
  address: "Calle Mayor 1",
  municipality: "Madrid",
  province: "Madrid",
  description: "Un lugar accesible.",
};

describe("createEstablishment (SPEC-030)", () => {
  it("crea la ficha con el autor de la sesión, nunca del cliente", async () => {
    findCategory.mockResolvedValue({ id: "cat-1", name: "Restaurante" });
    create.mockImplementation(async (args) => ({ id: "est-1", name: args.data.name ?? "" }));

    const result = await createEstablishment(validData, "user-1");

    expect(result).toEqual({ id: "est-1", name: "Restaurante Ejemplo" });
    expect(create).toHaveBeenCalledOnce();
    expect(create.mock.calls[0]?.[0]?.data.createdById).toBe("user-1");
    expect(create.mock.calls[0]?.[0]?.data.categoryId).toBe("cat-1");
  });

  it("guarda null cuando no hay descripción", async () => {
    findCategory.mockResolvedValue({ id: "cat-1", name: "Restaurante" });
    create.mockImplementation(async (args) => ({ id: "est-1", name: args.data.name ?? "" }));

    await createEstablishment({ ...validData, description: "" }, "user-1");

    expect(create.mock.calls[0]?.[0]?.data.description).toBeNull();
  });

  it("rechaza la categoría inexistente sin crear nada", async () => {
    findCategory.mockResolvedValue(null);

    await expect(createEstablishment(validData, "user-1")).rejects.toBeInstanceOf(
      CategoryNotFoundError,
    );
    expect(create).not.toHaveBeenCalled();
  });
});
