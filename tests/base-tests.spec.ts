import { lang } from '../src/lib/localization/translation';
import { test, expect } from '@playwright/test';

test.describe('OpenAI-UI base functionality', () => {
  test.beforeEach(async ({ page }) => {
    await fetch('http://localhost:5173/fake/history/user/me', { method: 'DELETE' });
    await page.goto('http://localhost:5173/');
  });

  test('UI should be available and visible', async ({ page }) => {
    await expect(page.getByTestId('header')).toBeVisible();
    await expect(page.getByTestId('sidebar')).toBeVisible();
    await expect(page.getByTestId('chat')).toBeVisible();
  });

  test('Bot should respond to start promt', async ({ page }) => {
    await page.getByRole('button', { name: lang.Page.Welcome.StartButton.en }).click();
    await expect(page.getByTestId('chat').getByRole('paragraph')).toHaveCount(2);
    await expect(page.getByTestId('chat').getByRole('paragraph').nth(0)).toHaveText(
      lang.Page.Welcome.StartButtonPrompt.en
    );
    await expect(page.getByTestId('chat').getByRole('paragraph').nth(1)).toContainText(
      lang.Page.Welcome.StartButtonPrompt.en
    );
  });

  test('Bot should respond to chat input', async ({ page }) => {
    await page.getByTestId('chat-input').fill('test');
    await page.getByRole('button', { name: 'send' }).click();
    await expect(page.getByTestId('chat').getByRole('paragraph')).toHaveCount(2);
    await expect(page.getByTestId('chat').getByRole('paragraph').nth(0)).toHaveText('test');
    await expect(page.getByTestId('chat').getByRole('paragraph').nth(1)).toContainText('test');
  });

  test('A new chat can be started', async ({ page }) => {
    await page.getByRole('button', { name: lang.Page.Welcome.StartButton.en }).click();
    await expect(page.getByTestId('chat').getByRole('paragraph')).toHaveCount(2);
    await expect(page.getByRole('button', { name: 'cancel' })).toBeHidden();
    await expect(page.getByRole('button', { name: 'send' })).toBeVisible();
    await page.getByRole('button', { name: 'clear chat' }).click();
    await expect(page.getByRole('button', { name: lang.Page.Welcome.StartButton.en })).toBeVisible();
  });

  test('test', async ({ page }) => {
    await page.getByRole('button', { name: 'How does the chat work?' }).click();
    await expect(page.getByTestId('chat')).toContainText(
      'Can you tell me more about what abilities and functions you have as an AI chatbot and how you handle my data and privacy? was your request and this is my answer.'
    );
    process.env.PUBLIC_OpenAi_Deployments = 'gpt3|gpt4';
    await page.getByRole('button', { name: 'settingsicon' }).click();
    await page.reload();
    await page.getByRole('button', { name: 'How does the chat work?' }).click();
    await expect(page.getByTestId('chat')).toContainText(
      'Can you tell me more about what abilities and functions you have as an AI chatbot and how you handle my data and privacy? was your request and this is my answer.'
    );
  });
});
