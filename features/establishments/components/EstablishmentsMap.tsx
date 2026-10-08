"use client";

import { useEffect } from "react";
import L from "leaflet";
import { CircleMarker, Popup, useMap } from "react-leaflet";
import { MapFrame } from "./MapFrame";
import { EstablishmentMapPopup } from "./EstablishmentMapPopup";
import type { MappedEstablishment } from "../services/establishment.service";

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(
      L.latLngBounds(points.map(([latitude, longitude]) => L.latLng(latitude, longitude))),
      {
        padding: [20, 20],
      },
    );
  }, [map, points]);

  return null;
}

// Mapa global (SPEC-090). Puramente presentacional: recibe la colección
// por props para reutilizarse con filtros, dashboard u otras vistas.
// Un CircleMarker por establecimiento (coherente con la ficha, sin
// assets) con popup enriquecido. Complementario al resumen textual.
export function EstablishmentsMap({ establishments }: { establishments: MappedEstablishment[] }) {
  const points = establishments.map(
    (establishment) => [establishment.latitude, establishment.longitude] as [number, number],
  );

  return (
    <MapFrame center={[40.3, -3.74]} zoom={6}>
      <FitBounds points={points} />
      {establishments.map((establishment) => (
        <CircleMarker
          key={establishment.id}
          center={[establishment.latitude, establishment.longitude]}
          radius={8}
        >
          <Popup>
            <EstablishmentMapPopup establishment={establishment} />
          </Popup>
        </CircleMarker>
      ))}
    </MapFrame>
  );
}
