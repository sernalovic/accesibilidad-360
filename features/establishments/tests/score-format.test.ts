import { describe, expect, it } from "vitest";
import { formatScoreSummary } from "@/features/establishments/utils/score-format";

describe("formatScoreSummary", () => {
  it("devuelve ambos textos con valoraciones", () => {
    expect(formatScoreSummary({ averageScore: 4.3, reviewCount: 3, hasReviews: true })).toEqual({
      scoreText: "4,3 / 5",
      reviewsText: "3 valoraciones",
    });
  });

  it("usa el singular con una valoración", () => {
    expect(formatScoreSummary({ averageScore: 5, reviewCount: 1, hasReviews: true })).toEqual({
      scoreText: "5,0 / 5",
      reviewsText: "1 valoración",
    });
  });

  it("devuelve el estado vacío sin valoraciones", () => {
    expect(formatScoreSummary({ averageScore: 0, reviewCount: 0, hasReviews: false })).toEqual({
      scoreText: "—",
      reviewsText: "Sin valoraciones",
    });
  });
});
