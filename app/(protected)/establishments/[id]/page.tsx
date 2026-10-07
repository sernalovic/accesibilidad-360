import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEstablishmentById } from "@/features/establishments/services/establishment.service";
import { listCriteria } from "@/features/reviews/services/criterion.service";
import { listReviewsByEstablishment } from "@/features/reviews/services/review.service";
import { ReviewForm } from "@/features/reviews/components/ReviewForm";
import { ReviewList } from "@/features/reviews/components/ReviewList";

export const metadata: Metadata = {
  title: "Ficha de establecimiento | Accesibilidad 360",
  description: "Detalle del establecimiento en Accesibilidad 360.",
};

interface EstablishmentDetailPageProps {
  params: Promise<{ id: string }>;
}

// Ficha con valoraciones (SPEC-040, 1.ª entrega).
// Datos básicos + formulario + lista con puntuaciones.
// Sin medias, edición ni eliminación. Inexistente → notFound().
export default async function EstablishmentDetailPage({ params }: EstablishmentDetailPageProps) {
  const { id } = await params;
  const [establishment, criteria, reviews] = await Promise.all([
    getEstablishmentById(id),
    listCriteria(),
    listReviewsByEstablishment(id),
  ]);
  if (!establishment) {
    notFound();
  }

  return (
    <main>
      <h1>{establishment.name}</h1>
      <p>{establishment.category.name}</p>
      <dl>
        <div>
          <dt>Dirección</dt>
          <dd>{establishment.address}</dd>
        </div>
        <div>
          <dt>Municipio</dt>
          <dd>{establishment.municipality}</dd>
        </div>
        <div>
          <dt>Provincia</dt>
          <dd>{establishment.province}</dd>
        </div>
        <div>
          <dt>Descripción</dt>
          <dd>{establishment.description ?? "—"}</dd>
        </div>
        <div>
          <dt>Autor</dt>
          <dd>{establishment.createdBy.name ?? "—"}</dd>
        </div>
        <div>
          <dt>Fecha de creación</dt>
          <dd>
            {new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(
              establishment.createdAt,
            )}
          </dd>
        </div>
      </dl>

      <section aria-labelledby="reviews-heading">
        <h2 id="reviews-heading">Valoraciones de accesibilidad</h2>
        <ReviewForm establishmentId={establishment.id} criteria={criteria} />
        {reviews.length === 0 ? (
          <p>Aún no hay valoraciones. ¡Sé la primera persona en valorar este establecimiento!</p>
        ) : (
          <ReviewList reviews={reviews} />
        )}
      </section>
    </main>
  );
}
