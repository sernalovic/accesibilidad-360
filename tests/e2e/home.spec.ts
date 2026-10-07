import { expect, test } from "@playwright/test";

test("la página base muestra el título del proyecto", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Accesibilidad 360" })).toBeVisible();
});
