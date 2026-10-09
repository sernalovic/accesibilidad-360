import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BackToAppLink } from "@/components/navigation/BackToAppLink";

const back = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ back }),
}));

function historyLength(value: number): void {
  Object.defineProperty(window.history, "length", { value, configurable: true });
}

describe("BackToAppLink (navegación legal)", () => {
  it("enlaza al fallback con texto descriptivo", () => {
    historyLength(1);

    render(<BackToAppLink fallbackHref="/" />);

    expect(screen.getByRole("link", { name: "Volver a la aplicación" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("vuelve atrás cuando existe historial navegable", () => {
    historyLength(3);
    back.mockClear();

    render(<BackToAppLink fallbackHref="/dashboard" />);
    fireEvent.click(screen.getByRole("link", { name: "Volver a la aplicación" }));

    expect(back).toHaveBeenCalledOnce();
  });

  it("prioriza el fallback sin historial útil", () => {
    historyLength(1);
    back.mockClear();

    render(<BackToAppLink fallbackHref="/dashboard" />);
    fireEvent.click(screen.getByRole("link", { name: "Volver a la aplicación" }));

    expect(back).not.toHaveBeenCalled();
  });
});
