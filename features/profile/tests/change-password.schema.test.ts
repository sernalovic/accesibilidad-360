import { describe, expect, it } from "vitest";
import { changePasswordSchema } from "@/features/profile/schemas/change-password.schema";

const validInput = {
  currentPassword: "Actual123456",
  newPassword: "Nueva1234567",
  confirmPassword: "Nueva1234567",
};

describe("changePasswordSchema (SPEC-125)", () => {
  it("acepta contraseñas válidas y coincidentes", () => {
    expect(changePasswordSchema.safeParse(validInput).success).toBe(true);
  });

  it("rechaza la confirmación distinta", () => {
    const result = changePasswordSchema.safeParse({
      ...validInput,
      confirmPassword: "Otra12345678",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword).toBeDefined();
    }
  });

  it("rechaza la nueva contraseña débil con las reglas del registro", () => {
    expect(
      changePasswordSchema.safeParse({
        ...validInput,
        newPassword: "corta1A",
        confirmPassword: "corta1A",
      }).success,
    ).toBe(false);
    expect(
      changePasswordSchema.safeParse({
        ...validInput,
        newPassword: "sinmayusculas12",
        confirmPassword: "sinmayusculas12",
      }).success,
    ).toBe(false);
  });

  it("rechaza la contraseña actual ausente", () => {
    expect(changePasswordSchema.safeParse({ ...validInput, currentPassword: "" }).success).toBe(
      false,
    );
  });
});
