import { Badge } from "@/components/ui/badge";
import { EstablishmentPhoto } from "./EstablishmentPhoto";
import { DeletePhotoButton } from "./DeletePhotoButton";
import { SetPrimaryPhotoButton } from "./SetPrimaryPhotoButton";
import type { EstablishmentPhotoItem } from "../services/photo.service";

interface EstablishmentGalleryProps {
  photos: (EstablishmentPhotoItem & { isPrimary: boolean })[];
  establishmentName: string;
  canDeleteIds: string[];
}

// Galería de fotografías (SPEC-120). Pulsar una miniatura la fija como
// principal; cada foto autorizada se elimina con confirmación.
// Orden estable: principal primero, resto por antigüedad (servicio).
// Sin modal ni carruseles.
export function EstablishmentGallery({
  photos,
  establishmentName,
  canDeleteIds,
}: EstablishmentGalleryProps) {
  const [primary, ...rest] = photos;

  return (
    <div className="space-y-4">
      {primary && (
        <div className="space-y-2">
          <EstablishmentPhoto url={primary.url} establishmentName={establishmentName} />
          <p className="flex items-center gap-2">
            <Badge>Principal</Badge>
            {canDeleteIds.includes(primary.id) && <DeletePhotoButton id={primary.id} />}
          </p>
        </div>
      )}
      {rest.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {rest.map((photo) => {
            const canManage = canDeleteIds.includes(photo.id);
            return (
              <li key={photo.id} className="space-y-2">
                {canManage ? (
                  <SetPrimaryPhotoButton
                    id={photo.id}
                    ariaLabel={`Fijar como fotografía principal de ${establishmentName}`}
                  >
                    <EstablishmentPhoto url={photo.url} establishmentName={establishmentName} />
                  </SetPrimaryPhotoButton>
                ) : (
                  <EstablishmentPhoto url={photo.url} establishmentName={establishmentName} />
                )}
                {canManage && <DeletePhotoButton id={photo.id} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
