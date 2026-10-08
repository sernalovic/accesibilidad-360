"use client";

import { CircleMarker, Popup } from "react-leaflet";
import { MapFrame } from "./MapFrame";

interface EstablishmentMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

// Mapa del establecimiento (SPEC-060, 1.ª entrega).
// Client Component (Leaflet exige DOM): se carga con ssr:false.
// Marcador único centrado + popup con el nombre. Complementario:
// toda la información existe también en texto.
export function EstablishmentMap({ latitude, longitude, name }: EstablishmentMapProps) {
  return (
    <div>
      <MapFrame center={[latitude, longitude]} zoom={16} className="h-72 w-full rounded-xl">
        <CircleMarker center={[latitude, longitude]} radius={10}>
          <Popup>{name}</Popup>
        </CircleMarker>
      </MapFrame>
      {process.env.NODE_ENV === "development" && (
        <p>
          Depuración: {latitude}, {longitude}
        </p>
      )}
    </div>
  );
}
