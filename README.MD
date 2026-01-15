# Artkive Testing Suite
# artkive-playwright-tests
# E2E Testing Suite - Playwright Automation Framework

A comprehensive end-to-end testing framework built with Playwright for automated functional and visual regression testing. This suite includes cross-browser testing, visual comparison utilities, and automated test execution across multiple environments.

## Features

- **Cross-Browser Testing**: Supports Chromium, Firefox, WebKit, and mobile browsers
- **Visual Regression Testing**: Pixel-perfect visual comparisons using pixelmatch
- **Functional Testing**: Comprehensive E2E test coverage for e-commerce flows
- **Admin Panel Testing**: Automated testing for admin dashboard functionality
- **Account Management Testing**: User account creation, login, and management flows
- **CI/CD Ready**: Configured for continuous integration pipelines
- **Test Reporting**: HTML and JSON test reports with screenshots and videos

## Tech Stack

- **Playwright** - Modern browser automation
- **Node.js** - Runtime environment
- **pixelmatch** - Visual diff comparison
- **pngjs** - PNG image processing

## Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0

## Installation

# Clone the repository
git clone https://github.com/iamandywarhol/e2etestsuite.git
cd e2etestsuite

# Install dependencies
npm install

# Install Playwright browsers
npm run install-browsers


## Commands List

### Common Playwright Commands 
**Run all tests in all browsers:**
```bash
npx playwright test
```

**Run all tests in Chromium only:**
```bash
npx playwright test --project=chromium
```

**Run a specific test file:**
```bash
npx playwright test path/to/your-test-file.spec.js
```

**Run a specific test by name:**
```bash
npx playwright test -g "Your test name"
```

**Show the last HTML report:**
```bash
npx playwright show-report
```

**Install Playwright browsers (if needed):**
```bash
npx playwright install
```

**List all available projects (browsers/devices):**
```bash
npx playwright test --list
```

**Run tests in headed mode (see the browser UI):**
```bash
npx playwright test --headed
```

**Run tests with slow motion (easier to watch):**
```bash
npx playwright test --headed --slow-mo=500
```

**Record a new test (opens the codegen tool):**
```bash
npx playwright codegen https://your-site.com
```

**Update Playwright to the latest version:**
```bash
npm install -D @playwright/test
```

**Run tests with video recording for all runs:**
```bash
npx playwright test --video=on
```

**Run tests and only keep videos for failures (default in many configs):**
```bash
npx playwright test
```

### Admin Tests

**Run all admin tests in Chromium:**
```bash
npx playwright test tests/admin --project=chromium
```

**Run a specific admin test:**
```bash
npx playwright test tests/admin/admin-box-purchase.spec.js --project=chromium
```

**Run all admin tests in all browsers:**
```bash
npx playwright test tests/admin
```

**Show the last HTML report:**
```bash
npx playwright show-report
```

### Box Purchase commands for 'artkive-dev-recorded-flow.spec.js
```bash 
note this is only active on a development environment and will not. break anything at this time
```