import { describe, expect, it } from "vitest";
import { canManageOwnerOrAdmin, isAdmin } from "@/lib/permissions";

describe("isAdmin (SPEC-110)", () => {
  it("solo es true para ADMIN", () => {
    expect(isAdmin({ id: "a", role: "ADMIN" })).toBe(true);
    expect(isAdmin({ id: "u", role: "USER" })).toBe(false);
    expect(isAdmin({ id: "m", role: "MODERATOR" })).toBe(false);
  });
});

describe("canManageOwnerOrAdmin (SPEC-110)", () => {
  it("permite al propietario con cualquier rol", () => {
    for (const role of ["USER", "MODERATOR", "ADMIN"] as const) {
      expect(canManageOwnerOrAdmin({ id: "user-1", role }, "user-1")).toBe(true);
    }
  });

  it("permite al administrador sobre contenido ajeno", () => {
    expect(canManageOwnerOrAdmin({ id: "admin-1", role: "ADMIN" }, "user-1")).toBe(true);
  });

  it("deniega a no propietarios sin rol ADMIN", () => {
    expect(canManageOwnerOrAdmin({ id: "other", role: "USER" }, "user-1")).toBe(false);
    expect(canManageOwnerOrAdmin({ id: "other", role: "MODERATOR" }, "user-1")).toBe(false);
  });
});
