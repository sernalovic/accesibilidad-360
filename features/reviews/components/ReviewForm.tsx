"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { reviewSchema, type ReviewInput } from "../schemas/review.schema";
import { createReviewAction } from "../actions/create-review.action";
import type { CriterionOption } from "../services/criterion.service";
import { SCORE_VALUES, scoreLabel } from "../utils/score-labels";
import { CriterionRatingCard } from "./CriterionRatingCard";

interface ReviewFormProps {
  establishmentId: string;
  criteria: CriterionOption[];
}

// Formulario de valoración (Sprint UX-001).
// Misma lógica y accesibilidad; reorganizado en Cards con grid
// responsive. Ante un envío inválido desplaza y enfoca el primer
// criterio pendiente con DOM nativo (sin librerías).
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

  const onInvalid = (formErrors: FieldErrors<ReviewInput>) => {
    const scoresErrors = formErrors.scores;
    if (!Array.isArray(scoresErrors)) {
      return;
    }
    const pendingIndex = scoresErrors.findIndex((entry) => entry?.score);
    const pendingId = pendingIndex === -1 ? undefined : criteria[pendingIndex]?.id;
    if (!pendingId) {
      return;
    }
    const target = document.getElementById(`criterion-${pendingId}`);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    target?.querySelector<HTMLInputElement>('input[type="radio"]')?.focus({ preventScroll: true });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
      aria-label="Formulario de valoración"
      className="space-y-8"
    >
      {formError && (
        <p role="alert" className="rounded-md border px-3 py-2 text-sm">
          {formError}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tu comentario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="review-comment">Comentario (opcional)</Label>
            <Textarea
              id="review-comment"
              aria-invalid={errors.comment ? true : undefined}
              {...register("comment")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Escala de puntuación</CardTitle>
        </CardHeader>
        <CardContent>
          <dl aria-label="Significado de las puntuaciones" className="flex flex-wrap gap-2">
            {SCORE_VALUES.map((value) => (
              <div key={value} className="rounded-md bg-muted px-2 py-1 text-sm">
                <dt className="sr-only">{`Valor ${value}`}</dt>
                <dd>
                  {value} · {scoreLabel(value)}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {criteria.map((criterion, index) => (
        <CriterionRatingCard
          key={criterion.id}
          criterion={criterion}
          index={index}
          register={register}
          error={errors.scores?.[index]?.score?.message}
        />
      ))}
      {errors.scores && (
        <p
          role="alert"
          className="rounded-md border border-destructive/50 px-3 py-2 text-sm text-destructive"
        >
          Debes puntuar todos los criterios.
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Guardando…" : "Enviar valoración"}
      </Button>
    </form>
  );
}
