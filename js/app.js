// js/app.js
// SPA Router และ Core Application Logic

window.QV = window.QV || {};
// QV local ref merged

QV.app = {
  currentScreen: null,
  state: null,
  screens: {}
};
// เชื่อม QV.screens กับ app screens ให้ registry เดียวกัน (screens ที่ไฟล์อื่น register จะมาโผล่บน QV.app.screens)
QV.screens = QV.app.screens;

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
  // บอส/มินิเกม: เรียก cleanup ของหน้าก่อนเพื่อหยุด game loop/timers
  if (QV.app.currentScreen && QV.app.screens[QV.app.currentScreen] &&
      typeof QV.app.screens[QV.app.currentScreen].cleanup === 'function') {
    try { QV.app.screens[QV.app.currentScreen].cleanup(); } catch (e) { console.error(e); }
  }
  appContainer.innerHTML = '';

  // render HTML
  const html = screen.render(QV.state, params);
  if (html != null && typeof html !== 'undefined') {
    appContainer.innerHTML = html;
  }

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
  const rank = QV.getRank(state.xp);
  const nextRank = QV.ranks[rank.index + 1];
  const xpBase = rank.index > 0 ? QV.ranks[rank.index][0] : 0;
  const xpProgress = nextRank ? state.xp - xpBase : 0;
  const xpNeeded = nextRank ? QV.ranks[rank.index + 1][0] - xpBase : 1;
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
      heart.className = 'heart' + (i >= state.energy ? ' empty' : '');
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
