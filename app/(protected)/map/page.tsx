import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { EstablishmentsMapLoader } from "@/features/establishments/components/EstablishmentsMapLoader";
import { listMappedEstablishments } from "@/features/establishments/services/establishment.service";

export const metadata: Metadata = {
  title: "Mapa | Accesibilidad 360",
  description: "Establecimientos geolocalizados de Accesibilidad 360.",
};

// Mapa global (SPEC-090). Una sola lectura; resumen textual encima
// para no depender únicamente del mapa. Sin mapa si no hay puntos.
export default async function MapPage() {
  const establishments = await listMappedEstablishments();

  return (
    <main id="contenido">
      <Container>
        <h1 className="text-3xl font-bold">Mapa de establecimientos</h1>
        {establishments.length === 0 ? (
          <p>Todavía no hay establecimientos con ubicación en el mapa.</p>
        ) : (
          <>
            <p>
              {establishments.length === 1
                ? "1 establecimiento en el mapa."
                : `${establishments.length} establecimientos en el mapa.`}
            </p>
            <EstablishmentsMapLoader establishments={establishments} />
          </>
        )}
      </Container>
    </main>
  );
}
