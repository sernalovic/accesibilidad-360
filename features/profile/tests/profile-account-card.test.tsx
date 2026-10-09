import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfileAccountCard } from "@/features/profile/components/ProfileAccountCard";

const profile = {
  name: "María García",
  email: "maria@example.com",
  role: "USER" as const,
  createdAt: new Date("2026-01-15"),
  provider: "Credenciales",
};

describe("ProfileAccountCard (SPEC-125)", () => {
  it("muestra nombre, correo, rol, alta y proveedor", () => {
    render(<ProfileAccountCard profile={profile} />);

    expect(screen.getByText("María García")).toBeInTheDocument();
    expect(screen.getByText("maria@example.com")).toBeInTheDocument();
    expect(screen.getByText("Usuario")).toBeInTheDocument();
    expect(screen.getByText("Credenciales")).toBeInTheDocument();
    expect(screen.getByText(/Miembro desde:/u)).toBeInTheDocument();
  });
});
