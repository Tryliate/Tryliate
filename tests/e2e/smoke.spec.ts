import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Tryliate/);
});

test('can navigate to build agent', async ({ page }) => {
  await page.goto('/');

  // Verify Platform Version
  await expect(page.locator('body')).toContainText('Tryliate');
  await expect(page.locator('body')).toContainText('v1.1.1');
});
