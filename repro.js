const fs = require('fs');
const vm = require('vm');

const files = ['config', 'app', 'landing', 'character', 'game_state', 'questions', 'galaxy_map', 'mission', 'leaderboard'];

const shared = {
  window: null,
  console,
  localStorage: {
    store: {},
    getItem(k) { return this.store[k] || null; },
    setItem(k, v) { this.store[k] = v; }
  },
  document: {
    addEventListener: () => {},
    getElementById: () => ({ innerHTML: '', children: [], appendChild() {} }),
    querySelectorAll: () => [],
    createElement: () => ({ style: {}, classList: { add() {} } }),
    body: { appendChild() {} }
  }
};

// browser classic script: window lookup — ใน vm ต้องจำลองด้วย script-level `with(window)` 
// แต่ `with` ใน script แยก: window ของ each script = shared.window (object เดียว)
const scripts = {};
for (const f of files) {
  scripts[f] = fs.readFileSync(`js/${f}.js`, 'utf8');
}

shared.window = shared; // window === globalThis
const ctx = vm.createContext({
  window: shared,
  globalThis: shared,
  console: shared.console,
  localStorage: shared.localStorage,
  document: shared.document
});

for (const f of files) {
  try {
    vm.runInContext(`with(window) { ${scripts[f]} }`, ctx, { filename: `${f}.js` });
    console.log(`✓ ${f}.js`);
  } catch (e) {
    console.log(`✗ ${f}.js: ${e.message}`);
    console.log(e.stack.split('\n').slice(0, 3).join('\n'));
    break;
  }
}

const QV = shared.window.QV;
console.log('\n--- ผล ---');
if (QV) {
  console.log('app:', !!QV.app);
  console.log('QV.app.screens:', Object.keys(QV.app ? QV.app.screens : {}));
  console.log('QV.screens:', Object.keys(QV.screens || {}));
  console.log('same obj:', QV.screens === (QV.app && QV.app.screens));
} else {
  console.log('QV: undefined');
}
