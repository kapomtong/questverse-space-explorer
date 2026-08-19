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
