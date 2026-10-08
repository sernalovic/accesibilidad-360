import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db/prisma";
import {
  CategoryNotFoundError,
  MunicipalityNotFoundError,
  ProvinceNotFoundError,
  createEstablishment,
} from "@/features/establishments/services/establishment.service";
import { geocodeAddress } from "@/features/establishments/services/geocoding.service";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    category: { findUnique: vi.fn() },
    province: { findUnique: vi.fn() },
    municipality: { findUnique: vi.fn() },
    establishment: { create: vi.fn() },
  },
}));

// Geocodificación mockeada: sin red en tests (SPEC-060).
vi.mock("@/features/establishments/services/geocoding.service", () => ({
  geocodeAddress: vi.fn(),
}));

const findCategory = vi.mocked(prisma.category.findUnique);
const findProvince = vi.mocked(prisma.province.findUnique);
const findMunicipality = vi.mocked(prisma.municipality.findUnique);
const create = vi.mocked(prisma.establishment.create);
const geocodeMock = vi.mocked(geocodeAddress);

beforeEach(() => {
  vi.clearAllMocks();
  geocodeMock.mockResolvedValue(null);
});

const validData = {
  name: "Restaurante Ejemplo",
  categoryId: "cat-1",
  address: "Calle Mayor 1",
  provinceId: "prov-28",
  municipalityId: "mun-1",
  description: "Un lugar accesible.",
};

function mockReadyDatabase(): void {
  findCategory.mockResolvedValue({ id: "cat-1", name: "Restaurante" });
  findProvince.mockResolvedValue({ id: "prov-28", name: "Madrid" });
  findMunicipality.mockResolvedValue({
    id: "mun-1",
    name: "Madrid",
    provinceId: "prov-28",
    province: { name: "Madrid" },
  });
  create.mockImplementation(async (args) => ({ id: "est-1", name: args.data.name ?? "" }));
}

describe("createEstablishment (SPEC-030 + SPEC-035)", () => {
  it("crea la ficha con el autor de la sesión, nunca del cliente", async () => {
    mockReadyDatabase();

    const result = await createEstablishment(validData, "user-1");

    expect(result).toEqual({ id: "est-1", name: "Restaurante Ejemplo" });
    expect(create).toHaveBeenCalledOnce();
    expect(create.mock.calls[0]?.[0]?.data.createdById).toBe("user-1");
    expect(create.mock.calls[0]?.[0]?.data.categoryId).toBe("cat-1");
    expect(create.mock.calls[0]?.[0]?.data.provinceId).toBe("prov-28");
    expect(create.mock.calls[0]?.[0]?.data.municipalityId).toBe("mun-1");
  });

  it("geocodifica con los nombres oficiales de la base de datos (SPEC-060)", async () => {
    mockReadyDatabase();

    await createEstablishment(validData, "user-1");

    expect(geocodeMock).toHaveBeenCalledWith({
      address: "Calle Mayor 1",
      municipality: "Madrid",
      province: "Madrid",
    });
  });

  it("guarda null cuando no hay descripción", async () => {
    mockReadyDatabase();

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

  it("rechaza la provincia inexistente sin crear nada", async () => {
    findCategory.mockResolvedValue({ id: "cat-1", name: "Restaurante" });
    findProvince.mockResolvedValue(null);

    await expect(createEstablishment(validData, "user-1")).rejects.toBeInstanceOf(
      ProvinceNotFoundError,
    );
    expect(create).not.toHaveBeenCalled();
  });

  it("rechaza el municipio de otra provincia", async () => {
    mockReadyDatabase();
    findMunicipality.mockResolvedValue({
      id: "mun-1",
      name: "Barcelona",
      provinceId: "prov-08",
      province: { name: "Barcelona" },
    });

    await expect(createEstablishment(validData, "user-1")).rejects.toBeInstanceOf(
      MunicipalityNotFoundError,
    );
    expect(create).not.toHaveBeenCalled();
  });

  it("persiste las coordenadas geocodificadas (SPEC-060)", async () => {
    mockReadyDatabase();
    geocodeMock.mockResolvedValue({ latitude: 40.4168, longitude: -3.7038 });

    await createEstablishment(validData, "user-1");

    expect(create.mock.calls[0]?.[0]?.data.latitude).toBe(40.4168);
    expect(create.mock.calls[0]?.[0]?.data.longitude).toBe(-3.7038);
  });

  it("crea con null si la geocodificación falla (SPEC-060)", async () => {
    mockReadyDatabase();
    geocodeMock.mockResolvedValue(null);

    await createEstablishment(validData, "user-1");

    expect(create.mock.calls[0]?.[0]?.data.latitude).toBeNull();
    expect(create.mock.calls[0]?.[0]?.data.longitude).toBeNull();
  });
});
