import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EstablishmentCard } from "@/features/establishments/components/EstablishmentCard";
import type { EstablishmentListItem } from "@/features/establishments/services/establishment.service";

const establishment: EstablishmentListItem = {
  id: "est-1",
  name: "Restaurante Ejemplo",
  municipality: "Madrid",
  province: "Madrid",
  createdAt: new Date("2026-01-01"),
  category: { name: "Restaurante" },
  createdBy: { name: "María" },
  photoUrl: "https://example.com/foto.jpg",
  averageScore: 4.3,
  reviewCount: 2,
  hasReviews: true,
};

describe("EstablishmentCard (microfase UX)", () => {
  it("muestra foto, nombre, categoría, municipio, estrellas, media y un único enlace Ver ficha", () => {
    render(<EstablishmentCard establishment={establishment} />);

    expect(screen.getByAltText("Fotografía de Restaurante Ejemplo")).toBeInTheDocument();
    expect(screen.getByText("Restaurante Ejemplo")).toBeInTheDocument();
    expect(screen.getByText("Restaurante")).toBeInTheDocument();
    expect(screen.getByText("Madrid, Madrid")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "4.3 de 5 estrellas" })).toBeInTheDocument();
    expect(screen.getByText("4,3 / 5 · 2 valoraciones")).toBeInTheDocument();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Ver ficha" })).toHaveAttribute(
      "href",
      "/establishments/est-1",
    );

    expect(screen.queryByText(/Por María/u)).not.toBeInTheDocument();
  });
});
