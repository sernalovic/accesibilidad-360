import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  formatAddressQuery,
  geocodeAddress,
} from "@/features/establishments/services/geocoding.service";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", fetchMock);
});

const parts = { address: "Calle Mayor 1", municipality: "Madrid", province: "Madrid" };

describe("formatAddressQuery (SPEC-060)", () => {
  it("combina dirección, municipio y provincia en una única función", () => {
    expect(formatAddressQuery(parts)).toBe("Calle Mayor 1, Madrid, Madrid");
  });
});

describe("geocodeAddress (SPEC-060)", () => {
  it("devuelve las coordenadas de Nominatim", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [{ lat: "40.4168", lon: "-3.7038" }],
    });

    await expect(geocodeAddress(parts)).resolves.toEqual({
      latitude: 40.4168,
      longitude: -3.7038,
    });
    expect(fetchMock).toHaveBeenCalledOnce();
    const url = new URL(String(fetchMock.mock.calls[0]?.[0] ?? ""));
    expect(url.hostname).toBe("nominatim.openstreetmap.org");
    expect(url.searchParams.get("q")).toBe("Calle Mayor 1, Madrid, Madrid");
    expect(url.searchParams.get("format")).toBe("json");
    expect(url.searchParams.get("limit")).toBe("1");
  });

  it("retorna null sin resultados", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });

    await expect(geocodeAddress(parts)).resolves.toBeNull();
  });

  it("retorna null con respuesta no válida o números inválidos", async () => {
    fetchMock.mockResolvedValue({ ok: false, json: async () => [] });
    await expect(geocodeAddress(parts)).resolves.toBeNull();

    fetchMock.mockResolvedValue({ ok: true, json: async () => [{ lat: "no", lon: "x" }] });
    await expect(geocodeAddress(parts)).resolves.toBeNull();
  });

  it("retorna null ante fallos de red sin lanzar", async () => {
    fetchMock.mockRejectedValue(new Error("red caída"));

    await expect(geocodeAddress(parts)).resolves.toBeNull();
  });
});
