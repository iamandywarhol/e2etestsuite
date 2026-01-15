/* This test will check through a series of invoices until it finds a paid invoice from today. it will then
assert if the invoice is from today and then assert if the invoice has been paid today.
however, new logic will need to be introduced should there need to be multiple paid invoices checked. */


import { test, expect } from '@playwright/test';
import fs from 'fs';

const testData = JSON.parse(fs.readFileSync(__dirname + '/admin-box-purchase.data.json', 'utf-8'));

test('Admin Invoices: Output each row until Payment Status is Paid', async ({ page }) => {
  // Login
  await page.goto('https://example-admin-site.com/admin');
  await page.getByRole('textbox', { name: 'Email' }).fill(testData.login.email);
  await page.getByRole('textbox', { name: 'Password' }).fill(testData.login.password);
  await page.getByRole('button', { name: 'Login' }).click();

  // Navigate to Invoices > All Invoices
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByRole('link', { name: 'All Invoices' }).click();

  // Get today's date in MM-DD-YYYY format
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const yyyy = today.getFullYear();
  const todayString = `${mm}/${dd}/${yyyy}`;

  // Wait for at least one data row with enough cells
  await page.waitForSelector('tbody tr td:nth-child(6)');

  const rows = await page.locator('tbody tr');
  const rowCount = await rows.count();
  console.log(`Found ${rowCount} rows in the table.`);
  console.log(`Today's Date: ${todayString}`);

  let foundToday = false; 
  let foundPaidToday = false;
  let isToday = false;

  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    const cellCount = await row.locator('td').count();
    //need clarification on this I am uncertain if this is neccesary Where is it picking up bad rows?
    if (cellCount < 8) {
      console.log(`Row ${i + 1}: Skipped (only ${cellCount} cells)`);
      continue;
    }


    const id = (await row.locator('td').nth(0).textContent())?.trim();
    const type = (await row.locator('td').nth(1).textContent())?.trim();
    const orderId = (await row.locator('td').nth(2).textContent())?.trim();
    const state = (await row.locator('td').nth(4).textContent())?.trim();
    const paymentStatus = (await row.locator('td').nth(5).textContent())?.trim();
    const createdOn = (await row.locator('td').nth(7).textContent())?.trim();

    console.log(`Row ${i + 1}: ID: ${id}, Type: ${type}, Order ID: ${orderId}, State: ${state}, Payment Status: ${paymentStatus}, Created On: ${createdOn}`);
    
    if (todayString !== createdOn) {
      console.log('No invoices from today were found. Stopping search.');
      break;
    }
    /*
    if (todayString === createdOn) {
      isToday = true;
     // continue;
    }*/
    isToday = true
    if (paymentStatus && paymentStatus.toLowerCase() === 'paid') {
      console.log('Found a row with ID: ' + id + ' with Payment Status: Paid. Test Passed.');
      foundPaidToday = true;
      break;
    }
  }
  //creates an assertion to check if an invoice is from today 
  expect(isToday).toBe(true);
  //creates an assertion to check an invoice has been paid today
  expect(foundPaidToday).toBe(true);
  
}); 
