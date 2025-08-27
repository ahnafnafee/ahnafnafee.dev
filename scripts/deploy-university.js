const fs = require('fs');
const path = require('path');

console.log('🎓 University Deployment Helper');
console.log('================================');

const outDir = path.join(process.cwd(), 'out');

if (!fs.existsSync(outDir)) {
  console.error('❌ No "out" directory found. Please run "yarn export:university" first.');
  process.exit(1);
}

console.log('✅ Export directory found');
console.log('📁 Files ready for deployment in:', outDir);
console.log('');
console.log('📋 Deployment Instructions:');
console.log('');
console.log('1. Update the BASE_PATH in package.json:');
console.log('   Replace "/~username" with your actual university path');
console.log('   Example: "/~jdoe" or "/~ahnafnafee"');
console.log('');
console.log('2. Run the export command:');
console.log('   yarn export:university');
console.log('');
console.log('3. Upload ALL files from the "out" directory to your public_html folder:');
console.log('   - Upload the entire contents of the "out" folder');
console.log('   - Make sure to preserve the directory structure');
console.log('   - Include hidden files like .nojekyll if present');
console.log('');
console.log('4. Your site will be available at:');
console.log('   https://your-university-domain.edu/~username/');
console.log('');
console.log('📝 Files to upload:');

function listFiles(dir, prefix = '') {
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      console.log(`   📁 ${prefix}${item}/`);
      if (prefix.length < 20) { // Limit depth for readability
        listFiles(fullPath, prefix + '  ');
      }
    } else {
      console.log(`   📄 ${prefix}${item}`);
    }
  });
}

listFiles(outDir);

console.log('');
console.log('⚠️  Important Notes:');
console.log('   - Make sure your university server supports static file serving');
console.log('   - Some universities require .htaccess files for proper routing');
console.log('   - Test all pages after deployment to ensure routing works');
console.log('   - Contact your IT department if you encounter issues');