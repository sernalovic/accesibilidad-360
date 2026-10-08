import type { ReviewWithScores } from "../services/review.service";
import { ReviewCard } from "./ReviewCard";

// Lista de valoraciones con sus puntuaciones (SPEC-040).
// Cada valoración es una Card independiente. Sin medias ni estadísticas.
export function ReviewList({ reviews }: { reviews: ReviewWithScores[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {reviews.map((review) => (
        <li key={review.id}>
          <ReviewCard review={review} />
        </li>
      ))}
    </ul>
  );
}
