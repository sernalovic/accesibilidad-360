import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SuccessNotice } from "@/features/auth/components/SuccessNotice";

describe("SuccessNotice (SPEC-010)", () => {
  it("renderiza el mensaje recibido con role status", () => {
    render(<SuccessNotice message="Operación completada." />);

    const notice = screen.getByRole("status");
    expect(notice).toHaveTextContent("Operación completada.");
  });
});
