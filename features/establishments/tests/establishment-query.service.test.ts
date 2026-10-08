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
  municipality: { name: "Madrid" },
  province: { name: "Madrid" },
  createdAt: new Date("2026-01-01"),
  category: { name: "Restaurante" },
  createdBy: { name: "María" },
  reviews: [],
};

const sampleFlat = {
  id: "est-1",
  name: "Restaurante Ejemplo",
  municipality: "Madrid",
  province: "Madrid",
  createdAt: new Date("2026-01-01"),
  category: { name: "Restaurante" },
  createdBy: { name: "María" },
};

const sampleSummary = { averageScore: 0, reviewCount: 0, hasReviews: false };

describe("listEstablishments (SPEC-030)", () => {
  it("ordena por creación descendente con select explícito", async () => {
    findMany.mockResolvedValue([sampleItem]);

    const result = await listEstablishments();

    expect(result).toEqual([{ ...sampleFlat, ...sampleSummary }]);
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

  it("calcula la media redondeada a un decimal y el conteo", async () => {
    findMany.mockResolvedValue([
      {
        ...sampleItem,
        reviews: [{ scores: [{ score: 5 }, { score: 4 }] }, { scores: [{ score: 4 }] }],
      },
    ]);

    const result = await listEstablishments();

    expect(result).toEqual([
      expect.objectContaining({ averageScore: 4.3, reviewCount: 2, hasReviews: true }),
    ]);
  });
});

describe("getEstablishmentById (SPEC-030 + SPEC-040)", () => {
  it("retorna la ficha con sus relaciones y sin valoraciones", async () => {
    const detail = {
      ...sampleItem,
      address: "Calle Mayor 1",
      description: null,
      latitude: null,
      longitude: null,
    };
    findUnique.mockResolvedValue(detail);

    const result = await getEstablishmentById("est-1");

    expect(result).toEqual({
      ...sampleFlat,
      address: "Calle Mayor 1",
      description: null,
      latitude: null,
      longitude: null,
      ...sampleSummary,
    });
    expect(findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "est-1" } }));
  });

  it("incluye la media cuando existen puntuaciones", async () => {
    findUnique.mockResolvedValue({
      ...sampleItem,
      address: "Calle Mayor 1",
      description: null,
      reviews: [{ scores: [{ score: 3 }, { score: 3 }] }],
    });

    const result = await getEstablishmentById("est-1");

    expect(result).toEqual(
      expect.objectContaining({ averageScore: 3, reviewCount: 1, hasReviews: true }),
    );
  });

  it("excluye los «No aplicable» de la media: (5+5+4)/3 (SPEC-045)", async () => {
    findUnique.mockResolvedValue({
      ...sampleItem,
      address: "Calle Mayor 1",
      description: null,
      reviews: [{ scores: [{ score: 5 }, { score: 5 }, { score: 4 }, { score: null }] }],
    });

    const result = await getEstablishmentById("est-1");

    expect(result).toEqual(
      expect.objectContaining({ averageScore: 4.7, reviewCount: 1, hasReviews: true }),
    );
  });

  it("retorna null si no existe", async () => {
    findUnique.mockResolvedValue(null);

    await expect(getEstablishmentById("inexistente")).resolves.toBeNull();
  });
});
