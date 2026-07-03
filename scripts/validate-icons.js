const fs = require('fs');
const path = require('path');

const ICON_STACK_PATH = path.join(__dirname, '../src/components/content/portfolio/IconStack.tsx');
const DATA_DIRS = [
  path.join(__dirname, '../src/data/portfolio'),
  path.join(__dirname, '../src/data/snippet')
];

function getIconCases() {
  const content = fs.readFileSync(ICON_STACK_PATH, 'utf8');
  const cases = new Set();
  const regex = /case\s+['"`](.*?)['"`]:/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    cases.add(match[1].toLowerCase());
  }
  return cases;
}

function getUsedTags() {
  const tags = new Set();
  
  DATA_DIRS.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));
    files.forEach(file => {
      const content = fs.readFileSync(path.join(dir, file), 'utf8');
      
      // Match stack: ['a', 'b']
      const stackMatch = content.match(/stack:\s*\[(.*?)\]/);
      if (stackMatch && stackMatch[1]) {
        stackMatch[1].split(',').forEach(t => {
          const tag = t.trim().replace(/['"`]/g, '').toLowerCase();
          if (tag) tags.add(tag);
        });
      }

      // Match topic: 'a'
      const topicMatch = content.match(/topic:\s*['"`](.*?)['"`]/);
      if (topicMatch && topicMatch[1]) {
        tags.add(topicMatch[1].trim().toLowerCase());
      }
    });
  });
  
  return tags;
}

function main() {
  console.log('Validating icon mappings in IconStack.tsx...');
  
  let cases;
  try {
    cases = getIconCases();
  } catch (err) {
    console.error('Error reading IconStack.tsx:', err.message);
    process.exit(1);
  }

  const tags = getUsedTags();
  const missing = [];

  tags.forEach(tag => {
    if (!cases.has(tag)) {
      missing.push(tag);
    }
  });

  if (missing.length > 0) {
    console.error('\n❌ ERROR: Missing icon mappings found!');
    console.error('The following tags are used in content but have no icon in IconStack.tsx:');
    missing.forEach(m => console.error(` - ${m}`));
    console.error('\nPlease add them to src/components/content/portfolio/IconStack.tsx');
    process.exit(1);
  } else {
    console.log('\n✅ All used tags are properly mapped to icons!');
    process.exit(0);
  }
}

main();
