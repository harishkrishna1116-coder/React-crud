const escomplex = require('typhonjs-escomplex');
const glob = require('glob');
const fs = require('fs-extra');

function analyzeFiles(patterns) {
  const filePaths = [];

  patterns.forEach(pattern => {
    const matched = glob.sync(pattern, { absolute: true });
    filePaths.push(...matched);
  });

  const results = [];

  for (const file of filePaths) {
    try {
      const code = fs.readFileSync(file, 'utf8');
      const report = escomplex.analyzeModule(code);

      results.push({
        path: file,
        cyc: report.aggregate.cyclomatic,
        diff: parseFloat(report.aggregate.halstead.difficulty.toFixed(2)),
        deps: report.dependencies.length
      });
    } catch (err) {
      console.error(`❌ Error analyzing ${file}:`, err.message);
    }
  }

  return results;
}

function generateHTML(results) {
  const labels = results.map(r => r.path.replace(/.*react-crud[\\/]/, ""));
  const cyclomatic = results.map(r => r.cyc);
  const difficulty = results.map(r => r.diff);

  const rows = results
    .map(r => `
      <tr>
        <td>${r.path}</td>
        <td class="${r.cyc > 10 ? 'high' : ''}">${r.cyc}</td>
        <td>${r.diff}</td>
        <td>${r.deps}</td>
      </tr>
    `)
    .join('');

  const html = `
  <html>
    <head>
      <title>TS/TSX Complexity Report</title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <style>
        body { font-family: Arial; padding: 20px; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; }
        th { background: #eee; }
        tr:nth-child(even) { background: #f9f9f9; }
        .high { color: red; font-weight: bold; }
        .chart-container { width: 100%; margin-top: 40px; }
      </style>
    </head>

    <body>
      <h1>TS/TSX Complexity Report</h1>
      <p>Generated: ${new Date().toLocaleString()}</p>

      <div class="chart-container">
        <h2>Cyclomatic Complexity per File</h2>
        <canvas id="cycChart"></canvas>
      </div>

      <div class="chart-container">
        <h2>Halstead Difficulty per File</h2>
        <canvas id="difficultyChart"></canvas>
      </div>

      <h2>Detailed Metrics</h2>
      <table>
        <tr>
          <th>File</th>
          <th>Cyclomatic Complexity</th>
          <th>Halstead Difficulty</th>
          <th>Dependencies</th>
        </tr>
        ${rows}
      </table>

      <script>
        const labels = ${JSON.stringify(labels)};
        const cyclomatic = ${JSON.stringify(cyclomatic)};
        const difficulty = ${JSON.stringify(difficulty)};

        new Chart(document.getElementById('cycChart'), {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Cyclomatic Complexity',
              data: cyclomatic
            }]
          }
        });

        new Chart(document.getElementById('difficultyChart'), {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Halstead Difficulty',
              data: difficulty
            }]
          }
        });
      </script>

    </body>
  </html>
  `;

  return html;
}

function saveReport(html) {
  const outputDir = './reports/complexity';
  fs.ensureDirSync(outputDir);

  const file = `${outputDir}/index.html`;
  fs.writeFileSync(file, html);

  console.log(`✔ Complexity report generated: ${file}`);
}

const results = analyzeFiles([
  "apps/**/*.{ts,tsx}",
  "libs/**/*.{ts,tsx}"
]);

const html = generateHTML(results);
saveReport(html);
