import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db/prisma";
import {
  DuplicateReviewError,
  EstablishmentNotFoundError,
  IncompleteScoresError,
  createReview,
} from "@/features/reviews/services/review.service";

const txCreate = vi.fn();
const txCreateMany = vi.fn();

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

const findEstablishment = vi.mocked(prisma.establishment.findUnique);
const findReview = vi.mocked(prisma.accessibilityReview.findUnique);
const findCriteria = vi.mocked(prisma.criterion.findMany);
const transaction = vi.mocked(prisma.$transaction);

beforeEach(() => {
  vi.clearAllMocks();
});

const validData = {
  establishmentId: "est-1",
  comment: "Muy accesible.",
  scores: [
    { criterionId: "crit-1", score: 5 },
    { criterionId: "crit-2", score: 4 },
  ],
};

function mockReadyDatabase(): void {
  findEstablishment.mockResolvedValue({ id: "est-1" });
  findReview.mockResolvedValue(null);
  findCriteria.mockResolvedValue([{ id: "crit-1" }, { id: "crit-2" }]);
  txCreate.mockResolvedValue({ id: "rev-1" });
  txCreateMany.mockResolvedValue({ count: 2 });
}

describe("createReview (SPEC-040)", () => {
  it("crea la review y sus puntuaciones en una única transacción", async () => {
    mockReadyDatabase();

    const result = await createReview(validData, "user-1");

    expect(result).toEqual({ id: "rev-1" });
    expect(transaction).toHaveBeenCalledOnce();
    expect(txCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          establishmentId: "est-1",
          userId: "user-1",
          comment: "Muy accesible.",
        }),
      }),
    );
    expect(txCreateMany).toHaveBeenCalledWith({
      data: [
        { reviewId: "rev-1", criterionId: "crit-1", score: 5 },
        { reviewId: "rev-1", criterionId: "crit-2", score: 4 },
      ],
    });
  });

  it("rechaza el establecimiento inexistente", async () => {
    findEstablishment.mockResolvedValue(null);

    await expect(createReview(validData, "user-1")).rejects.toBeInstanceOf(
      EstablishmentNotFoundError,
    );
    expect(transaction).not.toHaveBeenCalled();
  });

  it("rechaza la segunda valoración del mismo usuario", async () => {
    mockReadyDatabase();
    findReview.mockResolvedValue({ id: "rev-previa" });

    await expect(createReview(validData, "user-1")).rejects.toBeInstanceOf(DuplicateReviewError);
    expect(transaction).not.toHaveBeenCalled();
  });

  it("rechaza la cobertura incompleta de criterios", async () => {
    mockReadyDatabase();
    const incomplete = { ...validData, scores: [{ criterionId: "crit-1", score: 5 }] };

    await expect(createReview(incomplete, "user-1")).rejects.toBeInstanceOf(IncompleteScoresError);
    expect(transaction).not.toHaveBeenCalled();
  });
});
