import { describe, expect, it } from "vitest";
import { registerSchema } from "@/features/auth/schemas/register.schema";

const validInput = {
  name: "María García",
  email: "maria@example.com",
  password: "Segura123456",
  confirmPassword: "Segura123456",
};

describe("registerSchema (SPEC-010 fase 010.3)", () => {
  it("acepta una entrada válida", () => {
    expect(registerSchema.safeParse(validInput).success).toBe(true);
  });

  it("rechaza el nombre vacío o demasiado corto", () => {
    expect(registerSchema.safeParse({ ...validInput, name: "" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...validInput, name: "A" }).success).toBe(false);
  });

  it("rechaza el nombre demasiado largo", () => {
    expect(registerSchema.safeParse({ ...validInput, name: "a".repeat(101) }).success).toBe(false);
  });

  it("rechaza el correo con formato inválido", () => {
    expect(registerSchema.safeParse({ ...validInput, email: "no-es-un-email" }).success).toBe(
      false,
    );
  });

  it("rechaza la contraseña demasiado corta", () => {
    const short = { ...validInput, password: "Corta123", confirmPassword: "Corta123" };
    expect(registerSchema.safeParse(short).success).toBe(false);
  });

  it("rechaza la contraseña sin mayúscula", () => {
    const weak = { ...validInput, password: "sinmayus1234", confirmPassword: "sinmayus1234" };
    expect(registerSchema.safeParse(weak).success).toBe(false);
  });

  it("rechaza la contraseña sin minúscula", () => {
    const weak = { ...validInput, password: "SINMINUS1234", confirmPassword: "SINMINUS1234" };
    expect(registerSchema.safeParse(weak).success).toBe(false);
  });

  it("rechaza la contraseña sin número", () => {
    const weak = { ...validInput, password: "SinNumerosAqui", confirmPassword: "SinNumerosAqui" };
    expect(registerSchema.safeParse(weak).success).toBe(false);
  });

  it("rechaza la confirmación que no coincide", () => {
    const mismatch = { ...validInput, confirmPassword: "Otra12345678" };
    const result = registerSchema.safeParse(mismatch);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword).toBeDefined();
    }
  });
});
