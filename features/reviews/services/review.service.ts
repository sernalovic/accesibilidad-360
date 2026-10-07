import { prisma } from "@/lib/db/prisma";
import type { ReviewInput } from "../schemas/review.schema";

export class EstablishmentNotFoundError extends Error {
  readonly code = "ESTABLISHMENT_NOT_FOUND" as const;

  constructor() {
    super("El establecimiento no existe.");
    this.name = "EstablishmentNotFoundError";
  }
}

export class DuplicateReviewError extends Error {
  readonly code = "DUPLICATE_REVIEW" as const;

  constructor() {
    super("Ya has valorado este establecimiento.");
    this.name = "DuplicateReviewError";
  }
}

export class IncompleteScoresError extends Error {
  readonly code = "INCOMPLETE_SCORES" as const;

  constructor() {
    super("Debes puntuar todos los criterios.");
    this.name = "IncompleteScoresError";
  }
}

export interface CreatedReview {
  id: string;
}

export interface ReviewWithScores {
  id: string;
  comment: string | null;
  createdAt: Date;
  user: { name: string | null };
  scores: { score: number; criterion: { name: string } }[];
}

// Crea una valoración con todas sus puntuaciones en una única
// transacción (SPEC-040). `userId` procede siempre de la sesión.
export async function createReview(data: ReviewInput, userId: string): Promise<CreatedReview> {
  const establishment = await prisma.establishment.findUnique({
    where: { id: data.establishmentId },
    select: { id: true },
  });
  if (!establishment) {
    throw new EstablishmentNotFoundError();
  }

  const existing = await prisma.accessibilityReview.findUnique({
    where: { establishmentId_userId: { establishmentId: data.establishmentId, userId } },
    select: { id: true },
  });
  if (existing) {
    throw new DuplicateReviewError();
  }

  const criteria = await prisma.criterion.findMany({ select: { id: true } });
  const requiredIds = new Set(criteria.map((criterion) => criterion.id));
  const providedIds = new Set(data.scores.map((score) => score.criterionId));
  const complete =
    requiredIds.size > 0 &&
    requiredIds.size === providedIds.size &&
    [...requiredIds].every((id) => providedIds.has(id));
  if (!complete) {
    throw new IncompleteScoresError();
  }

  return prisma.$transaction(async (tx) => {
    const review = await tx.accessibilityReview.create({
      data: {
        establishmentId: data.establishmentId,
        userId,
        comment: data.comment || null,
      },
      select: { id: true },
    });
    await tx.criterionScore.createMany({
      data: data.scores.map((score) => ({
        reviewId: review.id,
        criterionId: score.criterionId,
        score: score.score,
      })),
    });
    return { id: review.id };
  });
}

// Lista las valoraciones de un establecimiento con sus puntuaciones
// (SPEC-040). Orden fijo por fecha descendente. `select` explícito.
export async function listReviewsByEstablishment(
  establishmentId: string,
): Promise<ReviewWithScores[]> {
  return prisma.accessibilityReview.findMany({
    where: { establishmentId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      comment: true,
      createdAt: true,
      user: { select: { name: true } },
      scores: {
        select: { score: true, criterion: { select: { name: true } } },
        orderBy: { criterion: { order: "asc" } },
      },
    },
  });
}
