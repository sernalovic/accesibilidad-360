"use client";

import dynamic from "next/dynamic";

// Leaflet exige DOM: `ssr: false` solo está permitido en Client
// Components, por eso la carga dinámica vive aquí (SPEC-060).
const EstablishmentMap = dynamic(
  () => import("./EstablishmentMap").then((module) => module.EstablishmentMap),
  { ssr: false, loading: () => <p>Cargando mapa…</p> },
);

interface EstablishmentMapLoaderProps {
  latitude: number;
  longitude: number;
  name: string;
}

export function EstablishmentMapLoader(props: EstablishmentMapLoaderProps) {
  return <EstablishmentMap {...props} />;
}
