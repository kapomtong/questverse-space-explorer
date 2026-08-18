// js/landing.js
// หน้า Landing Page
window.QV = window.QV || {};
// QV local ref merged

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
            <button id="btn-guide" class="btn btn-secondary">
              ⓘ กติกาและไอเทม
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

    // กติกาและไอเทม
    const btnGuide = document.getElementById('btn-guide');
    if (btnGuide) {
      btnGuide.addEventListener('click', () => {
        QV.app.show('guide');
      });
    }
  }
};

// หน้าแนะนำกติกา ไอเทม และสกิล (แสดงก่อนเริ่มเล่น)
QV.screens.guide = {
  render: function(state) {
    const items = Object.values(QV.ITEM_DEFS).map(item => `
      <div class="guide-item-card">
        <div class="guide-item-icon"><img src="${item.image}" alt="${item.name}"></div>
        <div>
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
        </div>
      </div>
    `).join('');

    const ranks = QV.ranks.map(r => `
      <div class="guide-rank-row">
        <span class="guide-rank-emoji">${r[2]}</span>
        <span class="guide-rank-name">${r[1]}</span>
        <span class="guide-rank-xp">ตั้งแต่ ${r[0]} XP</span>
      </div>
    `).join('');

    return `
      <div class="screen-guide">
        <div class="guide-bg"></div>
        <div class="container">
          <div class="guide-card card-glass">
            <h2>📘 กติกาและสกิลของ QuestVerse</h2>
            <p class="guide-sub">ผจญภัย 5 ดาวเคราะห์ = 5 วิชา ตอบคำถาม 125 ข้อ สะสม XP และปลดล็อกยศ!</p>

            <div class="guide-section">
              <h3>🧰 ไอเทมที่ได้รับตอนเริ่ม (ใช้ได้ 2 ชิ้นต่อชิ้น)</h3>
              ${items}
              <p class="guide-note">อิเทมจะเติมเต็มใหม่ในมิชชันที่เล่นถัดไป และหาเพิ่มได้จากการผ่านโซนครบ 5 ดาว</p>
            </div>

            <div class="guide-section">
              <h3>💛 ระบบพลังงาน</h3>
              <p>มีพลังงาน 5 หัวใจ เล่นได้ 5 โซนต่อวัน จะเติมเต็มอัตโนมัติในวันใหม่</p>
            </div>

            <div class="guide-section">
              <h3>⭐ คะแนน XP</h3>
              <p>ตอบถูก +10 XP · ตอบถูกใน 5 วินาที +5 โบนัส · ตอบถูกติดต่อกันครบทุก 3 ข้อ +5 โบนัสคอมโบ · มีนาฬิกานับถอยหลัง 30 วินาทีต่อข้อ ต้องรีบมือ!</p>
            </div>

            <div class="guide-section">
              <h3>🏅 ยศ (Rank)</h3>
              ${ranks}
            </div>

            <div class="guide-section">
              <h3>🛸 เหรียญตรา (Badge)</h3>
              <p>ผ่านครบทุกโซนของดาว, ตอบถูกติดต่อกัน 10 ข้อ, เล่นครบทุกดาว และตอบเร็ว 10 ครั้ง จะปลดล็อกเหรียญสะสม!</p>
            </div>

            <button class="btn btn-primary" id="btn-guide-back" style="margin-top: 24px;">🚀 เข้าใจแล้ว ไปเลย!</button>
          </div>
        </div>
      </div>
    `;
  },

  mount: function() {
    const btnBack = document.getElementById('btn-guide-back');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        QV.app.show('landing');
      });
    }
  }
};
