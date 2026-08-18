```javascript
// js/app.js
// SPA Router และ Core Application Logic

const QV = window.QV || {};

QV.app = {
  currentScreen: null,
  state: null,
  screens: {}
};

// เริ่มต้นแอปพลิเคชัน
QV.app.init = function() {
  QV.state = QV.loadState();
  QV.refreshEnergy(QV.state);
  QV.saveState(QV.state);

  // ตรวจสอบว่าผู้เล่นสร้างตัวละครแล้วหรือยัง
  if (!QV.state.player.name) {
    QV.app.show('landing');
  } else {
    QV.app.show('map');
  }

  // ซ่อน preloader
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.display = 'none';
  }
};

// แสดงหน้าจอตามชื่อ
QV.app.show = function(screenName, params) {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  const screen = QV.app.screens[screenName];
  if (!screen) {
    console.error('Screen not found:', screenName);
    return;
  }

  // ล้างเนื้อหาเดิม
  appContainer.innerHTML = '';

  // render HTML
  const html = screen.render(QV.state, params);
  appContainer.innerHTML = html;

  // mount events
  if (screen.mount) {
    screen.mount(params);
  }

  // เพิ่ม fade-in animation
  setTimeout(() => {
    const topElement = appContainer.firstElementChild;
    if (topElement) {
      topElement.classList.add('fade-in');
    }
  }, 10);

  QV.app.currentScreen = screenName;
};

// อัปเดตแถบสถานะผู้เล่นในหน้าแผนที่
QV.app.updatePlayerStatus = function() {
  if (QV.app.currentScreen !== 'map') return;

  const state = QV.state;
  const rank = QV.getRank(state.player.xp);
  const nextRank = QV.ranks[rank.index + 1];
  const xpForNext = nextRank ? nextRank.xp : rank.xp;
  const xpProgress = nextRank ? state.player.xp - rank.xp : 0;
  const xpNeeded = nextRank ? nextRank.xp - rank.xp : 1;
  const xpPercent = Math.min((xpProgress / xpNeeded) * 100, 100);

  // อัปเดต XP bar
  const xpBar = document.querySelector('.xp-bar-fill');
  if (xpBar) {
    xpBar.style.width = xpPercent + '%';
  }

  // อัปเดต rank chip
  const rankChip = document.querySelector('.rank-chip');
  if (rankChip) {
    rankChip.textContent = `${rank.emoji} ${rank.name}`;
  }

  // อัปเดต energy hearts
  const heartsContainer = document.querySelector('.energy-hearts');
  if (heartsContainer) {
    heartsContainer.innerHTML = '';
    for (let i = 0; i < QV.MAX_ENERGY; i++) {
      const heart = document.createElement('span');
      heart.className = 'heart' + (i >= state.player.energy ? ' empty' : '');
      heart.textContent = '❤️';
      heartsContainer.appendChild(heart);
    }
  }

  // อัปเดตชื่อผู้เล่น
  const playerNameEl = document.querySelector('.player-name');
  if (playerNameEl) {
    playerNameEl.textContent = QV.escapeHtml(state.player.name);
  }
};

// แสดง toast notification
QV.app.toast = function(message, type) {
  const toast = document.createElement('div');
  toast.className = 'feedback ' + (type || 'correct');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.top = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.zIndex = '10000';
  toast.style.padding = '1rem 2rem';
  toast.style.borderRadius = '999px';
  toast.style.fontWeight = '600';
  toast.style.animation = 'fadeIn 0.3s ease';

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 2000);
};

// เริ่มต้นเมื่อโหลดหน้าเว็บเสร็จ
document.addEventListener('DOMContentLoaded', () => {
  QV.app.init();
});
```

```javascript
// js/landing.js
// หน้า Landing Page

QV.screens.landing = {
  render: function(state) {
    const hasExistingPlayer = state && state.player && state.player.name;
    
    return `
      <div class="screen-landing">
        <div class="text-center">
          <h1 style="font-size: clamp(3rem, 8vw, 5rem); font-weight: 800; margin-bottom: 1rem; background: linear-gradient(135deg, #38BDF8, #6EE7B7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            QUESTVERSE
          </h1>
          <p style="font-size: clamp(1.125rem, 3vw, 1.5rem); color: rgba(255,255,255,0.7); margin-bottom: 3rem; max-width: 600px; margin-left: auto; margin-right: auto;">
            ผจญภัยเรียนรู้ข้าม 5 ดาวเคราะห์
          </p>
          
          <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 320px; margin: 0 auto;">
            <button id="btn-start" class="btn btn-primary">
              🚀 เริ่มการเดินทาง
            </button>
            ${hasExistingPlayer ? `
              <button id="btn-continue" class="btn btn-secondary">
                ⚡ เล่นต่อ
              </button>
            ` : ''}
            <button id="btn-leaderboard" class="btn btn-secondary">
              🏆 กระดานผู้นำ
            </button>
          </div>
        </div>
      </div>
    `;
  },

  mount: function() {
    const btnStart = document.getElementById('btn-start');
    const btnContinue = document.getElementById('btn-continue');
    const btnLeaderboard = document.getElementById('btn-leaderboard');

    // เริ่มเกมใหม่
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        QV.state = QV.newState();
        QV.saveState(QV.state);
        QV.app.show('character');
      });
    }

    // เล่นต่อ
    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        QV.app.show('map');
      });
    }

    // กระดานผู้นำ
    if (btnLeaderboard) {
      btnLeaderboard.addEventListener('click', () => {
        QV.app.show('leaderboard');
      });
    }
  }
};
```

```javascript
// js/character.js
// หน้าสร้างตัวละคร

QV.screens.character = {
  selectedSuit: 'blue',

  render: function() {
    const suits = [
      { id: 'blue', name: 'นักบินฟ้า', image: 'suit_blue.png', color: '#38BDF8' },
      { id: 'red', name: 'นักรบไฟ', image: 'suit_red.png', color: '#EF4444' },
      { id: 'green', name: 'นักสำรวจใบ', image: 'suit_green.png', color: '#6EE7B7' }
    ];

    return `
      <div class="screen-character">
        <div class="character-form">
          <h2 style="text-align: center; font-size: clamp(1.75rem, 4vw, 2.5rem); margin-bottom: 2rem; color: #fff;">
            เลือกสูทนักสำรวจ
          </h2>

          <div style="margin-bottom: 2rem;">
            <label for="player-name" style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: rgba(255,255,255,0.9);">
              ชื่อของนักสำรวจ
            </label>
            <input 
              type="text" 
              id="player-name" 
              placeholder="กรอกชื่อเล่นของคุณ" 
              maxlength="20"
              style="width: 100%; padding: 0.875rem 1.25rem; border-radius: 999px; border: 2px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: #fff; font-size: 1rem; transition: all 0.3s ease;"
            />
          </div>

          <div class="suit-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            ${suits.map(suit => `
              <div class="suit-card ${suit.id === 'blue' ? 'selected' : ''}" data-suit="${suit.id}" style="cursor: pointer; transition: transform 0.2s ease;">
                <img src="assets/images/${suit.image}" alt="${suit.name}" style="width: 100%; height: auto; border-radius: 12px; margin-bottom: 0.75rem;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22${suit.color}%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2255%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3E🚀%3C/text%3E%3C/svg%3E'" />
                <h3 style="text-align: center; font-size: 1rem; font-weight: 600; color: ${suit.color}; margin: 0;">
                  ${suit.name}
                </h3>
              </div>
            `).join('')}
          </div>

          <div class="character-actions text-center">
            <button id="btn-confirm" class="btn btn-primary" style="min-width: 240px;">
              ✨ ยืนยันและออกเดินทาง
            </button>
          </div>
        </div>
      </div>
    `;
  },

  mount: function() {
    const suitCards = document.querySelectorAll('.suit-card');
    const playerNameInput = document.getElementById('player-name');
    const btnConfirm = document.getElementById('btn-confirm');

    // เลือกสูท
    suitCards.forEach(card => {
      card.addEventListener('click', () => {
        suitCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        QV.screens.character.selectedSuit = card.dataset.suit;
      });
    });

    // ยืนยันและเริ่มเกม
    if (btnConfirm) {
      btnConfirm.addEventListener('click', () => {
        const name = playerNameInput.value.trim();
        
        if (!name) {
          // แสดง shake animation
          playerNameInput.style.animation = 'shake 0.5s ease';
          setTimeout(() => {
            playerNameInput.style.animation = '';
          }, 500);
          
          QV.app.toast('กรุณากรอกชื่อก่อนนะ! 😊', 'wrong');
          playerNameInput.focus();
          return;
        }

        // บันทึกข้อมูลผู้เล่น
        QV.state.player.name = QV.escapeHtml(name.substring(0, 20));
        QV.state.player.suit = QV.screens.character.selectedSuit;
        QV.saveState(QV.state);

        // ไปหน้าแผนที่
        QV.app.show('map');
      });
    }

    // Focus ที่ช่องชื่อ
    if (playerNameInput) {
      playerNameInput.focus();
    }
  }
};

// เพิ่ม shake animation ถ้ายังไม่มี
if (!document.getElementById('shake-style')) {
  const style = document.createElement('style');
  style.id = 'shake-style';
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }
  `;
  document.head.appendChild(style);
}
```