import Image from "next/image";

interface EstablishmentPhotoProps {
  url: string;
  establishmentName: string;
}

// Fotografía de la ficha (SPEC-050). Presentacional.
// `next/image` exige el dominio en `images.remotePatterns`.
export function EstablishmentPhoto({ url, establishmentName }: EstablishmentPhotoProps) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl">
      <Image
        src={url}
        alt={`Fotografía de ${establishmentName}`}
        fill
        sizes="(max-width: 768px) 100vw, 800px"
        className="object-cover"
      />
    </div>
  );
}
