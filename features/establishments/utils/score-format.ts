const decimalFormatter = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

// Decimal aislado para contextos que ya muestran su propio recuento
// (p. ej. tarjetas compactas del dashboard).
export function formatDecimalScore(value: number): string {
  return decimalFormatter.format(value);
}

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
