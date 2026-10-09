import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { auth, unstable_update } from "@/lib/auth/auth";
import { updateNameAction } from "@/features/profile/actions/update-name.action";

vi.mock("@/lib/db/prisma", () => ({
  prisma: { user: { update: vi.fn() } },
}));

vi.mock("@/lib/auth/auth", () => ({
  auth: vi.fn(),
  unstable_update: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const mockedAuth = vi.mocked(auth);
const mockedUpdate = vi.mocked(unstable_update);
const update = vi.mocked(prisma.user.update);

beforeEach(() => {
  vi.clearAllMocks();
  mockedAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
});

describe("updateNameAction (SPEC-125)", () => {
  it("actualiza el nombre y sincroniza la sesión", async () => {
    update.mockResolvedValue({ name: "María López" });

    await expect(updateNameAction({ name: "María López" })).resolves.toEqual({
      success: true,
      name: "María López",
    });
    expect(mockedUpdate).toHaveBeenCalledWith({ user: { name: "María López" } });
  });

  it("devuelve errores de campo sin tocar la base de datos", async () => {
    const result = await updateNameAction({ name: "A" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.name).toBeDefined();
    }
    expect(update).not.toHaveBeenCalled();
    expect(mockedUpdate).not.toHaveBeenCalled();
  });

  it("exige sesión", async () => {
    mockedAuth.mockResolvedValue(null);

    const result = await updateNameAction({ name: "María López" });

    expect(result).toEqual({ success: false, message: "Debes iniciar sesión." });
    expect(update).not.toHaveBeenCalled();
  });
});
