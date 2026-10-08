import { z } from "zod";

// Validación de la valoración (SPEC-040).
// Comentario opcional; puntuaciones de todos los criterios obligatorias
// (la cobertura total la garantiza el servicio contra la base de datos).
// `userId` nunca forma parte del formulario: lo aporta la sesión.
// Valor enviado por el radio «No aplicable» (SPEC-045).
// Nunca viaja a la base de datos: se convierte en `null`.
export const NOT_APPLICABLE_VALUE = "na";

const criterionScoreSchema = z.object({
  criterionId: z.string().trim().min(1),
  // coerce: el DOM siempre entrega strings (los radios no aplican
  // valueAsNumber de RHF) y los clientes pueden enviar strings.
  // undefined → NaN → lo rechaza .int(). `null` (vía "na") significa
  // «No aplicable» y pasa; el servicio decide si está permitido.
  score: z.preprocess(
    (value) => (value === NOT_APPLICABLE_VALUE ? null : value),
    z.union([
      z.null(),
      z.coerce
        .number({ invalid_type_error: "Debes puntuar este criterio." })
        .int("La puntuación debe ser un número entero.")
        .min(0, "La puntuación mínima es 0.")
        .max(5, "La puntuación máxima es 5."),
    ]),
  ),
});

export const reviewSchema = z.object({
  establishmentId: z.string().trim().min(1),
  comment: z.string().trim().optional(),
  scores: z.array(criterionScoreSchema).min(1, "Debes puntuar al menos un criterio."),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

// Tipo de entrada del formulario, antes de preprocess/coerce
// (p. ej. score como string del DOM o "na"). Para el genérico
// useForm<Output, Context, Input> de React Hook Form.
export type ReviewFormInput = z.input<typeof reviewSchema>;
