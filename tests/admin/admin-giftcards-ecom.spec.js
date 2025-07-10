/*
ECOM ONLY 
****************************************************
* This test will check through a series of gift cards until it finds a gift card created within the last 14 days.
* it will then assert if the gift card was created within the last 14 days.
* this test only checks the ecom gift cards table. 
****************************************************
*/
import { test, expect } from '@playwright/test';
import fs from 'fs';

// Use your existing admin credentials from the JSON file
const testData = JSON.parse(fs.readFileSync(__dirname + '/admin-box-purchase.data.json', 'utf-8'));

test('Gift Cards: at least one created within last 14 days', async ({ page }) => {
  await page.goto('https://www.artkiveapp.com/admin');
  await page.getByRole('textbox', { name: 'Email' }).fill(testData.login.email);
  await page.getByRole('textbox', { name: 'Password' }).fill(testData.login.password);
  await page.getByRole('button', { name: 'Login' }).click();

  // Navigate to Gift Cards > Ecom Gift Cards
  await page.getByRole('link', { name: 'Gift Cards' }).click();
  await page.getByRole('link', { name: 'Ecom Gift Cards' }).click();

  // Get today's date in MM-DD-YYYY format
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const yyyy = today.getFullYear();
  const todayString = `${mm}-${dd}-${yyyy}`;
 
  // Wait for at least one data row with enough cells
  await page.waitForSelector('tbody tr td:nth-child(6)');

  // Wait for the table to load (adjust selector if needed)
  await page.waitForSelector('td:nth-child(7)'); // Change column if date is in a different column

  // Wait for at least one data row with enough cells
  await page.waitForSelector('tbody tr td:nth-child(6)');

  const rows = await page.locator('tbody tr');
  const rowCount = await rows.count();
  console.log(`Found ${rowCount} rows in the table.`);
  console.log(`Today's Date: ${todayString}`);

  // Get all date cells in the table
  const dateCells = await page.locator('td:nth-child(7)').allTextContents();

  // Get today's date and 14 days ago


  //note you can use this to test the parameters of the date range
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(today.getDate() - 14); 

  // Helper to parse table date string (update format if needed)
  function parseTableDate(dateStr) {
    // Accepts 'MM/DD/YYYY' or 'MM-DD-YYYY'
    const [mm, dd, yyyy] = dateStr.replace(/-/g, '/').split('/');
    return new Date(`${yyyy}-${mm}-${dd}`);
  }
  //console.log(`Today's Date: ${todayString}`);

  let foundRecent = false;

  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    const cellCount = await row.locator('td').count();
    //const date = parseTableDate(cellCount.trim());
    //need clarification on this I am uncertain if this is neccesary Where is it picking up bad rows?
    if (cellCount < 8) {
      console.log(`Row ${i + 1}: Skipped (only ${cellCount} cells)`);
      continue;
    }

    const id = (await row.locator('td').nth(0).textContent())?.trim();
    const date = (await row.locator('td').nth(1).textContent())?.trim();
    const quantity = (await row.locator('td').nth(2).textContent())?.trim();
    const amount = (await row.locator('td').nth(3).textContent())?.trim();
    const status = (await row.locator('td').nth(4).textContent())?.trim();
    //const buyerName = (await row.locator('td').nth(5).textContent())?.trim();
    //const buyerEmail = (await row.locator('td').nth(6).textContent())?.trim();

    console.log(`Row ${i + 1}: ID: ${id}, Date: ${date}, Quanity: ${quantity}, Amount: ${amount}, Shipping Status: ${status}`);
     

    /* this is just some debugging code to check time values
    //const date = parseTableDate(cellCount.trim());
    //console.log('Comparing:', parsedDate, 'to', twoWeeksAgo, 'and', today);
    //console.log('Types:', typeof parsedDate, typeof twoWeeksAgo, typeof today); */
    const parsedDate = parseTableDate(date);

    if (parsedDate <= today && parsedDate >= twoWeeksAgo) {
        foundRecent = true; 
        console.log ('Gift Card ID: ' + id + ' was created within the last 14 days. Test Passed.');
        break;
    }
    else {
        //console.log ('Gift Card ID: ' + id + ' was not created within the last 14 days. Test Failed.');
        // Automatically fail the test
        expect.fail('Test Failed. Gift Card ID: ' + id + ' was not created within the last 14 days.');

    
        //we will create another function call here later to then run a gift card purchase and then a 
        //recheck to see if the gift card purchase was successful. 
        break;
    }

  //this asserstion will fail if no gift cards were created within the last 14 days. 
  expect(foundRecent).toBe(true);
  }
});



