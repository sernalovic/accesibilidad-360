import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("la página base no presenta violaciones críticas de accesibilidad", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
