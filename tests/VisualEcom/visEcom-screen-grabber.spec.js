import { test, expect } from '@playwright/test';

test('VisualEcom: Baseline screenshot of homepage after dismissing popups', async ({ page }) => {
  // Go to the homepage
  await page.goto('https://www.artkiveapp.com/');

  //set the viewport size
  await page.setViewportSize({ width: 1280, height: 800 });

  // Wait for popups to appear
  await page.waitForTimeout(7000);

  // Dismiss the cookie bar
  await page.getByRole('link', { name: 'OK', exact: true }).click();

  await page.waitForTimeout(2000);

  // Dismiss the promo dialog
  //await page.getByRole('button', { name: 'Close dialog' }).click();

  // Take a full-page baseline screenshot 
  //ignore this for now. This compares and shows the differences on a local host
  //await expect(page).toHaveScreenshot('homepage-baseline.png', { fullPage: true });
  //await page.evaluate(() => window. scrollTo(0, document.body.scrollHeight));

  //lets see if this works
  await page.screenshot({ path: 'tests/VisualEcom/visEcom-baseline/pricing/pricing-baseline.png', fullPage: true });
});
