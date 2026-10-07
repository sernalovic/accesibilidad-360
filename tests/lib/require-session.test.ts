import { beforeEach, describe, expect, it, vi } from "vitest";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { requireSession } from "@/lib/auth/require-session";

vi.mock("@/lib/auth/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

const authMock = vi.mocked(auth);
const redirectMock = vi.mocked(redirect);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("requireSession (SPEC-010)", () => {
  it("retorna la sesión cuando existe usuario", async () => {
    const session = { user: { id: "user-1", name: "María", email: "m@example.com", role: "USER" } };
    authMock.mockResolvedValue(session);

    await expect(requireSession()).resolves.toBe(session);
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("redirige a /login sin sesión", async () => {
    authMock.mockResolvedValue(null);

    await expect(requireSession()).rejects.toThrow("NEXT_REDIRECT:/login");
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  it("redirige a /login con sesión sin usuario", async () => {
    // @ts-expect-error - sesión incompleta para el caso límite.
    authMock.mockResolvedValue({});

    await expect(requireSession()).rejects.toThrow("NEXT_REDIRECT:/login");
  });
});
