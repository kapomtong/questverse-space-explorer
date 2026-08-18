```javascript
// js/boss.js (ส่วนที่เหลือ - ต่อจากบรรทัด timer)

    timerInterval = null;
    
    // ลบ event listeners ของ joystick
    if (joystickOuter) {
      joystickOuter.removeEventListener('touchstart', handleJoystickStart);
      joystickOuter.removeEventListener('touchmove', handleJoystickMove);
      joystickOuter.removeEventListener('touchend', handleJoystickEnd);
      joystickOuter.removeEventListener('mousedown', handleJoystickStart);
      document.removeEventListener('mousemove', handleJoystickMove);
      document.removeEventListener('mouseup', handleJoystickEnd);
    }
    
    if (container && container.parentNode) {
      container.remove();
    }
  }

  // ลงทะเบียน screen กับ QV
  if (typeof QV !== 'undefined' && QV.app) {
    QV.app.screens.boss = { render, mount, cleanup };
  }

  // เผื่อ debug
  window.QVBossTest = mount;

})();
```

```css
/* style.css (เพิ่มท้ายไฟล์) */

/* ===== BOSS BATTLE ===== */

.screen-boss {
  --surface-0: #05070C;
  --surface-1: #0A0D12;
  --surface-2: #0F131C;
  --surface-3: #161D2B;
  --surface-4: #1E2636;
  --accent: #E94560;
  --accent-dim: #8B2E44;
  --ice-accent: #38BDF8;
  --portal-accent: #A78BFA;
  --correct: #6EE7B7;
  --wrong: #EF4444;
  --radius-full: 999px;
  --radius-round: 50%;
  --spacing-xs: clamp(0.25rem, 0.5vw, 0.5rem);
  --spacing-sm: clamp(0.5rem, 1vw, 1rem);
  --spacing-md: clamp(1rem, 2vw, 1.5rem);
  --spacing-lg: clamp(1.5rem, 3vw, 2.5rem);
  --shadow-glow: 0 0 20px rgba(233, 69, 96, 0.4);
  
  position: fixed;
  inset: 0;
  background: linear-gradient(165deg, var(--surface-0) 0%, var(--surface-1) 50%, var(--surface-2) 100%);
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  overflow: hidden;
  font-family: var(--font-body);
  color: #E8EBF0;
}

.boss-arena {
  position: relative;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 1;
  margin: 0 auto;
  background: radial-gradient(circle at 50% 50%, var(--surface-2) 0%, var(--surface-1) 100%);
  border-radius: 24px;
  border: 2px solid var(--surface-4);
  overflow: hidden;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.5),
    inset 0 0 60px rgba(233, 69, 96, 0.08);
}

.boss-sprite {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: clamp(80px, 20vw, 120px);
  height: clamp(80px, 20vw, 120px);
  font-size: clamp(4rem, 10vw, 6rem);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: boss-idle 2s ease-in-out infinite;
  filter: drop-shadow(0 8px 16px rgba(233, 69, 96, 0.6));
  z-index: 10;
}

.player-sprite {
  position: absolute;
  bottom: 15%;
  width: clamp(48px, 12vw, 64px);
  height: clamp(48px, 12vw, 64px);
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 4px 8px rgba(56, 189, 248, 0.4));
  transition: left 0.15s ease-out;
  z-index: 5;
}

.player-sprite.walking {
  animation: player-walk 0.3s steps(2) infinite;
}

.answer-pad {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--surface-2);
  border-radius: 20px;
  border: 2px solid var(--surface-4);
  max-width: 600px;
  margin: 0 auto;
}

.answer-pad .pad-label {
  grid-column: 1 / -1;
  text-align: center;
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  font-weight: 600;
  color: var(--accent);
  margin-bottom: var(--spacing-xs);
  letter-spacing: 0.03em;
}

.answer-pad button {
  aspect-ratio: 1;
  background: var(--surface-3);
  border: 2px solid var(--surface-4);
  border-radius: 12px;
  color: #E8EBF0;
  font-size: clamp(1.1rem, 3vw, 1.4rem);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-body);
}

.answer-pad button:hover {
  background: var(--accent-dim);
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.answer-pad button:active {
  transform: translateY(0);
}

.answer-pad button.correct {
  animation: pad-correct 0.5s ease;
}

.answer-pad button.wrong {
  animation: pad-wrong 0.5s ease;
}

.hud-boss {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--spacing-md);
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--surface-2);
  border-radius: 16px;
  border: 2px solid var(--surface-4);
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.hud-boss-hp,
.hud-player-hp {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.hud-boss-hp {
  align-items: flex-start;
}

.hud-player-hp {
  align-items: flex-end;
}

.hud-hp-label {
  font-size: clamp(0.75rem, 1.5vw, 0.9rem);
  font-weight: 600;
  color: #A0A8B8;
  letter-spacing: 0.02em;
}

.hud-hp-bar {
  width: clamp(100px, 20vw, 140px);
  height: 12px;
  background: var(--surface-1);
  border-radius: var(--radius-full);
  overflow: hidden;
  border: 1px solid var(--surface-4);
  position: relative;
}

.hud-hp-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent) 0%, #FF6B8A 100%);
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(233, 69, 96, 0.6);
}

.hud-hp-fill.low {
  animation: pulse-red 0.8s ease-in-out infinite;
}

.hud-timer {
  text-align: center;
}

.hud-timer-value {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

.hud-timer-bar {
  width: clamp(60px, 12vw, 80px);
  height: 6px;
  background: var(--surface-1);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin: var(--spacing-xs) auto 0;
  border: 1px solid var(--surface-4);
}

.hud-timer-fill {
  height: 100%;
  background: linear-gradient(90deg, #6EE7B7 0%, #10B981 100%);
  border-radius: var(--radius-full);
  transition: width 1s linear;
}

.hud-combo {
  position: fixed;
  top: 20%;
  right: var(--spacing-lg);
  background: var(--surface-3);
  border: 2px solid var(--accent);
  border-radius: 16px;
  padding: var(--spacing-sm) var(--spacing-md);
  box-shadow: var(--shadow-glow);
  animation: fadeIn 0.3s ease;
}

.hud-combo-value {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--accent);
  text-align: center;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.hud-combo-label {
  font-size: clamp(0.7rem, 1.5vw, 0.85rem);
  color: #A0A8B8;
  text-align: center;
  margin-top: var(--spacing-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.joystick {
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: clamp(100px, 20vw, 140px);
  height: clamp(100px, 20vw, 140px);
  background: var(--surface-3);
  border: 3px solid var(--surface-4);
  border-radius: var(--radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.joystick:active {
  opacity: 1;
}

.joystick-inner {
  width: 40%;
  height: 40%;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dim) 100%);
  border-radius: var(--radius-round);
  box-shadow: 
    0 4px 12px rgba(233, 69, 96, 0.5),
    inset 0 -2px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.1s ease-out;
  pointer-events: none;
}

.atk-tile {
  position: absolute;
  width: 48px;
  height: 48px;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: tile-fly 2s linear;
  z-index: 3;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
}

.atk-tile.fireball {
  filter: drop-shadow(0 0 12px rgba(233, 69, 96, 0.8));
}

.atk-tile.ice {
  filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.8));
}

.atk-tile.portal {
  filter: drop-shadow(0 0 12px rgba(167, 139, 250, 0.8));
}

.warn-ring {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 3px solid var(--accent);
  border-radius: var(--radius-round);
  animation: pad-glow 1s ease-in-out;
  pointer-events: none;
  z-index: 2;
}

.confetti {
  position: fixed;
  width: 8px;
  height: 12px;
  animation: confetti-fall 2s ease-out forwards;
  pointer-events: none;
  z-index: 1000;
}

.confetti.gold {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
}

.confetti.silver {
  background: linear-gradient(135deg, #C0C0C0 0%, #808080 100%);
}

.confetti.color {
  background: linear-gradient(135deg, var(--accent) 0%, var(--ice-accent) 100%);
}

.hit-flash {
  position: absolute;
  inset: 0;
  background: rgba(233, 69, 96, 0.3);
  animation: fadeOut 0.3s ease;
  pointer-events: none;
  border-radius: inherit;
  z-index: 50;
}

.freeze-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%);
  pointer-events: none;
  border-radius: inherit;
  animation: pulse-red 1s ease-in-out infinite;
  z-index: 40;
}

/* Keyframes */

@keyframes boss-idle {
  0%, 100% { transform: translateX(-50%) translateY(0) scale(1); }
  50% { transform: translateX(-50%) translateY(-8px) scale(1.05); }
}

@keyframes player-walk {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes hit-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

@keyframes tile-fly {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(var(--fly-distance, -300px)) scale(0.5);
    opacity: 0;
  }
}

@keyframes pad-glow {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}

@keyframes pad-correct {
  0%, 100% {
    background: var(--surface-3);
    transform: scale(1);
  }
  50% {
    background: var(--correct);
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(110, 231, 183, 0.6);
  }
}

@keyframes pad-wrong {
  0%, 100% {
    background: var(--surface-3);
    transform: translateX(0);
  }
  25% {
    background: var(--wrong);
    transform: translateX(-4px);
  }
  75% {
    background: var(--wrong);
    transform: translateX(4px);
  }
}

@keyframes confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes pulse-red {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
```

```html
<!-- index.html (เพิ่มใน <body> หลัง js/minigame.js) -->

  <script src="js/minigame.js"></script>
  <script src="js/boss.js"></script>
</body>
```

```javascript
// js/galaxy_map.js (เพิ่มในฟังก์ชัน renderMap - หลังส่วนแสดงปุ่มดาวเคราะห์)

function renderMap() {
  const state = QV.state.get();
  const container = document.createElement('div');
  container.className = 'screen-map';

  // ... โค้ดเดิมแสดงดาวเคราะห์ ...

  // ปุ่มท้าบอส
  const bossSection = document.createElement('div');
  bossSection.style.cssText = `
    margin-top: var(--spacing-lg);
    padding: var(--spacing-md);
    background: var(--surface-2);
    border-radius: 20px;
    border: 2px solid var(--surface-4);
    text-align: center;
  `;

  const bossTitle = document.createElement('div');
  bossTitle.textContent = '⚔️ ศึกบอส';
  bossTitle.style.cssText = `
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    font-weight: 700;
    color: var(--accent);
    margin-bottom: var(--spacing-md);
    letter-spacing: -0.02em;
  `;
  bossSection.appendChild(bossTitle);

  // ตรวจสอบสถานะบอส
  const mathosDefeated = state.bossDefeated?.mathos || false;
  const chronosDefeated = state.bossDefeated?.chronos || false;

  if (!mathosDefeated || !chronosDefeated) {
    const bossGrid = document.createElement('div');
    bossGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: var(--spacing-md);
      max-width: 400px;
      margin: 0 auto;
    `;

    // ปุ่ม Mathos
    if (!mathosDefeated) {
      const btnMathos = document.createElement('button');
      btnMathos.id = 'btn-map-boss-mathos';
      btnMathos.innerHTML = `
        <div style="font-size: 2.5rem;">👹</div>
        <div style="margin-top: var(--spacing-xs); font-weight: 600;">Mathos</div>
        <div style="font-size: 0.8rem; color: #A0A8B8; margin-top: 4px;">ราชันย์บวก-ลบ</div>
      `;
      btnMathos.style.cssText = `
        background: var(--surface-3);
        border: 2px solid var(--accent);
        border-radius: 16px;
        padding: var(--spacing-md);
        cursor: pointer;
        transition: all 0.3s ease;
        color: #E8EBF0;
        font-family: var(--font-body);
      `;
      btnMathos.addEventListener('click', () => {
        QV.app.show('boss', { boss: 'mathos' });
      });
      btnMathos.addEventListener('mouseenter', () => {
        btnMathos.style.transform = 'translateY(-4px)';
        btnMathos.style.boxShadow = '0 8px 24px rgba(233, 69, 96, 0.4)';
      });
      btnMathos.addEventListener('mouseleave', () => {
        btnMathos.style.transform = 'translateY(0)';
        btnMathos.style.boxShadow = 'none';
      });
      bossGrid.appendChild(btnMathos);
    }

    // ปุ่ม Chronos
    if (!chronosDefeated) {
      const btnChronos = document.createElement('button');
      btnChronos.id = 'btn-map-boss-chronos';
      btnChronos.innerHTML = `
        <div style="font-size: 2.5rem;">⏰</div>
        <div style="margin-top: var(--spacing-xs); font-weight: 600;">Chronos</div>
        <div style="font-size: 0.8rem; color: #A0A8B8; margin-top: 4px;">จักรพรรดิคูณ-หาร</div>
      `;
      btnChronos.style.cssText = `
        background: var(--surface-3);
        border: 2px solid var(--ice-accent);
        border-radius: 16px;
        padding: var(--spacing-md);
        cursor: pointer;
        transition: all 0.3s ease;
        color: #E8EBF0;
        font-family: var(--font-body);
      `;
      btnChronos.addEventListener('click', () => {
        QV.app.show('boss', { boss: 'chronos' });
      });
      btnChronos.addEventListener('mouseenter', () => {
        btnChronos.style.transform = 'translateY(-4px)';
        btnChronos.style.boxShadow = '0 8px 24px rgba(56, 189, 248, 0.4)';
      });
      btnChronos.addEventListener('mouseleave', () => {
        btnChronos.style.transform = 'translateY(0)';
        btnChronos.style.boxShadow = 'none';
      });
      bossGrid.appendChild(btnChronos);
    }

    bossSection.appendChild(bossGrid);
  } else {
    // ชนะครบแล้ว
    const victoryMsg = document.createElement('div');
    victoryMsg.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: var(--spacing-sm);">🏆</div>
      <div style="font-size: clamp(1rem, 2.5vw, 1.2rem); font-weight: 600; color: var(--correct);">
        พิชิตบอสครบทุกตัวแล้ว!
      </div>
    `;
    victoryMsg.style.cssText = `
      padding: var(--spacing-lg);
    `;
    bossSection.appendChild(victoryMsg);
  }

  container.appendChild(bossSection);

  // ... ปุ่ม back ฯลฯ ...

  return container;
}
```