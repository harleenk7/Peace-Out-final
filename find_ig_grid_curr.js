const fs = require('fs');
const readline = require('readline');

const logPath = "C:/Users/DELL/.gemini/antigravity/brain/aa13eb32-c6b1-462b-a7bc-90ad06f12112/.system_generated/logs/transcript.jsonl";

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.includes('ig-grid') || line.includes('ig-tile')) {
    const obj = JSON.parse(line);
    console.log(`--- Step ${obj.step_index} ---`);
    const gridIdx = obj.content ? obj.content.indexOf('ig-grid') : -1;
    if (gridIdx !== -1) {
      console.log(obj.content.substring(gridIdx - 100, gridIdx + 1200));
    } else {
      console.log(line.substring(0, 1000));
    }
  }
});
