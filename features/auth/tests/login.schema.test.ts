import { describe, expect, it } from "vitest";
import { loginSchema } from "@/features/auth/schemas/login.schema";

describe("loginSchema (SPEC-010 fase 010.4)", () => {
  it("acepta credenciales con formato válido", () => {
    const result = loginSchema.safeParse({ email: "maria@example.com", password: "cualquiera" });
    expect(result.success).toBe(true);
  });

  it("rechaza el correo con formato inválido", () => {
    const result = loginSchema.safeParse({ email: "no-es-un-email", password: "cualquiera" });
    expect(result.success).toBe(false);
  });

  it("rechaza el correo ausente", () => {
    const result = loginSchema.safeParse({ password: "cualquiera" });
    expect(result.success).toBe(false);
  });

  it("rechaza la contraseña vacía o ausente", () => {
    expect(loginSchema.safeParse({ email: "maria@example.com", password: "" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "maria@example.com" }).success).toBe(false);
  });
});
