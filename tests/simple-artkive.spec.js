// tests/simple-artkive.spec.js
const { test, expect } = require('@playwright/test');

test('Simple Artkive Site Test', async ({ page }) => {
  console.log('🚀 Starting simple test...');
  
  // Navigate to the site
  await page.goto('https://www.artkiveapp.com');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot
  await page.screenshot({ path: 'screenshots/simple-test.png' });
  
  // Check that the page title contains "Artkive"
  await expect(page).toHaveTitle(/Artkive/);
  
  // Look for common elements that should be on the page
  const getMyBoxButton = page.locator('text=Get My Box').first();
  if (await getMyBoxButton.isVisible()) {
    console.log('✅ Found "Get My Box" button');
  }
  
  console.log('✅ Simple test completed!');
});
