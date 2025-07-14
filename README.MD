# Artkive Testing Suite
# artkive-playwright-tests
##create Segment ignore and Klaviyo etc. 

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