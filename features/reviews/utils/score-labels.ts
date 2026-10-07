// Etiquetas de la escala 0–5 (SPEC-040, de 001-domain-model.md).
// Ninguna puntuación debe mostrarse sin su significado.
export const SCORE_VALUES = [0, 1, 2, 3, 4, 5] as const;

const SCORE_LABELS: Record<number, string> = {
  0: "Muy deficiente",
  1: "Deficiente",
  2: "Aceptable",
  3: "Buena",
  4: "Muy buena",
  5: "Excelente",
};

export function scoreLabel(score: number): string {
  return SCORE_LABELS[score] ?? `${score}`;
}
