import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Configuration
const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 }
};

const PAGES = [
  { name: 'homepage', url: 'https://example-ecommerce-site.com/' },
  { name: 'pricing', url: 'https://example-ecommerce-site.com/pricing' }
];

const EXCLUSIONS = [
  '#hero-video',
  '.cookie-banner',
  '.popup-overlay'
];

test.describe('Baseline Screenshot Creator', () => {
  for (const viewport of Object.entries(VIEWPORTS)) {
    const [device, size] = viewport;
    
    for (const page of PAGES) {
      test(`Create baseline for ${page.name} on ${device}`, async ({ page: pageObject }) => {
        // Navigate to page
        await pageObject.goto(page.url);
        await pageObject.setViewportSize(size);
        
        // Wait for page to load
        await pageObject.waitForLoadState('networkidle');
        
        // Handle common popups/interruptions
        await handlePopups(pageObject);
        
        // Apply exclusions
        await applyExclusions(pageObject, EXCLUSIONS);
        
        // Create baseline directory if it doesn't exist
        const baselineDir = `tests/visual/baselines/${device}`;
        if (!fs.existsSync(baselineDir)) {
          fs.mkdirSync(baselineDir, { recursive: true });
        }
        
        // Take screenshot
        const screenshotPath = path.join(baselineDir, `${page.name}.png`);
        await pageObject.screenshot({ 
          path: screenshotPath, 
          fullPage: true 
        });
        
        console.log(`Created baseline: ${screenshotPath}`);
      });
    }
  }
});

async function handlePopups(page) {
  try {
    // Handle cookie banner
    const cookieButton = page.getByRole('link', { name: 'OK', exact: true });
    if (await cookieButton.isVisible({ timeout: 2000 })) {
      await cookieButton.click();
    }
    
    // Handle other popups as needed
    await page.waitForTimeout(1000);
  } catch (error) {
    console.log('No popups to handle or popup handling failed');
  }
}

async function applyExclusions(page, selectors) {
  for (const selector of selectors) {
    await page.addStyleTag({ 
      content: `${selector} { visibility: hidden !important; }` 
    });
  }
} 