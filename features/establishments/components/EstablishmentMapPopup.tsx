import Image from "next/image";
import Link from "next/link";
import { formatScoreSummary } from "../utils/score-format";
import type { MappedEstablishment } from "../services/establishment.service";

// Contenido del popup del mapa global (SPEC-090).
// Presentacional: sin formularios, con enlaces navegables por teclado.
export function EstablishmentMapPopup({ establishment }: { establishment: MappedEstablishment }) {
  const summary = formatScoreSummary(establishment);

  return (
    <div className="space-y-2">
      <Link href={`/establishments/${establishment.id}`}>{establishment.name}</Link>
      <p>
        {establishment.category} · {establishment.municipality}
      </p>
      <p>
        {summary.scoreText} · {summary.reviewsText}
      </p>
      {establishment.photoUrl && (
        <div className="relative aspect-video w-40">
          <Image
            src={establishment.photoUrl}
            alt={`Fotografía de ${establishment.name}`}
            fill
            sizes="160px"
            className="object-cover"
          />
        </div>
      )}
      <Link href={`/establishments/${establishment.id}`}>Ver ficha</Link>
    </div>
  );
}
