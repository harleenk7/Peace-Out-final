const fs = require('fs');
const readline = require('readline');

const logPath = "C:/Users/DELL/.gemini/antigravity/brain/aa13eb32-c6b1-462b-a7bc-90ad06f12112/.system_generated/logs/transcript.jsonl";

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.includes('"step_index":2511')) {
    const obj = JSON.parse(line);
    console.log(obj.content);
  }
});
