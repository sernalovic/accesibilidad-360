import type { ReviewWithScores } from "../services/review.service";
import { scoreLabel } from "../utils/score-labels";

const dateFormatter = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" });

// Lista de valoraciones con sus puntuaciones (SPEC-040).
// Presentacional: sin medias ni estadísticas.
export function ReviewList({ reviews }: { reviews: ReviewWithScores[] }) {
  return (
    <ul>
      {reviews.map((review) => (
        <li key={review.id}>
          <article>
            <p>
              Por {review.user.name ?? "—"} · {dateFormatter.format(review.createdAt)}
            </p>
            {review.comment && <p>{review.comment}</p>}
            <ul>
              {review.scores.map((score) => (
                <li key={`${review.id}-${score.criterion.name}`}>
                  {score.criterion.name}: {score.score} — {scoreLabel(score.score)}
                </li>
              ))}
            </ul>
          </article>
        </li>
      ))}
    </ul>
  );
}
