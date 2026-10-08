import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMediumDate } from "@/lib/utils";
import { scoreLabel } from "@/features/reviews/utils/score-labels";
import type { DashboardReview } from "../services/dashboard.service";

// Tarjeta de valoración reciente para el dashboard (SPEC-100).
// Presentación propia (no reutiliza ReviewCard para no multivariarla).
export function DashboardReviewCard({ review }: { review: DashboardReview }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/establishments/${review.establishmentId}`}>{review.establishmentName}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          Por {review.userName ?? "—"} · {formatMediumDate(review.createdAt)}
        </p>
        {review.comment && <p>{review.comment}</p>}
        <p>Media de la valoración: {review.averageScore} / 5</p>
        <ul className="space-y-1">
          {review.scores.map((score) => (
            <li key={`${review.id}-${score.criterionName}`}>
              {score.criterionName}: {score.score} — {scoreLabel(score.score)}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
