import { execSync } from "child_process";
import fs from "fs";

const SOURCE_DIR = "apps/react-crud/src";
const SUMMARY_FILE = "./Smells-ReactSniffer.json";
const OUTPUT_FILE = "./Smells-ReactSniffer-Detailed.json";

console.log("🔍 Running React Sniffer...");
let output;
try {
  output = execSync(`npx reactsniffer2 ${SOURCE_DIR} --detailed`, { encoding: "utf-8" });
  console.log(output);
} catch (err) {
  console.error("❌ React Sniffer failed:", err.message);
  process.exit(1);
}

if (!fs.existsSync(SUMMARY_FILE)) {
  console.error("❌ Smells-ReactSniffer.json not found. Did React Sniffer run successfully?");
  process.exit(1);
}

const summaryData = JSON.parse(fs.readFileSync(SUMMARY_FILE, "utf-8"));

// Parse CLI output for file-level smells
// Matches either of these patterns:
//  • File: path/to/File.tsx - Smell: Props Spreading - Description: Props are spread in JSX
//  • Smell found in file: path/to/File.tsx -> Props Spreading (Props are spread in JSX)
const detailedSmells = [];

const patterns = [
  /File:\s*(.*?)\s*-\s*Smell:\s*(.*?)\s*-\s*Description:\s*(.*?)(?:\r?\n|$)/g,
  /Smell found in file:\s*(.*?)\s*->\s*(.*?)\s*\((.*?)\)/g,
];

for (const regex of patterns) {
  let match;
  while ((match = regex.exec(output)) !== null) {
    detailedSmells.push({
      file: match[1],
      smellType: match[2],
      description: match[3],
    });
  }
}

summaryData.detailedSmells = detailedSmells;

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(summaryData, null, 2), "utf-8");
console.log(`✅ Detailed smell data written to ${OUTPUT_FILE}`);
