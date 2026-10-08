import { prisma } from "@/lib/db/prisma";
import { canManageOwnerOrAdmin, type Actor } from "@/lib/permissions";
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

export class NotApplicableNotAllowedError extends Error {
  readonly code = "NOT_APPLICABLE_NOT_ALLOWED" as const;

  constructor() {
    super("Este criterio no admite «No aplicable».");
    this.name = "NotApplicableNotAllowedError";
  }
}

export interface CreatedReview {
  id: string;
}

export interface ReviewWithScores {
  id: string;
  comment: string | null;
  createdAt: Date;
  userId: string;
  user: { name: string | null };
  scores: { score: number | null; criterion: { name: string } }[];
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

  const criteria = await prisma.criterion.findMany({
    select: { id: true, allowsNotApplicable: true },
  });
  const allowsNotApplicableById = new Map(
    criteria.map((criterion) => [criterion.id, criterion.allowsNotApplicable]),
  );
  const requiredIds = new Set(criteria.map((criterion) => criterion.id));
  const providedIds = new Set(data.scores.map((score) => score.criterionId));
  const complete =
    requiredIds.size > 0 &&
    requiredIds.size === providedIds.size &&
    [...requiredIds].every((id) => providedIds.has(id));
  if (!complete) {
    throw new IncompleteScoresError();
  }
  for (const score of data.scores) {
    if (score.score === null && !allowsNotApplicableById.get(score.criterionId)) {
      throw new NotApplicableNotAllowedError();
    }
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
      userId: true,
      user: { select: { name: true } },
      scores: {
        select: { score: true, criterion: { select: { name: true } } },
        orderBy: { criterion: { order: "asc" } },
      },
    },
  });
}

export class ReviewNotFoundError extends Error {
  readonly code = "REVIEW_NOT_FOUND" as const;

  constructor() {
    super("La valoración no existe.");
    this.name = "ReviewNotFoundError";
  }
}

export class ForbiddenReviewError extends Error {
  readonly code = "FORBIDDEN_REVIEW" as const;

  constructor() {
    super("No tienes permiso para eliminar esta valoración.");
    this.name = "ForbiddenReviewError";
  }
}

// Elimina una valoración (SPEC-110). Sin edición.
// Solo su autor o ADMIN. Las puntuaciones caen en cascada y la media,
// al ser dinámica, se actualiza sola.
export async function deleteReview(id: string, actor: Actor): Promise<{ establishmentId: string }> {
  const review = await prisma.accessibilityReview.findUnique({
    where: { id },
    select: { id: true, userId: true, establishmentId: true },
  });
  if (!review) {
    throw new ReviewNotFoundError();
  }
  if (!canManageOwnerOrAdmin(actor, review.userId)) {
    throw new ForbiddenReviewError();
  }

  await prisma.accessibilityReview.delete({ where: { id } });
  return { establishmentId: review.establishmentId };
}
