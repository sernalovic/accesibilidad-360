import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { EstablishmentCard } from "@/features/establishments/components/EstablishmentCard";
import { listEstablishments } from "@/features/establishments/services/establishment.service";

export const metadata: Metadata = {
  title: "Establecimientos | Accesibilidad 360",
  description: "Explora los establecimientos de Accesibilidad 360.",
};

// Listado de establecimientos (SPEC-030, 2.ª entrega).
// Orden createdAt DESC desde el servicio. Sin filtros ni paginación.
export default async function EstablishmentsPage() {
  const establishments = await listEstablishments();

  return (
    <main>
      <h1>Establecimientos</h1>
      <Link href="/establishments/new" className={buttonVariants()}>
        Nueva ficha
      </Link>
      {establishments.length === 0 ? (
        <div>
          <p>
            Aún no se ha añadido ningún establecimiento. ¡Crea la primera ficha y ayuda a la
            comunidad!
          </p>
          <Link href="/establishments/new" className={buttonVariants()}>
            Nueva ficha
          </Link>
        </div>
      ) : (
        <ul>
          {establishments.map((establishment) => (
            <li key={establishment.id}>
              <EstablishmentCard establishment={establishment} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
