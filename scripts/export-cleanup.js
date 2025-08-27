const fs = require('fs');
const path = require('path');

const apiDir = path.join(process.cwd(), 'src', 'app', 'api');
const backupDir = path.join(process.cwd(), 'temp_api_backup');

if (fs.existsSync(backupDir)) {
  console.log('Restoring API directory...');
  
  // Restore API directory from backup
  fs.cpSync(backupDir, apiDir, { recursive: true });
  
  // Remove backup directory
  fs.rmSync(backupDir, { recursive: true, force: true });
  
  console.log('API directory restored.');
} else {
  console.log('No backup directory found to restore.');
}