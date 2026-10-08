import { beforeEach, describe, expect, it, vi } from "vitest";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { deletePhotoAction } from "@/features/photos/actions/delete-photo.action";
import { deleteUploadedPhoto } from "@/features/photos/services/photo-storage.service";

vi.mock("@/lib/auth/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/features/photos/services/photo-storage.service", () => ({
  uploadPhotoBuffer: vi.fn(),
  deleteUploadedPhoto: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    photo: { findUnique: vi.fn(), delete: vi.fn() },
  },
}));

const authMock = vi.mocked(auth);
const revalidateMock = vi.mocked(revalidatePath);
const findPhoto = vi.mocked(prisma.photo.findUnique);
const removePhoto = vi.mocked(prisma.photo.delete);
const destroyMock = vi.mocked(deleteUploadedPhoto);

const session = {
  user: { id: "user-1", name: "María", email: "maria@example.com", role: "USER" as const },
  expires: new Date().toISOString(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("deletePhotoAction (SPEC-110)", () => {
  it("rechaza sin sesión", async () => {
    authMock.mockResolvedValue(null);

    await expect(deletePhotoAction("photo-1")).resolves.toEqual({
      success: false,
      message: "Debes iniciar sesión para eliminar una fotografía.",
    });
    expect(removePhoto).not.toHaveBeenCalled();
  });

  it("elimina y revalida la ficha", async () => {
    authMock.mockResolvedValue(session);
    findPhoto.mockResolvedValue({
      id: "photo-1",
      userId: "user-1",
      publicId: "accesibilidad360/foto",
      establishmentId: "est-1",
    });
    destroyMock.mockResolvedValue(undefined);
    removePhoto.mockResolvedValue({ id: "photo-1" });

    await expect(deletePhotoAction("photo-1")).resolves.toEqual({ success: true });
    expect(destroyMock).toHaveBeenCalledWith("accesibilidad360/foto");
    expect(revalidateMock).toHaveBeenCalledWith("/establishments/est-1");
  });

  it("propaga el mensaje de permiso denegado", async () => {
    authMock.mockResolvedValue(session);
    findPhoto.mockResolvedValue({
      id: "photo-1",
      userId: "owner-1",
      publicId: "accesibilidad360/foto",
      establishmentId: "est-1",
    });

    await expect(deletePhotoAction("photo-1")).resolves.toEqual({
      success: false,
      message: "No tienes permiso para eliminar esta fotografía.",
    });
    expect(removePhoto).not.toHaveBeenCalled();
  });
});
