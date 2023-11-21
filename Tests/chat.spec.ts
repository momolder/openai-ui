import { test, expect } from "@playwright/test";

test.describe("Chat tests", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // test("Ask a question, follow and unfollow", async ({ page }) => {
  //   await page.getByTestId("welcomeStartButton").click();
  //   await expect(page.getByTestId("message-0")).toBeVisible();
  //   await expect(page.getByTestId("message-1")).toBeVisible();
  //   await page.getByTestId("inputFollowButton").click();
  //   await page.getByTestId("sidebarhistoryButton").click();
  //   expect((await page.getByTestId("historyLoadButton-0").innerText()).length).toBeGreaterThan(1);
  //   await page.getByTestId("historyUnfollowButton-0").click();
  //   await expect(page.getByTestId("historyLoadButton-0")).toBeHidden();
  // });

  // test("Start chatting and clear the chat", async ({ page }) => {
  //   //await page.getByTestId("inputMessageInput").click();
  //   await page.getByTestId("inputMessageInput").fill("Antworte mit exakt 'Antwort zur Frage'", {force: true});
  //   await page.getByTestId("inputSendButton").click();
  //   expect(await page.getByTestId("message-0").textContent()).toContain(
  //     "Antworte mit exakt 'Antwort zur Frage'"
  //   );
  //   expect(await page.getByTestId("message-1").textContent()).toContain("Antwort zur Frage");
  //   await page.getByTestId("inputClearButton").click();
  //   await expect(page.getByTestId("welcomeStartButton")).toBeVisible();
  // });
});
