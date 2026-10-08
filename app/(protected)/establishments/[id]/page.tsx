import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Building2, CalendarDays, ImageIcon, MapPin, Star, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/layout/Container";
import { formatScoreSummary } from "@/features/establishments/utils/score-format";
import { getEstablishmentById } from "@/features/establishments/services/establishment.service";
import { listCriteria } from "@/features/reviews/services/criterion.service";
import { listReviewsByEstablishment } from "@/features/reviews/services/review.service";
import { ReviewForm } from "@/features/reviews/components/ReviewForm";
import { ReviewList } from "@/features/reviews/components/ReviewList";
import { EstablishmentPhoto } from "@/features/photos/components/EstablishmentPhoto";
import { PhotoUploadForm } from "@/features/photos/components/PhotoUploadForm";
import { listPhotosByEstablishment } from "@/features/photos/services/photo.service";

export const metadata: Metadata = {
  title: "Ficha de establecimiento | Accesibilidad 360",
  description: "Detalle del establecimiento en Accesibilidad 360.",
};

interface EstablishmentDetailPageProps {
  params: Promise<{ id: string }>;
}

// Ficha rediseñada (sprint UX): solo presentación y composición.
// Mismos datos, misma lógica, mismas rutas. Inexistente → notFound().
export default async function EstablishmentDetailPage({ params }: EstablishmentDetailPageProps) {
  const { id } = await params;
  const [establishment, criteria, reviews, photos] = await Promise.all([
    getEstablishmentById(id),
    listCriteria(),
    listReviewsByEstablishment(id),
    listPhotosByEstablishment(id),
  ]);
  if (!establishment) {
    notFound();
  }
  const summary = formatScoreSummary(establishment);
  const [primaryPhoto] = photos;

  return (
    <main>
      <Container>
        <header className="space-y-3">
          <Badge>{establishment.category.name}</Badge>
          <h1 className="text-3xl font-bold">{establishment.name}</h1>
          <p className="flex items-center gap-2">
            <Star className="size-8" aria-hidden="true" />
            <span className="text-4xl font-bold">{summary.scoreText}</span>
            <span className="text-muted-foreground">{summary.reviewsText}</span>
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4" aria-hidden="true" />
            {establishment.municipality}, {establishment.province}
          </p>
          {establishment.description && <p>{establishment.description}</p>}
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            {primaryPhoto ? (
              <EstablishmentPhoto url={primaryPhoto.url} establishmentName={establishment.name} />
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl bg-muted text-muted-foreground">
                <ImageIcon className="size-8" aria-hidden="true" />
                <p>Sin fotografía todavía</p>
              </div>
            )}
            <PhotoUploadForm establishmentId={establishment.id} disabled={photos.length > 0} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información del establecimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex items-start gap-3">
                  <Building2 className="size-4" aria-hidden="true" />
                  <div>
                    <dt className="font-medium">Dirección</dt>
                    <dd className="text-muted-foreground">{establishment.address}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="size-4" aria-hidden="true" />
                  <div>
                    <dt className="font-medium">Autor</dt>
                    <dd className="text-muted-foreground">{establishment.createdBy.name ?? "—"}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  <div>
                    <dt className="font-medium">Fecha de creación</dt>
                    <dd className="text-muted-foreground">
                      {new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(
                        establishment.createdAt,
                      )}
                    </dd>
                  </div>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <section aria-labelledby="reviews-heading" className="space-y-6">
          <h2 id="reviews-heading">Valoraciones de accesibilidad</h2>
          <ReviewForm establishmentId={establishment.id} criteria={criteria} />
          {reviews.length === 0 ? (
            <p>Aún no hay valoraciones. ¡Sé la primera persona en valorar este establecimiento!</p>
          ) : (
            <ReviewList reviews={reviews} />
          )}
        </section>
      </Container>
    </main>
  );
}
