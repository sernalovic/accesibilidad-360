import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  CategoryExistsError,
  CategoryInUseError,
  CategoryNotFoundError,
  createCategory,
  deleteCategory,
  listCategoriesWithUsage,
  renameCategory,
} from "@/features/establishments/services/category.service";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const findMany = vi.mocked(prisma.category.findMany);
const findUnique = vi.mocked(prisma.category.findUnique);
const create = vi.mocked(prisma.category.create);
const update = vi.mocked(prisma.category.update);
const remove = vi.mocked(prisma.category.delete);

beforeEach(() => {
  vi.clearAllMocks();
});

function prismaKnownError(): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError("Unique constraint failed.", {
    code: "P2002",
    clientVersion: "test",
  });
}

describe("listCategoriesWithUsage (SPEC-110)", () => {
  it("devuelve el conteo por categoría en orden alfabético", async () => {
    findMany.mockResolvedValue([
      { id: "cat-1", name: "Bar", _count: { establishments: 2 } },
      { id: "cat-2", name: "Hotel", _count: { establishments: 0 } },
    ]);

    await expect(listCategoriesWithUsage()).resolves.toEqual([
      { id: "cat-1", name: "Bar", establishmentCount: 2 },
      { id: "cat-2", name: "Hotel", establishmentCount: 0 },
    ]);
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ orderBy: { name: "asc" } }));
  });
});

describe("createCategory (SPEC-110)", () => {
  it("crea recortando espacios", async () => {
    create.mockResolvedValue({ id: "cat-1", name: "Bar" });

    await expect(createCategory("  Bar  ")).resolves.toEqual({ id: "cat-1", name: "Bar" });
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ data: { name: "Bar" } }));
  });

  it("convierte el duplicado en error de dominio", async () => {
    create.mockRejectedValue(prismaKnownError());

    await expect(createCategory("Bar")).rejects.toBeInstanceOf(CategoryExistsError);
  });
});

describe("renameCategory (SPEC-110)", () => {
  it("renombra existente", async () => {
    findUnique.mockResolvedValue({ id: "cat-1" });
    update.mockResolvedValue({ id: "cat-1", name: "Taberna" });

    await expect(renameCategory("cat-1", "Taberna")).resolves.toEqual({
      id: "cat-1",
      name: "Taberna",
    });
  });

  it("rechaza inexistente y duplicado", async () => {
    findUnique.mockResolvedValue(null);
    await expect(renameCategory("x", "Y")).rejects.toBeInstanceOf(CategoryNotFoundError);

    findUnique.mockResolvedValue({ id: "cat-1" });
    update.mockRejectedValue(prismaKnownError());
    await expect(renameCategory("cat-1", "Bar")).rejects.toBeInstanceOf(CategoryExistsError);
  });
});

describe("deleteCategory (SPEC-110)", () => {
  it("elimina sin usos", async () => {
    findUnique.mockResolvedValue({ id: "cat-1", _count: { establishments: 0 } });
    remove.mockResolvedValue({ id: "cat-1" });

    await deleteCategory("cat-1");

    expect(remove).toHaveBeenCalledWith({ where: { id: "cat-1" } });
  });

  it("rechaza inexistente y en uso sin borrar", async () => {
    findUnique.mockResolvedValue(null);
    await expect(deleteCategory("x")).rejects.toBeInstanceOf(CategoryNotFoundError);

    findUnique.mockResolvedValue({ id: "cat-1", _count: { establishments: 3 } });
    await expect(deleteCategory("cat-1")).rejects.toBeInstanceOf(CategoryInUseError);
    expect(remove).not.toHaveBeenCalled();
  });
});
