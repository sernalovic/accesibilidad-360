import { describe, expect, it } from "vitest";
import { reviewSchema } from "@/features/reviews/schemas/review.schema";

const validInput = {
  establishmentId: "est-1",
  comment: "Muy accesible.",
  scores: [
    { criterionId: "crit-1", score: 5 },
    { criterionId: "crit-2", score: 4 },
  ],
};

describe("reviewSchema (SPEC-040)", () => {
  it("acepta una valoración válida", () => {
    expect(reviewSchema.safeParse(validInput).success).toBe(true);
  });

  it("acepta la valoración sin comentario", () => {
    expect(reviewSchema.safeParse({ ...validInput, comment: undefined }).success).toBe(true);
  });

  it("rechaza puntuaciones fuera de rango o no enteras", () => {
    const over = { ...validInput, scores: [{ criterionId: "crit-1", score: 6 }] };
    expect(reviewSchema.safeParse(over).success).toBe(false);
    const under = { ...validInput, scores: [{ criterionId: "crit-1", score: -1 }] };
    expect(reviewSchema.safeParse(under).success).toBe(false);
    const decimal = { ...validInput, scores: [{ criterionId: "crit-1", score: 2.5 }] };
    expect(reviewSchema.safeParse(decimal).success).toBe(false);
  });

  it("rechaza la lista de puntuaciones vacía", () => {
    expect(reviewSchema.safeParse({ ...validInput, scores: [] }).success).toBe(false);
  });

  it("convierte las puntuaciones en string del DOM a número", () => {
    const fromBrowser = {
      ...validInput,
      scores: [
        { criterionId: "crit-1", score: "5" },
        { criterionId: "crit-2", score: "4" },
      ],
    };
    const result = reviewSchema.safeParse(fromBrowser);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.scores).toEqual([
        { criterionId: "crit-1", score: 5 },
        { criterionId: "crit-2", score: 4 },
      ]);
    }
  });

  it("convierte «na» en null estructural (la regla vive en el servicio)", () => {
    const result = reviewSchema.safeParse({
      ...validInput,
      scores: [
        { criterionId: "crit-1", score: 5 },
        { criterionId: "crit-2", score: "na" },
      ],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.scores).toEqual([
        { criterionId: "crit-1", score: 5 },
        { criterionId: "crit-2", score: null },
      ]);
    }
  });
});
