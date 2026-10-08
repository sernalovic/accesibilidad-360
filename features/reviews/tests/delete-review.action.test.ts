import { beforeEach, describe, expect, it, vi } from "vitest";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { deleteReviewAction } from "@/features/reviews/actions/delete-review.action";

vi.mock("@/lib/auth/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    accessibilityReview: { findUnique: vi.fn(), delete: vi.fn() },
  },
}));

const authMock = vi.mocked(auth);
const revalidateMock = vi.mocked(revalidatePath);
const findReview = vi.mocked(prisma.accessibilityReview.findUnique);
const removeReview = vi.mocked(prisma.accessibilityReview.delete);

const session = {
  user: { id: "user-1", name: "María", email: "maria@example.com", role: "USER" as const },
  expires: new Date().toISOString(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("deleteReviewAction (SPEC-110)", () => {
  it("rechaza sin sesión", async () => {
    authMock.mockResolvedValue(null);

    await expect(deleteReviewAction("rev-1")).resolves.toEqual({
      success: false,
      message: "Debes iniciar sesión para eliminar una valoración.",
    });
    expect(removeReview).not.toHaveBeenCalled();
  });

  it("elimina y revalida la ficha", async () => {
    authMock.mockResolvedValue(session);
    findReview.mockResolvedValue({ id: "rev-1", userId: "user-1", establishmentId: "est-1" });
    removeReview.mockResolvedValue({ id: "rev-1" });

    await expect(deleteReviewAction("rev-1")).resolves.toEqual({ success: true });
    expect(revalidateMock).toHaveBeenCalledWith("/establishments/est-1");
  });

  it("propaga el mensaje de permiso denegado", async () => {
    authMock.mockResolvedValue(session);
    findReview.mockResolvedValue({ id: "rev-1", userId: "owner-1", establishmentId: "est-1" });

    await expect(deleteReviewAction("rev-1")).resolves.toEqual({
      success: false,
      message: "No tienes permiso para eliminar esta valoración.",
    });
    expect(removeReview).not.toHaveBeenCalled();
  });
});
