import { describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { listMunicipalities, listProvinces } from "@/features/establishments/services/geo.service";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    province: { findMany: vi.fn() },
    municipality: { findMany: vi.fn() },
  },
}));

const findProvinces = vi.mocked(prisma.province.findMany);
const findMunicipalities = vi.mocked(prisma.municipality.findMany);

describe("listProvinces (SPEC-035)", () => {
  it("devuelve id, code y name ordenados", async () => {
    findProvinces.mockResolvedValue([{ id: "prov-28", code: "28", name: "Madrid" }]);

    await expect(listProvinces()).resolves.toEqual([{ id: "prov-28", code: "28", name: "Madrid" }]);
    expect(findProvinces).toHaveBeenCalledWith({
      orderBy: { name: "asc" },
      select: { id: true, code: true, name: true },
    });
  });
});

describe("listMunicipalities (SPEC-035)", () => {
  it("devuelve id, code, name y provinceId para el filtrado en cliente", async () => {
    findMunicipalities.mockResolvedValue([
      { id: "mun-1", code: "28006", name: "Madrid", provinceId: "prov-28" },
    ]);

    await expect(listMunicipalities()).resolves.toEqual([
      { id: "mun-1", code: "28006", name: "Madrid", provinceId: "prov-28" },
    ]);
  });
});
