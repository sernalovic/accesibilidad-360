import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatScoreSummary } from "../utils/score-format";
import type { EstablishmentListItem } from "../services/establishment.service";

const dateFormatter = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" });

// Tarjeta de establecimiento (SPEC-030, 2.ª entrega).
// Toda la tarjeta es clicable mediante un enlace expansible con un único
// punto de tabulación; el "Ver ficha" visible es decorativo para no
// anidar interactivos. Sin acciones de editar ni eliminar.
export function EstablishmentCard({ establishment }: { establishment: EstablishmentListItem }) {
  const detailUrl = `/establishments/${establishment.id}`;
  const summary = formatScoreSummary(establishment);

  return (
    <Card className="relative">
      <Link
        href={detailUrl}
        aria-label={`Ver ficha de ${establishment.name}`}
        className="absolute inset-0 rounded-xl"
      >
        <span className="sr-only">Ver ficha de {establishment.name}</span>
      </Link>
      <CardHeader>
        <CardTitle>{establishment.name}</CardTitle>
        <CardDescription>
          <Badge variant="secondary">{establishment.category.name}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          {summary.scoreText} · {summary.reviewsText}
        </p>
        <p>
          {establishment.municipality}, {establishment.province}
        </p>
        <p>
          Por {establishment.createdBy.name ?? "—"} ·{" "}
          {dateFormatter.format(establishment.createdAt)}
        </p>
      </CardContent>
      <CardFooter>
        <span className={buttonVariants()} aria-hidden="true">
          Ver ficha
        </span>
      </CardFooter>
    </Card>
  );
}
