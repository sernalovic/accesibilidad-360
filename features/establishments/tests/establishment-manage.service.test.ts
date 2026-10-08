import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db/prisma";
import {
  deleteEstablishment,
  updateEstablishment,
} from "@/features/establishments/services/establishment.service";
import { geocodeAddress } from "@/features/establishments/services/geocoding.service";
import { deleteUploadedPhoto } from "@/features/photos/services/photo-storage.service";
import {
  EstablishmentNotFoundError,
  ForbiddenEstablishmentError,
} from "@/features/establishments/services/establishment-permissions";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    category: { findUnique: vi.fn() },
    province: { findUnique: vi.fn() },
    municipality: { findUnique: vi.fn() },
    establishment: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  },
}));

vi.mock("@/features/establishments/services/geocoding.service", () => ({
  geocodeAddress: vi.fn(),
}));

vi.mock("@/features/photos/services/photo-storage.service", () => ({
  deleteUploadedPhoto: vi.fn(),
  uploadPhotoBuffer: vi.fn(),
}));

const findCategory = vi.mocked(prisma.category.findUnique);
const findProvince = vi.mocked(prisma.province.findUnique);
const findMunicipality = vi.mocked(prisma.municipality.findUnique);
const findEstablishment = vi.mocked(prisma.establishment.findUnique);
const update = vi.mocked(prisma.establishment.update);
const remove = vi.mocked(prisma.establishment.delete);
const geocodeMock = vi.mocked(geocodeAddress);
const destroyMock = vi.mocked(deleteUploadedPhoto);

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
  description: "",
};

const current = {
  createdById: "user-1",
  address: "Calle Mayor 1",
  municipalityId: "mun-1",
  provinceId: "prov-28",
  latitude: 40.4,
  longitude: -3.7,
};

function mockValidReferences(): void {
  findCategory.mockResolvedValue({ id: "cat-1", name: "Restaurante" });
  findProvince.mockResolvedValue({ id: "prov-28", name: "Madrid" });
  findMunicipality.mockResolvedValue({
    id: "mun-1",
    name: "Madrid",
    provinceId: "prov-28",
  });
  update.mockImplementation(async (args) => ({ id: "est-1", name: args.data.name ?? "" }));
}

describe("updateEstablishment (SPEC-080)", () => {
  it("actualiza como propietario preservando coordenadas sin cambios geo", async () => {
    mockValidReferences();
    findEstablishment.mockResolvedValue(current);

    const result = await updateEstablishment("est-1", validData, { id: "user-1", role: "USER" });

    expect(result).toEqual({ id: "est-1", name: "Restaurante Ejemplo" });
    expect(geocodeMock).not.toHaveBeenCalled();
    expect(update.mock.calls[0]?.[0]?.data.latitude).toBe(40.4);
    expect(update.mock.calls[0]?.[0]?.data.longitude).toBe(-3.7);
  });

  it("recalcula coordenadas solo si cambia la ubicación", async () => {
    mockValidReferences();
    findEstablishment.mockResolvedValue(current);
    geocodeMock.mockResolvedValue({ latitude: 41.3, longitude: 2.1 });

    await updateEstablishment(
      "est-1",
      { ...validData, address: "Gran Vía 2" },
      { id: "user-1", role: "USER" },
    );

    expect(geocodeMock).toHaveBeenCalledOnce();
    expect(update.mock.calls[0]?.[0]?.data.latitude).toBe(41.3);
    expect(update.mock.calls[0]?.[0]?.data.longitude).toBe(2.1);
  });

  it("permite al administrador sobre contenido ajeno", async () => {
    mockValidReferences();
    findEstablishment.mockResolvedValue(current);

    await expect(
      updateEstablishment("est-1", validData, { id: "admin-1", role: "ADMIN" }),
    ).resolves.toBeDefined();
    expect(update).toHaveBeenCalledOnce();
  });

  it("deniega a terceros sin modificar nada", async () => {
    mockValidReferences();
    findEstablishment.mockResolvedValue(current);

    await expect(
      updateEstablishment("est-1", validData, { id: "other", role: "USER" }),
    ).rejects.toBeInstanceOf(ForbiddenEstablishmentError);
    expect(update).not.toHaveBeenCalled();
    expect(geocodeMock).not.toHaveBeenCalled();
  });

  it("rechaza el establecimiento inexistente", async () => {
    findEstablishment.mockResolvedValue(null);

    await expect(
      updateEstablishment("inexistente", validData, { id: "user-1", role: "USER" }),
    ).rejects.toBeInstanceOf(EstablishmentNotFoundError);
    expect(update).not.toHaveBeenCalled();
  });
});

describe("deleteEstablishment (SPEC-080)", () => {
  it("elimina como propietario limpiando Cloudinary", async () => {
    findEstablishment.mockResolvedValue({
      createdById: "user-1",
      photos: [{ publicId: "accesibilidad360/foto" }],
    });
    remove.mockResolvedValue({ id: "est-1" });

    await deleteEstablishment("est-1", { id: "user-1", role: "USER" });

    expect(destroyMock).toHaveBeenCalledWith("accesibilidad360/foto");
    expect(remove).toHaveBeenCalledWith({ where: { id: "est-1" } });
  });

  it("permite al administrador sobre contenido ajeno", async () => {
    findEstablishment.mockResolvedValue({ createdById: "user-1", photos: [] });
    remove.mockResolvedValue({ id: "est-1" });

    await deleteEstablishment("est-1", { id: "admin-1", role: "ADMIN" });

    expect(remove).toHaveBeenCalledOnce();
  });

  it("deniega a terceros sin borrar nada", async () => {
    findEstablishment.mockResolvedValue({ createdById: "user-1", photos: [] });

    await expect(
      deleteEstablishment("est-1", { id: "other", role: "USER" }),
    ).rejects.toBeInstanceOf(ForbiddenEstablishmentError);
    expect(destroyMock).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });

  it("rechaza el establecimiento inexistente", async () => {
    findEstablishment.mockResolvedValue(null);

    await expect(
      deleteEstablishment("inexistente", { id: "user-1", role: "USER" }),
    ).rejects.toBeInstanceOf(EstablishmentNotFoundError);
    expect(remove).not.toHaveBeenCalled();
  });
});
