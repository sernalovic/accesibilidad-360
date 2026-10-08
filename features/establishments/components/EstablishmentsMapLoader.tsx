"use client";

import dynamic from "next/dynamic";
import type { MappedEstablishment } from "../services/establishment.service";

// Carga diferida del mapa global (SPEC-090): Leaflet exige DOM,
// mismo patrón `ssr:false` ya probado en la ficha.
const EstablishmentsMap = dynamic(
  () => import("./EstablishmentsMap").then((module) => module.EstablishmentsMap),
  { ssr: false, loading: () => <p>Cargando mapa…</p> },
);

export function EstablishmentsMapLoader({
  establishments,
}: {
  establishments: MappedEstablishment[];
}) {
  return <EstablishmentsMap establishments={establishments} />;
}
