import type { UseFormRegister } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import type { CriterionOption } from "../services/criterion.service";
import type { ReviewInput } from "../schemas/review.schema";
import { SCORE_VALUES, scoreLabel } from "../utils/score-labels";

interface CriterionRatingCardProps {
  criterion: CriterionOption;
  index: number;
  register: UseFormRegister<ReviewInput>;
  error?: string;
}

// Tarjeta de puntuación por criterio (Sprint UX-001).
// Presentacional: fieldset con legend como primer hijo (asociación
// intacta), radios nativos en grid responsive y descripción solo
// cuando el modelo la expone (sin inventar contenido).
export function CriterionRatingCard({
  criterion,
  index,
  register,
  error,
}: CriterionRatingCardProps) {
  return (
    <Card id={`criterion-${criterion.id}`} className="scroll-mt-24">
      <CardContent>
        <fieldset>
          <legend>{criterion.name}</legend>
          {criterion.description && <p>{criterion.description}</p>}
          <div
            role="radiogroup"
            aria-label={`Puntuación para ${criterion.name}`}
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
          >
            {SCORE_VALUES.map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  value={value}
                  aria-label={`${value} — ${scoreLabel(value)}`}
                  {...register(`scores.${index}.score`)}
                />
                <span aria-hidden="true">{value}</span>
              </label>
            ))}
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </fieldset>
      </CardContent>
    </Card>
  );
}
