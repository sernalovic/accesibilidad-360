"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { reviewSchema, type ReviewInput } from "../schemas/review.schema";
import { createReviewAction } from "../actions/create-review.action";
import type { CriterionOption } from "../services/criterion.service";
import { SCORE_VALUES, scoreLabel } from "../utils/score-labels";

interface ReviewFormProps {
  establishmentId: string;
  criteria: CriterionOption[];
}

// Formulario de valoración (Sprint UI-001: shadcn/ui en comentario;
// los radios siguen siendo radios nativos, sin sliders).
// Misma lógica y accesibilidad; solo cambia la presentación.
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Formulario de valoración"
      className="space-y-4"
    >
      {formError && (
        <p role="alert" className="rounded-md border px-3 py-2 text-sm">
          {formError}
        </p>
      )}

      <fieldset>
        <legend>Tu valoración</legend>
        <div className="space-y-2">
          <Label htmlFor="review-comment">Comentario (opcional)</Label>
          <Textarea
            id="review-comment"
            aria-invalid={errors.comment ? true : undefined}
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
          <p role="alert" className="text-sm text-destructive">
            Debes puntuar todos los criterios.
          </p>
        )}
      </fieldset>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Guardando…" : "Enviar valoración"}
      </Button>
    </form>
  );
}
