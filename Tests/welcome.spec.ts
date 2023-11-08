import { test, expect } from "@playwright/test";

test.describe("Welcome tests", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test("has title", async ({ page }) => {
    await expect(page).toHaveTitle("OpenAI-UI");
  });

  test('User should be identified correctly', async ({ page }) => {
    await expect(page.getByTestId('headerUserButtonTooltip')).toContainText('Mock-User-');
  })

  test('UI should be set up correctly', async ({page}) => {
    await expect(page.getByTestId("inputSendButton")).toBeDisabled();
    await expect(page.getByTestId("inputClearButton")).toBeDisabled();
    await expect(page.getByTestId("inputFollowButton")).toBeDisabled();
    await expect(page.getByTestId("sidebar")).toHaveClass(/.*w-max.*/);

    await expect(page.getByTestId("welcomeStartButton")).toBeVisible();
    await expect(page.getByTestId("welcomeStartButton")).toBeEnabled();

    await page.getByTestId("sidebarsettingsButton").click();
    await expect(page.getByTestId("settingsSidebarRight")).not.toBeChecked();
    await expect(page.getByTestId("settingsLanguage")).toHaveValue("en");
    await expect(page.getByTestId("settingsAutosave")).not.toBeChecked();
    await expect(page.getByTestId("settingsTheme")).not.toBeChecked();

    await page.getByTestId("sidebarhistoryButton").click();
    await expect(page.getByTestId("historyEmpty")).toBeVisible();
  });
});
