// tests/artkive-dev-recorded-flow.spec.js
//validated ready to ship 7/7/25 DO NOT ALTER THIS CODE
const { test, expect } = require('@playwright/test');

class ArtkiveDevRecordedTest {
  constructor(page) {
    this.page = page;
    this.testData = {
      firstName: 'nathan',
      lastName: 'brookes', 
      email: 'nathan.b+jst@artkivebox.com',
      phone: '(111) 222-3333',
      streetAddress: '15800 Arminta st.',
      city: 'Van nuys',
      zipCode: '91406',
      cardName: 'test user',
      cardNumber: '4242 4242 4242 4242',
      expiryDate: '11/29',
      cvv: '331'
    };
    this.cardAttemptLog = [];
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
    console.log('🚀 Starting dev environment Artkive box purchase flow...\n');

    try {
      // Step 1: Navigate to dev site
      console.log('Step 1: Navigating to dev site...');
      await this.page.goto('https://apple-pay-qa.heirloomprint.com/');
      await this.takeScreenshot('01-dev-initial-page');

      // Step 2: Click "Get My Box" 
      console.log('Step 2: Clicking Get My Box...');
      await this.page.locator('#main-header').getByRole('link', { name: 'Get My Box' }).click();
      await this.takeScreenshot('02-dev-get-my-box-clicked');

      // Step 3: Continue through initial steps
      console.log('Step 3: Continuing through flow...');
      await this.page.getByRole('button', { name: 'Continue' }).first().click();
      await this.takeScreenshot('03-dev-continued-flow');

      // Step 4: Scroll down (simulating the arrow key presses)
      console.log('Step 4: Scrolling down...');
      for (let i = 0; i < 19; i++) {
        await this.page.locator('body').press('ArrowDown');
      }
      await this.takeScreenshot('04-dev-scrolled-down');

      // Step 5: Continue to form
      console.log('Step 5: Continuing to form...');
      await this.page.getByRole('button', { name: 'Continue' }).click();
      await this.takeScreenshot('05-dev-form-page');

      // Step 6: Fill personal information
      console.log('Step 6: Filling personal information...');
      await this.fillPersonalInfo();
      await this.takeScreenshot('06-dev-personal-info-filled');

      // Step 7: Fill address information  
      console.log('Step 7: Filling address information...');
      await this.fillAddressInfo();
      await this.takeScreenshot('07-dev-address-filled');

      // Step 8: Check for confirmation before payment
      console.log('Step 8: Checking for confirmation before payment...');
      const confirmationHeading = this.page.getByRole('heading', { name: 'Your Artkive Box is On the way!' });
      let confirmationReached = false;
      try {
        if (await confirmationHeading.isVisible({ timeout: 3000 })) {
          console.log('🎉 Payment success! Confirmation detected before payment step.');
          confirmationReached = true;
        }
      } catch (e) {
        // Not visible, continue to payment
      }

      // Step 9: Fill payment information and submit order if needed
      if (!confirmationReached) {
        console.log('Step 9: Filling payment information...');
        confirmationReached = await this.fillPaymentInfoAndSubmit();
      }

      // Step 10: Check for confirmation after payment
      console.log('Step 10: Checking for confirmation after payment...');
      try {
        // Use a more flexible selector: any heading containing the confirmation text
        const headings = await this.page.locator('h1, h2, h3, h4, h5, h6');
        const count = await headings.count();
        let found = false;
        for (let i = 0; i < count; i++) {
          const text = await headings.nth(i).innerText();
          if (text.includes('Artkive Box is On the way')) {
            found = true;
            break;
          }
        }
        if (found) {
          console.log('✅ Payment and confirmation successful! (heading contains confirmation text)');
          return { status: 'success', message: 'Dev box purchase flow completed', cardAttempts: this.cardAttemptLog };
        } else {
          throw new Error('Confirmation not detected after payment (no heading contains expected text).');
        }
      } catch (e) {
        console.error('❌ Confirmation not found after payment:', e.message);
        await this.takeScreenshot('confirmation-not-found');
        // Log the page content for debugging
        const content = await this.page.content();
        console.error('Page HTML at failure:', content);
        return { status: 'failed', message: 'Confirmation not found after payment', cardAttempts: this.cardAttemptLog };
      }

      // Step 11: Handle terms and final submission (only if not already confirmed)
      console.log('Step 11: Handling terms and submission...');
      await this.handleFinalSubmission();
      await this.takeScreenshot('11-dev-final-step');

      console.log('✅ Dev flow completed successfully!');
      return { status: 'success', message: 'Dev box purchase flow completed', cardAttempts: this.cardAttemptLog };

    } catch (error) {
      console.error('❌ Dev flow failed:', error.message);
      await this.takeScreenshot('dev-error-state');
      return { status: 'failed', message: error.message, cardAttempts: this.cardAttemptLog };
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
    await this.page.locator('input[name="email"]').fill(this.testData.email);
    await this.page.locator('input[name="email"]').press('Tab');

    // Phone
    await this.page.locator('input[name="phone"]').fill(this.testData.phone);
  }

  async fillAddressInfo() {
    // Street address
    await this.page.getByRole('textbox', { name: 'Street Address' }).click();
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
    await this.page.locator('input[name="zipCode"]').press('Tab');
  }

  async fillPaymentInfoAndSubmit() {
    // Check if confirmation is already present before proceeding
    const confirmationHeading = this.page.getByRole('heading', { name: 'Your Artkive Box is On the way!' });
    try {
      if (await confirmationHeading.isVisible({ timeout: 2000 })) {
        this.cardAttemptLog.push('Confirmation page already present, skipping payment.');
        return true;
      }
    } catch (e) {
      // Not visible, continue as normal
    }

    // Fill cardholder name (still in the top document)
    await this.page.locator('input[name="name"]').fill(this.testData.cardName);
    await this.page.locator('input[name="name"]').press('Tab');

    // Test cards to try (different cards for different scenarios)
    const testCards = [
      { number: '4242424242424242', description: 'Visa (success)' },
      { number: '4000000000000002', description: 'Visa (declined)' },
      { number: '5555555555554444', description: 'Mastercard (success)' },
      { number: '378282246310005', description: 'Amex (success)' },
      { number: '6011111111111117', description: 'Discover (success)' },
      { number: '4000002500003155', description: 'Visa (insufficient funds)' }
    ];

    for (const card of testCards) {
      console.log(`🔄 Trying card: ${card.description} (${card.number})`);
      
      try {
        // Clear and fill card number
        const cardField = this.page.locator('input[name="cardNumber"]');
        await cardField.click();
        await cardField.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
        await cardField.fill(card.number);
        await cardField.press('Tab');
        
        // Clear and fill expiry field
        const expiryField = this.page.locator('input[name="expiry"], input[name="exp-date"], input[placeholder*="MM/YY"]');
        if (await expiryField.isVisible({ timeout: 2000 })) {
          await expiryField.click();
          await expiryField.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
          await expiryField.fill('11/29');
          await expiryField.press('Tab');
        }

        // Clear and fill CVC field
        const cvcField = this.page.locator('input[name="cvc"], input[name="cvv"], input[name="cardCvc"]');
        if (await cvcField.isVisible({ timeout: 2000 })) {
          await cvcField.click();
          await cvcField.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
          await cvcField.fill('331');
          await cvcField.press('Tab');
        }

        // Clear and fill zip field
        const zipField = this.page.locator('input[name="postal"], input[name="zip"], input[name="billingZipCode"]');
        if (await zipField.isVisible({ timeout: 2000 })) {
          await zipField.click();
          await zipField.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
          await zipField.fill('91406');
        }

        this.cardAttemptLog.push(`Card ${card.number} filled successfully.`);

        // Check terms of service checkbox if present
        const tosCheckbox = this.page.getByRole('checkbox', { name: /terms of use/i });
        if (await tosCheckbox.isVisible({ timeout: 2000 })) {
          if (!(await tosCheckbox.isChecked())) {
            await tosCheckbox.check();
          }
        }

        // Click place order button
        const placeOrderButton = this.page.getByRole('button', { name: /place order/i });
        if (await placeOrderButton.isVisible({ timeout: 5000 })) {
          await placeOrderButton.click();
          this.cardAttemptLog.push('Place order button clicked.');
        } else {
          throw new Error('Place order button not found.');
        }

        // Wait a moment for any response
        await this.page.waitForTimeout(3000);

        // Check for success (confirmation page)
        const successHeading = this.page.getByRole('heading', { name: /Artkive Box is On the way/i });
        if (await successHeading.isVisible({ timeout: 5000 })) {
          this.cardAttemptLog.push(`✅ Payment successful with card ${card.number}! Confirmation detected.`);
          return true;
        }

        // Check for decline message
        const declineSelectors = [
          'text=card has been declined',
          'text=declined',
          'text=insufficient funds',
          'text=payment failed',
          '[data-testid*="error"]',
          '.error',
          '.alert-error'
        ];

        let declineFound = false;
        for (const selector of declineSelectors) {
          try {
            const declineElement = this.page.locator(selector);
            if (await declineElement.isVisible({ timeout: 1000 })) {
              const declineText = await declineElement.innerText();
              console.log(`❌ Card declined: ${declineText}`);
              this.cardAttemptLog.push(`Card ${card.number} declined: ${declineText}`);
              declineFound = true;
              break;
            }
          } catch (e) {
            // Continue to next selector
          }
        }

        if (declineFound) {
          // Try to close any error modal/dialog
          const closeButtons = this.page.locator('button[aria-label="Close"], button:has-text("×"), button:has-text("Close"), .close, .modal-close');
          for (let i = 0; i < await closeButtons.count(); i++) {
            try {
              if (await closeButtons.nth(i).isVisible({ timeout: 1000 })) {
                await closeButtons.nth(i).click();
                await this.page.waitForTimeout(500);
                break;
              }
            } catch (e) {
              // Continue to next close button
            }
          }
          
          // Wait a moment before trying next card
          await this.page.waitForTimeout(1000);
          continue; // Try next card
        }

        // If neither success nor decline detected, wait a bit longer and check again
        await this.page.waitForTimeout(2000);
        
        // Final check for success
        if (await successHeading.isVisible({ timeout: 3000 })) {
          this.cardAttemptLog.push(`✅ Payment successful with card ${card.number}! Confirmation detected.`);
          return true;
        }

        // If we get here, something unexpected happened
        console.log(`⚠️ Unexpected result with card ${card.number}, trying next card...`);
        this.cardAttemptLog.push(`Unexpected result with card ${card.number}, trying next card.`);

      } catch (error) {
        console.log(`❌ Error with card ${card.number}: ${error.message}`);
        this.cardAttemptLog.push(`Error with card ${card.number}: ${error.message}`);
        
        // Try to recover and continue with next card
        try {
          // Refresh the page or go back to payment form
          await this.page.reload();
          await this.page.waitForTimeout(2000);
          
          // Re-fill the form data
          await this.fillPersonalInfo();
          await this.fillAddressInfo();
        } catch (recoveryError) {
          console.log(`❌ Recovery failed: ${recoveryError.message}`);
        }
      }
    }

    // If we get here, all cards failed
    this.cardAttemptLog.push('All test cards were declined or failed.');
    throw new Error('All test cards were declined or failed');
  }

  async handleFinalSubmission() {
    // Check terms agreement
    await this.page.getByRole('checkbox', { name: 'I agree with Terms of Use and' }).check();

    // Final order button
    await this.page.getByRole('button', { name: 'Place Order • $' }).click();

    // Wait for confirmation
    try {
      await this.page.getByRole('heading', { name: 'Your Artkive Box is On the' }).click();
      console.log('✅ Order confirmation found!');
    } catch (e) {
      console.log('⚠️ Order confirmation not found, but flow completed');
    }
  }
}

// Main test
test('Artkive Dev Box Purchase - Recorded Flow', async ({ page }) => {
  const testRunner = new ArtkiveDevRecordedTest(page);
  
  // Run the full flow
  const result = await testRunner.runFullFlow();
  
  // Validate success
  expect(result.status).toBe('success');
});

module.exports = { ArtkiveDevRecordedTest }; 