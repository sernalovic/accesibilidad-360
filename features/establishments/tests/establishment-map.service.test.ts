import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { listMappedEstablishments } from "@/features/establishments/services/establishment.service";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    establishment: { findMany: vi.fn() },
  },
}));

const findMany = vi.mocked(prisma.establishment.findMany);

beforeEach(() => {
  vi.clearAllMocks();
});

function row(overrides: Record<string, unknown> = {}) {
  return {
    id: "est-1",
    name: "Restaurante Ejemplo",
    latitude: 40.4,
    longitude: -3.7,
    createdAt: new Date("2026-01-01"),
    category: { name: "Restaurante" },
    municipality: { name: "Madrid" },
    province: { name: "Madrid" },
    photos: [{ url: "https://res.cloudinary.com/demo/foto.jpg" }],
    createdBy: { name: "María" },
    reviews: [{ scores: [{ score: 5 }, { score: 3 }] }],
    ...overrides,
  };
}

describe("listMappedEstablishments (SPEC-090)", () => {
  it("filtra sin coordenadas con select explícito", async () => {
    findMany.mockResolvedValue([row()]);

    const result = await listMappedEstablishments();

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { latitude: { not: null }, longitude: { not: null } },
      }),
    );
    const select = findMany.mock.calls[0]?.[0]?.select;
    expect(select).toBeDefined();
    expect(select).not.toHaveProperty("passwordHash");
    expect(result).toEqual([
      expect.objectContaining({
        id: "est-1",
        latitude: 40.4,
        longitude: -3.7,
        category: "Restaurante",
        municipality: "Madrid",
        province: "Madrid",
        photoUrl: "https://res.cloudinary.com/demo/foto.jpg",
        averageScore: 4,
        reviewCount: 1,
        hasReviews: true,
      }),
    ]);
  });

  it("mapea photoUrl a null sin fotografías", async () => {
    findMany.mockResolvedValue([row({ photos: [], reviews: [] })]);

    const result = await listMappedEstablishments();

    expect(result).toEqual([
      expect.objectContaining({
        photoUrl: null,
        averageScore: 0,
        reviewCount: 0,
        hasReviews: false,
      }),
    ]);
  });

  it("retorna vacío sin establecimientos geolocalizados", async () => {
    findMany.mockResolvedValue([]);

    await expect(listMappedEstablishments()).resolves.toEqual([]);
  });
});
