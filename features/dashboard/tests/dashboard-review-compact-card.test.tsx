import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardReviewCompactCard } from "@/features/dashboard/components/DashboardReviewCompactCard";

const review = {
  id: "rev-1",
  comment: `Un comentario lo bastante largo como para superar el límite de ciento cuarenta letras y comprobar así que el truncado funciona correctamente en la tarjeta.`,
  createdAt: new Date("2026-06-01"),
  establishmentId: "est-1",
  establishmentName: "Restaurante Ejemplo",
  userName: "María",
  averageScore: 4.8,
  scores: [{ score: 5, criterionName: "Acceso" }],
};

describe("DashboardReviewCompactCard (microfase UX)", () => {
  it("muestra establecimiento, autor, estrellas con media exacta y comentario truncado", () => {
    render(<DashboardReviewCompactCard review={review} />);

    expect(screen.getByRole("link", { name: "Restaurante Ejemplo" })).toBeInTheDocument();
    expect(screen.getByText(/Por María/u)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "4.8 de 5 estrellas" })).toBeInTheDocument();
    expect(screen.getByText("4,8 / 5")).toBeInTheDocument();
    const text = screen.getByText(/Un comentario lo bastante largo/u).textContent ?? "";
    expect(text.length).toBeLessThanOrEqual(141);
    expect(text.endsWith("…")).toBe(true);
    expect(screen.getByRole("link", { name: "Ver ficha" })).toHaveAttribute(
      "href",
      "/establishments/est-1",
    );
  });
});
