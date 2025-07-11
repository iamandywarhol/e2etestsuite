import { test, expect } from '@playwright/test';

test('VisualEcom: Baseline screenshot of homepage', async ({ page }) => {
  // Go to the homepage (adjust URL if you want a different page)
  await page.goto('https://www.artkiveapp.com/');

  // Take a full-page screenshot and save as baseline
  await expect(page).toHaveScreenshot('homepage-baseline.png', { fullPage: true });
});
