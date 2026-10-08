import { describe, expect, it } from "vitest";
import { canManageEstablishment } from "@/features/establishments/services/establishment-permissions";

describe("canManageEstablishment (SPEC-080)", () => {
  it("permite al creador con cualquier rol", () => {
    for (const role of ["USER", "MODERATOR", "ADMIN"] as const) {
      expect(canManageEstablishment({ id: "user-1", role }, "user-1")).toBe(true);
    }
  });

  it("permite al administrador sobre contenido ajeno", () => {
    expect(canManageEstablishment({ id: "admin-1", role: "ADMIN" }, "user-1")).toBe(true);
  });

  it("deniega a usuarios y moderadores sobre contenido ajeno", () => {
    expect(canManageEstablishment({ id: "other", role: "USER" }, "user-1")).toBe(false);
    expect(canManageEstablishment({ id: "other", role: "MODERATOR" }, "user-1")).toBe(false);
  });
});
