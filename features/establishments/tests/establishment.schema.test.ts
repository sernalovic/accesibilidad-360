import { describe, expect, it } from "vitest";
import { establishmentSchema } from "@/features/establishments/schemas/establishment.schema";

const validInput = {
  name: "Restaurante Ejemplo",
  categoryId: "cat-1",
  address: "Calle Mayor 1",
  provinceId: "prov-28",
  municipalityId: "mun-1",
  description: "Un lugar accesible.",
};

describe("establishmentSchema (SPEC-030 + SPEC-035)", () => {
  it("acepta una ficha válida", () => {
    expect(establishmentSchema.safeParse(validInput).success).toBe(true);
  });

  it("acepta la ficha sin descripción", () => {
    expect(establishmentSchema.safeParse({ ...validInput, description: undefined }).success).toBe(
      true,
    );
  });

  it("rechaza el nombre demasiado corto o largo", () => {
    expect(establishmentSchema.safeParse({ ...validInput, name: "AB" }).success).toBe(false);
    expect(establishmentSchema.safeParse({ ...validInput, name: "a".repeat(121) }).success).toBe(
      false,
    );
  });

  it("rechaza la ficha sin categoría, dirección, provincia o municipio", () => {
    expect(establishmentSchema.safeParse({ ...validInput, categoryId: "" }).success).toBe(false);
    expect(establishmentSchema.safeParse({ ...validInput, address: "" }).success).toBe(false);
    expect(establishmentSchema.safeParse({ ...validInput, provinceId: "" }).success).toBe(false);
    expect(establishmentSchema.safeParse({ ...validInput, municipalityId: "" }).success).toBe(
      false,
    );
  });
});
