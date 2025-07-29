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
    we need page classes as well for each page 

    Multistep Higher Level functions 
    1. -Upload images function 
    2. -Delete Images function (all and one)
    3. -Create book function
    4. Drag and drop function
    5. -create an account function
    6. -change address function 
    7. change password function 
    8. Add tags function (using classes)
    9. -Add child name function 

    ***************************/
    async dragAndDrop(sourceSelector, targetSelector){

        
        //TODO this is causing issues.
        const source = this.page.locator(sourceSelector);
        const target = this.page.locator(targetSelector);

        await source.dragTo(target);

        console.log(`Dragged from ${sourceSelector} to ${targetSelector}`);

        //I suppose this is one way to do it. but creating a dynamic function would be better. 
        // perhaps if it passes by reference it would be a better way to do it. 


    }
    async bookPurchase(){

        //todo purchase a book. 
        //this will be a multistep function. 
        //1. go to the book purchase page
        //2. select the book
        //3. click the purchase button
        //4. assert the book has been purchased
        

    }



    async changeAddress(){

        throw new Error('Not Implemented, must be overridden in child class')

        //todo change the address within the account. 
        //this will be a multistep function. 
        //1. go to the address page
        //2. fill in the address
        //3. click the save button
        //4. assert the address has been changed
        
    }

    async createNewAccount() {


        console.log('Creating a new account...');

        // Generate a unique email for each run
        const timestamp = Date.now();
        const sliceTimeStamp = string(timestamp).slice(-4);
        const email = `nathan.b+${timestamp}@artkivebox.com`;
        const password = 'Artkive1!';
        const name = 'Example user';

        // Go to the sign-in page and click 'Create an account'
        await this.page.goto('https://account-qa-automation.heirloomprint.com/signin?redirect=%2Fphotos');
        await this.page.getByRole('link', { name: 'Create an account' }).click();

        // Fill in the registration form
        await this.page.locator('input[name="name"]').click();
        await this.page.locator('input[name="name"]').fill(name);
        await this.page.locator('input[name="email"]').click();
        await this.page.locator('input[name="email"]').fill(email);
        await this.page.locator('input[name="email"]').press('Tab');
        await this.page.locator('input[name="password"]').fill(password);
        await this.page.locator('input[name="password"]').press('Tab');
        await this.page.locator('input[name="password_confirmation"]').fill(password);

        // Submit the form
        await this.page.getByRole('button', { name: 'Sign Up' }).click();

        // Wait for the 'My Photos' heading to appear (indicating success)
        await this.page.getByRole('heading', { name: 'My Photos' }).waitFor({ state: 'visible', timeout: 15000 });

        console.log('Account created successfully', 'email: ', email, 'password: ', password, 'name: ', name);
        
        
        // this may not be needed. 
        // Return the account object
        //this should actually return into a struct
        return {
            email,
            password,
            name
        };
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
            // may need extra logic here. Uncertain if this is even needed. 
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

    async addSaturation(){

        throw new Error('Not Implemented, must be overridden')
    }
    async reduceSaturation(){
        //todo reduce saturation
        throw new Error('Not Implemented, must be overridden')

    }

    async rotateImageLeft(){
        //todo rotate image left
        throw new Error('Not Implemented, must be overridden')

    }
    async rotateImageRight(){

        //todo rotate image right
        throw new Error('Not Implemented, must be overridden')
    }
    async addContrast(){
        //todo add contrast
        throw new Error('Not Implemented, must be overridden')

    }
    async reduceContrast(){
        //todo reduce contrast
        throw new Error('Not Implemented, must be overridden')

    }
    async addBrightness(){

        //todo add brightness
        throw new Error('Not Implemented, must be overridden')
    }
    async reduceBrightness(){

        //todo reduce brightness
        throw new Error('Not Implemented, must be overridden')
    }

    async addTags(){

        //todo add tags
        throw new Error('Not Implemented, must be overridden')
    }
    async deleteTags(){

        //todo delete tags
        throw new Error('Not Implemented, must be overridden')
    }
    
    
}

class MyPhotosPage extends AccountAppTest{
    constructor(page){
        super(page);
        //my photos page specific constructor logic
    }

    async goto() {
        await this.page.goto(this.baseUrl + '/photos');
    }


    async newBookPurchase(){

        await super.createNewBook();
        //Book purchase logic
        

    }

    async uploadImages(){
        await super.uploadImages();
        //todo logic to upload images
    }
    async deleteImagesAll(){

        await super.deleteImagesAll();
        //todo logic to delete all images
    }
    async deleteImagesOne(){

        await super.deleteImagesOne();
        //todo logic to delete one image
    }
    

}

class MyBooksPage extends AccountAppTest{

    async goto() {
        console.log('going to books page')
        await this.page.goto(this.baseUrl + '/books');
    }

}

class MyOrdersPage extends AccountAppTest{

    async goto() {
        console.log('going to orders page')
        await this.page.goto(this.baseUrl + '/orders');
    }

}

class DiyDraftsPage extends AccountAppTest{

    async goto() {
        console.log('going to drafts page')
        await this.page.goto(this.baseUrl + '/drafts');
    }

    //TODO functions to test Drafts Page

}

class AccountDetailsPage extends AccountAppTest{

    /*
     * This needs a special set of logic to ensure the account is still accessible 
     * through wither the creation of a new account
     * or some kind of clean up logic to make sure the account is then deleted after the test is compelete 
     * 
     */

    async goto() {
        console.log('going to account details page')
        await this.page.goto(this.baseUrl + '/account');
    }

    async editName(){
        //TODO 
    }
    async editEmail(){

        //TODO changes the users email 
    }

    async updatePassword(){

        //TODO this must change the password value of the login/test account
    }

}

class AddressPage extends AccountAppTest{

    async goto() {
        console.log('going to address page')
        await this.page.goto(this.baseUrl + '/address');
    }

    async editAddress({
        firstName1 = 'Marge',
        lastName1 = 'Simpson',
        address1 = '1234 Sunset blvd',
        city1 = 'Los Angeles',
        state1 = 'California',
        postalCode1 = '90013',


        firstName2 = 'Ned',
        lastName2 = 'Flanders',
        address2 = '15800 Arminta st.',
        city2 = 'Van Nuys',
        //state2 = 'California',
        postalCode2 = '92647'
    } = {}) {

        
        // Now you can use address1, city, state, postalCode in your function
        await this.page.getByRole('button', { name: 'Edit' }).click();
        console.log('Edit button clicked');

        let currentAddress = await this.page.locator('input[name="shippingAddress1"]').inputValue();
        console.log('The Current Address is: ', currentAddress);

        //first assertion
        expect([address1, address2]).toContain(currentAddress); 

        
       
       if (await this.page.locator('input[name="shippingAddress1"]').inputValue() === address1){

            await this.page.locator('input[name="firstName"]').click();
            await this.page.locator('input[name="firstName"]').fill(firstName2);
            await this.page.locator('input[name="lastName"]').click();
            await this.page.locator('input[name="lastName"]').fill(lastName2);
            await this.page.locator('input[name="shippingAddress1"]').fill(address2);
            await this.page.locator('input[name="shippingCity"]').fill(city2);
            await this.page.getByRole('combobox').nth(1).click();
            await this.page.getByRole('option', { name: state1 }).click();
            await this.page.locator('input[name="shippingPostalCode"]').fill(postalCode2);

            //change the value for the time out below to aid in checking the status of the test.
            //await this.page.waitForTimeout(5000);
            currentAddress = await this.page.locator('input[name="shippingAddress1"]').inputValue();
            await this.page.getByRole('button', { name: 'Save' }).click();
            console.log('The New address is: ', currentAddress);
            await this.page.getByText('Account details successfully').waitFor({ timeout: 5000 });
           
            expect([address2]).toContain(currentAddress);
        }
        else if (await this.page.locator('input[name="shippingAddress1"]').inputValue() === address2){
        
            await this.page.locator('input[name="firstName"]').click();
            await this.page.locator('input[name="firstName"]').fill(firstName1);
            await this.page.locator('input[name="lastName"]').click();
            await this.page.locator('input[name="lastName"]').fill(lastName1);
            await this.page.locator('input[name="shippingAddress1"]').fill(address1);
            await this.page.locator('input[name="shippingCity"]').fill(city1);
            await this.page.getByRole('combobox').nth(1).click();
            await this.page.getByRole('option', { name: state1 }).click();
            await this.page.locator('input[name="shippingPostalCode"]').fill(postalCode1);

            //change the value for the time out below to aid in checking the status of the test.
            //await this.page.waitForTimeout(1000);
            currentAddress = await this.page.locator('input[name="shippingAddress1"]').inputValue();
            await this.page.getByRole('button', { name: 'Save' }).click();
            console.log('The New address is: ', currentAddress);
            await this.page.getByText('Account details successfully').waitFor({ timeout: 5000 });
            
            expect([address1]).toContain(currentAddress);
        }else{
            console.log('Bad address')
            throw new Error('Address not found');
        }
    }
    async setAddress(){
        //TODO for blue edit test
        //this needs a while condition to ensure there is no address on the page. 
    }
    async changeAddress({
        firstName1 = 'Ralph',
        lastName1 = 'Wiggum',
        address1 = '1234 Sunset blvd',
        city1 = 'Los Angeles',
        state1 = 'California',
        postalCode1 = '90013',


        firstName2 = 'Homer',
        lastName2 = 'Simpson',
        address2 = '15800 Arminta st.',
        city2 = 'Van Nuys',
        //state2 = 'California',
        postalCode2 = '92647'
    } = {}) {

        // Now you can use address1, city, state, postalCode in your function
        
        await this.page.getByRole('button', { name: 'Change Address' }).click();
        console.log('Changed Address button clicked');


        let currentAddress = await this.page.locator('input[name="shippingAddress1"]').inputValue();
        console.log('The Current Address is: ', currentAddress);

        //first assertion
        expect([address1, address2]).toContain(currentAddress);

        if (await this.page.locator('input[name="shippingAddress1"]').inputValue() === address1){
           
            await this.page.locator('input[name="firstName"]').fill(firstName2);  
            await this.page.locator('input[name="lastName"]').fill(lastName2);
            await this.page.locator('input[name="shippingAddress1"]').fill(address2);
            await this.page.locator('input[name="shippingCity"]').fill(city2);
            await this.page.getByRole('combobox').nth(1).click();
            await this.page.getByRole('option', { name: state1 }).click();
            await this.page.locator('input[name="shippingPostalCode"]').fill(postalCode2);
            
            //change the value for the time out below to aid in checking the status of the test.
            //await this.page.waitForTimeout(5000);
            currentAddress = await this.page.locator('input[name="shippingAddress1"]').inputValue();
            console.log('The New address is: ', currentAddress);
            await this.page.getByRole('button', { name: 'Save' }).click();
            await this.page.getByText('Account details successfully').waitFor({ timeout: 5000 });
           
            expect([address2]).toContain(currentAddress);
        }
        else if (await this.page.locator('input[name="shippingAddress1"]').inputValue() === address2){
        
            await this.page.locator('input[name="firstName"]').fill(firstName1);
            await this.page.locator('input[name="lastName"]').fill(lastName1);
            await this.page.locator('input[name="shippingAddress1"]').fill(address1);
            await this.page.locator('input[name="shippingCity"]').fill(city1);
            await this.page.getByRole('combobox').nth(1).click();
            await this.page.getByRole('option', { name: state1 }).click();
            await this.page.locator('input[name="shippingPostalCode"]').fill(postalCode1);

            //change the value for the time out below to aid in checking the status of the test.
            //await this.page.waitForTimeout(5000);
            currentAddress = await this.page.locator('input[name="shippingAddress1"]').inputValue();
            console.log('The New address is: ', currentAddress);
            await this.page.getByRole('button', { name: 'Save' }).click();
            await this.page.getByText('Account details successfully').waitFor({ timeout: 5000 });
            
            expect([address1]).toContain(currentAddress);
        }else{

            console.log('Bad address')
            throw new Error('Address not found');
        }
    }

}

class NamePage extends AccountAppTest{


    async goto(){

        console.log('going to name page')
        await this.page.goto(this.baseUrl + '/labels/names');
    }
    
    async addName({
        childName = 'New Name Tag '
    } = {}) {
        console.log('Adding child name:', childName);

        const timestamp = Date.now();
        const uniqueNumber = timestamp.toString().slice(-4)

        const uniqueChildName = `${childName} ${uniqueNumber}`;
        console.log(`Using Unique child name: ${uniqueChildName}`);
        
        // Get today's date
        const today = new Date();
        const currentMonth = (today.getMonth() + 1).toString(); // getMonth() returns 0-11, so add 1
        const currentDay = today.getDate().toString();
        
        console.log(`Using today's date: ${currentMonth}/${currentDay}`);
        
        // Click the "Add New" button
        await this.page.waitForTimeout(5000);
        await this.page.getByRole('button', { name: 'Add New' }).waitFor({ state: 'visible' });
        await this.page.getByRole('button', { name: 'Add New' }).click();

        await this.page.waitForTimeout(3000);
        
        // Fill in the child's name
        await this.page.locator('input[name="name"]').click();
        await this.page.locator('input[name="name"]').fill(uniqueChildName);
        
        // Click on the date field
        await this.page.getByRole('textbox', { name: 'MM-DD-YYYY' }).click();
        await this.page.getByRole('textbox', { name: 'MM-DD-YYYY' }).fill(currentMonth);
        
        // Click on the month button (first button in the row)
        await this.page.getByRole('row', { name: childName }).getByRole('button').first().click();
        
        // Click on today's day
        await this.page.getByRole('gridcell', { name: currentDay }).click();
        
        // Click on the year button (second button in the row)
       // await this.page.getByRole('row', { name: `${childName} ${currentMonth.padStart(2, '0')}-${currentDay.padStart(2, '0')}-` }).getByRole('button').nth(1).click();
        
        // Final click on the date field to confirm
        await this.page.getByText(`${currentMonth.padStart(2, '0')}-${currentDay.padStart(2, '0')}-`).click();


        //save the name 

        await this.page.getByRole('row', { name: 'label edit' }).getByRole('button').nth(1).click();
    



        
        console.log('✅ Child name added successfully with today\'s date');
    }
    async addThreeNames(){

      for (let i = 0; i < 3; i++){
        await this.addName();
        console.log(`Added child name ${i + 1}`);
        await this.page.waitForTimeout(1000);


      }
      console.log('✅ Three child names added successfully');
      
    }
    
    async removeName(){

        //TODO Function to delete a child 
        const firstChildCell = await this.page.getByRole('cell', { name: '' }).first();
        const childName =   await firstChildCell.textContent();

        console.log('Child name to remove:', childName);
        
        console.log('Removing a Child 💀');

        await this.page.getByRole('row', {name: childName}).getByRole('button').nth(1).click();

       // await this.page.getByRole('button', { name: 'Delete' }).click();

        console.log(`Child name : ${childName} has been removed`);


        
    }


    async removeAllNames(){

        //TODO
        console.log('Removing all children 💀💀💀');
    }
    
    async editName(){

        //TODO edit a child name 
    }

}

class AgeGradePage extends AccountAppTest{

    async goto(){
        console.log('going to age grade page')
        await this.page.goto(this.baseUrl + '/labels/age-grade');
    }

    async addAgeGrade(){
        //TODO adds an age grade Tag

        await this.page.getByRole('button', { name: 'Add New' }).click();
        
        await this.page.getByRole('textbox', { name: 'Age/Grade' }).fill('1');
        
        await this.page.getByRole('button', { name: 'Save' }).click();

    
        
        
    }
    async removeAgeGrade(){
        //TODO removes an age grade tag

    }
    async editAgeGrade(){
        //TODO edits an age grade tag

    }

}   

class TagsPage extends AccountAppTest{

    async goto(){
        console.log('going to tags page')
        await this.page.goto(this.baseUrl + '/labels/tags');
    }


    async addTag(){
        //TODO add tag

    }
    async removeTag(){
        //TODO remove tag
    }
    async editTag(){
        //TODO edit tag 
    }
}



    //figure out how to create specific overrides and virtual functions etc.
class BookBuilder extends MyBooksPage{
    constructor(page){
        super(page);
        // book specific constructor logic
    }

    async removeBookPages(){

        //todo logic to remove a book page

    }
    async addBookPages(){   //todo add new pages to the book. 
        //this will be a multistep function. 
        //1. go to the book page
        //2. click the add pages button
        //3. select the pages
        //4. click the save button
        //5. assert the pages have been added
    }
    async addBookPagesEMPTYBOOK(){

    
    }
    
}

class BBImageEditor extends BookBuilder{
    constructor(page){
        super(page);
        //book builder editor specific constructor logic 
    }
    async replaceImage(){


    }
    async addSaturation(){

        //todo add saturation   
    }
    async reduceSaturation(){
        //todo reduce saturation

    }
    
    async rotateImageLeft(){
        //todo rotate image left

    }
    async rotateImageRight(){

        //todo rotate image right
    }
    async addContrast(){
        //todo add contrast

    }
    async reduceContrast(){
        //todo reduce contrast

    }
    async addBrightness(){

        //todo add brightness
    }
    async reduceBrightness(){

        //todo reduce brightness
    }
    
}


//figure out how to create specific overrides and virtual functions etc.
class ImageEditor extends AccountAppTest{
    constructor(page){
        super(page);
        //image editor specific constructor logic 
    }
    async addSaturation(){

        //todo add saturation   
    }
    async reduceSaturation(){
        //todo reduce saturation

    }
    
    async rotateImageLeft(){
        //todo rotate image left

    }
    async rotateImageRight(){

        //todo rotate image right
    }
    async addContrast(){
        //todo add contrast

    }
    async reduceContrast(){
        //todo reduce contrast

    }
    async addBrightness(){

        //todo add brightness
    }
    async reduceBrightness(){

        //todo reduce brightness
    }

}



// Basic test to verify login works


//Status: Working 
test('Account App - Login Test', async ({ page }) => {
    const accountApp = new AccountAppTest(page);
    await accountApp.login();
    
    // We'll add more assertions here once we see the post-login page
    console.log('✅ Login test completed');
});
//Status: Working 


//this test 
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
});

//needs to be debugged. 
test('Upload Images', async ({page} ) => {
    test.setTimeout(300000); //5 min time out
    const accountApp = new AccountAppTest(page);
    await accountApp.login();
    //await accountApp.deleteImagesAll();
    await accountApp.page.waitForTimeout(5000);
    await accountApp.uploadImages();
}); 
test ('Create a new account', async ({page}) => {

    const accountApp = new AccountAppTest(page);
    await accountApp.createNewAccount();

});

//Status: broken
test('Drag and drop image in My Books', async ({ page }) => {
    const myBook = new BookBuilder(page);
    await myBook.login(); // or use AccountAppTest if login is there

    // Optionally, ensure there are at least 3 images
    const imageCount = await page.locator('.image-thumb').count();
    expect(imageCount).toBeGreaterThanOrEqual(3);

    // Drag the first image to the third position
    await myPhotos.dragTo('.image-thumb:nth-child(1)', '.image-thumb:nth-child(3)');

    // Optionally, add an assertion to verify the order changed
    // For example, check the src or alt of the images after drag
    // const firstImageSrc = await page.locator('.image-thumb').nth(0).getAttribute('src');
    // expect(firstImageSrc).toBe('expected-src-after-drag');
});
//Status: working Success!
test('Edit Address', async ({ page }) => {

    //this command creates a new address page object 
    const addressPage = new AddressPage(page);
    await addressPage.login();
    //await addressPage.page.waitForTimeout(5000);
    await addressPage.goto();
    //await addressPage.page.waitForTimeout(3000);
    await addressPage.editAddress();
    //await addressPage.page.waitForTimeout(5000);
});


test('Add Child Name', async ({page}) => {

    
    const namePage = new NamePage(page);
    await namePage.login();

    await namePage.page.waitForTimeout(5000);

    await namePage.goto();

   // await namePage.addName();
    await namePage.addThreeNames();

    await namePage.page.waitForTimeout(4000);

    //await namePage.removeName();
    //await namePage.page.waitForTimeout(3000);

});

test('Add Age Grade', async ({page}) => {

    const ageGradePage = new AgeGradePage(page);
    await ageGradePage.login();

    await ageGradePage.goto();

    await ageGradePage.addAgeGrade();
    //call a function within age grade page to do stuff. 

});

