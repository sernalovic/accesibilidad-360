import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { searchEstablishments } from "@/features/establishments/services/establishment.service";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    establishment: { findMany: vi.fn() },
  },
}));

const findMany = vi.mocked(prisma.establishment.findMany);

beforeEach(() => {
  vi.clearAllMocks();
});

function row(name: string, createdAt: string, scores: number[] = []) {
  return {
    id: `est-${name}`,
    name,
    municipality: { name: "Madrid" },
    province: { name: "Madrid" },
    createdAt: new Date(createdAt),
    category: { name: "Restaurante" },
    createdBy: { name: "María" },
    reviews: scores.length > 0 ? [{ scores: scores.map((score) => ({ score })) }] : [],
  };
}

describe("searchEstablishments (SPEC-070)", () => {
  it("sin filtros ordena por creación descendente", async () => {
    findMany.mockResolvedValue([row("B", "2026-02-01"), row("A", "2026-01-01")]);

    const result = await searchEstablishments({});

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {}, orderBy: { createdAt: "desc" } }),
    );
    expect(result.map((item) => item.name)).toEqual(["B", "A"]);
  });

  it("combina búsqueda, categoría, provincia y municipio", async () => {
    findMany.mockResolvedValue([]);

    await searchEstablishments({
      search: "  usoa  ",
      categoryId: "cat-1",
      provinceId: "prov-28",
      municipalityId: "mun-1",
      sort: "recent",
    });

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          name: { contains: "usoa", mode: "insensitive" },
          categoryId: "cat-1",
          provinceId: "prov-28",
          municipalityId: "mun-1",
        },
      }),
    );
  });

  it("ignora valores vacíos y orden desconocido", async () => {
    findMany.mockResolvedValue([]);

    await searchEstablishments({ search: "   ", categoryId: "", sort: "inexistente" });

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {}, orderBy: { createdAt: "desc" } }),
    );
  });

  it("ordena por nombre ascendente y descendente en base de datos", async () => {
    findMany.mockResolvedValue([]);

    await searchEstablishments({ sort: "name-asc" });
    expect(findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({ orderBy: { name: "asc" } }),
    );

    await searchEstablishments({ sort: "name-desc" });
    expect(findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({ orderBy: { name: "desc" } }),
    );

    await searchEstablishments({ sort: "oldest" });
    expect(findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({ orderBy: { createdAt: "asc" } }),
    );
  });

  it("ordena por valoración en memoria con desempate por fecha", async () => {
    findMany.mockResolvedValue([
      row("Medio", "2026-03-01", [3, 3]),
      row("Mejor", "2026-01-01", [5, 5]),
      row("Sin valorar", "2026-04-01"),
      row("Empate nuevo", "2026-05-01", [4]),
      row("Empate viejo", "2026-02-01", [4]),
    ]);

    const result = await searchEstablishments({ sort: "rating" });

    expect(result.map((item) => item.name)).toEqual([
      "Mejor",
      "Empate nuevo",
      "Empate viejo",
      "Medio",
      "Sin valorar",
    ]);
  });
});
