const fs = require('fs');

async function textToMp3(text, outPath) {
  fs.writeFileSync(outPath, text);
  return outPath;
}

module.exports = { textToMp3 };
