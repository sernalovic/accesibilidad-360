"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, type ReviewInput } from "../schemas/review.schema";
import { createReviewAction } from "../actions/create-review.action";
import type { CriterionOption } from "../services/criterion.service";
import { SCORE_VALUES, scoreLabel } from "../utils/score-labels";

const inputClassName = "w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900";

interface ReviewFormProps {
  establishmentId: string;
  criteria: CriterionOption[];
}

// Formulario de valoración (SPEC-040).
// Radios accesibles por criterio (fieldset + legend) con el significado
// de cada valor en etiqueta visible de escala y aria-label por opción.
// Sin sliders. El comentario es opcional.
export function ReviewForm({ establishmentId, criteria }: ReviewFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      establishmentId,
      comment: "",
      scores: criteria.map((criterion) => ({
        criterionId: criterion.id,
        score: undefined as unknown as number,
      })),
    },
  });

  const onSubmit = (values: ReviewInput) => {
    setFormError(null);
    startTransition(async () => {
      const result = await createReviewAction(values);
      if (result.success) {
        reset();
        router.refresh();
        return;
      }
      setFormError(result.message);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Formulario de valoración">
      {formError && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-red-800">
          {formError}
        </p>
      )}

      <fieldset>
        <legend>Tu valoración</legend>
        <div>
          <label htmlFor="review-comment">Comentario (opcional)</label>
          <textarea
            id="review-comment"
            aria-invalid={errors.comment ? true : undefined}
            className={inputClassName}
            {...register("comment")}
          />
        </div>

        <dl aria-label="Significado de las puntuaciones">
          {SCORE_VALUES.map((value) => (
            <div key={value}>
              <dt>{value}</dt>
              <dd>{scoreLabel(value)}</dd>
            </div>
          ))}
        </dl>

        {criteria.map((criterion, index) => (
          <fieldset key={criterion.id}>
            <legend>{criterion.name}</legend>
            {criterion.description && <p>{criterion.description}</p>}
            <div role="radiogroup" aria-label={`Puntuación para ${criterion.name}`}>
              {SCORE_VALUES.map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    value={value}
                    aria-label={`${value} — ${scoreLabel(value)}`}
                    {...register(`scores.${index}.score`, { valueAsNumber: true })}
                  />
                  <span aria-hidden="true">{value}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        {errors.scores && (
          <p role="alert" className="text-red-800">
            Debes puntuar todos los criterios.
          </p>
        )}
      </fieldset>

      <button type="submit" disabled={isPending}>
        {isPending ? "Guardando…" : "Enviar valoración"}
      </button>
    </form>
  );
}
