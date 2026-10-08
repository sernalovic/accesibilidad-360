const decimalFormatter = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export interface ScoreSummaryInput {
  averageScore: number;
  reviewCount: number;
  hasReviews: boolean;
}

export interface ScoreSummary {
  scoreText: string;
  reviewsText: string;
}

// Devuelve conjuntamente ambos textos para reutilizarlos en
// cualquier vista (listado, ficha y futuras evoluciones).
export function formatScoreSummary(input: ScoreSummaryInput): ScoreSummary {
  if (!input.hasReviews) {
    return { scoreText: "—", reviewsText: "Sin valoraciones" };
  }
  return {
    scoreText: `${decimalFormatter.format(input.averageScore)} / 5`,
    reviewsText: input.reviewCount === 1 ? "1 valoración" : `${input.reviewCount} valoraciones`,
  };
}
