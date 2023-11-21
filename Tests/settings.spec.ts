import { test, expect } from '@playwright/test';

test.describe('Settings tests', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // test('Sidebar position test', async ({page}) => {
  //   await page.getByTestId("sidebarsettingsButton").click();
  //   await expect(page.getByTestId("settingsSidebarRight")).not.toBeChecked();
  //   await page.getByTestId("settingsSidebarRight").click();
  //   await expect(page.getByTestId("settingsSidebarRight")).toBeChecked();
  //   await page.goto('/');
  //   await page.getByTestId("sidebarsettingsButton").click();
  //   await expect(page.getByTestId("settingsSidebarRight")).toBeChecked();
  // });
});
