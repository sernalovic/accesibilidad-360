import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatMediumDate } from "@/lib/utils";
import { formatDecimalScore } from "@/features/establishments/utils/score-format";
import type { DashboardReview } from "../services/dashboard.service";

const MAX_COMMENT_LENGTH = 140;

// Tarjeta compacta de valoración para el dashboard (microfase UX).
// Establecimiento, autor, fecha, estrellas decorativas + media exacta,
// comentario truncado y enlace. Sin el detalle de criterios.
export function DashboardReviewCompactCard({ review }: { review: DashboardReview }) {
  const filledStars = Math.round(review.averageScore);
  const comment =
    review.comment && review.comment.length > MAX_COMMENT_LENGTH
      ? `${review.comment.slice(0, MAX_COMMENT_LENGTH)}…`
      : review.comment;

  return (
    <Card>
      <CardContent className="space-y-2">
        <p>
          <Link href={`/establishments/${review.establishmentId}`}>{review.establishmentName}</Link>
        </p>
        <p>
          Por {review.userName ?? "—"} · {formatMediumDate(review.createdAt)}
        </p>
        <p>
          <span role="img" aria-label={`${review.averageScore} de 5 estrellas`}>
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                aria-hidden="true"
                className={index < filledStars ? "fill-current" : ""}
              />
            ))}
          </span>{" "}
          {formatDecimalScore(review.averageScore)} / 5
        </p>
        {comment && <p>{comment}</p>}
        <Link href={`/establishments/${review.establishmentId}`}>Ver ficha</Link>
      </CardContent>
    </Card>
  );
}
