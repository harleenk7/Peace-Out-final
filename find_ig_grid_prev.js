const fs = require('fs');
const readline = require('readline');

const logPath = "C:/Users/DELL/.gemini/antigravity/brain/bdd17d6a-5eb5-4e8f-a71c-95fcfaa56f65/.system_generated/logs/transcript.jsonl";

if (fs.existsSync(logPath)) {
  const rl = readline.createInterface({
    input: fs.createReadStream(logPath),
    crlfDelay: Infinity
  });

  rl.on('line', (line) => {
    if (line.includes('ig-grid')) {
      const obj = JSON.parse(line);
      console.log(`--- Step ${obj.step_index} ---`);
      const gridIdx = obj.content.indexOf('ig-grid');
      console.log(obj.content.substring(gridIdx - 200, gridIdx + 1200));
    }
  });
} else {
  console.log("Previous log not found");
}
