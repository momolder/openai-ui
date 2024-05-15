import { lang } from '../src/lib/localization/translation';
import { test, expect } from '@playwright/test';

test.describe('OpenAI-UI base functionality', () => {
  test.beforeEach(async ({ page }) => {
    await fetch('http://localhost:3000/fake/history/user/me', { method: 'DELETE' });
    await page.goto('http://localhost:3000/');
  });

  test('UI should be available and visible', async ({ page }) => {
    await expect(page.getByTestId('header')).toBeVisible();
    await expect(page.getByTestId('sidebar')).toBeVisible();
    await expect(page.getByTestId('chat')).toBeVisible();
  });

  test('Bot should respond to start promt', async ({ page }) => {
    await page.getByTestId('welcome-button').click();
    await expect(page.getByTestId('chat').getByRole('paragraph')).toHaveCount(2);
    await expect(page.getByTestId('chat').getByRole('paragraph').nth(0)).toHaveText(
      lang.Page.Welcome.StartButtonPrompt.en
    );
    await expect(page.getByTestId('chat').getByRole('paragraph').nth(1)).toContainText(
      lang.Page.Welcome.StartButtonPrompt.en
    );
  });

  test('A new chat can be started', async ({ page }) => {
    await page.getByTestId('welcome-button').click();
    await expect(page.getByTestId('chat').getByRole('paragraph')).toHaveCount(2);
    await expect(page.getByRole('button', { name: 'cancel' })).toBeHidden();
    await expect(page.getByRole('button', { name: 'send' })).toBeVisible();
    await page.getByRole('button', { name: 'clear chat' }).click();
    await expect(page.getByRole('button', { name: lang.Page.Welcome.StartButton.en })).toBeVisible();
  });
  test('Bot should respond to chat input', async ({ page }) => {
    await page.getByTestId('chat-input').fill('test');
    await page.getByRole('button', { name: 'send' }).click();
    await expect(page.getByTestId('chat').getByRole('paragraph')).toHaveCount(2);
    await expect(page.getByTestId('chat').getByRole('paragraph').nth(0)).toHaveText('test');
    await expect(page.getByTestId('chat').getByRole('paragraph').nth(1)).toContainText('test');
  });

  test('Deployment select should change model usage', async ({ page }) => {
    await page.getByRole('button', { name: 'settingsicon' }).click();
    await page.getByTestId(lang.Page.Settings.Deployment.en).selectOption('gpt-35-turbo');
    await page.getByTestId('welcome-button').click();
    await expect(page.getByTestId('chat')).toContainText('gpt-35-turbo');
    await page.getByTestId(lang.Page.Settings.Deployment.en).selectOption('gpt-4');
    await page.getByRole('button', { name: 'clear chat' }).click();
    await page.getByTestId('welcome-button').click();
    await expect(page.getByTestId('chat')).toContainText('gpt-4');
  });
});
