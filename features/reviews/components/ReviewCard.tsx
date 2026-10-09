import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMediumDate } from "@/lib/utils";
import type { ReviewWithScores } from "../services/review.service";
import { scoreLabel } from "../utils/score-labels";
import { DeleteReviewButton } from "./DeleteReviewButton";

// Tarjeta de valoración (rediseño de ficha, solo presentación).
// Autor y fecha destacados; comentario y puntuaciones con etiquetas.
// `canDelete` lo calcula la página en servidor (SPEC-110).
export function ReviewCard({
  review,
  canDelete = false,
}: {
  review: ReviewWithScores;
  canDelete?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {review.user.name ?? "—"} · {formatMediumDate(review.createdAt)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {review.comment && <p>{review.comment}</p>}
        <ul className="space-y-1">
          {review.scores.map((score) => (
            <li key={`${review.id}-${score.criterion.name}`}>
              {score.criterion.name}:{" "}
              {score.score === null ? (
                <Badge variant="secondary">No aplicable</Badge>
              ) : (
                `${score.score} — ${scoreLabel(score.score)}`
              )}
            </li>
          ))}
        </ul>
        {canDelete && <DeleteReviewButton id={review.id} />}
      </CardContent>
    </Card>
  );
}
