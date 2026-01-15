//this is an older version of the test, do not use. 7/7/25
const { test, expect } = require('@playwright/test');

class ArtkiveTestRunner {
  constructor(page) {
    this.page = page;
    this.testResults = {
      testName: 'Artkive Box Purchase Flow',
      startTime: new Date(),
      endTime: null,
      status: 'running',
      steps: [],
      errors: [],
      screenshots: []
    };
  }

  async logStep(stepName, status = 'success', details = '') {
    const step = {
      name: stepName,
      status,
      timestamp: new Date(),
      details
    };
    this.testResults.steps.push(step);
    console.log(`[${status.toUpperCase()}] ${stepName}${details ? ': ' + details : ''}`);
  }

  async takeScreenshot(name) {
    const screenshotPath = `screenshots/${name}-${Date.now()}.png`;
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    this.testResults.screenshots.push({
      name,
      path: screenshotPath,
      timestamp: new Date()
    });
    return screenshotPath;
  }

  async navigateToSite() {
    try {
      await this.page.goto('https://example-ecommerce-site.com', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      await this.logStep('Navigate to Artkive homepage');
      await this.takeScreenshot('homepage');
      return true;
    } catch (error) {
      await this.logStep('Navigate to homepage', 'failed', error.message);
      this.testResults.errors.push(error.message);
      return false;
    }
  }

  async findBoxPurchaseOption() {
    try {
      // Look for common box purchase patterns
      const boxSelectors = [
        'text=order',
        'text=box',
        'text=purchase',
        'text=buy',
        '[href*="order"]',
        '[href*="box"]',
        '[href*="purchase"]',
        'button:has-text("order")',
        'a:has-text("box")'
      ];

      let foundElement = null;
      for (const selector of boxSelectors) {
        try {
          foundElement = await this.page.locator(selector).first();
          if (await foundElement.isVisible({ timeout: 2000 })) {
            await this.logStep('Found box purchase option', 'success', `Using selector: ${selector}`);
            break;
          }
        } catch (e) {
          // Continue to next selector
          continue;
        }
      }

      if (!foundElement || !(await foundElement.isVisible())) {
        throw new Error('No box purchase option found');
      }

      await foundElement.click();
      await this.page.waitForLoadState('networkidle');
      await this.logStep('Click box purchase option');
      await this.takeScreenshot('box-purchase-page');
      return true;
    } catch (error) {
      await this.logStep('Find box purchase option', 'failed', error.message);
      this.testResults.errors.push(error.message);
      return false;
    }
  }

  async fillOrderForm() {
    try {
      // Common form field patterns
      const testData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Test Street',
        city: 'Test City',
        state: 'CA',
        zip: '12345',
        phone: '555-123-4567'
      };

      // Wait for form to be visible
      await this.page.waitForSelector('form, input[type="email"], input[name*="email"]', { timeout: 10000 });

      // Fill email field
      const emailSelectors = ['input[type="email"]', 'input[name*="email"]', 'input[id*="email"]'];
      for (const selector of emailSelectors) {
        try {
          const emailField = this.page.locator(selector).first();
          if (await emailField.isVisible({ timeout: 2000 })) {
            await emailField.fill(testData.email);
            await this.logStep('Fill email field');
            break;
          }
        } catch (e) {
          continue;
        }
      }

      // Fill name fields
      const nameFields = [
        { selectors: ['input[name*="first"]', 'input[id*="first"]'], value: testData.firstName, name: 'first name' },
        { selectors: ['input[name*="last"]', 'input[id*="last"]'], value: testData.lastName, name: 'last name' }
      ];

      for (const field of nameFields) {
        for (const selector of field.selectors) {
          try {
            const element = this.page.locator(selector).first();
            if (await element.isVisible({ timeout: 2000 })) {
              await element.fill(field.value);
              await this.logStep(`Fill ${field.name} field`);
              break;
            }
          } catch (e) {
            continue;
          }
        }
      }

      await this.takeScreenshot('form-filled');
      return true;
    } catch (error) {
      await this.logStep('Fill order form', 'failed', error.message);
      this.testResults.errors.push(error.message);
      return false;
    }
  }

  async proceedToCheckout() {
    try {
      // Look for checkout/continue buttons
      const checkoutSelectors = [
        'button:has-text("checkout")',
        'button:has-text("continue")',
        'button:has-text("next")',
        'button:has-text("proceed")',
        'input[type="submit"]',
        '[data-testid*="checkout"]',
        '[id*="checkout"]'
      ];

      let checkoutButton = null;
      for (const selector of checkoutSelectors) {
        try {
          checkoutButton = this.page.locator(selector).first();
          if (await checkoutButton.isVisible({ timeout: 2000 })) {
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!checkoutButton || !(await checkoutButton.isVisible())) {
        throw new Error('No checkout button found');
      }

      await checkoutButton.click();
      await this.page.waitForLoadState('networkidle');
      await this.logStep('Proceed to checkout');
      await this.takeScreenshot('checkout-page');
      return true;
    } catch (error) {
      await this.logStep('Proceed to checkout', 'failed', error.message);
      this.testResults.errors.push(error.message);
      return false;
    }
  }

  async validateOrderSummary() {
    try {
      // Look for order confirmation elements
      const confirmationSelectors = [
        'text=order summary',
        'text=review',
        'text=total',
        '[data-testid*="summary"]',
        '.order-summary',
        '.checkout-summary'
      ];

      let foundSummary = false;
      for (const selector of confirmationSelectors) {
        try {
          const element = this.page.locator(selector).first();
          if (await element.isVisible({ timeout: 5000 })) {
            foundSummary = true;
            await this.logStep('Order summary visible', 'success', `Found: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!foundSummary) {
        throw new Error('Order summary not found');
      }

      await this.takeScreenshot('order-summary');
      return true;
    } catch (error) {
      await this.logStep('Validate order summary', 'failed', error.message);
      this.testResults.errors.push(error.message);
      return false;
    }
  }

  /* this adds additional cards to the test just in case that the first card is declined mon jul 7 */
  
  async fillPaymentInfoAndSubmit() {
    await this.page.locator('input[name="name"]').fill(this.testData.cardName);
    await this.page.locator('input[name="name"]').press('Tab');

    const testCards = [
      '4242424242424242',
      '4000000000000002',
      '5555555555554444',
      '378282246310005',
      '6011111111111117',
      '4000002500003155'
    ];

    let cardAccepted = false;
    for (const card of testCards) {
      // Clear card number field robustly
      const cardInput = this.page.locator('input[name="cardNumber"]');
      await cardInput.click();
      await cardInput.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
      await cardInput.press('Backspace');

      // Fill card details
      await cardInput.fill(card);
      await cardInput.press('Tab');
      await this.page.getByRole('textbox', { name: 'MM/YY' }).fill(this.testData.expiryDate);
      await this.page.getByRole('textbox', { name: 'MM/YY' }).press('Tab');
      await this.page.locator('input[name="cardCvc"]').fill(this.testData.cvv);
      await this.page.locator('input[name="cardCvc"]').press('Tab');
      await this.page.locator('input[name="billingZipCode"]').fill(this.testData.zipCode);

      // Check the TOS/Privacy Policy checkbox before each attempt
      await this.page.getByRole('checkbox', { name: 'I agree with Terms of Use and' }).check();

      // Click Place Order for each card attempt
      await this.page.getByRole('button', { name: 'Place Order • $' }).click();

      // Wait for either decline or confirmation
      const declineMessage = this.page.locator('text=card has been declined');
      const confirmation = this.page.getByRole('heading', { name: 'Your Artkive Box is On the' });

      const result = await Promise.race([
        declineMessage.waitFor({ timeout: 5000 }).then(() => 'declined').catch(() => null),
        confirmation.waitFor({ timeout: 5000 }).then(() => 'confirmed').catch(() => null)
      ]);

      if (result === 'confirmed') {
        this.cardAttemptLog.push(`Test card ${card} successful. Confirmation page reached.`);
        cardAccepted = true;
        break;
      } else if (result === 'declined') {
        this.cardAttemptLog.push(`Test card ${card} failed (declined). Moving to next card...`);
        // Optionally close the error message
        const closeBtn = this.page.locator('button[aria-label="Close"], button:has-text("×")');
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
        }
        // Wait a moment for the form to reset if needed
        await this.page.waitForTimeout(500);
      }
    }
    if (!cardAccepted) {
      this.cardAttemptLog.push('All test cards were declined.');
      throw new Error('All test cards were declined');
    }
  }

  async runFullTest() {
    console.log('🚀 Starting Artkive Box Purchase Test...\n');

    const steps = [
      () => this.navigateToSite(),
      () => this.findBoxPurchaseOption(),
      () => this.fillOrderForm(),
      () => this.proceedToCheckout(),
      () => this.validateOrderSummary(),
      () => this.fillPaymentInfoAndSubmit()
    ];

    for (const step of steps) {
      const success = await step();
      if (!success) {
        this.testResults.status = 'failed';
        break;
      }
    }

    if (this.testResults.status !== 'failed') {
      this.testResults.status = 'passed';
    }

    this.testResults.endTime = new Date();
    return this.generateReport();
  }

  generateReport() {
    const duration = this.testResults.endTime - this.testResults.startTime;
    const report = {
      ...this.testResults,
      duration: `${Math.round(duration / 1000)}s`,
      summary: {
        totalSteps: this.testResults.steps.length,
        passedSteps: this.testResults.steps.filter(s => s.status === 'success').length,
        failedSteps: this.testResults.steps.filter(s => s.status === 'failed').length,
        screenshotCount: this.testResults.screenshots.length
      }
    };

    console.log('\n📊 Test Report:');
    console.log('================');
    console.log(`Status: ${report.status.toUpperCase()}`);
    console.log(`Duration: ${report.duration}`);
    console.log(`Steps: ${report.summary.passedSteps}/${report.summary.totalSteps} passed`);
    console.log(`Screenshots: ${report.summary.screenshotCount}`);
    
    if (report.errors.length > 0) {
      console.log('\n❌ Errors:');
      report.errors.forEach(error => console.log(`  - ${error}`));
    }

    return report;
  }
}

// Playwright test definition
test('Artkive Box Purchase Flow', async ({ page }) => {
  const testRunner = new ArtkiveTestRunner(page);
  const report = await testRunner.runFullTest();
  
  // Assert that the test passed
  expect(report.status).toBe('passed');
});

module.exports = { ArtkiveTestRunner };