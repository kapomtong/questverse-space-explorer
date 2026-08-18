const fs = require('fs');
const files = ['config.js','game_state.js','app.js','landing.js','character.js','galaxy_map.js','mission.js','leaderboard.js','questions.js'];
let all = '';
let first = true;
for (const f of files) {
  let code = fs.readFileSync('js/'+f,'utf8');
  // แปลงรูป window.QV = window.QV || {}; + const QV = window.QV; → เหลือ window.QV = window.QV || {}; ครั้งแรก
  if (code.includes('window.QV = window.QV || {};')) {
    code = code.replace(/window\.QV = window\.QV \|\| \{\};\s*\n/, first ? '' : '');
    code = code.replace(/^const QV = window\.QV;\s*\n?/m, '');
    first = false;
  }
  // ลบบรรทัด const QV = window.QV || {}; (รูปเก่า)
  code = code.replace(/^const QV = window\.QV \|\| \{\};\s*$/m, '');
  code = code.replace(/^\/\/ QV local ref merged\s*$/m, '');
  code = code.replace(/^\/\/ QV merged\s*$/m, '');
  all += code + '\n\n';
}
try {
  new Function('QV','localStorage','document','window','console','confirm','Date','parseInt','JSON','Array','setTimeout','Object','Error', all);
  console.log('ALL SYNTAX OK');
} catch(e) {
  console.log('ERROR:', e.message);
}
