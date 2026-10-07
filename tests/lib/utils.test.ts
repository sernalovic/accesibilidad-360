import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("combina clases de Tailwind", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("resuelve conflictos a favor de la última clase", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("ignora valores falsos", () => {
    expect(cn("px-2", false, undefined, "py-1")).toBe("px-2 py-1");
  });
});
