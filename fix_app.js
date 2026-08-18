const fs = require('fs');
const path = 'js/app.js';
let src = fs.readFileSync(path, 'utf8');

if (!src.includes('QV.app.screens = QV.screens')) {
  // เพิ่ม binding หลัง const QV.app declaration
  src = src.replace(
    /QV\.app = \{\n\s*currentScreen: null,\n\s*state: null,\n\s*screens: \{\}\n\s*\};/,
    `QV.app = {
  currentScreen: null,
  state: null,
  screens: {}
};
// เชื่อม QV.screens กับ app screens ให้ registry เดียวกัน (screens ที่ไฟล์อื่น register จะมาโผล่บน QV.app.screens)` + `
QV.screens = QV.app.screens;`
  );
  fs.writeFileSync(path, src);
  console.log('fixed app.js');
} else {
  console.log('already fixed');
}
