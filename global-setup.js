// global-setup.js
async function globalSetup() {
    console.log('🔧 Global setup starting...');
    
    // Create directories if they don't exist
    const fs = require('fs');
    const dirs = ['screenshots', 'test-results', 'recordings'];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });
    
    console.log('✅ Global setup complete');
  }
  
  module.exports = globalSetup;