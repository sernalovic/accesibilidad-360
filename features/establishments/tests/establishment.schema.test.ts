import { describe, expect, it } from "vitest";
import { establishmentSchema } from "@/features/establishments/schemas/establishment.schema";

const validInput = {
  name: "Restaurante Ejemplo",
  categoryId: "cat-1",
  address: "Calle Mayor 1",
  municipality: "Madrid",
  province: "Madrid",
  description: "Un lugar accesible.",
};

describe("establishmentSchema (SPEC-030)", () => {
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

  it("rechaza la ficha sin categoría, dirección, municipio o provincia", () => {
    expect(establishmentSchema.safeParse({ ...validInput, categoryId: "" }).success).toBe(false);
    expect(establishmentSchema.safeParse({ ...validInput, address: "" }).success).toBe(false);
    expect(establishmentSchema.safeParse({ ...validInput, municipality: "" }).success).toBe(false);
    expect(establishmentSchema.safeParse({ ...validInput, province: "" }).success).toBe(false);
  });
});
