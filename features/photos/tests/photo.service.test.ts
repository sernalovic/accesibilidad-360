import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { testImageFile } from "@/tests/utils/test-files";
import {
  deleteUploadedPhoto,
  uploadPhotoBuffer,
} from "@/features/photos/services/photo-storage.service";
import {
  PhotoAlreadyExistsError,
  PhotoTooSmallError,
  uploadEstablishmentPhoto,
} from "@/features/photos/services/photo.service";

vi.mock("@/features/photos/services/photo-storage.service", () => ({
  uploadPhotoBuffer: vi.fn(),
  deleteUploadedPhoto: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    establishment: { findUnique: vi.fn() },
    photo: { findFirst: vi.fn(), create: vi.fn() },
  },
}));

const uploadMock = vi.mocked(uploadPhotoBuffer);
const deleteMock = vi.mocked(deleteUploadedPhoto);
const findEstablishment = vi.mocked(prisma.establishment.findUnique);
const findPhoto = vi.mocked(prisma.photo.findFirst);
const create = vi.mocked(prisma.photo.create);

beforeEach(() => {
  vi.clearAllMocks();
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

  it("rechaza la segunda fotografía sin subir nada", async () => {
    findEstablishment.mockResolvedValue({ id: "est-1" });
    findPhoto.mockResolvedValue({ id: "photo-previa" });

    await expect(uploadEstablishmentPhoto("est-1", "user-1", file)).rejects.toBeInstanceOf(
      PhotoAlreadyExistsError,
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
