import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReviewWithScores } from "../services/review.service";
import { scoreLabel } from "../utils/score-labels";

const dateFormatter = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" });

// Tarjeta de valoración (rediseño de ficha, solo presentación).
// Autor y fecha destacados; comentario y puntuaciones con etiquetas.
export function ReviewCard({ review }: { review: ReviewWithScores }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {review.user.name ?? "—"} · {dateFormatter.format(review.createdAt)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {review.comment && <p>{review.comment}</p>}
        <ul className="space-y-1">
          {review.scores.map((score) => (
            <li key={`${review.id}-${score.criterion.name}`}>
              {score.criterion.name}: {score.score} — {scoreLabel(score.score)}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
