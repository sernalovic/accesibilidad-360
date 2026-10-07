import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthError, CredentialsSignin } from "next-auth";
import { signIn } from "@/lib/auth/auth";
import { loginUserAction } from "@/features/auth/actions/login.action";

vi.mock("@/lib/auth/auth", () => ({
  signIn: vi.fn(),
}));

// "next-auth" no puede cargarse en Vitest fuera del runtime de Next
// (importa next/server). Se sustituye por las clases de error mínimas
// que la action distingue mediante instanceof.
vi.mock("next-auth", () => {
  class AuthError extends Error {
    type: string;
    constructor(message?: string) {
      super(message);
      this.type = "AuthError";
    }
  }
  class CredentialsSignin extends AuthError {
    constructor() {
      super("CredentialsSignin");
      this.type = "CredentialsSignin";
    }
  }
  return { AuthError, CredentialsSignin };
});

const signInMock = vi.mocked(signIn);

beforeEach(() => {
  vi.clearAllMocks();
});

const validInput = { email: "maria@example.com", password: "Segura123456" };

describe("loginUserAction (SPEC-010 fase 010.4)", () => {
  it("no llama a signIn con entrada inválida", async () => {
    const result = await loginUserAction({ email: "no-es-un-email", password: "x" });

    expect(result).toEqual({ success: false, message: "Revisa los datos del formulario." });
    expect(signInMock).not.toHaveBeenCalled();
  });

  it("devuelve el mensaje genérico con credenciales incorrectas", async () => {
    signInMock.mockRejectedValue(new CredentialsSignin());

    const result = await loginUserAction(validInput);

    expect(result).toEqual({
      success: false,
      message: "Correo electrónico o contraseña incorrectos.",
    });
  });

  it("devuelve un mensaje genérico ante otros errores de Auth.js", async () => {
    signInMock.mockRejectedValue(new AuthError("Fallo del proveedor."));

    const result = await loginUserAction(validInput);

    expect(result).toEqual({
      success: false,
      message: "No se ha podido iniciar sesión. Inténtalo de nuevo.",
    });
  });

  it("relanza los errores que no son de Auth.js (incluido el redirect de éxito)", async () => {
    const redirectError = new Error("NEXT_REDIRECT");
    signInMock.mockRejectedValue(redirectError);

    await expect(loginUserAction(validInput)).rejects.toBe(redirectError);
  });
});
