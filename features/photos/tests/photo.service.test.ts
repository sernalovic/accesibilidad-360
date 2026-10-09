import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { testImageFile } from "@/tests/utils/test-files";
import {
  deleteUploadedPhoto,
  uploadPhotoBuffer,
} from "@/features/photos/services/photo-storage.service";
import {
  ForbiddenPhotoError,
  PhotoLimitReachedError,
  PhotoNotFoundError,
  PhotoTooSmallError,
  deletePhoto,
  setPrimaryPhoto,
  uploadEstablishmentPhoto,
} from "@/features/photos/services/photo.service";

vi.mock("@/features/photos/services/photo-storage.service", () => ({
  uploadPhotoBuffer: vi.fn(),
  deleteUploadedPhoto: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    establishment: { findUnique: vi.fn() },
    photo: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

const uploadMock = vi.mocked(uploadPhotoBuffer);
const deleteMock = vi.mocked(deleteUploadedPhoto);
const findEstablishment = vi.mocked(prisma.establishment.findUnique);
const findPhoto = vi.mocked(prisma.photo.findFirst);
const findPhotoById = vi.mocked(prisma.photo.findUnique);
const removePhoto = vi.mocked(prisma.photo.delete);
const countPhotos = vi.mocked(prisma.photo.count);
const create = vi.mocked(prisma.photo.create);

beforeEach(() => {
  vi.clearAllMocks();
  countPhotos.mockResolvedValue(0);
});

const file = testImageFile();

function mockReadyDatabase(): void {
  findEstablishment.mockResolvedValue({ id: "est-1" });
  findPhoto.mockResolvedValue(null);
  uploadMock.mockResolvedValue({
    url: "https://res.cloudinary.com/demo/image/upload/foto.jpg",
    publicId: "accesibilidad360/foto",
    width: 1200,
    height: 800,
  });
  create.mockImplementation(async (args) => ({ id: "photo-1", url: args.data.url ?? "" }));
}

describe("uploadEstablishmentPhoto (SPEC-050)", () => {
  it("persiste solo url y publicId con isPrimary", async () => {
    mockReadyDatabase();

    const result = await uploadEstablishmentPhoto("est-1", "user-1", file);

    expect(result).toEqual({
      id: "photo-1",
      url: "https://res.cloudinary.com/demo/image/upload/foto.jpg",
    });
    expect(create).toHaveBeenCalledOnce();
    expect(create.mock.calls[0]?.[0]?.data).toEqual({
      establishmentId: "est-1",
      userId: "user-1",
      url: "https://res.cloudinary.com/demo/image/upload/foto.jpg",
      publicId: "accesibilidad360/foto",
      isPrimary: true,
    });
  });

  it("la segunda fotografía es secundaria (SPEC-120)", async () => {
    mockReadyDatabase();
    countPhotos.mockResolvedValue(1);

    await uploadEstablishmentPhoto("est-1", "user-1", file);

    expect(create.mock.calls[0]?.[0]?.data.isPrimary).toBe(false);
  });

  it("rechaza al alcanzar el máximo sin subir nada (SPEC-120)", async () => {
    findEstablishment.mockResolvedValue({ id: "est-1" });
    countPhotos.mockResolvedValue(10);

    await expect(uploadEstablishmentPhoto("est-1", "user-1", file)).rejects.toBeInstanceOf(
      PhotoLimitReachedError,
    );
    expect(uploadMock).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  it("elimina lo subido y rechaza dimensiones insuficientes", async () => {
    mockReadyDatabase();
    uploadMock.mockResolvedValue({
      url: "https://res.cloudinary.com/demo/image/upload/foto.jpg",
      publicId: "accesibilidad360/foto",
      width: 400,
      height: 300,
    });

    await expect(uploadEstablishmentPhoto("est-1", "user-1", file)).rejects.toBeInstanceOf(
      PhotoTooSmallError,
    );
    expect(deleteMock).toHaveBeenCalledWith("accesibilidad360/foto");
    expect(create).not.toHaveBeenCalled();
  });
});

describe("deletePhoto (SPEC-110)", () => {
  it("borra primero en Cloudinary y después en BD", async () => {
    findPhotoById.mockResolvedValue({
      id: "photo-1",
      userId: "user-1",
      publicId: "accesibilidad360/foto",
      establishmentId: "est-1",
    });
    removePhoto.mockResolvedValue({ id: "photo-1" });

    const result = await deletePhoto("photo-1", { id: "user-1", role: "USER" });

    expect(result).toEqual({ establishmentId: "est-1" });
    expect(deleteMock).toHaveBeenCalledWith("accesibilidad360/foto");
    expect(removePhoto).toHaveBeenCalledWith({ where: { id: "photo-1" } });
  });

  it("conserva el registro si Cloudinary falla", async () => {
    findPhotoById.mockResolvedValue({
      id: "photo-1",
      userId: "user-1",
      publicId: "accesibilidad360/foto",
      establishmentId: "est-1",
    });
    deleteMock.mockRejectedValue(new Error("Cloudinary caído"));

    await expect(deletePhoto("photo-1", { id: "user-1", role: "USER" })).rejects.toThrow(
      "Cloudinary caído",
    );
    expect(removePhoto).not.toHaveBeenCalled();
  });

  it("rechaza inexistente y sin permiso", async () => {
    findPhotoById.mockResolvedValue(null);
    await expect(deletePhoto("x", { id: "user-1", role: "USER" })).rejects.toBeInstanceOf(
      PhotoNotFoundError,
    );

    findPhotoById.mockResolvedValue({
      id: "photo-1",
      userId: "owner-1",
      publicId: "accesibilidad360/foto",
      establishmentId: "est-1",
    });
    await expect(deletePhoto("photo-1", { id: "other", role: "USER" })).rejects.toBeInstanceOf(
      ForbiddenPhotoError,
    );
    expect(deleteMock).not.toHaveBeenCalled();
    expect(removePhoto).not.toHaveBeenCalled();
  });

  it("promociona la más antigua al borrar la principal (SPEC-120)", async () => {
    deleteMock.mockResolvedValue(undefined);
    findPhotoById.mockResolvedValue({
      id: "photo-1",
      userId: "user-1",
      publicId: "accesibilidad360/foto",
      establishmentId: "est-1",
      isPrimary: true,
    });
    removePhoto.mockResolvedValue({ id: "photo-1" });
    findPhoto.mockResolvedValueOnce({ id: "photo-2" });
    const updatePhoto = vi.mocked(prisma.photo.update);
    updatePhoto.mockResolvedValue({ id: "photo-2" });

    await deletePhoto("photo-1", { id: "user-1", role: "USER" });

    expect(updatePhoto).toHaveBeenCalledWith({
      where: { id: "photo-2" },
      data: { isPrimary: true },
    });
  });

  it("sin restantes no promociona nada (SPEC-120)", async () => {
    deleteMock.mockResolvedValue(undefined);
    findPhotoById.mockResolvedValue({
      id: "photo-1",
      userId: "user-1",
      publicId: "accesibilidad360/foto",
      establishmentId: "est-1",
      isPrimary: true,
    });
    removePhoto.mockResolvedValue({ id: "photo-1" });
    findPhoto.mockResolvedValueOnce(null);
    const updatePhoto = vi.mocked(prisma.photo.update);

    await deletePhoto("photo-1", { id: "user-1", role: "USER" });

    expect(updatePhoto).not.toHaveBeenCalled();
  });
});

describe("setPrimaryPhoto (SPEC-120)", () => {
  it("fija la principal en transacción como autor o admin", async () => {
    findPhotoById.mockResolvedValue({
      id: "photo-2",
      userId: "user-1",
      establishmentId: "est-1",
    });
    const transaction = vi.mocked(prisma.$transaction);
    transaction.mockImplementation(async (operations: unknown) => {
      expect(operations).toHaveLength(2);
      return [];
    });

    const result = await setPrimaryPhoto("photo-2", { id: "user-1", role: "USER" });

    expect(result).toEqual({ establishmentId: "est-1" });
    expect(transaction).toHaveBeenCalledOnce();
  });

  it("rechaza inexistente y sin permiso", async () => {
    findPhotoById.mockResolvedValue(null);
    await expect(setPrimaryPhoto("x", { id: "user-1", role: "USER" })).rejects.toBeInstanceOf(
      PhotoNotFoundError,
    );

    findPhotoById.mockResolvedValue({ id: "photo-2", userId: "owner-1", establishmentId: "est-1" });
    await expect(setPrimaryPhoto("photo-2", { id: "other", role: "USER" })).rejects.toBeInstanceOf(
      ForbiddenPhotoError,
    );
  });
});
