

Quick Commands

***FUNCTIONAL***

ECOM

    Dev Environment 
    npx playwright test tests/artkive-dev-recorded-flow.spec.js
    (Runs Safari, Chromium, Firefox, Mobile safari, mobile chrome)
    Runs sequencially 


ADMIN

    Box Purchase
    npx playwright test tests/admin/admin-box-purchase.spec.js --project=chromium

    Non box4 sku (cards)
    npx playwright test tests/admin/admin-box-purchase.spec.js --project=chromium

    GiftCards (ecom)
    npx playwright test tests/admin/admin-giftcards-ecom.spec.js --project=chromium
    
    GiftCards (egift)
    npx playwright test tests/admin/admin-giftcards-egift.spec.js --project=chromium
    
    Invoices
    npx playwright test tests/admin/admin-invoices-all.spec.js --project=chromium
    
    Memberships 
    npx playwright test tests/admin/admin-memberships.spec.js --project=chromium
    
    Saved Books
    npx playwright test tests/admin/admin-box-purchase.spec.js --project=chromium



ACCOUNT



***VISUAL***

ECOM
(Running only within chromium)
npx playwright test /tests/VisualEcom/visEcom-pixelmatch-test.spec.js --project=chromium

Screen Grabber 
npx playwright test tests/VisualEcom/visEcom-screen-grabber.spec.js --project=chromium 