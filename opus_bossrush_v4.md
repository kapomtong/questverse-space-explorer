```javascript
// js/bossHall.js

const BOSS_CONFIGS = window.BOSS_CONFIGS || [
  { id: 'mathos', name: 'Mathos', subject: 'math', difficulty: 1, requiredXP: 0, bossImg: 'assets/boss_mathos.webp' },
  { id: 'chronos', name: 'Chronos', subject: 'science', difficulty: 2, requiredXP: 100, bossImg: 'assets/boss_chronos.webp' },
  { id: 'kawi', name: 'Kawi', subject: 'thai', difficulty: 3, requiredXP: 250, bossImg: 'assets/boss_kawi.webp' },
  { id: 'lex', name: 'Lex', subject: 'english', difficulty: 4, requiredXP: 450, bossImg: 'assets/boss_lex.webp' },
  { id: 'terra', name: 'Terra', subject: 'social', difficulty: 5, requiredXP: 700, bossImg: 'assets/boss_terra.webp' }
];

const SUBJECT_NAMES = {
  math: 'คณิตศาสตร์',
  science: 'วิทยาศาสตร์',
  thai: 'ภาษาไทย',
  english: 'ภาษาอังกฤษ',
  social: 'สังคมศึกษา'
};

const ITEMS = [
  { id: 'shield', name: 'โล่พิทักษ์', icon: '🛡️', img: 'assets/item_shield.webp', desc: 'กันดาเมจครั้งแรก 1 ดวง' },
  { id: 'potion', name: 'ยาฟื้นฟู', icon: '🧪', img: 'assets/item_potion.webp', desc: 'ฟื้น HP 1 ดวงทุก 3 คำตอบถูก' },
  { id: 'boost', name: 'เวลาชะลอ', icon: '⚡', img: 'assets/item_boost.webp', desc: 'บอสช้าลง 40% ใน 10 วินาทีแรก' }
];

QV.app.screens['boss-hall'] = {
  mount(root, params) {
    this.root = root;
    this.selectedBoss = null;
    this.selectedItem = null;
    this.showingItemSelect = false;

    this.render();
  },

  render() {
    const player = QV.state.player;
    const xp = player.xp || 0;
    const level = Math.floor(xp / 100) + 1;
    const energy = player.energy || 100;
    const rank = xp < 100 ? 'มือใหม่' : xp < 300 ? 'นักรบ' : xp < 600 ? 'ผู้เชี่ยวชาญ' : 'ตำนาน';

    if (this.showingItemSelect && this.selectedBoss) {
      this.renderItemSelect();
      return;
    }

    const bossCards = BOSS_CONFIGS.map(cfg => {
      const locked = xp < cfg.requiredXP;
      const stars = '⭐'.repeat(cfg.difficulty);
      return `
        <div class="boss-card ${locked ? 'locked' : ''}" data-boss-id="${cfg.id}">
          <img class="boss-img" src="${cfg.bossImg}" alt="${cfg.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%23222%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23666%22 font-size=%2248%22%3E👾%3C/text%3E%3C/svg%3E'">
          <div class="boss-info">
            <h3 class="boss-name">${cfg.name}</h3>
            <div class="boss-subject">${SUBJECT_NAMES[cfg.subject] || cfg.subject}</div>
            <div class="boss-difficulty">${stars}</div>
            ${locked ? `
              <div class="boss-locked">
                <div class="lock-icon">🔒</div>
                <div>ต้องการ ${cfg.requiredXP} XP</div>
              </div>
            ` : `
              <button class="btn-challenge btn-gold">ท้าประจัญ!</button>
            `}
          </div>
        </div>
      `;
    }).join('');

    this.root.innerHTML = `
      <div class="boss-hall">
        <header class="hall-header">
          <div class="player-profile">
            <div class="player-name">${player.name || 'ผู้เล่น'}</div>
            <div class="player-stats">
              <span class="stat-item">XP: ${xp}</span>
              <span class="stat-item">ยศ: ${rank}</span>
              <span class="stat-item">LV ${level}</span>
            </div>
            <div class="energy-bar">
              <div class="energy-fill" style="width: ${energy}%"></div>
              <span class="energy-text">${energy}%</span>
            </div>
          </div>
          <div class="hall-actions">
            <button class="btn-leaderboard">🏆 กระดานผู้นำ</button>
            <button class="btn-time-attack">⏱️ Time Attack</button>
            <button class="btn-reset">🔄 Reset</button>
          </div>
        </header>
        <div class="boss-grid">
          ${bossCards}
        </div>
      </div>
    `;

    this.attachEventListeners();
  },

  renderItemSelect() {
    const cfg = BOSS_CONFIGS.find(b => b.id === this.selectedBoss);
    if (!cfg) return;

    const itemCards = ITEMS.map(item => `
      <div class="item-card ${this.selectedItem === item.id ? 'selected' : ''}" data-item-id="${item.id}">
        <div class="item-icon">${item.icon}</div>
        <img class="item-img" src="${item.img}" alt="${item.name}" onerror="this.style.display='none'">
        <div class="item-name">${item.name}</div>
        <div class="item-desc">${item.desc}</div>
      </div>
    `).join('');

    this.root.innerHTML = `
      <div class="item-select-overlay">
        <div class="item-select-panel">
          <h2>เลือกไอเทมสู้ ${cfg.name}</h2>
          <div class="item-grid">
            ${itemCards}
          </div>
          <div class="item-actions">
            <button class="btn-start-battle btn-gold">เลือกและเริ่มสู้</button>
            <button class="btn-back">ย้อนกลับ</button>
          </div>
        </div>
      </div>
    `;

    this.attachItemSelectListeners();
  },

  attachEventListeners() {
    this.root.querySelector('.btn-leaderboard').addEventListener('click', () => {
      const board = QV.state.leaderboard || [];
      if (board.length === 0) {
        alert('ยังไม่มีข้อมูลกระดานผู้นำ');
      } else {
        const list = board.map((p, i) => `${i + 1}. ${p.name} - ${p.xp} XP`).join('\n');
        alert('🏆 กระดานผู้นำ\n\n' + list);
      }
    });

    this.root.querySelector('.btn-time-attack').addEventListener('click', () => {
      QV.app.navigate('time-attack');
    });

    this.root.querySelector('.btn-reset').addEventListener('click', () => {
      if (confirm('ต้องการ Reset ความคืบหน้าทั้งหมด?')) {
        QV.state.player = { name: QV.state.player.name, xp: 0, energy: 100 };
        QV.state.save();
        this.render();
      }
    });

    this.root.querySelectorAll('.boss-card:not(.locked)').forEach(card => {
      const challengeBtn = card.querySelector('.btn-challenge');
      if (challengeBtn) {
        challengeBtn.addEventListener('click', () => {
          this.selectedBoss = card.dataset.bossId;
          this.selectedItem = null;
          this.showingItemSelect = true;
          this.render();
        });
      }
    });
  },

  attachItemSelectListeners() {
    this.root.querySelectorAll('.item-card').forEach(card => {
      card.addEventListener('click', () => {
        this.selectedItem = card.dataset.itemId;
        this.render();
      });
    });

    this.root.querySelector('.btn-start-battle').addEventListener('click', () => {
      if (!this.selectedItem) {
        alert('กรุณาเลือกไอเทม');
        return;
      }

      QV.state.selectedItem = this.selectedItem;
      QV.state.save();

      const cfg = BOSS_CONFIGS.find(b => b.id === this.selectedBoss);
      this.root.innerHTML = '';
      
      const battle = new BossBattle(this.root, this.selectedBoss);
      battle.mount();
      
      this.cleanupBattle = () => {
        if (battle.cleanup) battle.cleanup();
      };
    });

    this.root.querySelector('.btn-back').addEventListener('click', () => {
      this.showingItemSelect = false;
      this.selectedBoss = null;
      this.selectedItem = null;
      this.render();
    });
  },

  cleanup() {
    if (this.cleanupBattle) {
      this.cleanupBattle();
      this.cleanupBattle = null;
    }
    if (this.root) {
      this.root.innerHTML = '';
    }
  }
};
```

```javascript
// js/timeAttack.js

QV.app.screens['time-attack'] = {
  mount(root, params) {
    this.root = root;
    this.timeLimit = 90;
    this.timeRemaining = 90;
    this.timerInterval = null;
    this.questionsAnswered = 0;
    this.correctAnswers = 0;
    this.battleInstance = null;

    this.startTimeAttack();
  },

  startTimeAttack() {
    this.root.innerHTML = '<div class="ta-loading">กำลังเตรียม Time Attack...</div>';

    setTimeout(() => {
      const bossId = 'mathos';
      this.battleInstance = new BossBattle(this.root, bossId, {
        timeLimit: this.timeLimit,
        onAnswer: (correct) => {
          this.questionsAnswered++;
          if (correct) {
            this.correctAnswers++;
            this.timeRemaining = Math.min(this.timeLimit, this.timeRemaining + 5);
            this.updateTimer();
          }
          
          if (this.questionsAnswered >= 10) {
            this.endTimeAttack(true);
          }
        },
        onFinish: (result) => {
          this.endTimeAttack(result.won);
        }
      });

      this.battleInstance.mount();
      this.startTimer();
      this.injectTimerDisplay();
    }, 100);
  },

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.updateTimer();

      if (this.timeRemaining <= 0) {
        this.endTimeAttack(false);
      }
    }, 1000);
  },

  injectTimerDisplay() {
    const existingHud = this.root.querySelector('.battle-hud') || this.root.querySelector('.boss-battle');
    if (existingHud) {
      let timerEl = this.root.querySelector('.ta-timer');
      if (!timerEl) {
        timerEl = document.createElement('div');
        timerEl.className = 'ta-timer';
        existingHud.insertBefore(timerEl, existingHud.firstChild);
      }
      this.updateTimer();
    } else {
      setTimeout(() => this.injectTimerDisplay(), 200);
    }
  },

  updateTimer() {
    const timerEl = this.root.querySelector('.ta-timer');
    if (timerEl) {
      const critical = this.timeRemaining <= 10;
      timerEl.className = `ta-timer ${critical ? 'critical' : ''}`;
      timerEl.innerHTML = `
        <div class="ta-timer-label">⏱️ Time Attack</div>
        <div class="ta-timer-value">${this.timeRemaining}s</div>
      `;
    }
  },

  endTimeAttack(victory) {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    const bonusXP = victory ? Math.max(0, this.timeRemaining * 10) : 0;
    const totalXP = this.correctAnswers * 10 + bonusXP;

    if (victory) {
      QV.state.player.xp = (QV.state.player.xp || 0) + totalXP;
      QV.state.save();
    }

    this.root.innerHTML = `
      <div class="ta-result ${victory ? 'victory' : 'defeat'}">
        <div class="ta-result-panel">
          <h1>${victory ? '🎉 สำเร็จ!' : '⏰ หมดเวลา'}</h1>
          <div class="ta-stats">
            <div class="ta-stat">คำถามที่ตอบ: ${this.questionsAnswered}/10</div>
            <div class="ta-stat">ตอบถูก: ${this.correctAnswers}</div>
            <div class="ta-stat">เวลาเหลือ: ${this.timeRemaining}s</div>
            ${victory ? `<div class="ta-stat bonus">โบนัสเวลา: +${bonusXP} XP</div>` : ''}
            <div class="ta-stat total">รวม XP: +${totalXP}</div>
          </div>
          <button class="btn-back-hall btn-gold" onclick="QV.app.navigate('boss-hall')">
            กลับสู่ห้องโถง
          </button>
        </div>
      </div>
    `;
  },

  cleanup() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.battleInstance && this.battleInstance.cleanup) {
      this.battleInstance.cleanup();
    }
    if (this.root) {
      this.root.innerHTML = '';
    }
  }
};
```

```css
/* Boss Hall & Time Attack Styles */

.boss-hall {
  padding: clamp(1rem, 3vw, 2rem);
  min-height: 100vh;
  background: linear-gradient(135deg, #05070C 0%, #0F131C 100%);
}

.hall-header {
  background: linear-gradient(135deg, #161D2B 0%, #1E2636 100%);
  border: 2px solid rgba(233, 165, 104, 0.3);
  border-radius: 16px;
  padding: clamp(1rem, 2.5vw, 1.5rem);
  margin-bottom: clamp(1.5rem, 4vw, 2.5rem);
}

.player-profile {
  margin-bottom: 1rem;
}

.player-name {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 700;
  color: #E9A568;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.player-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

.stat-item {
  font-size: clamp(0.875rem, 2vw, 1rem);
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

.energy-bar {
  position: relative;
  width: 100%;
  height: 24px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(110, 231, 183, 0.3);
}

.energy-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #6EE7B7 0%, #38BDF8 100%);
  transition: width 0.3s ease;
}

.energy-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
  z-index: 1;
}

.hall-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.hall-actions button {
  flex: 1;
  min-width: 120px;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 999px;
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, #1E2636 0%, #161D2B 100%);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hall-actions button:hover {
  transform: translateY(-2px);
  border-color: rgba(233, 165, 104, 0.5);
  box-shadow: 0 4px 12px rgba(233, 165, 104, 0.2);
}

.boss-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
  gap: clamp(1rem, 3vw, 1.5rem);
}

@media (min-width: 768px) {
  .boss-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.boss-card {
  background: linear-gradient(135deg, #161D2B 0%, #1E2636 100%);
  border: 2px solid rgba(233, 165, 104, 0.4);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.boss-card:hover {
  transform: translateY(-4px) scale(1.02);
  border-color: rgba(233, 165, 104, 0.8);
  box-shadow: 0 8px 24px rgba(233, 165, 104, 0.3);
}

.boss-card.locked {
  opacity: 0.55;
  filter: grayscale(0.7);
  cursor: not-allowed;
}

.boss-card.locked:hover {
  transform: none;
  box-shadow: none;
}

.boss-img {
  width: 100%;
  height: 160px;
  object-fit: contain;
  background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%);
  padding: 1rem;
}

.boss-info {
  padding: 1rem;
}

.boss-name {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 700;
  color: #E9A568;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.boss-subject {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.25rem;
}

.boss-difficulty {
  font-size: 1rem;
  margin-bottom: 0.75rem;
}

.boss-locked {
  text-align: center;
  padding: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.lock-icon {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

.btn-challenge,
.btn-gold {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #E9A568 0%, #D4894D 100%);
  color: #05070C;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-challenge:hover,
.btn-gold:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(233, 165, 104, 0.5);
}

/* Item Selection */

.item-select-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(5, 7, 12, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.item-select-panel {
  background: linear-gradient(135deg, #0F131C 0%, #161D2B 100%);
  border: 2px solid rgba(233, 165, 104, 0.5);
  border-radius: 16px;
  padding: clamp(1.5rem, 4vw, 2.5rem);
  max-width: 800px;
  width: 100%;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.item-select-panel h2 {
  text-align: center;
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: #E9A568;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.02em;
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.item-card {
  background: linear-gradient(135deg, #161D2B 0%, #1E2636 100%);
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 1.5rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.item-card:hover {
  transform: translateY(-4px);
  border-color: rgba(233, 165, 104, 0.5);
}

.item-card.selected {
  border-color: #E9A568;
  box-shadow: 0 0 20px rgba(233, 165, 104, 0.4);
}

.item-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.item-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin: 0 auto 0.5rem;
  display: block;
}

.item-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #E9A568;
  margin-bottom: 0.5rem;
}

.item-desc {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
}

.item-actions {
  display: flex;
  gap: 1rem;
}

.item-actions button {
  flex: 1;
  padding: 0.875rem;
  border: none;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-start-battle {
  background: linear-gradient(135deg, #E9A568 0%, #D4894D 100%);
  color: #05070C;
}

.btn-back {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Time Attack */

.ta-timer {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #161D2B 0%, #1E2636 100%);
  border: 2px solid #6EE7B7;
  border-radius: 16px;
  padding: 1rem 1.5rem;
  text-align: center;
  z-index: 999;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.ta-timer.critical {
  border-color: #ef4444;
  animation: urgentPulse 0.5s ease-in-out infinite;
}

@keyframes urgentPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
  }
  50% {
    transform: scale(1.08);
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.6);
  }
}

.ta-timer-label {
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.25rem;
}

.ta-timer-value {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #6EE7B7;
  line-height: 1;
}

.ta-timer.critical .ta-timer-value {
  color: #ef4444;
}

.ta-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  color: rgba(255, 255, 255, 0.7);
}

.ta-result {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #05070C 0%, #0F131C 100%);
  padding: 1rem;
}

.ta-result-panel {
  background: linear-gradient(135deg, #161D2B 0%, #1E2636 100%);
  border: 2px solid rgba(233, 165, 104, 0.5);
  border-radius: 16px;
  padding: clamp(2rem, 5vw, 3rem);
  text-align: center;
  max-width: 500px;
  width: 100%;
  animation: slideUp 0.5s ease;
}

.ta-result.victory .ta-result-panel {
  border-color: #6EE7B7;
}

.ta-result.defeat .ta-result-panel {
  border-color: #ef4444;
}

.ta-result h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  margin: 0 0 1.5rem 0;
  color: #E9A568;
}

.ta-result.victory h1 {
  color: #6EE7B7;
}

.ta-result.defeat h1 {
  color: #ef4444;
}

.ta-stats {
  margin-bottom: 2rem;
}

.ta-stat {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.ta-stat.bonus {
  color: #6EE7B7;
  font-weight: 600;
}

.ta-stat.total {
  color: #E9A568;
  font-weight: 700;
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  margin-top: 1rem;
  background: rgba(233, 165, 104, 0.1);
}

.btn-back-hall {
  padding: 1rem 2rem;
  font-size: clamp(1rem, 2.5vw, 1.125rem);
}
```