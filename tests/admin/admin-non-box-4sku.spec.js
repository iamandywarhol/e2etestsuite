import { test, expect } from '@playwright/test';
import fs from 'fs';

// You may want to move credentials to a data file for security/maintainability
//const ADMIN_EMAIL = 'nathan.b@artkivebox.com';
//const ADMIN_PASSWORD = 'Stanford1!';

//this should read from the json file the credentials etc. 
const testData = JSON.parse(fs.readFileSync(__dirname + '/admin-box-purchase.data.json', 'utf-8'));

// Table row indices (1-based):
// 3: Cards - Original
// 4: Cards - Wedding
// 5: XL Cards
const ROWS_TO_CHECK = [3, 4, 5];
const CURRENT_DAY_COL = 2; // 1-based index for 'Current Day' column

test('Admin Non-Box SKUs: Cards - Original, Wedding, XL Cards (Current Day > 1)', async ({ page }) => {
  // Go to admin login page
  await page.goto('https://www.artkiveapp.com/admin');
  await page.getByRole('textbox', { name: 'Email' }).fill(testData.login.email);
  await page.getByRole('textbox', { name: 'Password' }).fill(testData.login.password);
  await page.getByRole('button', { name: 'Login' }).click();
 

  // Navigate to Statistics
  await page.getByRole('link', { name: 'Statistics' }).click();

  // Wait for the table to load
  await page.waitForSelector('table');
  const table = page.locator('table');

  // Check the Current Day values for the specified rows
  let found = false;
  for (const rowIdx of ROWS_TO_CHECK) {
    // Table rows are 1-based, and the first row is the header, so add 1
    const cell = table.locator(`tr:nth-child(${rowIdx + 1}) > td:nth-child(${CURRENT_DAY_COL})`);
    const valueText = await cell.textContent();
    const value = parseInt(valueText?.trim() || '0', 10);
    console.log(`Row ${rowIdx}: Current Day value = ${value}`);
    if (value > 1) {
      found = true;
      break;
    }
  }

  expect(found).toBe(true);
});
