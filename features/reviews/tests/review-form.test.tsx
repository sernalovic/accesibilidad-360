import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createReviewAction } from "@/features/reviews/actions/create-review.action";
import { ReviewForm } from "@/features/reviews/components/ReviewForm";

vi.mock("@/features/reviews/actions/create-review.action", () => ({
  createReviewAction: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

const actionMock = vi.mocked(createReviewAction);

const criteria = [
  { id: "crit-1", name: "Acceso sin escalones", description: null },
  { id: "crit-2", name: "Puerta accesible", description: null },
];

// Reproducción: el navegador envía los valores de los radios como
// strings. El formulario debe entregar números al Server Action.
describe("ReviewForm (reproducción SPEC-040)", () => {
  it("envía las puntuaciones como números aunque el DOM devuelva strings", async () => {
    actionMock.mockResolvedValue({ success: true, id: "rev-1" });
    render(<ReviewForm establishmentId="est-1" criteria={criteria} />);

    const radios = document.querySelectorAll('input[type="radio"][value="3"]');
    expect(radios.length).toBe(2);
    radios.forEach((radio) => fireEvent.click(radio));
    fireEvent.click(screen.getByRole("button", { name: "Enviar valoración" }));

    await waitFor(() => expect(actionMock).toHaveBeenCalledOnce());
    const payload = actionMock.mock.calls[0]?.[0] as {
      scores: { criterionId: string; score: unknown }[];
    };
    expect(payload.scores).toHaveLength(2);
    for (const entry of payload.scores) {
      expect(typeof entry.score).toBe("number");
    }
  });
});
