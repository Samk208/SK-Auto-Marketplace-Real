import { expect, test } from "@playwright/test";

test.describe("Homepage AI Agents", () => {
  test("should display all production AI agents", async ({ page }) => {
    await page.goto("/");

    // Check for the section header
    await expect(
      page.getByText("AI-Powered Trust Infrastructure"),
    ).toBeVisible();

    // Check for the 3 Production Agents
    await expect(page.getByText("Document Intelligence")).toBeVisible();
    await expect(page.getByText("Vision Inspector")).toBeVisible();
    await expect(page.getByText("Pricing Oracle")).toBeVisible();
  });

  test("should display roadmap agents", async ({ page }) => {
    await page.goto("/");

    // Check for Roadmap Agents
    await expect(page.getByText("Logistics Navigator")).toBeVisible();
    await expect(page.getByText("Smart Matcher")).toBeVisible();
  });

  test("should navigate to AI Command Center", async ({ page }) => {
    await page.goto("/");

    // Find the CTA button
    const cta = page.getByRole("link", { name: /Launch Command Center/i });
    await expect(cta).toBeVisible();

    // Check href attribute
    await expect(cta).toHaveAttribute("href", "/ai");
  });
});
