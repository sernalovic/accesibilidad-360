import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db/prisma";
import {
  DuplicateReviewError,
  EstablishmentNotFoundError,
  ForbiddenReviewError,
  IncompleteScoresError,
  NotApplicableNotAllowedError,
  ReviewNotFoundError,
  createReview,
  deleteReview,
} from "@/features/reviews/services/review.service";

const txCreate = vi.fn();
const txCreateMany = vi.fn();

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    establishment: { findUnique: vi.fn() },
    accessibilityReview: { findUnique: vi.fn(), delete: vi.fn() },
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
  findCriteria.mockResolvedValue([
    { id: "crit-1", allowsNotApplicable: false },
    { id: "crit-2", allowsNotApplicable: true },
  ]);
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

  it("persiste null en criterios que admiten «No aplicable»", async () => {
    mockReadyDatabase();
    const withNotApplicable = {
      ...validData,
      scores: [
        { criterionId: "crit-1", score: 5 },
        { criterionId: "crit-2", score: null },
      ],
    };

    const result = await createReview(withNotApplicable, "user-1");

    expect(result).toEqual({ id: "rev-1" });
    expect(txCreateMany).toHaveBeenCalledWith({
      data: [
        { reviewId: "rev-1", criterionId: "crit-1", score: 5 },
        { reviewId: "rev-1", criterionId: "crit-2", score: null },
      ],
    });
  });

  it("rechaza null en criterios que no lo admiten", async () => {
    mockReadyDatabase();
    const invalid = {
      ...validData,
      scores: [
        { criterionId: "crit-1", score: null },
        { criterionId: "crit-2", score: 4 },
      ],
    };

    await expect(createReview(invalid, "user-1")).rejects.toBeInstanceOf(
      NotApplicableNotAllowedError,
    );
    expect(transaction).not.toHaveBeenCalled();
  });
});

describe("deleteReview (SPEC-110)", () => {
  it("elimina como autor y como administrador", async () => {
    const remove = vi.mocked(prisma.accessibilityReview.delete);
    findReview.mockResolvedValue({ id: "rev-1", userId: "user-1", establishmentId: "est-1" });
    remove.mockResolvedValue({ id: "rev-1" });

    await expect(deleteReview("rev-1", { id: "user-1", role: "USER" })).resolves.toEqual({
      establishmentId: "est-1",
    });
    expect(remove).toHaveBeenCalledWith({ where: { id: "rev-1" } });

    await expect(deleteReview("rev-1", { id: "admin-1", role: "ADMIN" })).resolves.toBeDefined();
  });

  it("rechaza inexistente y sin permiso", async () => {
    const remove = vi.mocked(prisma.accessibilityReview.delete);
    findReview.mockResolvedValue(null);
    await expect(deleteReview("x", { id: "user-1", role: "USER" })).rejects.toBeInstanceOf(
      ReviewNotFoundError,
    );

    findReview.mockResolvedValue({ id: "rev-1", userId: "owner-1", establishmentId: "est-1" });
    await expect(deleteReview("rev-1", { id: "other", role: "USER" })).rejects.toBeInstanceOf(
      ForbiddenReviewError,
    );
    expect(remove).not.toHaveBeenCalled();
  });
});
