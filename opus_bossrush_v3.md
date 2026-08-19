## 1. js/boss.js

```javascript
// js/boss.js
const BOSS_CONFIGS = {
  mathos: {
    id: 'mathos',
    name: 'Mathos',
    subject: 'math',
    difficulty: 1,
    requiredXP: 0,
    arenaBg: 'assets/arena_mathos.webp',
    bossImg: 'assets/boss_mathos.webp',
    introCutIn: 'จงพิสูจน์ความสามารถทางคณิตศาสตร์ของเจ้า!',
    victoryMsg: 'เจ้าเข้าใจหลักการคณิตศาสตร์อย่างแท้จริง',
    defeatMsg: 'กลับไปฝึกฝนพื้นฐานเพิ่มเติมก่อน',
    attackTheme: {
      fireball: { color: '#E9A568', name: 'สมการลูกไฟ' },
      ice: { color: '#38BDF8', name: 'โซนแช่แข็งตัวเลข' },
      portal: { color: '#A78BFA', name: 'ประตูมิติคณิต' }
    },
    baseDifficulty: {
      attackInterval: 4500,
      firstAttackDelay: 5000
    }
  },
  chronos: {
    id: 'chronos',
    name: 'Chronos',
    subject: 'science',
    difficulty: 2,
    requiredXP: 100,
    arenaBg: 'assets/arena_chronos.webp',
    bossImg: 'assets/boss_chronos.webp',
    introCutIn: 'เวลาและวิทยาศาสตร์คือกฎของข้า!',
    victoryMsg: 'เจ้าควบคุมเวลาและวิทยาศาสตร์ได้แล้ว',
    defeatMsg: 'เวลาของเจ้ายังไม่มาถึง',
    attackTheme: {
      fireball: { color: '#6EE7B7', name: 'พลังงานควอนตัม' },
      ice: { color: '#38BDF8', name: 'ห้องแช่แข็งเวลา' },
      portal: { color: '#8B5CF6', name: 'รอยแยกเวลา' }
    },
    baseDifficulty: {
      attackInterval: 4000,
      firstAttackDelay: 4500
    }
  },
  kawi: {
    id: 'kawi',
    name: 'Kawi',
    subject: 'thai',
    difficulty: 3,
    requiredXP: 250,
    arenaBg: 'assets/arena_kawi.webp',
    bossImg: 'assets/boss_kawi.webp',
    introCutIn: 'ภาษาไทยคือศิลปะแห่งปัญญา พิสูจน์ให้ข้าเห็น!',
    victoryMsg: 'เจ้าเชี่ยวชาญภาษาไทยอย่างแท้จริง',
    defeatMsg: 'ภาษาไทยลึกซึ้งกว่าที่เจ้าคิด',
    attackTheme: {
      fireball: { color: '#F59E0B', name: 'คำอักษรเพลิง' },
      ice: { color: '#3B82F6', name: 'โซนคำศัพท์น้ำแข็ง' },
      portal: { color: '#EC4899', name: 'ประตูวรรณคดี' }
    },
    baseDifficulty: {
      attackInterval: 3500,
      firstAttackDelay: 4000
    }
  },
  lex: {
    id: 'lex',
    name: 'Lex',
    subject: 'english',
    difficulty: 4,
    requiredXP: 450,
    arenaBg: 'assets/arena_lex.webp',
    bossImg: 'assets/boss_lex.webp',
    introCutIn: 'Your vocabulary shall be tested to its limits!',
    victoryMsg: 'Your command of English is truly impressive',
    defeatMsg: 'More practice with English is needed',
    attackTheme: {
      fireball: { color: '#EF4444', name: 'Vocabulary Blast' },
      ice: { color: '#06B6D4', name: 'Grammar Freeze Zone' },
      portal: { color: '#8B5CF6', name: 'Literature Portal' }
    },
    baseDifficulty: {
      attackInterval: 3000,
      firstAttackDelay: 3500
    }
  },
  terra: {
    id: 'terra',
    name: 'Terra',
    subject: 'social',
    difficulty: 5,
    requiredXP: 700,
    arenaBg: 'assets/arena_terra.webp',
    bossImg: 'assets/boss_terra.webp',
    introCutIn: 'โลกและสังคมรอการพิสูจน์จากเจ้า!',
    victoryMsg: 'เจ้าเข้าใจโลกและสังคมอย่างลึกซึ้ง',
    defeatMsg: 'โลกใบนี้ซับซ้อนกว่าที่เจ้าเข้าใจ',
    attackTheme: {
      fireball: { color: '#10B981', name: 'ลูกโลกเพลิง' },
      ice: { color: '#0EA5E9', name: 'โซนแช่แข็งภูมิศาสตร์' },
      portal: { color: '#A855F7', name: 'ประตูประวัติศาสตร์' }
    },
    baseDifficulty: {
      attackInterval: 2500,
      firstAttackDelay: 3000
    }
  }
};

const CONFIG = {
  PAD_SLOTS: [
    { left: 15, top: 20 },
    { left: 75, top: 25 },
    { left: 10, top: 60 },
    { left: 85, top: 65 },
    { left: 40, top: 15 },
    { left: 60, top: 75 },
    { left: 25, top: 80 },
    { left: 70, top: 45 }
  ],
  PAD_MIN_DISTANCE: 18,
  PLAYER_SPEED: 0.4,
  INTENTIONAL_THRESHOLD: 0.15,
  INTENTIONAL_DURATION: 800,
  CAMPING_WARNING_TIME: 4500,
  FIREBALL_SPEED: 0.25,
  ICE_DURATION: 3000,
  PORTAL_WARP_DELAY: 1500,
  COMBO_DASH_THRESHOLD: 3,
  COMBO_INVINCIBLE_THRESHOLD: 10
};

class BossBattle {
  constructor(root, bossId) {
    this.root = root;
    this.config = BOSS_CONFIGS[bossId];
    if (!this.config) throw new Error(`Boss ${bossId} not found`);

    this.gameState = {
      player: { x: 50, y: 50, vx: 0, vy: 0, hp: 3, frozen: false, shielded: false },
      bossHP: 100,
      score: 0,
      combo: 0,
      questionCount: 0,
      correctStreak: 0,
      keys: {},
      joystick: { active: false, dx: 0, dy: 0 },
      pads: [],
      currentQuestion: null,
      attacks: [],
      events: [],
      campingTimer: 0,
      campingWarning: false,
      lastPosition: { x: 50, y: 50 },
      item: QV.state.boss?.item_selected || null,
      itemUsed: false,
      pet: { x: 50, y: 50, bobOffset: 0 }
    };

    this.intentionalState = { padIndex: -1, timer: 0 };
    this.rafId = null;
    this.lastTime = 0;
    this.attackTimer = 0;
    this.eventTimer = 0;
    this.questionPool = [];
    this.usedQuestions = new Set();
  }

  mount() {
    this.root.innerHTML = '';
    
    // Arena
    const arena = document.createElement('div');
    arena.className = 'boss-arena';
    arena.style.cssText = `
      position: relative;
      width: 100vw;
      height: 100vh;
      background: url('${this.config.arenaBg}') center/cover;
      overflow: hidden;
    `;

    // HUD
    const hud = document.createElement('div');
    hud.className = 'boss-hud';
    hud.innerHTML = `
      <div class="boss-hp-bar">
        <div class="boss-hp-fill" style="width: 100%; background: ${this.config.attackTheme.fireball.color};"></div>
        <span class="boss-name">${this.config.name}</span>
      </div>
      <div class="player-hp">
        ${Array(3).fill('<div class="hp-heart">♥</div>').join('')}
      </div>
      <div class="combo-counter" style="display: none;">Combo: <span>0</span></div>
      <div class="camping-warning" style="display: none;">⚠️ อย่ายืนนิ่ง!</div>
    `;
    arena.appendChild(hud);

    // Player
    const player = document.createElement('div');
    player.className = 'boss-player';
    player.style.cssText = `
      position: absolute;
      width: 3vw;
      height: 3vw;
      background: radial-gradient(circle, #FFD700, #FFA500);
      border-radius: 999px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      transition: box-shadow 0.3s;
      z-index: 10;
    `;
    arena.appendChild(player);
    this.playerEl = player;

    // Pet Mito
    const pet = document.createElement('div');
    pet.className = 'pet-mito';
    pet.innerHTML = `<img src="assets/pet_mito.webp" alt="Mito" style="width: 100%; height: 100%;">`;
    arena.appendChild(pet);
    this.petEl = pet;

    // Joystick
    const joystick = document.createElement('div');
    joystick.id = 'joystick';
    joystick.innerHTML = '<div class="j-base"><div class="j-stick"></div></div>';
    arena.appendChild(joystick);
    this.joystickEl = joystick;

    this.arenaEl = arena;
    this.root.appendChild(arena);

    this.setupControls();
    this.loadQuestionPool();
    this.showIntroCutIn();
  }

  showIntroCutIn() {
    const cutIn = document.createElement('div');
    cutIn.className = 'intro-cutin';
    cutIn.innerHTML = `
      <img src="${this.config.bossImg}" alt="${this.config.name}">
      <h2>${this.config.name}</h2>
      <p>${this.config.introCutIn}</p>
    `;
    this.arenaEl.appendChild(cutIn);

    setTimeout(() => {
      cutIn.style.opacity = '0';
      setTimeout(() => {
        cutIn.remove();
        this.startBattle();
      }, 500);
    }, 3000);
  }

  startBattle() {
    this.loadQuestion();
    this.lastTime = performance.now();
    this.attackTimer = this.config.baseDifficulty.firstAttackDelay;
    
    // Item boost (ช้าลง 40% ใน 10 วิแรก)
    if (this.gameState.item === 'boost' && !this.gameState.itemUsed) {
      this.gameState.itemUsed = true;
      const originalInterval = this.config.baseDifficulty.attackInterval;
      this.config.baseDifficulty.attackInterval *= 1.4;
      setTimeout(() => {
        this.config.baseDifficulty.attackInterval = originalInterval;
      }, 10000);
    }

    this.gameLoop();
  }

  setupControls() {
    // Keyboard
    this.keydownHandler = (e) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        this.gameState.keys[key] = true;
        e.preventDefault();
      }
    };
    this.keyupHandler = (e) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        this.gameState.keys[key] = false;
      }
    };
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);

    // Joystick
    const stick = this.joystickEl.querySelector('.j-stick');
    const base = this.joystickEl.querySelector('.j-base');
    
    const handleStart = (clientX, clientY) => {
      this.gameState.joystick.active = true;
    };
    
    const handleMove = (clientX, clientY) => {
      if (!this.gameState.joystick.active) return;
      const rect = base.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      let dx = clientX - centerX;
      let dy = clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDist = rect.width / 2;
      if (distance > maxDist) {
        dx = (dx / distance) * maxDist;
        dy = (dy / distance) * maxDist;
      }
      stick.style.transform = `translate(${dx}px, ${dy}px)`;
      this.gameState.joystick.dx = dx / maxDist;
      this.gameState.joystick.dy = dy / maxDist;
    };
    
    const handleEnd = () => {
      this.gameState.joystick.active = false;
      stick.style.transform = 'translate(0, 0)';
      this.gameState.joystick.dx = 0;
      this.gameState.joystick.dy = 0;
    };

    base.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    });
    base.addEventListener('touchmove', (e) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    });
    base.addEventListener('touchend', handleEnd);
    base.addEventListener('mousedown', (e) => handleStart(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', handleEnd);
  }

  loadQuestionPool() {
    const subject = this.config.subject;
    const questions = QV.questions[subject]?.questions || [];
    this.questionPool = questions.filter(q => !this.usedQuestions.has(q.q));
  }

  loadQuestion() {
    if (this.questionPool.length === 0) {
      this.usedQuestions.clear();
      this.loadQuestionPool();
    }

    const q = this.questionPool.splice(Math.floor(Math.random() * this.questionPool.length), 1)[0];
    this.usedQuestions.add(q.q);
    this.gameState.currentQuestion = q;

    // Select 4 pad slots
    const slots = this.selectPadSlots();
    this.gameState.pads = q.choices.map((choice, i) => {
      const slot = slots[i];
      return {
        x: slot.left,
        y: slot.top,
        text: choice,
        correct: i === q.answerIdx
      };
    });

    this.renderPads();
    this.gameState.questionCount++;

    // Event card ทุก 3 ข้อ
    if (this.gameState.questionCount > 0 && this.gameState.questionCount % 3 === 0) {
      this.triggerEvent();
    }
  }

  selectPadSlots() {
    const available = [...CONFIG.PAD_SLOTS];
    const selected = [];
    
    for (let i = 0; i < 4; i++) {
      let attempts = 0;
      while (attempts < 50) {
        const idx = Math.floor(Math.random() * available.length);
        const slot = available[idx];
        
        let valid = true;
        for (const other of selected) {
          const dx = slot.left - other.left;
          const dy = slot.top - other.top;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONFIG.PAD_MIN_DISTANCE) {
            valid = false;
            break;
          }
        }
        
        if (valid) {
          selected.push(slot);
          available.splice(idx, 1);
          break;
        }
        attempts++;
      }
      
      if (selected.length === i) {
        selected.push(available.splice(0, 1)[0]);
      }
    }
    
    return selected;
  }

  renderPads() {
    this.arenaEl.querySelectorAll('.answer-pad').forEach(el => el.remove());
    
    this.gameState.pads.forEach((pad, i) => {
      const el = document.createElement('div');
      el.className = 'answer-pad';
      el.dataset.index = i;
      el.style.cssText = `
        position: absolute;
        left: ${pad.x}%;
        top: ${pad.y}%;
        transform: translate(-50%, -50%);
        width: 12vw;
        height: 12vw;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: clamp(0.9rem, 1.5vw, 1.2rem);
        color: white;
        text-align: center;
        padding: 1vw;
        transition: all 0.3s;
        cursor: pointer;
      `;
      
      const core = document.createElement('div');
      core.className = 'pad-core';
      core.textContent = pad.text;
      core.style.cssText = `
        width: 70%;
        height: 70%;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      el.appendChild(core);
      
      this.arenaEl.appendChild(el);
    });
  }

  updatePlayer(dt) {
    if (this.gameState.player.frozen) return;

    let dx = 0, dy = 0;

    // Keyboard
    if (this.gameState.keys.w) dy -= 1;
    if (this.gameState.keys.s) dy += 1;
    if (this.gameState.keys.a) dx -= 1;
    if (this.gameState.keys.d) dx += 1;

    // Joystick
    if (this.gameState.joystick.active) {
      dx += this.gameState.joystick.dx;
      dy += this.gameState.joystick.dy;
    }

    // Normalize
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len > 0) {
      dx /= len;
      dy /= len;
    }

    // Combo dash
    let speed = CONFIG.PLAYER_SPEED;
    if (this.gameState.combo >= CONFIG.COMBO_DASH_THRESHOLD) {
      speed *= 1.3;
      this.playerEl.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
    } else {
      this.playerEl.style.boxShadow = 'none';
    }

    this.gameState.player.vx = dx * speed;
    this.gameState.player.vy = dy * speed;

    this.gameState.player.x += this.gameState.player.vx;
    this.gameState.player.y += this.gameState.player.vy;

    // Bounds
    this.gameState.player.x = Math.max(5, Math.min(95, this.gameState.player.x));
    this.gameState.player.y = Math.max(5, Math.min(95, this.gameState.player.y));

    this.playerEl.style.left = `${this.gameState.player.x}%`;
    this.playerEl.style.top = `${this.gameState.player.y}%`;

    // Shield visual
    if (this.gameState.player.shielded) {
      this.playerEl.style.border = '3px solid cyan';
    } else {
      this.playerEl.style.border = 'none';
    }
  }

  updatePet(dt) {
    // Bob animation
    this.gameState.pet.bobOffset += dt * 0.003;
    const bob = Math.sin(this.gameState.pet.bobOffset) * 2;

    // Follow player
    const tx = this.gameState.player.x;
    const ty = this.gameState.player.y - 8;
    this.gameState.pet.x += (tx - this.gameState.pet.x) * 0.05;
    this.gameState.pet.y += (ty - this.gameState.pet.y) * 0.05;

    this.petEl.style.left = `${this.gameState.pet.x}%`;
    this.petEl.style.top = `${this.gameState.pet.y + bob}%`;
  }

  checkPadCollision() {
    const pads = this.arenaEl.querySelectorAll('.answer-pad');
    const px = this.gameState.player.x;
    const py = this.gameState.player.y;
    const speed = Math.sqrt(this.gameState.player.vx ** 2 + this.gameState.player.vy ** 2);

    pads.forEach((padEl, i) => {
      const pad = this.gameState.pads[i];
      const dx = px - pad.x;
      const dy = py - pad.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 6) {
        padEl.style.transform = 'translate(-50%, -50%) scale(1.1)';
        padEl.style.borderColor = 'rgba(255, 255, 255, 0.8)';

        // Intentional answer check
        if (speed < CONFIG.INTENTIONAL_THRESHOLD) {
          if (this.intentionalState.padIndex === i) {
            this.intentionalState.timer += 16;
            if (this.intentionalState.timer >= CONFIG.INTENTIONAL_DURATION) {
              this.onAnswer(pad.correct, pad);
              this.intentionalState = { padIndex: -1, timer: 0 };
            }
          } else {
            this.intentionalState = { padIndex: i, timer: 0 };
          }
        } else {
          this.intentionalState = { padIndex: -1, timer: 0 };
        }
      } else {
        padEl.style.transform = 'translate(-50%, -50%) scale(1)';
        padEl.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        if (this.intentionalState.padIndex === i) {
          this.intentionalState = { padIndex: -1, timer: 0 };
        }
      }
    });
  }

  onAnswer(correct, pad) {
    if (correct) {
      const xp = this.gameState.currentQuestion.xp || 10;
      QV.state.player.xp += xp;
      this.gameState.score += xp;
      this.gameState.combo++;
      this.gameState.correctStreak++;

      // Combo counter
      const comboEl = this.arenaEl.querySelector('.combo-counter');
      comboEl.style.display = 'block';
      comboEl.querySelector('span').textContent = this.gameState.combo;

      // Potion: +HP ทุก 3 ข้อถูก
      if (this.gameState.item === 'potion' && this.gameState.correctStreak % 3 === 0) {
        this.gameState.player.hp = Math.min(3, this.gameState.player.hp + 1);
        this.updateHPDisplay();
      }

      // Combo 10 = invincible bonus
      if (this.gameState.correctStreak === CONFIG.COMBO_INVINCIBLE_THRESHOLD) {
        this.showConfetti();
        QV.state.player.xp += 50;
        this.gameState.score += 50;
      }

      this.loadQuestion();
    } else {
      this.gameState.combo = 0;
      this.gameState.correctStreak = 0;
      this.arenaEl.querySelector('.combo-counter').style.display = 'none';
      this.takeDamage();
    }

    QV.saveState();
  }

  takeDamage() {
    // Shield blocks first hit
    if (this.gameState.player.shielded) {
      this.gameState.player.shielded = false;
      return;
    }

    // Combo invincible
    if (this.gameState.correctStreak >= CONFIG.COMBO_INVINCIBLE_THRESHOLD) {
      return;
    }

    this.gameState.player.hp--;
    this.updateHPDisplay();

    if (this.gameState.player.hp <= 0) {
      this.showDefeat();
    }
  }

  updateHPDisplay() {
    const hearts = this.arenaEl.querySelectorAll('.hp-heart');
    hearts.forEach((heart, i) => {
      heart.style.opacity = i < this.gameState.player.hp ? '1' : '0.3';
    });
  }

  updateCampingDetection(dt) {
    const px = this.gameState.player.x;
    const py = this.gameState.player.y;
    const dx = px - this.gameState.lastPosition.x;
    const dy = py - this.gameState.lastPosition.y;
    const moved = Math.sqrt(dx * dx + dy * dy);

    if (moved < 1) {
      this.gameState.campingTimer += dt;
      if (this.gameState.campingTimer > CONFIG.CAMPING_WARNING_TIME) {
        if (!this.gameState.campingWarning) {
          this.gameState.campingWarning = true;
          this.arenaEl.querySelector('.camping-warning').style.display = 'block';
          // Targeted fireball
          this.spawnTargetedFireball(px, py);
        }
      }
    } else {
      this.gameState.campingTimer = 0;
      this.gameState.campingWarning = false;
      this.arenaEl.querySelector('.camping-warning').style.display = 'none';
      this.gameState.lastPosition = { x: px, y: py };
    }
  }

  updateAttacks(dt) {
    this.attackTimer += dt;
    if (this.attackTimer > this.config.baseDifficulty.attackInterval) {
      this.attackTimer = 0;
      this.spawnAttack();
    }

    this.gameState.attacks = this.gameState.attacks.filter(attack => {
      if (attack.type === 'fireball') {
        attack.x += attack.vx * dt * 0.06;
        attack.y += attack.vy * dt * 0.06;

        const dx = attack.x - this.gameState.player.x;
        const dy = attack.y - this.gameState.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 3) {
          this.takeDamage();
          attack.el.remove();
          return false;
        }

        if (attack.x < 0 || attack.x > 100 || attack.y < 0 || attack.y > 100) {
          attack.el.remove();
          return false;
        }

        attack.el.style.left = `${attack.x}%`;
        attack.el.style.top = `${attack.y}%`;
      } else if (attack.type === 'ice') {
        attack.duration -= dt;
        if (attack.duration <= 0) {
          attack.el.remove();
          this.gameState.player.frozen = false;
          return false;
        }

        const dx = attack.x - this.gameState.player.x;
        const dy = attack.y - this.gameState.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 15 && !this.gameState.player.frozen) {
          this.gameState.player.frozen = true;
          setTimeout(() => {
            this.gameState.player.frozen = false;
          }, CONFIG.ICE_DURATION);
        }
      } else if (attack.type === 'portal') {
        attack.duration -= dt;
        if (attack.duration <= 0) {
          attack.el.remove();
          return false;
        }

        const dx = attack.x - this.gameState.player.x;
        const dy = attack.y - this.gameState.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 5 && !attack.activated) {
          attack.activated = true;
          setTimeout(() => {
            this.gameState.player.x = Math.random() * 80 + 10;
            this.gameState.player.y = Math.random() * 80 + 10;
          }, CONFIG.PORTAL_WARP_DELAY);
        }
      }

      return true;
    });
  }

  spawnAttack() {
    const types = ['fireball', 'ice', 'portal'];
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === 'fireball') {
      const side = Math.floor(Math.random() * 4);
      let x, y, vx, vy;
      if (side === 0) { x = Math.random() * 100; y = 0; vx = 0; vy = 1; }
      else if (side === 1) { x = 100; y = Math.random() * 100; vx = -1; vy = 0; }
      else if (side === 2) { x = Math.random() * 100; y = 100; vx = 0; vy = -1; }
      else { x = 0; y = Math.random() * 100; vx = 1; vy = 0; }

      const el = document.createElement('div');
      el.className = 'attack-fireball';
      el.style.cssText = `
        position: absolute;
        width: 3vw;
        height: 3vw;
        background: ${this.config.attackTheme.fireball.color};
        border-radius: 999px;
        box-shadow: 0 0 15px ${this.config.attackTheme.fireball.color};
        left: ${x}%;
        top: ${y}%;
        transform: translate(-50%, -50%);
        z-index: 5;
      `;
      this.arenaEl.appendChild(el);
      this.gameState.attacks.push({ type: 'fireball', x, y, vx, vy, el });
    } else if (type === 'ice') {
      const x = Math.random() * 80 + 10;
      const y = Math.random() * 80 + 10;

      const el = document.createElement('div');
      el.className = 'attack-ice';
      el.style.cssText = `
        position: absolute;
        width: 30vw;
        height: 30vw;
        background: radial-gradient(circle, ${this.config.attackTheme.ice.color}33, transparent);
        border: 2px dashed ${this.config.attackTheme.ice.color};
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        transform: translate(-50%, -50%);
        z-index: 5;
      `;
      this.arenaEl.appendChild(el);
      this.gameState.attacks.push({ type: 'ice', x, y, duration: CONFIG.ICE_DURATION, el });
    } else if (type === 'portal') {
      const x = Math.random() * 80 + 10;
      const y = Math.random() * 80 + 10;

      const el = document.createElement('div');
      el.className = 'attack-portal';
      el.style.cssText = `
        position: absolute;
        width: 8vw;
        height: 8vw;
        background: radial-gradient(circle, ${this.config.attackTheme.portal.color}, transparent);
        border: 3px solid ${this.config.attackTheme.portal.color};
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        transform: translate(-50%, -50%);
        animation: portalSpin 2s linear infinite;
        z-index: 5;
      `;
      this.arenaEl.appendChild(el);
      this.gameState.attacks.push({ type: 'portal', x, y, duration: 5000, activated: false, el });
    }
  }

  spawnTargetedFireball(targetX, targetY) {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    if (side === 0) { x = Math.random() * 100; y = 0; }
    else if (side === 1) { x = 100; y = Math.random() * 100; }
    else if (side === 2) { x = Math.random() * 100; y = 100; }
    else { x = 0; y = Math.random() * 100; }

    const dx = targetX - x;
    const dy = targetY - y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const vx = (dx / len) * CONFIG.FIREBALL_SPEED;
    const vy = (dy / len) * CONFIG.FIREBALL_SPEED;

    const el = document.createElement('div');
    el.className = 'attack-fireball targeted';
    el.style.cssText = `
      position: absolute;
      width: 4vw;
      height: 4vw;
      background: #FF4444;
      border-radius: 999px;
      box-shadow: 0 0 20px #FF4444;
      left: ${x}%;
      top: ${y}%;
      transform: translate(-50%, -50%);
      z-index: 5;
    `;
    this.arenaEl.appendChild(el);
    this.gameState.attacks.push({ type: 'fireball', x, y, vx, vy, el });
  }

  triggerEvent() {
    const events = ['asteroid', 'blackhole', 'gift'];
    const event = events[Math.floor(Math.random() * events.length)];

    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';
    eventCard.innerHTML = `<img src="assets/event_${event}.webp" alt="${event}">`;
    this.arenaEl.appendChild(eventCard);

    setTimeout(() => eventCard.remove(), 3000);

    if (event === 'asteroid') {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const x = Math.random() * 100;
          const y = -10;
          const el = document.createElement('div');
          el.className = 'event-asteroid';
          el.style.cssText = `
            position: absolute;
            width: 5vw;
            height: 5vw;
            background: url('assets/event_asteroid.webp') center/cover;
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            transform: translate(-50%, -50%);
            z-index: 5;
          `;
          this.arenaEl.appendChild(el);
          
          const fallInterval = setInterval(() => {
            const currentTop = parseFloat(el.style.top);
            el.style.top = `${currentTop + 2}%`;
            
            const dx = x - this.gameState.player.x;
            const dy = currentTop - this.gameState.player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 5) {
              this.takeDamage();
              clearInterval(fallInterval);
              el.remove();
            }
            
            if (currentTop > 110) {
              clearInterval(fallInterval);
              el.remove();
            }
          }, 50);
        }, i * 500);
      }
    } else if (event === 'blackhole') {
      const centerX = 50;
      const centerY = 50;
      const duration = 6000;
      const startTime = performance.now();

      const blackholeInterval = setInterval(() => {
        const elapsed = performance.now() - startTime;
        if (elapsed > duration) {
          clearInterval(blackholeInterval);
          return;
        }

        // Pull pads toward center
        this.gameState.pads.forEach((pad, i) => {
          const dx = centerX - pad.x;
          const dy = centerY - pad.y;
          pad.x += dx * 0.02;
          pad.y += dy * 0.02;

          const padEl = this.arenaEl.querySelector(`.answer-pad[data-index="${i}"]`);
          if (padEl) {
            padEl.style.left = `${pad.x}%`;
            padEl.style.top = `${pad.y}%`;
          }
        });
      }, 50);
    } else if (event === 'gift') {
      this.gameState.player.hp = Math.min(3, this.gameState.player.hp + 1);
      this.updateHPDisplay();
    }
  }

  showConfetti() {
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: ${['#FFD700', '#FF69B4', '#00CED1'][Math.floor(Math.random() * 3)]};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: confettiFall ${1 + Math.random()}s linear;
        z-index: 100;
      `;
      this.arenaEl.appendChild(confetti);
      setTimeout(() => confetti.remove(), 2000);
    }
  }

  gameLoop(timestamp = 0) {
    const dt = timestamp - this.lastTime;
    this.lastTime = timestamp;

    if (dt < 100) {
      this.updatePlayer(dt);
      this.updatePet(dt);
      this.checkPadCollision();
      this.updateCampingDetection(dt);
      this.updateAttacks(dt);
    }

    this.rafId = requestAnimationFrame((t) => this.gameLoop(t));
  }

  showVictory() {
    this.cleanup();
    
    const victory = document.createElement('div');
    victory.className = 'boss-result victory';
    victory.innerHTML = `
      <h2>ชนะแล้ว!</h2>
      <img src="${this.config.bossImg}" alt="${this.config.name}">
      <p>${this.config.victoryMsg}</p>
      <p class="score">คะแนน: ${this.gameState.score} XP</p>
      <button class="btn btn-gold" onclick="QV.app.navigate('boss-hall')">ก