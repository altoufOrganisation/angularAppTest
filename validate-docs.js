import fs from 'fs';

const requiredFiles = [
  '.github/copilot-instructions.md',
  'docs/module-docs.md',
  'docs/user-stories.md'
];

let failed = false;

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing required file: ${file}`);
    failed = true;
  } else {
    console.log(`✅ Found: ${file}`);
  }
}

if (failed) {
  console.error('\nDocumentation validation failed.');
  process.exit(1);
}

console.log('\n✅ Documentation validation passed.');
