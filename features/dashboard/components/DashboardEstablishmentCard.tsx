import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatDecimalScore,
  formatScoreSummary,
} from "@/features/establishments/utils/score-format";
import type { DashboardEstablishment } from "../services/dashboard.service";

// Tarjeta de establecimiento para el dashboard (SPEC-100 + microfase UX).
// Presentación propia del dashboard (no reutiliza EstablishmentCard
// para no convertirla en un componente multivariante).
// Compacta: foto panorámica contenida, igual altura (h-full), solo
// foto + nombre + categoría + municipio/provincia + estrellas + media + recuento.
export function DashboardEstablishmentCard({
  establishment,
}: {
  establishment: DashboardEstablishment;
}) {
  const summary = formatScoreSummary(establishment);
  const filledStars = Math.round(establishment.averageScore);

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      {establishment.photoUrl && (
        <div className="relative aspect-[21/9] w-full shrink-0 overflow-hidden">
          <Image
            src={establishment.photoUrl}
            alt={`Fotografía de ${establishment.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1 text-base leading-snug">
          <Link href={`/establishments/${establishment.id}`}>{establishment.name}</Link>
        </CardTitle>
        <div>
          <Badge>{establishment.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-1 text-sm">
        <p className="text-muted-foreground">
          {establishment.municipality}, {establishment.province}
        </p>
        <p className="flex items-center gap-1.5">
          <span role="img" aria-label={`${establishment.averageScore} de 5 estrellas`}>
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                aria-hidden="true"
                className={index < filledStars ? "size-4 fill-current" : "size-4"}
              />
            ))}
          </span>
          <span>
            {formatDecimalScore(establishment.averageScore)} / 5 · {summary.reviewsText}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
