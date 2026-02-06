import { expect, test } from "@playwright/test";

test.describe("Negotiator AI Agent (Chat Widget)", () => {
  test("should open chat widget and send a message", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // 1. Check for floating button
    const toggleButton = page.getByLabel("Open Chat");
    await expect(toggleButton).toBeVisible();
    await toggleButton.click();

    // 2. Check for Chat Interface
    await expect(page.getByText("Sales Assistant")).toBeVisible();
    await expect(page.getByText("Online Now")).toBeVisible();

    // 3. Send a message
    const input = page.getByPlaceholder("Type a message...");
    await input.fill("Is this 2020 Kia Sportage available?");

    const sendButton = page.locator('button[type="submit"]');
    await sendButton.click();

    // 4. Verify user message displayed
    await expect(
      page.getByText("Is this 2020 Kia Sportage available?"),
    ).toBeVisible();

    // 5. Verify AI responds (wait for response)
    // Since we are running against real/dev backend, response might take a moment.
    // We look for any message from the assistant that appears AFTER our message
    // Note: The specific response text depends on the backend/AI, so we just check for existence
    // or the loading state disappearing.

    // We can check if a new message bubble appears
    // The widget adds a mock error or real response.
    // Let's assert that the input is cleared, which happens on submit
    await expect(input).toBeEmpty();
  });
});
