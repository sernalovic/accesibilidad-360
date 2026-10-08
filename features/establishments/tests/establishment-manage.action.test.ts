import { beforeEach, describe, expect, it, vi } from "vitest";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { updateEstablishmentAction } from "@/features/establishments/actions/update-establishment.action";
import { deleteEstablishmentAction } from "@/features/establishments/actions/delete-establishment.action";
import { geocodeAddress } from "@/features/establishments/services/geocoding.service";

vi.mock("@/lib/auth/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

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

const authMock = vi.mocked(auth);
const revalidateMock = vi.mocked(revalidatePath);
const findCategory = vi.mocked(prisma.category.findUnique);
const findProvince = vi.mocked(prisma.province.findUnique);
const findMunicipality = vi.mocked(prisma.municipality.findUnique);
const findEstablishment = vi.mocked(prisma.establishment.findUnique);
const update = vi.mocked(prisma.establishment.update);
const remove = vi.mocked(prisma.establishment.delete);
const geocodeMock = vi.mocked(geocodeAddress);

const session = {
  user: { id: "user-1", name: "María", email: "maria@example.com", role: "USER" as const },
};

const validInput = {
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

beforeEach(() => {
  vi.clearAllMocks();
  geocodeMock.mockResolvedValue(null);
});

describe("updateEstablishmentAction (SPEC-080)", () => {
  it("rechaza sin sesión", async () => {
    authMock.mockResolvedValue(null);

    const result = await updateEstablishmentAction("est-1", validInput);

    expect(result).toEqual({
      success: false,
      message: "Debes iniciar sesión para editar un establecimiento.",
    });
    expect(update).not.toHaveBeenCalled();
  });

  it("actualiza y revalida ficha y listado", async () => {
    authMock.mockResolvedValue({ ...session, expires: new Date().toISOString() });
    findEstablishment.mockResolvedValue(current);
    findCategory.mockResolvedValue({ id: "cat-1", name: "Restaurante" });
    findProvince.mockResolvedValue({ id: "prov-28", name: "Madrid" });
    findMunicipality.mockResolvedValue({
      id: "mun-1",
      name: "Madrid",
      provinceId: "prov-28",
    });
    update.mockResolvedValue({ id: "est-1", name: "Restaurante Ejemplo" });

    const result = await updateEstablishmentAction("est-1", validInput);

    expect(result).toEqual({ success: true, id: "est-1" });
    expect(revalidateMock).toHaveBeenCalledWith("/establishments/est-1");
    expect(revalidateMock).toHaveBeenCalledWith("/establishments");
  });

  it("propaga el mensaje de permiso denegado", async () => {
    authMock.mockResolvedValue({ ...session, expires: new Date().toISOString() });
    findEstablishment.mockResolvedValue({ ...current, createdById: "other" });

    const result = await updateEstablishmentAction("est-1", validInput);

    expect(result).toEqual({
      success: false,
      message: "No tienes permiso para modificar este establecimiento.",
    });
    expect(update).not.toHaveBeenCalled();
  });
});

describe("deleteEstablishmentAction (SPEC-080)", () => {
  it("rechaza sin sesión", async () => {
    authMock.mockResolvedValue(null);

    const result = await deleteEstablishmentAction("est-1");

    expect(result).toEqual({
      success: false,
      message: "Debes iniciar sesión para eliminar un establecimiento.",
    });
    expect(remove).not.toHaveBeenCalled();
  });

  it("elimina y revalida el listado", async () => {
    authMock.mockResolvedValue({ ...session, expires: new Date().toISOString() });
    findEstablishment.mockResolvedValue({ createdById: "user-1", photos: [] });
    remove.mockResolvedValue({ id: "est-1" });

    const result = await deleteEstablishmentAction("est-1");

    expect(result).toEqual({ success: true });
    expect(revalidateMock).toHaveBeenCalledWith("/establishments");
  });

  it("propaga el mensaje de permiso denegado", async () => {
    authMock.mockResolvedValue({ ...session, expires: new Date().toISOString() });
    findEstablishment.mockResolvedValue({ createdById: "other", photos: [] });

    const result = await deleteEstablishmentAction("est-1");

    expect(result).toEqual({
      success: false,
      message: "No tienes permiso para modificar este establecimiento.",
    });
    expect(remove).not.toHaveBeenCalled();
  });
});
