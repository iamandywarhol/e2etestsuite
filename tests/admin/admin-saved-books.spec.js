import { test, expect } from '@playwright/test';
import fs from 'fs';

// Read test data from JSON file (reuse your admin data file)
const testData = JSON.parse(fs.readFileSync(__dirname + '/admin-box-purchase.data.json', 'utf-8'));

test('Saved Books: at least one Created At date matches today', async ({ page }) => {
  // test link 
  // await page.goto('https://apple-pay-qa.heirloomprint.com/admin');
  await page.goto('https://www.artkiveapp.com/admin')
  await page.getByRole('textbox', { name: 'Email' }).fill(testData.login.email);
  await page.getByRole('textbox', { name: 'Password' }).fill(testData.login.password);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'Saved Books' }).click();

  // Wait for the table to load
  await page.waitForSelector('td:nth-child(7)');

  // Get all "Created At" cells in the table
  const dateCells = await page.locator('td:nth-child(7)').allTextContents();

  // Get today's date in MM-DD-YYYY format
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const yyyy = today.getFullYear();
  const todayString = `${mm}-${dd}-${yyyy}`;

  let found = dateCells.some(cell => cell.trim() === todayString);

  // Easily fixable exception: also allow 06-30-2025
  //if (!found) {
  //  found = dateCells.some(cell => cell.trim() === '06-30-2025');
  //}

  expect(found).toBe(true);
});
