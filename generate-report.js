import fs from "fs";

const inputPath = "./Smells-ReactSniffer.json";
const outputPath = "./reports/react-sniffer-report.html";

const data = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

let summary = data["smells (General Infomation)"];
let detailed = data["detailedSmells"] || [];

// HTML start
let html = `
<html>
  <head>
    <title>React Sniffer Detailed Report</title>
    <style>
      body { font-family: Arial; margin: 20px; background: #f9f9f9; }
      h1, h2 { color: #333; }
      table { border-collapse: collapse; width: 100%; margin-top: 20px; background: white; }
      th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
      th { background: #eee; }
      tr:nth-child(even) { background: #f5f5f5; }
    </style>
  </head>
  <body>
    <h1>React Sniffer Report</h1>

    <h2>Summary</h2>
    <table>
      <tr><th>Smell Type</th><th>Count</th></tr>
      ${Object.entries(summary)
        .map(([smell, count]) => `<tr><td>${smell}</td><td>${count}</td></tr>`)
        .join("")}
    </table>

    <h2>Detailed Findings</h2>
    <table>
      <tr><th>File</th><th>Component</th><th>Smell Type</th><th>Description</th><th>Line</th></tr>
      ${
        detailed.length
          ? detailed
              .map(
                s => `
        <tr>
          <td>${s.file || ""}</td>
          <td>${s.component || ""}</td>
          <td>${s.smellType || ""}</td>
          <td>${s.description || ""}</td>
          <td>${s.line || ""}</td>
        </tr>`
              )
              .join("")
          : `<tr><td colspan="5" style="text-align:center;color:#777;">No detailed data available</td></tr>`
      }
    </table>
  </body>
</html>
`;

fs.writeFileSync(outputPath, html, "utf-8");
console.log(`✅ Detailed HTML report generated: ${outputPath}`);
