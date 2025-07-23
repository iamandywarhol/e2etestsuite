import { test, expect } from "@playwright/test";
import path from 'path';
import fs from 'fs';

// Read test data from JSON file
const testData = JSON.parse(fs.readFileSync(__dirname + '/account-bookbuilder.data.json', 'utf-8'));

// Base class for Account App testing
class AccountAppTest {
    constructor(page) {
        this.page = page;
        this.baseUrl = 'https://account-qa-automation.heirloomprint.com/';
    }


    /************************* 

    List of needed functions 
    
    Questions: Determine what low level functions are needed

    Assertions should probably be made within the test versus within the function. 

    Lower level functions 

    Multistep Higher Level functions 
    1. Upload images function 
    2. Delete Images function (all and one)
    3. Create book function
    4. Drag and drop function
    5. create an account function
    6. change address function 
    7. change password function 
    8. Add tags function
    9.



    ***************************/
    async dragAndDrop(sourceSelector, targetSelector){

        
        //TODO create a function that will drag and drop the images to a new order. 
        const source = this.page.locator(sourceSelector);
        const target = this.page.locator(targetSelector);

        await source.dragTo(target);

        console.log('image id: ', source.id, 'dropped to: ', target.id);

        //I suppose this is one way to do it. but creating a dynamic function would be better. 
        // perhaps if it passes by reference it would be a better way to do it. 


    }

    async createNewAccount(){

        //todo create a new account function. 
        //this will create a new account with a new email and password. 
        //it will then login to the account and return the account object. 
        //the account object will have the email and password. 
        //the account object will have the account id. 
        //the account object will have the account name. 
        
    }


    
    async dateAndTime(){

        //get the current date and time
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        return `${formattedDate} ${formattedTime}`;
    }
    
    async deleteImagesAll(){
        //TODO selects all images and clicks the delete button 
        await this.selectAllImages();
        
        await this.page.waitForTimeout(4000);

        const removeButton = this.page.getByRole('button', { name: 'Remove' });
        await removeButton.waitFor({ state: 'visible'});

        await this.page.waitForTimeout(2000);
        await removeButton.click();
        await this.page.waitForTimeout(2000);
        // Confirm deletion
        const confirmButton = this.page.getByRole('button', { name: 'Yes, Delete' });
        await confirmButton.waitFor({ state: 'visible' });
        await confirmButton.click();

        console.log('All Images Deleted');

    }

    async deleteImagesOne() {
        // Click the menu (three dots or similar) for the first image
        // Adjust selector as needed if the structure changes
        const menuButton = this.page.locator('.e186ktwn4 > svg').first();
        await menuButton.waitFor({ state: 'visible' });
        await menuButton.click();

        // Click the Remove button
        const removeButton = this.page.getByRole('button', { name: 'Remove' });
        await removeButton.waitFor({ state: 'visible' });
        await removeButton.click();

        // Confirm deletion
        const confirmButton = this.page.getByRole('button', { name: 'Yes, Delete' });
        await confirmButton.waitFor({ state: 'visible' });
        await confirmButton.click();

        // Optionally, wait for the image to disappear or a success message
        // await this.page.waitForSelector('selector-for-image', { state: 'detached' });
        console.log('One image deleted');
    }
    // Takes a screenshot of the current page
    async takeScreenshot(stepName) {
        const timestamp = Date.now();
        const filename = `${stepName}-${timestamp}.png`;
        await this.page.screenshot({ 
            path: `screenshots/account/${filename}`, 
            fullPage: true 
        });
        console.log(`📸 Screenshot saved: ${filename}`);
        return filename;
    }

    // Login function - reads credentials from JSON file
    async login() {
        console.log('🔐 Logging into account app...');
        
        // Navigate to login page with redirect to photos
        await this.page.goto('https://account-qa-automation.heirloomprint.com/signin?redirect=%2Fphotos');
        
        // Fill email
        await this.page.locator('input[name="email"]').click();
        await this.page.locator('input[name="email"]').fill(testData.login.email);
        await this.page.locator('input[name="email"]').press('Tab');
        
        // Fill password
        await this.page.locator('input[name="password"]').fill(testData.login.password);
        //await this.page.locator('input[name="password"]').press('Enter');
        
        // Click Sign In button
        await this.page.getByRole('button', { name: 'Sign In' }).click();
        
        // Wait for successful login
        await this.page.waitForLoadState('networkidle');
        await this.takeScreenshot('01-login-success');
        
        console.log('✅ Login successful');
    }


    async uploadImages() {
        console.log('Uploading images...');
        

        // 1. Get all image file paths from the SourceUploadImages folder
        const imagesDir = path.join(__dirname, 'SourceUploadImages');
        const imageFiles = fs.readdirSync(imagesDir)
            .filter(file => /\.(png|jpe?g|gif)$/i.test(file))
            .map(file => path.join(imagesDir, file));

        if (imageFiles.length === 0) {
            throw new Error('No images found in SourceUploadImages folder.');
        }

        // 2. Set files directly on the file input (no need to click Browse Files or use filechooser)
        const fileInput = await this.page.locator('input[type="file"]');
        await fileInput.setInputFiles(imageFiles);

        // 3. Optionally, skip any modal/step
        try {
            const skipButton = this.page.getByText('Skip this Step', { timeout: 3000 });
            if (await skipButton.isVisible()) {
                await skipButton.click();
            }
        } catch (e) {
            // If not present, continue
        }

        // 4. Poll for upload progress
        const maxWaitMs = 300000; // 5 minutes
        const pollIntervalMs = 5000;
        const start = Date.now();
        let uploadedCount = 0;
        while (Date.now() - start < maxWaitMs) {
            try {
                // Get the number of images uploaded from the modal
                const uploadedText = await this.page.getByText(/\d+ Images/, { exact: false, timeout: 2000 }).textContent();
                uploadedCount = parseInt(uploadedText.match(/(\d+) Images/)[1], 10);
                console.log(`Images uploaded so far (modal): ${uploadedCount}`);
                if (uploadedCount === imageFiles.length) {
                    break;
                }
            } catch (e) {
                // If not found, keep polling
                console.log('Waiting for upload progress...');
            }
            await this.page.waitForTimeout(pollIntervalMs);
        }
        if (uploadedCount !== imageFiles.length) {
            throw new Error(`❌ Upload did not complete in time: modal=${uploadedCount}, files=${imageFiles.length}`);
        }

        // 5. Get the number of images displayed on the page
        // Adjust selector as needed for your app
        // const imagesOnPage = await this.page.locator('img[alt^="Artwork"], .MuiBox-root img').count();
        //console.log(`Images displayed on page: ${imagesOnPage}`);

        // 6. Assert both counts match the number of files uploaded
        const imagesOnPage = await this.page.locator('p.MuiTypography-root.MuiTypography-body2.css-1ms8nty').textContent();
        if (imagesOnPage === imageFiles.length) {
            console.log('✅ All images uploaded and displayed successfully!');
        } else {
            throw new Error(`❌ Upload failed: modal=${uploadedCount}, page=${imagesOnPage}, files=${imageFiles.length}`);
        }
    }


    async selectAllImages(){
        const checkbox = this.page.getByRole('checkbox', { name: 'Select Visible' });
        await checkbox.waitFor({ state: 'visible' });
        await checkbox.click();
    }



    //create a new book
    //selects all the images in the My Photos tab to create a book. 
    async createNewBook(){
        console.log('Creating a new book...');
        
        await this.selectAllImages();

        // Corrected selector
        const newBookButton = this.page.getByRole('button', { name: 'Create Book' });
        await newBookButton.waitFor({ state: 'visible' });
        await newBookButton.click();

        // Continue with the rest of the flow, using selectors from the working script
        await this.page.locator('div').filter({ hasText: /^11in x 8\.5in Book$/ }).getByRole('img').first().click();
        await this.page.getByRole('button', { name: 'Next' }).click();
        //await page.locator('.css-q7lffx').first().click();
        //await this.page.locator('.selectable.css-1n431dg').first().click();

        await this.page.locator('.css-q7lffx').first().click();
        await this.page.getByRole('button', { name: 'Next' }).click();
        await this.page.waitForTimeout(1000);
        
    

        //Fill in the book title
        const bookTitle = this.page.getByRole('textbox', { name: 'BOOK TITLE' });
        await this.page.waitForTimeout(1000);
        await bookTitle.waitFor({ state: 'visible' });
        await bookTitle.click();

        const dateAndTime = await this.dateAndTime();
        await bookTitle.fill(`My new book ${dateAndTime}`);



        //go to the next page 
        await this.page.getByRole('button', { name: 'Next' }).click();
        await this.page.waitForTimeout(1000);

        //generate book
        await this.page.getByRole('button', { name: 'Generate Book' }).click();
        await this.page.waitForTimeout(5000);

        // ...continue as needed
        //need verifiable assertions here.
    }
}

// Basic test to verify login works
/*
//Status: Working 
test('Account App - Login Test', async ({ page }) => {
    const accountApp = new AccountAppTest(page);
    await accountApp.login();
    
    // We'll add more assertions here once we see the post-login page
    console.log('✅ Login test completed');
});
//Status: Working 
test('Navigate tabs', async ({ page }) => {
    const accountApp = new AccountAppTest(page);
    await accountApp.login();

    //add either screen shots or test assertions for each tab
    await page.getByRole('link', { name: 'My Photos' }).click();
    await page.getByRole('link', { name: 'My Books' }).click();
    await page.getByRole('link', { name: 'My Orders' }).click();
    await page.getByRole('link', { name: 'Account Details' }).click();
    await page.getByRole('link', { name: 'Address' }).click();
    await page.getByRole('link', { name: 'Name' }).click();
    await page.getByRole('link', { name: 'Age/Grade' }).click();
    await page.getByRole('link', { name: 'Tags' }).click();
    await page.getByRole('link', { name: 'My Photos' }).click();
});
//Status: Working 
test('Create a new book', async ({ page }) => {
    const accountApp = new AccountAppTest(page);
    await accountApp.login();

    await accountApp.createNewBook();
});


//Status: Working 
test('Delete an image', async ({ page }) => {
    const accountApp = new AccountAppTest(page);
    await accountApp.login();
    await accountApp.deleteImagesOne();


});

//Status: Working 
test('Delete all images', async ({ page }) => {
    const accountApp = new AccountAppTest(page);
    await accountApp.login();
    await accountApp.deleteImagesAll();
});*/
test('Upload Images', async ({page} ) => {
    test.setTimeout(300000); //5 min time out
    const accountApp = new AccountAppTest(page);
    await accountApp.login();
    //await accountApp.deleteImagesAll();
    await accountApp.page.waitForTimeout(5000);
    await accountApp.uploadImages();
}); 

