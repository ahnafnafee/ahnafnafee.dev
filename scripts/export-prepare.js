const fs = require('fs');
const path = require('path');

const apiDir = path.join(process.cwd(), 'src', 'app', 'api');
const backupDir = path.join(process.cwd(), 'temp_api_backup');

if (fs.existsSync(apiDir)) {
  console.log('Backing up API directory for static export...');
  
  // Copy API directory to backup location
  fs.cpSync(apiDir, backupDir, { recursive: true });
  
  // Remove original API directory
  fs.rmSync(apiDir, { recursive: true, force: true });
  
  console.log('API directory backed up and removed.');
} else {
  console.log('No API directory found to backup.');
}