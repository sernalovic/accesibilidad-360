import { describe, expect, it } from "vitest";
import { authConfig } from "@/lib/auth/auth.config";

describe("authConfig (SPEC-010 fase 010.1)", () => {
  it("utiliza únicamente el provider Credentials", () => {
    const ids = authConfig.providers?.map((provider) => provider.id);
    expect(ids).toEqual(["credentials"]);
  });

  it("utiliza sesiones JWT hasta disponer del adaptador Prisma", () => {
    expect(authConfig.session?.strategy).toBe("jwt");
  });
});
