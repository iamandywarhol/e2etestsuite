
//this needs the exact pass/fail criteria and logic to support it. 
//Some neccesary requirements are:
//Create logic that will aid in the detection of bots. 
//Possibly look at the years in which a plan may expire and then pass/fail on specific criteria. 
//Logic for any specific edge cases that may arise.


import { test, expect } from '@playwright/test';
import fs from 'fs';

const testData = JSON.parse(fs.readFileSync(__dirname + '/admin-box-purchase.data.json', 'utf-8'));


test('Comp Plans: Plans expiring two years from todays date', async ({ page }) => {
    await page.goto('https://www.artkiveapp.com/admin');
    await page.getByRole('textbox', { name: 'Email' }).fill(testData.login.email);
    await page.getByRole('textbox', { name: 'Password' }).fill(testData.login.password);
    await page.getByRole('button', { name: 'Login' }).click();
  
    // Navigate to Gift Cards > Ecom Gift Cards
    await page.getByRole('link', { name: 'Memberships' }).click();
    await page.getByRole('link', { name: 'Comp Plans' }).click();
  
    // Get today's date in MM-DD-YYYY format
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const todayString = `${mm}-${dd}-${yyyy}`;
   
    // Wait for at least one data row with enough cells
    //await page.waitForSelector('tbody tr td:nth-child(4)');
  
    // Wait for the table to load (adjust selector if needed)
    await page.waitForSelector('td:nth-child(3)'); // Change column if date is in a different column
  
    // Wait for at least one data row with enough cells
    await page.waitForSelector('tbody tr td:nth-child(5)');
  
    const rows = await page.locator('tbody tr');
    const rowCount = await rows.count();
    console.log(`Found ${rowCount} rows in the table.`);
    console.log(`Today's Date: ${todayString}`);
  
    // Get all date cells in the table
    const dateCells = await page.locator('td:nth-child(7)').allTextContents();
  
    // Get today's date and 14 days ago
    //note you can use this to test the parameters of the date range
    const twoyearsexp = new Date();
    twoyearsexp.setDate(today.getDate() + 730); 
  
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
      if (cellCount < 2) {
        console.log(`Row ${i + 1}: Skipped (only ${cellCount} cells)`);
        continue;
      }
  
      const planTitle = (await row.locator('td').nth(0).textContent())?.trim();
      const userEmail = (await row.locator('td').nth(1).textContent())?.trim();
      const pstartDate = (await row.locator('td').nth(2).textContent())?.trim();
      const compExpDate = (await row.locator('td').nth(3).textContent())?.trim();
      const numPics = (await row.locator('td').nth(4).textContent())?.trim();
      const numOrders = (await row.locator('td').nth(5).textContent())?.trim();
  
      console.log(`Row ${i + 1}: Plan title: ${planTitle}, Plan Start Date: ${pstartDate}, compExpDate: ${compExpDate}, Number of Pictures: ${numPics}, Number of Orders: ${numOrders}`);
       
  
      // this is just some debugging code to check time values
      const date = parseTableDate(cellCount.trim());
      
      console.log('Comparing:', parsedDate, 'to', twoyearsexp, 'and', today);
      console.log('Types:', typeof parsedDate, typeof twoyearsexp, typeof today); 
      const parsedDate = parseTableDate(date);
  
      if (parsedDate = twoyearsexp) {
          foundRecent = true; 
          console.log ('Membership ID:' + userEmail + ' expires on ' + compExpDate );
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