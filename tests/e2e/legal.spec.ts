import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("las páginas legales muestran su título", async ({ page }) => {
  for (const [path, heading] of [
    ["/legal", "Aviso legal"],
    ["/privacy", "Política de privacidad"],
    ["/cookies", "Política de cookies"],
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }
});

test("el pie global enlaza la información legal", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Aviso legal" })).toHaveAttribute("href", "/legal");
  await expect(page.getByRole("link", { name: "Política de privacidad" })).toHaveAttribute(
    "href",
    "/privacy",
  );
  await expect(page.getByRole("link", { name: "Política de cookies" })).toHaveAttribute(
    "href",
    "/cookies",
  );
});

test("la página legal no presenta violaciones críticas de accesibilidad", async ({ page }) => {
  await page.goto("/legal");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
