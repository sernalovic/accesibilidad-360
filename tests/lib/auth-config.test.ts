import { describe, expect, it } from "vitest";
import { authConfig } from "@/lib/auth/auth.config";

describe("authConfig (SPEC-010 fase 010.4)", () => {
  it("utiliza sesiones JWT hasta disponer del adaptador Prisma", () => {
    expect(authConfig.session?.strategy).toBe("jwt");
  });

  it("redirige el inicio de sesión a la página /login", () => {
    expect(authConfig.pages?.signIn).toBe("/login");
  });

  it("no protege rutas todavía (autorización en fase posterior)", () => {
    const authorized = authConfig.callbacks?.authorized;
    expect(authorized).toBeDefined();
    // @ts-expect-error - invocación mínima sin request real.
    expect(authorized?.({})).toBe(true);
  });
});
