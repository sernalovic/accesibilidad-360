import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, CalendarDays, ImageIcon, MapPin, Star, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth/auth";
import { Container } from "@/components/layout/Container";
import { formatScoreSummary } from "@/features/establishments/utils/score-format";
import { getEstablishmentById } from "@/features/establishments/services/establishment.service";
import { listCriteria } from "@/features/reviews/services/criterion.service";
import { listReviewsByEstablishment } from "@/features/reviews/services/review.service";
import { ReviewForm } from "@/features/reviews/components/ReviewForm";
import { ReviewList } from "@/features/reviews/components/ReviewList";
import { EstablishmentGallery } from "@/features/photos/components/EstablishmentGallery";
import { PhotoUploadForm } from "@/features/photos/components/PhotoUploadForm";
import { DeleteEstablishmentButton } from "@/features/establishments/components/DeleteEstablishmentButton";
import { EstablishmentMapLoader } from "@/features/establishments/components/EstablishmentMapLoader";
import { canManageEstablishment } from "@/features/establishments/services/establishment-permissions";
import { canManageOwnerOrAdmin } from "@/lib/permissions";
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
  const session = await auth();
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
  const user = session?.user;
  const canDeletePhotoIds = user
    ? photos
        .filter((photo) => canManageOwnerOrAdmin({ id: user.id, role: user.role }, photo.userId))
        .map((photo) => photo.id)
    : [];
  const canManage =
    !!user && canManageEstablishment({ id: user.id, role: user.role }, establishment.createdById);
  const canDeleteIds = user
    ? reviews
        .filter((review) => canManageOwnerOrAdmin({ id: user.id, role: user.role }, review.userId))
        .map((review) => review.id)
    : [];

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
          {canManage && (
            <div className="flex gap-2">
              <Link
                href={`/establishments/${establishment.id}/edit`}
                className={buttonVariants({ variant: "outline" })}
              >
                Editar
              </Link>
              <DeleteEstablishmentButton id={establishment.id} />
            </div>
          )}
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <section aria-labelledby="gallery-heading" className="space-y-4">
              <h2 id="gallery-heading">Fotografías</h2>
              {photos.length === 0 ? (
                <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl bg-muted text-muted-foreground">
                  <ImageIcon className="size-8" aria-hidden="true" />
                  <p>Sin fotografías todavía</p>
                </div>
              ) : (
                <EstablishmentGallery
                  photos={photos}
                  establishmentName={establishment.name}
                  canDeleteIds={canDeletePhotoIds}
                />
              )}
              <PhotoUploadForm establishmentId={establishment.id} />
            </section>
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

        <section aria-labelledby="location-heading" className="space-y-4">
          <h2 id="location-heading">Ubicación</h2>
          {establishment.latitude !== null && establishment.longitude !== null ? (
            <EstablishmentMapLoader
              latitude={establishment.latitude}
              longitude={establishment.longitude}
              name={establishment.name}
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
                <MapPin className="size-8 text-muted-foreground" aria-hidden="true" />
                <p className="font-medium">Ubicación no disponible</p>
                <p className="text-muted-foreground">
                  Todavía no se ha podido situar este establecimiento en el mapa.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        <Separator className="my-8" />

        <section aria-labelledby="reviews-heading" className="space-y-6">
          <h2 id="reviews-heading">Valoraciones de accesibilidad</h2>
          <ReviewForm establishmentId={establishment.id} criteria={criteria} />
          {reviews.length === 0 ? (
            <p>Aún no hay valoraciones. ¡Sé la primera persona en valorar este establecimiento!</p>
          ) : (
            <ReviewList reviews={reviews} canDeleteIds={canDeleteIds} />
          )}
        </section>
      </Container>
    </main>
  );
}
