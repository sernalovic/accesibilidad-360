import { beforeEach, describe, expect, it, vi } from "vitest";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { setPrimaryPhotoAction } from "@/features/photos/actions/set-primary-photo.action";

vi.mock("@/lib/auth/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    photo: { findUnique: vi.fn(), update: vi.fn(), updateMany: vi.fn() },
    $transaction: vi.fn(),
  },
}));

const authMock = vi.mocked(auth);
const revalidateMock = vi.mocked(revalidatePath);
const findPhoto = vi.mocked(prisma.photo.findUnique);
const transaction = vi.mocked(prisma.$transaction);

const session = {
  user: { id: "user-1", name: "María", email: "maria@example.com", role: "USER" as const },
  expires: new Date().toISOString(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("setPrimaryPhotoAction (SPEC-120)", () => {
  it("rechaza sin sesión", async () => {
    authMock.mockResolvedValue(null);

    await expect(setPrimaryPhotoAction("photo-2")).resolves.toEqual({
      success: false,
      message: "Debes iniciar sesión para gestionar fotografías.",
    });
  });

  it("fija la principal y revalida la ficha", async () => {
    authMock.mockResolvedValue(session);
    findPhoto.mockResolvedValue({ id: "photo-2", userId: "user-1", establishmentId: "est-1" });
    transaction.mockResolvedValue([]);

    await expect(setPrimaryPhotoAction("photo-2")).resolves.toEqual({ success: true });
    expect(revalidateMock).toHaveBeenCalledWith("/establishments/est-1");
  });

  it("propaga el mensaje de permiso denegado", async () => {
    authMock.mockResolvedValue(session);
    findPhoto.mockResolvedValue({ id: "photo-2", userId: "owner-1", establishmentId: "est-1" });

    await expect(setPrimaryPhotoAction("photo-2")).resolves.toEqual({
      success: false,
      message: "No tienes permiso para gestionar esta fotografía.",
    });
  });
});
