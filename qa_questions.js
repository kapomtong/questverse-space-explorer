// QA: โหลด questions.js และนับคำถามต่อดาว/โซน
const fs = require('fs');
const code = fs.readFileSync('/home/ubuntu/questverse-game/js/questions.js', 'utf8');
// window mock: ให้ const QV ประกาศใน global scope ของ eval ไม่ได้ — แทนที่ const เป็น var
let transformed = code.replace(/^const QV = /m, 'var QV = ')
  .replace(/^const QVL = /m, 'var QVL = ')
  .replace(/^const QV2 = /m, 'var QV2 = ')  // เผื่อ
  .replace(/^const QV3 = /m, 'var QV3 = '); // เผื่อ
global.window = global;
try {
  eval(transformed);
} catch (e) {
  console.error('EVAL ERROR:', e.message);
  process.exit(1);
}
let total = 0;
for (const [planet, zones] of Object.entries(QV.QUESTIONS)) {
  console.log(planet, 'zones:', Object.keys(zones).length);
  for (const [z, qs] of Object.entries(zones)) {
    if (!Array.isArray(qs)) { console.log('  z' + z, 'NOT ARRAY:', typeof qs); continue; }
    console.log('  z' + z, qs.length, 'qs');
    let bad = qs.filter(q => !q.q || !Array.isArray(q.choices) || q.choices.length !== 4 || typeof q.answerIdx !== 'number' || q.answerIdx < 0 || q.answerIdx > 3 || !q.hint);
    if (bad.length) console.log('    BAD:', bad.map(q => q.q).slice(0, 3));
    total += qs.length;
  }
}
console.log('TOTAL:', total);
