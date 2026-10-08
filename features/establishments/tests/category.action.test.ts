import { beforeEach, describe, expect, it, vi } from "vitest";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { createCategoryAction } from "@/features/establishments/actions/create-category.action";
import { updateCategoryAction } from "@/features/establishments/actions/update-category.action";
import { deleteCategoryAction } from "@/features/establishments/actions/delete-category.action";

vi.mock("@/lib/auth/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

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

const authMock = vi.mocked(auth);
const revalidateMock = vi.mocked(revalidatePath);
const findUnique = vi.mocked(prisma.category.findUnique);
const create = vi.mocked(prisma.category.create);
const update = vi.mocked(prisma.category.update);
const remove = vi.mocked(prisma.category.delete);

const adminSession = {
  user: { id: "admin-1", name: "Admin", email: "admin@example.com", role: "ADMIN" as const },
  expires: new Date().toISOString(),
};

const userSession = {
  user: { id: "user-1", name: "María", email: "maria@example.com", role: "USER" as const },
  expires: new Date().toISOString(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createCategoryAction (SPEC-110)", () => {
  it("rechaza sin sesión y sin rol ADMIN", async () => {
    authMock.mockResolvedValue(null);
    await expect(createCategoryAction("Bar")).resolves.toEqual({
      success: false,
      message: "No tienes permiso para gestionar categorías.",
    });

    authMock.mockResolvedValue(userSession);
    await expect(createCategoryAction("Bar")).resolves.toEqual({
      success: false,
      message: "No tienes permiso para gestionar categorías.",
    });
    expect(create).not.toHaveBeenCalled();
  });

  it("crea y revalida /admin", async () => {
    authMock.mockResolvedValue(adminSession);
    create.mockResolvedValue({ id: "cat-9", name: "Bar" });

    await expect(createCategoryAction("Bar")).resolves.toEqual({ success: true, id: "cat-9" });
    expect(revalidateMock).toHaveBeenCalledWith("/admin");
  });

  it("rechaza el nombre inválido sin tocar la base de datos", async () => {
    authMock.mockResolvedValue(adminSession);

    const result = await createCategoryAction("  ");

    expect(result).toEqual({ success: false, message: "Revisa el nombre de la categoría." });
    expect(create).not.toHaveBeenCalled();
  });
});

describe("updateCategoryAction (SPEC-110)", () => {
  it("renombra y revalida /admin", async () => {
    authMock.mockResolvedValue(adminSession);
    findUnique.mockResolvedValue({ id: "cat-1" });
    update.mockResolvedValue({ id: "cat-1", name: "Taberna" });

    await expect(updateCategoryAction("cat-1", "Taberna")).resolves.toEqual({
      success: true,
      id: "cat-1",
    });
    expect(revalidateMock).toHaveBeenCalledWith("/admin");
  });

  it("rechaza sin ADMIN", async () => {
    authMock.mockResolvedValue(userSession);

    await expect(updateCategoryAction("cat-1", "Taberna")).resolves.toEqual({
      success: false,
      message: "No tienes permiso para gestionar categorías.",
    });
    expect(update).not.toHaveBeenCalled();
  });
});

describe("deleteCategoryAction (SPEC-110)", () => {
  it("elimina y revalida /admin", async () => {
    authMock.mockResolvedValue(adminSession);
    findUnique.mockResolvedValue({ id: "cat-1", _count: { establishments: 0 } });
    remove.mockResolvedValue({ id: "cat-1" });

    await expect(deleteCategoryAction("cat-1")).resolves.toEqual({ success: true });
    expect(revalidateMock).toHaveBeenCalledWith("/admin");
  });

  it("propaga el mensaje de categoría en uso", async () => {
    authMock.mockResolvedValue(adminSession);
    findUnique.mockResolvedValue({ id: "cat-1", _count: { establishments: 2 } });

    await expect(deleteCategoryAction("cat-1")).resolves.toEqual({
      success: false,
      message: "No se puede eliminar: la categoría está en uso por establecimientos.",
    });
    expect(remove).not.toHaveBeenCalled();
  });
});
