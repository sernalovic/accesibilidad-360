import { prisma } from "@/lib/db/prisma";
import { averageScoreOf } from "@/features/establishments/services/establishment.service";

export interface DashboardStats {
  establishments: number;
  users: number;
  reviews: number;
  photos: number;
}

export interface DashboardEstablishment {
  id: string;
  name: string;
  category: string;
  municipality: string;
  province: string;
  photoUrl: string | null;
  averageScore: number;
  reviewCount: number;
  hasReviews: boolean;
}

export interface DashboardReviewScore {
  score: number;
  criterionName: string;
}

export interface DashboardReview {
  id: string;
  comment: string | null;
  createdAt: Date;
  establishmentId: string;
  establishmentName: string;
  userName: string | null;
  averageScore: number;
  scores: DashboardReviewScore[];
}

export interface DashboardData {
  stats: DashboardStats;
  latest: DashboardEstablishment[];
  topRated: DashboardEstablishment[];
  latestReviews: DashboardReview[];
}

// Composición del dashboard (SPEC-100, 1.ª entrega).
// DTO completamente preparado para la vista: la página no calcula
// ni transforma nada. 6 consultas independientes en un único Promise.all
// (4 conteos + establecimientos + últimas valoraciones), sin N+1.
// Sin gráficos todavía.
export async function getDashboardData(): Promise<DashboardData> {
  const [establishmentCount, userCount, reviewCount, photoCount, establishmentRows, reviewRows] =
    await Promise.all([
      prisma.establishment.count(),
      prisma.user.count(),
      prisma.accessibilityReview.count(),
      prisma.photo.count(),
      prisma.establishment.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          createdAt: true,
          category: { select: { name: true } },
          municipality: { select: { name: true } },
          province: { select: { name: true } },
          photos: { select: { url: true }, orderBy: { createdAt: "asc" }, take: 1 },
          reviews: { select: { scores: { select: { score: true } } } },
        },
      }),
      prisma.accessibilityReview.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          comment: true,
          createdAt: true,
          user: { select: { name: true } },
          establishment: { select: { id: true, name: true } },
          scores: {
            select: { score: true, criterion: { select: { name: true } } },
            orderBy: { criterion: { order: "asc" } },
          },
        },
      }),
    ]);

  const establishments: EstablishmentWithDate[] = establishmentRows.map((row) => {
    const allScores = row.reviews.flatMap((review) => review.scores.map((entry) => entry.score));
    return {
      id: row.id,
      name: row.name,
      category: row.category.name,
      municipality: row.municipality.name,
      province: row.province.name,
      photoUrl: row.photos[0]?.url ?? null,
      averageScore: averageScoreOf(allScores),
      reviewCount: row.reviews.length,
      hasReviews: allScores.length > 0,
      createdAt: row.createdAt,
    };
  });

  // Mejor valorados: media desc, nº valoraciones desc, más reciente.
  // Limitación conocida del MVP (SPEC-070): la media vive en JS.
  const byRating = [...establishments].sort(
    (a, b) =>
      b.averageScore - a.averageScore ||
      b.reviewCount - a.reviewCount ||
      b.createdAt.getTime() - a.createdAt.getTime(),
  );

  return {
    stats: {
      establishments: establishmentCount,
      users: userCount,
      reviews: reviewCount,
      photos: photoCount,
    },
    latest: establishments.slice(0, 5).map(toCard),
    topRated: byRating.slice(0, 5).map(toCard),
    latestReviews: reviewRows.map((row) => ({
      id: row.id,
      comment: row.comment,
      createdAt: row.createdAt,
      establishmentId: row.establishment.id,
      establishmentName: row.establishment.name,
      userName: row.user.name,
      averageScore: averageScoreOf(row.scores.map((entry) => entry.score)),
      scores: row.scores.map((entry) => ({
        score: entry.score,
        criterionName: entry.criterion.name,
      })),
    })),
  };
}

interface EstablishmentWithDate extends DashboardEstablishment {
  createdAt: Date;
}

// La fecha solo se usa internamente para ordenar; no viaja en el DTO.
function toCard(item: EstablishmentWithDate): DashboardEstablishment {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    municipality: item.municipality,
    province: item.province,
    photoUrl: item.photoUrl,
    averageScore: item.averageScore,
    reviewCount: item.reviewCount,
    hasReviews: item.hasReviews,
  };
}
