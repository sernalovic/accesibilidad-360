import type { ReviewWithScores } from "../services/review.service";
import { ReviewCard } from "./ReviewCard";

// Lista de valoraciones con sus puntuaciones (SPEC-040).
// Cada valoración es una Card independiente. Sin medias ni estadísticas.
// `canDeleteIds` lo calcula la página en servidor (SPEC-110).
export function ReviewList({
  reviews,
  canDeleteIds = [],
}: {
  reviews: ReviewWithScores[];
  canDeleteIds?: string[];
}) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {reviews.map((review) => (
        <li key={review.id}>
          <ReviewCard review={review} canDelete={canDeleteIds.includes(review.id)} />
        </li>
      ))}
    </ul>
  );
}
