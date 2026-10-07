import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db/prisma";
import {
  getEstablishmentById,
  listEstablishments,
} from "@/features/establishments/services/establishment.service";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    category: { findUnique: vi.fn() },
    establishment: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn() },
  },
}));

const findMany = vi.mocked(prisma.establishment.findMany);
const findUnique = vi.mocked(prisma.establishment.findUnique);

beforeEach(() => {
  vi.clearAllMocks();
});

const sampleItem = {
  id: "est-1",
  name: "Restaurante Ejemplo",
  municipality: "Madrid",
  province: "Madrid",
  createdAt: new Date("2026-01-01"),
  category: { name: "Restaurante" },
  createdBy: { name: "María" },
};

describe("listEstablishments (SPEC-030)", () => {
  it("ordena por creación descendente con select explícito", async () => {
    findMany.mockResolvedValue([sampleItem]);

    const result = await listEstablishments();

    expect(result).toEqual([sampleItem]);
    expect(findMany).toHaveBeenCalledOnce();
    expect(findMany.mock.calls[0]?.[0]?.orderBy).toEqual({ createdAt: "desc" });
    const select = findMany.mock.calls[0]?.[0]?.select;
    expect(select).toBeDefined();
    expect(select).not.toHaveProperty("passwordHash");
  });

  it("retorna lista vacía sin establecimientos", async () => {
    findMany.mockResolvedValue([]);

    await expect(listEstablishments()).resolves.toEqual([]);
  });
});

describe("getEstablishmentById (SPEC-030)", () => {
  it("retorna la ficha con sus relaciones", async () => {
    const detail = { ...sampleItem, address: "Calle Mayor 1", description: null };
    findUnique.mockResolvedValue(detail);

    await expect(getEstablishmentById("est-1")).resolves.toEqual(detail);
    expect(findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "est-1" } }));
  });

  it("retorna null si no existe", async () => {
    findUnique.mockResolvedValue(null);

    await expect(getEstablishmentById("inexistente")).resolves.toBeNull();
  });
});
