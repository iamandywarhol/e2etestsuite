// global-setup.js
async function globalSetup() {
    console.log('🔧 Global setup starting...');
    
    // Create directories if they don't exist
    const fs = require('fs');
    const dirs = ['screenshots', 'test-results'];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    
    console.log('✅ Global setup complete');
  }
  
  module.exports = globalSetup;