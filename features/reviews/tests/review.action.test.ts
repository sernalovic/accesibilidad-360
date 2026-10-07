import { beforeEach, describe, expect, it, vi } from "vitest";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { createReviewAction } from "@/features/reviews/actions/create-review.action";

const txCreate = vi.fn();
const txCreateMany = vi.fn();

vi.mock("@/lib/auth/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    establishment: { findUnique: vi.fn() },
    accessibilityReview: { findUnique: vi.fn() },
    criterion: { findMany: vi.fn() },
    $transaction: vi.fn((callback: unknown) =>
      (callback as (tx: unknown) => Promise<unknown>)({
        accessibilityReview: { create: txCreate },
        criterionScore: { createMany: txCreateMany },
      }),
    ),
  },
}));

const authMock = vi.mocked(auth);
const findEstablishment = vi.mocked(prisma.establishment.findUnique);
const findReview = vi.mocked(prisma.accessibilityReview.findUnique);
const findCriteria = vi.mocked(prisma.criterion.findMany);

const session = {
  user: { id: "user-1", name: "María", email: "maria@example.com", role: "USER" as const },
};

const validInput = {
  establishmentId: "est-1",
  comment: "Muy accesible.",
  scores: [
    { criterionId: "crit-1", score: 5 },
    { criterionId: "crit-2", score: 4 },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createReviewAction (SPEC-040)", () => {
  it("rechaza sin sesión sin tocar la base de datos", async () => {
    authMock.mockResolvedValue(null);

    const result = await createReviewAction(validInput);

    expect(result).toEqual({ success: false, message: "Debes iniciar sesión para valorar." });
    expect(findEstablishment).not.toHaveBeenCalled();
  });

  it("crea con sesión válida", async () => {
    authMock.mockResolvedValue({ ...session, expires: new Date().toISOString() });
    findEstablishment.mockResolvedValue({ id: "est-1" });
    findReview.mockResolvedValue(null);
    findCriteria.mockResolvedValue([{ id: "crit-1" }, { id: "crit-2" }]);
    txCreate.mockResolvedValue({ id: "rev-1" });
    txCreateMany.mockResolvedValue({ count: 2 });

    const result = await createReviewAction(validInput);

    expect(result).toEqual({ success: true, id: "rev-1" });
  });

  it("devuelve el mensaje de duplicado sin exponer detalles", async () => {
    authMock.mockResolvedValue({ ...session, expires: new Date().toISOString() });
    findEstablishment.mockResolvedValue({ id: "est-1" });
    findReview.mockResolvedValue({ id: "rev-previa" });

    const result = await createReviewAction(validInput);

    expect(result).toEqual({ success: false, message: "Ya has valorado este establecimiento." });
  });

  it("devuelve errores de campo con entrada inválida sin tocar la base de datos", async () => {
    authMock.mockResolvedValue({ ...session, expires: new Date().toISOString() });

    const result = await createReviewAction({ ...validInput, scores: [] });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.scores).toBeDefined();
    }
    expect(findEstablishment).not.toHaveBeenCalled();
  });
});
