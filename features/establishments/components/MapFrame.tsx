"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapFrameProps {
  center: [number, number];
  zoom: number;
  className?: string;
  children: React.ReactNode;
}

// Marco común de todos los mapas (SPEC-090).
// OpenStreetMap con atribución obligatoria, scrollWheelZoom desactivado
// para no secuestrar el scroll y esquinas redondeadas.
export function MapFrame({
  center,
  zoom,
  className = "h-[70vh] w-full rounded-xl",
  children,
}: MapFrameProps) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className={className}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
}
