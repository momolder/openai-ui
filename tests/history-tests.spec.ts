import { lang } from '../src/lib/localization/translation';
import { test, expect } from '@playwright/test';

test.describe('OpenAI-UI base functionality', () => {
  test.beforeEach(async ({ page }) => {
    await fetch('http://localhost:5173/fake/history/user/me', { method: 'DELETE' });
    await page.goto('http://localhost:5173/');
  });

  test('rename should rename a conversation', async ({ page }) => {
    await page.getByRole('button', { name: lang.Page.Welcome.StartButton.en }).click();
    await page.getByRole('button', { name: 'historyicon' }).click();
    await page.getByRole('button', { name: '...' }).nth(1).click();
    await page.getByRole('button', { name: 'contextMenuItemicon Rename' }).click();
    await page.getByTestId('message-box-input').fill('rename1');
    await page.getByTestId('message-box-ok').click();
    await expect(page.getByTestId('sidebar')).toContainText('rename1');
  });

  test('cancel a rename should not rename a conversation', async ({ page }) => {
    await page.getByRole('button', { name: lang.Page.Welcome.StartButton.en }).click();
    await page.getByRole('button', { name: 'historyicon' }).click();
    await page.getByRole('button', { name: '...' }).nth(1).click();
    await page.getByRole('button', { name: 'contextMenuItemicon Rename' }).click();
    await page.getByTestId('message-box-input').fill('rename1');
    await page.getByTestId('message-box-cancel').click();
    await expect(page.getByTestId('sidebar')).not.toContainText('rename1');
  });
});
