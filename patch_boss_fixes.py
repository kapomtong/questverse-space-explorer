#!/usr/bin/env python3
"""Add missing question text bar to boss.js mount/loadQuestion and joystick/question CSS."""

# ---------- boss.js ----------
path = 'js/boss.js'
lines = open(path).read().split('\n')

# 1) Insert question bar after hud creation
assert any('arena.appendChild(hud);' in l for l in lines), 'hud append not found'
idx = next(i for i, l in enumerate(lines) if 'arena.appendChild(hud);' in l)
qbar = """    // Question bar
    const qbar = document.createElement('div');
    qbar.className = 'boss-question-bar';
    qbar.innerHTML = '<span id="boss-q-text">กำลังโหลดคำถาม...</span>';
    arena.appendChild(qbar);"""
lines.insert(idx + 1, qbar)

src = '\n'.join(lines)

# 2) Update question text in loadQuestion
old_lq = """    this.gameState.currentQuestion = q;
    // Select 4 pad slots"""
new_lq = """    this.gameState.currentQuestion = q;
    const qText = this.arenaEl.querySelector('#boss-q-text');
    if (qText) qText.innerHTML = typeof QV.formatFrac === 'function' ? QV.formatFrac(QV.escapeHtml(q.q)) : QV.escapeHtml(q.q);
    // Select 4 pad slots"""
assert old_lq in src, 'loadQuestion anchor not found'
src = src.replace(old_lq, new_lq, 1)

open(path, 'w').write(src)
print('boss.js patched OK')

# ---------- style.css ----------
css_path = 'style.css'
css = open(css_path).read()
marker = '/* ===== Joystick (touch movement) + question bar ===== */'
if marker not in css:
    extra = """
/* ===== Joystick (touch movement) + question bar ===== */
#joystick {
  position: absolute;
  bottom: 5%;
  left: 5%;
  width: 110px;
  height: 110px;
  z-index: 50;
  display: none;
}
.j-base {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.45);
  position: relative;
  touch-action: none;
}
.j-stick {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 46%;
  height: 46%;
  border-radius: 50%;
  background: rgba(255, 215, 0, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.6);
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.boss-question-bar {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 25;
  background: rgba(5, 7, 12, 0.88);
  border: 2px solid rgba(233, 165, 104, 0.65);
  border-radius: 12px;
  padding: 8px 16px;
  max-width: 88%;
  text-align: center;
  font-size: clamp(13px, 3.2vw, 18px);
  font-weight: 700;
  color: #fff;
  pointer-events: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
}
#boss-q-text {
  color: #FFD700;
}
@media (max-width: 600px) {
  #joystick { display: block; }
  .boss-question-bar {
    top: 52px;
    font-size: clamp(12px, 3.6vw, 16px);
    padding: 7px 12px;
  }
}
@media (min-width: 601px) and (hover: none) {
  #joystick { display: block; }
}
"""
    css = css.rstrip() + '\n' + extra
    open(css_path, 'w').write(css)
    print('style.css patched OK')
else:
    print('style.css already patched')
