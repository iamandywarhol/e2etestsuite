import { test, expect } from '@playwright/test';
import fs from 'fs';

// Read test data from JSON file
const testData = JSON.parse(fs.readFileSync(__dirname + '/admin-box-purchase.data.json', 'utf-8'));

test('Admin Box Orders: first row, third column is today\'s date', async ({ page }) => {
  // Go to login page
  //this is a test link and is not really needed 
  //await page.goto('https://apple-pay-qa.heirloomprint.com/admin');
  await page.goto('https://www.artkiveapp.com/admin');
  await page.getByRole('textbox', { name: 'Email' }).fill(testData.login.email);
  await page.getByRole('textbox', { name: 'Password' }).fill(testData.login.password);
  await page.getByRole('button', { name: 'Login' }).click();

  // Navigate to Box Orders > All Boxes
  await page.getByRole('link', { name: 'Box Orders' }).click();
  await page.getByRole('link', { name: 'All Boxes' }).click();

  // Wait for the table to load
  await page.waitForSelector('.odd > td:nth-child(3)');

  // Get the text of the first row, third column
  const dateCell = await page.locator('.odd > td:nth-child(3)').first();
  const cellText = (await dateCell.textContent())?.trim();

  // Get today's date in MM-DD-YYYY format
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const yyyy = today.getFullYear();
  const todayString = `${mm}-${dd}-${yyyy}`;

  // Assert the cell contains today's date
  expect(cellText).toContain(todayString);
});
