import { test, expect } from '@playwright/test';

// homepage visual comparison test

test('VisualEcom: Baseline screenshot of homepage with video masked', async ({ page }) => {
  await page.goto('https://example-ecommerce-site.com/');
  //await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(7000);

  // removes the cookie and email address popups
  await page.getByRole('link', { name: 'OK', exact: true }).click();
  await page
  await page.getByRole('button', { name: 'Close dialog' }).click();

  // take a screenshot with the video area masked
  await expect(page).toHaveScreenshot('homepage-baseline.png', {
   // fullPage: true,
    //mask: [
    //  page.locator('#hero-video')
    //]
  });
});