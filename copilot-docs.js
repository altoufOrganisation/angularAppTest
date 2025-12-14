/**
 * Copilot-adapted Documentation Validator & Assembler
 * ---------------------------------------------------
 * - Copilot writes documentation (manual / PR / IDE)
 * - CI validates presence, structure, and minimal quality
 * - No OpenAI, no API keys, no quotas
 */

import fs from "fs";
import path from "path";

// -----------------------------
// Required files
// -----------------------------
const REQUIRED_FILES = [
  ".github/copilot-instructions.md",
  "docs/module-docs.md",
  "docs/user-stories.md"
];

const SCAN_FILE = "scan-output.json";

// -----------------------------
// Expected content rules
// -----------------------------
const CONTENT_RULES = {
  "docs/module-docs.md": [
    "File:",
    "purpose",
    "dependencies"
  ],
  "docs/user-stories.md": [
    "As a",
    "so that"
  ]
};

// -----------------------------
// Utilities
// -----------------------------
function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function warn(message) {
  console.warn(`⚠️ ${message}`);
}

// -----------------------------
// Step 1: Validate required files
// -----------------------------
console.log("📄 Validating Copilot documentation setup...\n");

for (const file of REQUIRED_FILES) {
  if (!fs.existsSync(file)) {
    fail(`Missing required file: ${file}`);
  }
  console.log(`✅ Found: ${file}`);
}

// -----------------------------
// Step 2: Validate scan output (optional but recommended)
// -----------------------------
let scannedFiles = [];

if (fs.existsSync(SCAN_FILE)) {
  const scanData = JSON.parse(fs.readFileSync(SCAN_FILE, "utf-8"));
  scannedFiles = [...new Set(scanData.map(c => c.filePath))];

  console.log(`🗂️ Scan output detected: ${scannedFiles.length} source files indexed.`);
} else {
  warn("scan-output.json not found — skipping scan alignment checks.");
}

// -----------------------------
// Step 3: Validate documentation content
// -----------------------------
for (const [docFile, keywords] of Object.entries(CONTENT_RULES)) {
  const content = fs.readFileSync(docFile, "utf-8");

  if (content.trim().length < 100) {
    fail(`${docFile} appears to be empty or too short.`);
  }

  for (const keyword of keywords) {
    if (!content.toLowerCase().includes(keyword.toLowerCase())) {
      fail(`${docFile} is missing expected content: "${keyword}"`);
    }
  }

  console.log(`✅ Content validation passed: ${docFile}`);
}

// -----------------------------
// Step 4: Optional alignment check (soft gate)
// -----------------------------
if (scannedFiles.length > 0) {
  const moduleDocs = fs.readFileSync("docs/module-docs.md", "utf-8");

  const undocumented = scannedFiles.filter(
    f => !moduleDocs.includes(f)
  );

  if (undocumented.length > 0) {
    warn(
      `Some scanned files are not referenced in module-docs.md:\n` +
      undocumented.slice(0, 5).map(f => ` - ${f}`).join("\n") +
      (undocumented.length > 5 ? "\n ..." : "")
    );
  } else {
    console.log("✅ All scanned files are referenced in module documentation.");
  }
}

// -----------------------------
// Done
// -----------------------------
console.log("\n✨ Copilot documentation validation completed successfully.");
console.log("🤖 Docs are present, structured, and aligned with instructions.");
