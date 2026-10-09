import { beforeEach, describe, expect, it, vi } from "vitest";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { uploadPhotoBuffer } from "@/features/photos/services/photo-storage.service";
import { testImageFile } from "@/tests/utils/test-files";
import { uploadPhotoAction } from "@/features/photos/actions/upload-photo.action";

vi.mock("@/lib/auth/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/features/photos/services/photo-storage.service", () => ({
  uploadPhotoBuffer: vi.fn(),
  deleteUploadedPhoto: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    establishment: { findUnique: vi.fn() },
    photo: { findFirst: vi.fn(), create: vi.fn(), count: vi.fn() },
  },
}));

const authMock = vi.mocked(auth);
const uploadMock = vi.mocked(uploadPhotoBuffer);
const findEstablishment = vi.mocked(prisma.establishment.findUnique);
const findPhoto = vi.mocked(prisma.photo.findFirst);
const countPhotos = vi.mocked(prisma.photo.count);
const create = vi.mocked(prisma.photo.create);

const session = {
  user: { id: "user-1", name: "María", email: "maria@example.com", role: "USER" as const },
};

function formData(): FormData {
  const data = new FormData();
  data.set("establishmentId", "est-1");
  data.set("photo", testImageFile());
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  countPhotos.mockResolvedValue(0);
});

describe("uploadPhotoAction (SPEC-050)", () => {
  it("rechaza sin sesión sin subir nada", async () => {
    authMock.mockResolvedValue(null);

    const result = await uploadPhotoAction({ success: false, message: null }, formData());

    expect(result).toEqual({
      success: false,
      message: "Debes iniciar sesión para subir una fotografía.",
    });
    expect(uploadMock).not.toHaveBeenCalled();
  });

  it("rechaza archivos no válidos sin subir nada", async () => {
    authMock.mockResolvedValue({ ...session, expires: new Date().toISOString() });
    const bad = formData();
    bad.set("photo", new File([new Uint8Array(10)], "foto.gif", { type: "image/gif" }));

    const result = await uploadPhotoAction({ success: false, message: null }, bad);

    expect(result.success).toBe(false);
    expect(uploadMock).not.toHaveBeenCalled();
  });

  it("publica con sesión válida", async () => {
    authMock.mockResolvedValue({ ...session, expires: new Date().toISOString() });
    findEstablishment.mockResolvedValue({ id: "est-1" });
    findPhoto.mockResolvedValue(null);
    uploadMock.mockResolvedValue({
      url: "https://res.cloudinary.com/demo/image/upload/foto.jpg",
      publicId: "accesibilidad360/foto",
      width: 1200,
      height: 800,
    });
    create.mockResolvedValue({ id: "photo-1", url: "https://x/y.jpg" });

    const result = await uploadPhotoAction({ success: false, message: null }, formData());

    expect(result).toEqual({ success: true, message: "Fotografía publicada correctamente." });
  });
});
