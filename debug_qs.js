const fs = require('fs');
const code = fs.readFileSync('/home/ubuntu/questverse-game/js/questions.js', 'utf8');
// หา position ของ '{' ที่ error — ลอง eval ทีละบรรทัด
const lines = code.split('\n');
let acc = '';
for (let i = 0; i < lines.length; i++) {
  acc += lines[i] + '\n';
  try { new Function(acc); } catch (e) {
    console.log('FAIL at line', i + 1, ':', e.message);
    console.log('line:', lines[i].slice(0, 120));
    if (i > 0) console.log('prev:', lines[i-1].slice(0, 120));
    break;
  }
}
