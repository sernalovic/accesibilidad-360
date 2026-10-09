import { expect, test } from "@playwright/test";

test("la página base muestra el título del proyecto", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Accesibilidad 360" })).toBeVisible();
});

test("la llamada a la acción lleva a iniciar sesión o crear cuenta", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Iniciar sesión" }).first()).toHaveAttribute(
    "href",
    "/login",
  );
  await expect(page.getByRole("link", { name: "Crear cuenta" }).first()).toHaveAttribute(
    "href",
    "/register",
  );
});
