"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface EstablishmentMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

// Mapa del establecimiento (SPEC-060, 1.ª entrega).
// Client Component (Leaflet exige DOM): se carga con ssr:false.
// Marcador único centrado + popup con el nombre. Complementario:
// toda la información existe también en texto.
// scrollWheelZoom desactivado para no secuestrar el scroll de la página.
export function EstablishmentMap({ latitude, longitude, name }: EstablishmentMapProps) {
  return (
    <div>
      <MapContainer
        center={[latitude, longitude]}
        zoom={16}
        scrollWheelZoom={false}
        className="h-72 w-full rounded-xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker center={[latitude, longitude]} radius={10}>
          <Popup>{name}</Popup>
        </CircleMarker>
      </MapContainer>
      {process.env.NODE_ENV === "development" && (
        <p>
          Depuración: {latitude}, {longitude}
        </p>
      )}
    </div>
  );
}
