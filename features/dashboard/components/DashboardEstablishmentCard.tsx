import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatScoreSummary } from "@/features/establishments/utils/score-format";
import type { DashboardEstablishment } from "../services/dashboard.service";

// Tarjeta de establecimiento para el dashboard (SPEC-100).
// Presentación propia del dashboard (no reutiliza EstablishmentCard
// para no convertirla en un componente multivariante).
export function DashboardEstablishmentCard({
  establishment,
}: {
  establishment: DashboardEstablishment;
}) {
  const summary = formatScoreSummary(establishment);

  return (
    <Card>
      {establishment.photoUrl && (
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-xl">
          <Image
            src={establishment.photoUrl}
            alt={`Fotografía de ${establishment.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>
          <Link href={`/establishments/${establishment.id}`}>{establishment.name}</Link>
        </CardTitle>
        <Badge>{establishment.category}</Badge>
      </CardHeader>
      <CardContent>
        <p>
          {establishment.municipality}, {establishment.province}
        </p>
        <p>
          {summary.scoreText} · {summary.reviewsText}
        </p>
      </CardContent>
    </Card>
  );
}
