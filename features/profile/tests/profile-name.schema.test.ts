import { describe, expect, it } from "vitest";
import { profileNameSchema } from "@/features/profile/schemas/profile-name.schema";

describe("profileNameSchema (SPEC-125)", () => {
  it("acepta un nombre válido", () => {
    expect(profileNameSchema.safeParse({ name: "María García" }).success).toBe(true);
  });

  it("rechaza nombres demasiado cortos o largos", () => {
    expect(profileNameSchema.safeParse({ name: "A" }).success).toBe(false);
    expect(profileNameSchema.safeParse({ name: "a".repeat(101) }).success).toBe(false);
  });

  it("rechaza el nombre ausente", () => {
    expect(profileNameSchema.safeParse({}).success).toBe(false);
  });
});
