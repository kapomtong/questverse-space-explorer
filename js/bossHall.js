// Boss Rush Hall — หน้าหลักใหม่ของเกม (แทนแผนที่ดาวเคราะห์)
// เลือกบอส → เลือกไอเทม → สู้ (ใช้ BossBattle engine จาก boss.js)
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
  { id: 'boost', name: 'เวลาชะลอ', icon: '⚡', img: 'assets/item_boost.webp', desc: 'บอสโจมตีช้าลง 40% ใน 10 วินาทีแรก' }
];

const BOSS_LIST = window.BOSS_CONFIGS ? Object.values(window.BOSS_CONFIGS) : [
  { id: 'mathos', name: 'Mathos', subject: 'math', difficulty: 1, requiredXP: 0, bossImg: 'assets/boss_mathos.webp' },
  { id: 'chronos', name: 'Chronos', subject: 'science', difficulty: 2, requiredXP: 100, bossImg: 'assets/boss_chronos.webp' },
  { id: 'kawi', name: 'Kawi', subject: 'thai', difficulty: 3, requiredXP: 250, bossImg: 'assets/boss_kawi.webp' },
  { id: 'lex', name: 'Lex', subject: 'english', difficulty: 4, requiredXP: 450, bossImg: 'assets/boss_lex.webp' },
  { id: 'terra', name: 'Terra', subject: 'social', difficulty: 5, requiredXP: 700, bossImg: 'assets/boss_terra.webp' }
];

QV.app.screens['boss-hall'] = {
  selectedBoss: null,
  selectedItem: null,
  showingItemSelect: false,

  render(state, params) {
    this.renderBody();
    return null;
  },


  showSkillsModal() {
    this.removeSkillsModal();
    const container = document.getElementById('app');
    const modal = document.createElement('div');
    modal.id = 'boss-skills-modal';
    modal.className = 'skills-modal';
    modal.innerHTML = `
      <div class="skills-overlay" data-action="close-skills"></div>
      <div class="skills-panel">
        <button class="skills-close" data-action="close-skills" aria-label="ปิด">✕</button>
        <h3>📘 คู่มือสกิลการสู้บอส</h3>
        <div class="skills-list">
          <div class="skill-row">
            <div class="skill-icon">🎯</div>
            <div><b>คำตอบถูก = โจมตีบอส</b> — ตอบถูก 10 ข้อ = ชนะ! เดินเท้าไปยืนบนป้ายคำตอบ แล้วบอสจะโดนดาเมจ</div>
          </div>
          <div class="skill-row">
            <div class="skill-icon">🛡️</div>
            <div><b>โล่พิทักษ์</b> — กันดาเมจจากการโดนบอสโจมตีครั้งแรก 1 ครั้ง</div>
          </div>
          <div class="skill-row">
            <div class="skill-icon">🧪</div>
            <div><b>ยาฟื้นฟู</b> — ฟื้น HP 1 ดวง ทุก 3 คำตอบถูก</div>
          </div>
          <div class="skill-row">
            <div class="skill-icon">⚡</div>
            <div><b>เวลาชะลอ</b> — บอสโจมตีช้าลง 40% ใน 10 วินาทีแรก</div>
          </div>
          <div class="skill-row">
            <div class="skill-icon">🔥</div>
            <div><b>คอมโบ</b> — ตอบถูกติดกันสะสมคอมโบ! คอมโบยิ่งสูงยิ่งต่อแต้ม และยิ่งคอมโบสูงบอสจะโกรธจัด เร่งความเร็ว</div>
          </div>
          <div class="skill-row">
            <div class="skill-icon">🐾</div>
            <div><b>เพ็ท Mito</b> — แมวคู่หูจะลอยตามเจ้าไปทุกที่ คอยให้กำลังใจตลอดเวลา</div>
          </div>
          <div class="skill-row">
            <div class="skill-icon">🃏</div>
            <div><b>อีเวนต์การ์ด</b> — ทุก 3 ข้อ อาจเกิด: ☄️ อุกกาบาต (ลูกบอมบ์ตก), 🌀 หลุมดำ (แรงดูดเข้าศูนย์กลาง), 🎁 ของขวัญ (บอสมอบไอเทมฟรี!)</div>
          </div>
          <div class="skill-row">
            <div class="skill-icon">🧊</div>
            <div><b>การโจมตีบอส</b> — พลุไฟ 💥 และน้ำแข็งเยือกแข็ง 🧊 (โดนแช่แข็ง = เคลื่อนที่ไม่ได้จนกว่าจะละลาย) เดินหลบไปให้ทัน!</div>
          </div>
          <div class="skill-row">
            <div class="skill-icon">🚶</div>
            <div><b>ห้ามยืนแช่!</b> — ยืนที่เดิมนานเกิน 4.5 วิ จะโดนเตือนและบอสจะโจมตีรัว การเดินและตอบสลับตำแหน่งคือกุญแจสู่ชัยชนะ</div>
          </div>
          <div class="skill-row">
            <div class="skill-icon">❄️</div>
            <div><b>ใจเย็น ๆ</b> — บอสมี HP 3 ดวงเช่นเดียวกับเจ้า โดน 3 ครั้ง = แพ้ พิชิตบอสครบรับ Badge และ XP ปลดล็อกบอสถัดไป!</div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(modal);
    modal.querySelectorAll('[data-action="close-skills"]').forEach(b => {
      b.addEventListener('click', () => this.removeSkillsModal());
    });
  },
  removeSkillsModal() {
    const m = document.getElementById('boss-skills-modal');
    if (m) m.remove();
  },

  mount(params) {
    this.attachEventListeners();
  },

  renderBody() {
    const container = document.getElementById('app');
    const player = QV.state.player;
    const xp = player.xp || 0;
    const level = Math.floor(xp / 100) + 1;
    const energy = QV.state.energy || 10;
    const rankInfo = QV.getRank ? QV.getRank(xp) : { name: 'มือใหม่', emoji: '🌱' };

    if (this.showingItemSelect && this.selectedBoss) {
      this.renderItemSelect();
      return;
    }

    const bossCards = BOSS_LIST.map(cfg => {
      const locked = xp < cfg.requiredXP;
      const stars = '⭐'.repeat(cfg.difficulty);
      const beaten = (player.badges || []).includes(`boss-${cfg.id}`);
      return `
        <div class="boss-card ${locked ? 'locked' : ''} ${beaten ? 'beaten' : ''}" data-boss-id="${cfg.id}">
          <img class="boss-img" src="${cfg.bossImg}" alt="${cfg.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%23222%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23666%22 font-size=%2248%22%3E👾%3C/text%3E%3C/svg%3E'">
          <div class="boss-info">
            <h3 class="boss-name">${cfg.name}</h3>
            <div class="boss-subject">${SUBJECT_NAMES[cfg.subject] || cfg.subject}</div>
            <div class="boss-difficulty">${stars}</div>
            ${beaten ? '<div class="boss-badge-tag">✅ เคยพิชิต</div>' : ''}
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

    container.innerHTML = `
      <div class="boss-hall">
        <header class="hall-header">
          <div class="player-profile">
            <div class="player-name">${player.name || 'นักผจญภัย'} <span class="rank-tag">${rankInfo.emoji} ${rankInfo.name}</span></div>
            <div class="player-stats">
              <span class="stat-item">✨ XP: ${xp}</span>
              <span class="stat-item">LV ${level}</span>
              <span class="stat-item">⚡ Energy: ${'❤️'.repeat(energy)}${'🖤'.repeat(Math.max(0, 10 - energy))}</span>
            </div>
          </div>
          <div class="hall-actions">
            <button class="btn-leaderboard">🏆 กระดานผู้นำ</button>
            <button class="btn-time-attack">⏱️ Time Attack</button>
            <button class="btn-skills" data-action="skills">📘 สกิลการสู้</button>
            <button class="btn-back-map">🗺️ แผนที่เดิม</button>
          </div>
        </header>
        <h2 class="hall-title">🏛️ หอกรูชบอส — สู้บอส 5 ด่านเพื่อพิชิตความรู้</h2>
        <p class="hall-subtitle">ชนะบอสเพื่อรับ XP • ปลดบอสที่ยากขึ้น • เลือกไอเทมก่อนสู้</p>
        <div class="boss-grid">
          ${bossCards}
        </div>
      </div>
    `;
  },

  renderItemSelect() {
    const container = document.getElementById('app');
    const cfg = BOSS_LIST.find(b => b.id === this.selectedBoss);
    if (!cfg) return;

    const itemCards = ITEMS.map(item => `
      <div class="item-card ${this.selectedItem === item.id ? 'selected' : ''}" data-item-id="${item.id}">
        <div class="item-icon">${item.icon}</div>
        <img class="item-img" src="${item.img}" alt="${item.name}" onerror="this.style.display='none'">
        <div class="item-name">${item.name}</div>
        <div class="item-desc">${item.desc}</div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="item-select-overlay">
        <div class="item-select-panel">
          <h2>เลือกไอเทมสู้กับ ${cfg.name}</h2>
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

    container.querySelectorAll('.item-card').forEach(card => {
      card.addEventListener('click', () => {
        this.selectedItem = card.dataset.itemId;
        this.renderItemSelect();
      });
    });

    container.querySelector('.btn-start-battle').addEventListener('click', () => {
      if (!this.selectedItem) {
        QV.app.toast('เลือกไอเทมก่อนเริ่มสู้!', 'incorrect');
        return;
      }
      // บันทึกไอเทมให้ engine
      QV.state.boss = QV.state.boss || {};
      QV.state.boss.item_selected = this.selectedItem;
      QV.saveState();
      QV.app.show('boss', { bossId: this.selectedBoss });
    });
    container.querySelector('.btn-back').addEventListener('click', () => {
      this.showingItemSelect = false;
      this.selectedBoss = null;
      this.selectedItem = null;
      this.renderBody();
      this.attachEventListeners();
    });
  },

  attachEventListeners() {
    const container = document.getElementById('app');
    const leaderboardBtn = container.querySelector('.btn-leaderboard');
    if (leaderboardBtn) {
      leaderboardBtn.addEventListener('click', () => QV.app.show('leaderboard'));
    }

    const timeAttackBtn = container.querySelector('.btn-time-attack');
    // ปุ่มสกิลการสู้
    const btnSkills = container.querySelector('.btn-skills');
    if (btnSkills) btnSkills.addEventListener('click', () => this.showSkillsModal());

    if (timeAttackBtn) {
      timeAttackBtn.addEventListener('click', () => QV.app.show('time-attack'));
    }

    const backMapBtn = container.querySelector('.btn-back-map');
    if (backMapBtn) {
      backMapBtn.addEventListener('click', () => QV.app.show('map'));
    }

    container.querySelectorAll('.boss-card:not(.locked)').forEach(card => {
      const challengeBtn = card.querySelector('.btn-challenge');
      if (challengeBtn) {
        challengeBtn.addEventListener('click', () => {
          this.selectedBoss = card.dataset.bossId;
          this.selectedItem = null;
          this.showingItemSelect = true;
          this.renderItemSelect();
        });
      }
    });
  }
};
