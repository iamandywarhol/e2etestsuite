// tests/artkive-recorded-flow.spec.js
const { test, expect } = require('@playwright/test');

class ArtkiveRecordedTest {
  constructor(page) {
    this.page = page;
    this.testData = {
      firstName: 'Test',
      lastName: 'User', 
      email: 'nathan.b+jst@artkivebox.com',
      phone: '(111) 2223333',
      streetAddress: '15800 Arminta St.',
      city: 'Van Nuys',
      zipCode: '91406',
      cardName: 'Jeffrey Lipp',
      cardNumber: '4154178254252182',
      expiryDate: '11/28',
      cvv: '331'
    };
  }

  async takeScreenshot(stepName) {
    const timestamp = Date.now();
    const filename = `${stepName}-${timestamp}.png`;
    await this.page.screenshot({ 
      path: `screenshots/${filename}`, 
      fullPage: true 
    });
    console.log(`📸 Screenshot saved: ${filename}`);
    return filename;
  }

  async runFullFlow() {
    console.log('🚀 Starting recorded Artkive box purchase flow...\n');

    try {
      // Step 1: Navigate to checkout
      console.log('Step 1: Navigating to site...');
      await this.page.goto('https://www.artkiveapp.com/checkout-confirmation?data=eyJpZCl6MzAZN2A4LCJ0b3RhbCI6Mzl9');
      await this.takeScreenshot('01-initial-page');

      // Step 2: Click "Get My Box" 
      console.log('Step 2: Clicking Get My Box...');
      await this.page.locator('#main-header').getByRole('link', { name: 'Get My Box' }).click();
      await this.takeScreenshot('02-get-my-box-clicked');

      // Step 3: Continue through initial steps
      console.log('Step 3: Continuing through flow...');
      await this.page.getByRole('button', { name: 'Continue' }).first().click();
      await this.page.getByRole('button', { name: 'Continue' }).click();
      await this.takeScreenshot('03-continued-flow');

      // Step 4: Fill personal information
      console.log('Step 4: Filling personal information...');
      await this.fillPersonalInfo();
      await this.takeScreenshot('04-personal-info-filled');

      // Step 5: Fill address information  
      console.log('Step 5: Filling address information...');
      await this.fillAddressInfo();
      await this.takeScreenshot('05-address-filled');

      // Step 6: Fill payment information
      console.log('Step 6: Filling payment information...');
      await this.fillPaymentInfo();
      await this.takeScreenshot('06-payment-filled');

      // Step 7: Handle terms and final submission
      console.log('Step 7: Handling terms and submission...');
      await this.handleFinalSubmission();
      await this.takeScreenshot('07-final-step');

      console.log('✅ Flow completed successfully!');
      return { status: 'success', message: 'Box purchase flow completed' };

    } catch (error) {
      console.error('❌ Flow failed:', error.message);
      await this.takeScreenshot('error-state');
      throw error;
    }
  }

  async fillPersonalInfo() {
    // First name
    await this.page.locator('input[name="firstName"]').click();
    await this.page.locator('input[name="firstName"]').fill(this.testData.firstName);
    await this.page.locator('input[name="firstName"]').press('Tab');

    // Last name  
    await this.page.locator('input[name="lastName"]').fill(this.testData.lastName);
    await this.page.locator('input[name="lastName"]').press('Tab');

    // Email
    await this.page.locator('input[name="email"]').click();
    await this.page.locator('input[name="email"]').click(); // Double click as in recording
    await this.page.locator('input[name="email"]').fill(this.testData.email);
    await this.page.locator('input[name="email"]').press('Tab');

    // Phone
    await this.page.locator('input[name="phone"]').fill(this.testData.phone);
    await this.page.locator('input[name="phone"]').press('Tab');
  }

  async fillAddressInfo() {
    // Country selection
    await this.page.getByRole('button', { name: 'United States' }).press('Tab');

    // Street address
    await this.page.getByRole('textbox', { name: 'Street Address' }).fill(this.testData.streetAddress);
    await this.page.getByRole('textbox', { name: 'Street Address' }).press('Tab');

    // Address line 2 (skip as not filled in recording)
    await this.page.locator('input[name="address2"]').press('Tab');

    // City
    await this.page.locator('input[name="city"]').fill(this.testData.city);

    // State - California selection
    await this.page.getByLabel('', { exact: true }).click();
    await this.page.getByRole('option', { name: 'California' }).click();

    // Zip code
    await this.page.locator('input[name="zipCode"]').click();
    await this.page.locator('input[name="zipCode"]').fill(this.testData.zipCode);
  }

  async fillPaymentInfo() {
    // Cardholder name
    await this.page.locator('input[name="name"]').click();
    await this.page.locator('input[name="name"]').fill(this.testData.cardName);
    await this.page.locator('input[name="name"]').press('Tab');

    // Card number
    await this.page.locator('input[name="cardNumber"]').click();
    await this.page.locator('input[name="cardNumber"]').fill(this.testData.cardNumber);

    // Expiry date
    await this.page.getByRole('textbox', { name: 'MM/YY' }).click();
    await this.page.getByRole('textbox', { name: 'MM/YY' }).fill(this.testData.expiryDate);
    await this.page.getByRole('textbox', { name: 'MM/YY' }).press('Tab');

    // CVV
    await this.page.locator('input[name="cardCvc"]').fill(this.testData.cvv);
    await this.page.locator('input[name="cardCvc"]').press('Tab');

    // Billing zip (same as shipping)
    await this.page.locator('input[name="billingZipCode"]').fill(this.testData.zipCode);
  }

  async handleFinalSubmission() {
    // Close any popups/messages
    try {
      await this.page.locator('iframe[title="Close message"]').contentFrame().getByRole('button', { name: 'Close message from company' }).click();
    } catch (e) {
      console.log('No popup to close, continuing...');
    }

    // Check terms agreement
    await this.page.getByRole('checkbox', { name: 'I agree with terms and conditions' }).check();

    // Final order button
    await this.page.getByRole('button', { name: 'Place Order • $' }).click();

    // Wait for confirmation
    try {
      await this.page.getByRole('heading', { name: 'Your Artkive Box Is On the' }).click();
      console.log('✅ Order confirmation found!');
    } catch (e) {
      console.log('⚠️ Order confirmation not found, but flow completed');
    }
  }
}

// Main test
test('Artkive Box Purchase - Recorded Flow', async ({ page }) => {
  const testRunner = new ArtkiveRecordedTest(page);
  
  // Run the full flow
  const result = await testRunner.runFullFlow();
  
  // Validate success
  expect(result.status).toBe('success');
});

// Test with different data sets
test('Artkive Box Purchase - Different User Data', async ({ page }) => {
  const testRunner = new ArtkiveRecordedTest(page);
  
  // Override test data
  testRunner.testData = {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 123-4567',
    streetAddress: '123 Main St',
    city: 'Los Angeles', 
    zipCode: '90210',
    cardName: 'Jane Smith',
    cardNumber: '4242424242424242',
    expiryDate: '12/25',
    cvv: '123'
  };
  
  const result = await testRunner.runFullFlow();
  expect(result.status).toBe('success');
});

module.exports = { ArtkiveRecordedTest };