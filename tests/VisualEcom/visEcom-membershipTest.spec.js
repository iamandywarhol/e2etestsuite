/*
Membership baseline test
tests the visual stability of the membership page, comparing current screenshot to baseline

TODO:
- needs exact exclusion logic that is testable
- needs to display screen differences in local report (pass/fail)
- other requirements TBD
*/
import { test, expect } from '@playwright/test';
import fs from 'fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import path from 'path';

test('Visual diff with percentage logging', async ({ page }) => {

  //Define the Test Name
  const testName = 'membership';

  await page.goto('https://example-ecommerce-site.com/plans');
 
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(7000);
  //await page.locator('svg.kl-private-reset-css-Xuajs1').click();
  await page.getByRole('link', { name: 'OK', exact: true }).click();
  await page.waitForTimeout(1000);


  const closeButton = page.getByRole('button', { name: 'Close dialog', exact:true });
  if(closeButton.count() > 0) {
  await page.getByRole('button', { name: 'Close dialog', exact:true }).click();
  await page.waitForTimeout(1000);
  }
  //
  
  //Exclusions logic
  await page.addStyleTag({ content: '#hero-video { visibility: hidden; }' });
  
  // Take a screenshot




  // when creating a new test, change path and title to match the new test
  const screenshotPath = 'tests/VisualEcom/screenshots/memberships-current.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });

   // Take a screenshot with the video area masked
  // await expect(page).toHaveScreenshot('homepage-baseline.png', {
    //fullPage: true,
    //mask: [
    //  page.locator('#hero-video')
    //],
 // }); 


  let comparedImages = false;
  // Compare with baseline
  //Create a new folder in the visEcom-baseline folder for the new page
  const baselinePath = 'tests/VisualEcom/visEcom-baseline/membership/membership-baseline.png'; //also change this line to match the new test baseline path
  if (fs.existsSync(baselinePath)) {
    const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
    const img2 = PNG.sync.read(fs.readFileSync(screenshotPath));
    const { width, height } = img1;
    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(
      img1.data, img2.data, diff.data, width, height,
      { threshold: 0.1 }
    );
    const totalPixels = width * height;
    const percentDiff = ((numDiffPixels / totalPixels) * 100).toFixed(2);
    
     const testName = 'membership'
    //This is the line that needs to be chaqnged for the diff file 
    // Create the directory structure if it doesn't exist
    const diffDir = `tests/VisualEcom/diffreport/${testName}`;
    if (!fs.existsSync(diffDir)) {
      fs.mkdirSync(diffDir, { recursive: true });
    }

    // Now write the file
    fs.writeFileSync(`${diffDir}/${testName}-diff.png`, PNG.sync.write(diff));
    console.log(`Visual difference: ${percentDiff}% (${numDiffPixels} pixels)`);
    //if the difference is greater than 0.02, the test will fail.
    
    //tolerance logic
    //adjust here by %00.00 format.
    const tolerance = 1.0;
    if (percentDiff > tolerance) {
        //the test will fail and provide a screenshot of the difference along with comparison.
      console.log(`Visual difference is greater than ${tolerance}%. Test failed.`);
      comparedImages = false;
      expect(comparedImages).toBe(true);
      
    } else {
      console.log(`Visual difference is less than ${tolerance}%. Test passed.`);
      comparedImages = true;
      expect(comparedImages).toBe(true);
    }
  } else {
    console.log('No baseline found. Saving current screenshot as baseline.');
    fs.copyFileSync(screenshotPath, baselinePath);
  }
  //await expect(page).toHaveScreenshot('homepage-baseline.png', { fullPage: true });

});
