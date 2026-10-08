// Geocodificación con Nominatim (SPEC-060, 1.ª entrega).
// Solo se invoca durante la creación del establecimiento, nunca
// en lectura. Cualquier fallo devuelve null para no bloquear la
// creación (los campos quedan a null y la ficha lo indica).

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const REQUEST_TIMEOUT_MS = 5000;

export interface AddressParts {
  address: string;
  municipality: string;
  province: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Construye la dirección en una única función reutilizable
// para futuras fases (edición, re-geocodificación, etc.).
export function formatAddressQuery(parts: AddressParts): string {
  return `${parts.address}, ${parts.municipality}, ${parts.province}`;
}

export async function geocodeAddress(parts: AddressParts): Promise<Coordinates | null> {
  try {
    const params = new URLSearchParams({
      q: formatAddressQuery(parts),
      format: "json",
      limit: "1",
    });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
        headers: { "User-Agent": "Accesibilidad360/1.0 (TFM)" },
        signal: controller.signal,
      });
      if (!response.ok) {
        return null;
      }
      const results = (await response.json()) as { lat?: string; lon?: string }[];
      const [first] = results;
      if (!first) {
        return null;
      }
      const latitude = Number.parseFloat(first.lat ?? "");
      const longitude = Number.parseFloat(first.lon ?? "");
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return null;
      }
      return { latitude, longitude };
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return null;
  }
}
