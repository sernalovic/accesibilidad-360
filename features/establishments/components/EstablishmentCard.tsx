import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDecimalScore, formatScoreSummary } from "../utils/score-format";
import type { EstablishmentListItem } from "../services/establishment.service";

// Tarjeta de establecimiento (SPEC-030 + microfase UX).
// Mismo lenguaje visual que DashboardEstablishmentCard, sin unificar
// componentes para evitar un multivariante (ver informe previo).
// Sin overlay: único enlace visible "Ver ficha", sin autor ni fecha.
export function EstablishmentCard({ establishment }: { establishment: EstablishmentListItem }) {
  const detailUrl = `/establishments/${establishment.id}`;
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
        <CardTitle className="line-clamp-1 text-base leading-snug">{establishment.name}</CardTitle>
        <div>
          <Badge variant="secondary">{establishment.category.name}</Badge>
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
      <CardFooter>
        <Link href={detailUrl} className={buttonVariants()}>
          Ver ficha
        </Link>
      </CardFooter>
    </Card>
  );
}
