import { beforeEach, describe, expect, it, vi } from "vitest";
import { signOut } from "@/lib/auth/auth";
import { logoutAction } from "@/features/auth/actions/logout.action";

vi.mock("@/lib/auth/auth", () => ({
  signOut: vi.fn(),
}));

const signOutMock = vi.mocked(signOut);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("logoutAction (SPEC-010)", () => {
  it("destruye la sesión y redirige a /login", async () => {
    await logoutAction();

    expect(signOutMock).toHaveBeenCalledOnce();
    expect(signOutMock).toHaveBeenCalledWith({ redirectTo: "/login" });
  });
});
