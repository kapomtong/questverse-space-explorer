const BOSS_CONFIGS = {
  mathos: {
    id: 'mathos',
    name: 'Mathos',
    subject: 'math',
    difficulty: 1,
    requiredXP: 0,
    arenaBg: 'assets/arena_mathos_hd.webp',
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
    arenaBg: 'assets/arena_chronos_hd.webp',
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
    { left: 12, top: 55 },
    { left: 88, top: 55 },
    { left: 20, top: 72 },
    { left: 80, top: 72 },
    { left: 15, top: 88 },
    { left: 85, top: 88 },
    { left: 35, top: 85 },
    { left: 65, top: 85 }
  ],
  PAD_MIN_TOP: 40,
  PAD_MIN_DISTANCE: 22,
  PLAYER_SPEED: 0.4,
  INTENTIONAL_THRESHOLD: 0.15,
  INTENTIONAL_DURATION: 800,
  CAMPING_WARNING_TIME: 4500,
  WIN_AT: 10, // ตอบถูก 10 ข้อ = ชนะบอส
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
      correctCount: 0,
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
      timeLimit: 0,
      timeRemaining: 0,
      maxCombo: 0,
      pet: { x: 50, y: 50, bobOffset: 0 }
    };

    this.intentionalState = { padIndex: -1, timer: 0 };
    const options = arguments[2] || {};
    if (options.timeLimit) {
      this.gameState.timeLimit = options.timeLimit;
      this.gameState.timeRemaining = options.timeLimit;
    }
    this.onAnswerCallback = options.onAnswer || null;
    this.onTimeUpCallback = options.onTimeUp || null;
    this.rafId = null;
    this.running = false;
    this.lastTime = 0;
    this.attackTimer = 0;
    this.eventTimer = 0;
    this.questionPool = [];
    this.usedQuestions = new Set();

    // Shield item: กันดาเมจครั้งแรก
    if (this.gameState.item === 'shield') this.gameState.player.shielded = true;
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
    // Question bar
    const qbar = document.createElement('div');
    qbar.className = 'boss-question-bar';
    qbar.innerHTML = '<span id="boss-q-text">กำลังโหลดคำถาม...</span>';
    arena.appendChild(qbar);

    // Player
    const suit = (QV.state && QV.state.player && QV.state.player.suit) || 'red';
    const player = document.createElement('div');
    player.className = 'boss-player';
    player.style.cssText = `
      position: absolute;
      width: 9vw;
      max-width: 96px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      transition: left 0.06s linear, top 0.06s linear;
      z-index: 10;
    `;
    player.innerHTML = `<img src="assets/suit_${suit}.webp" alt="นักผจญภัย" onerror="this.style.display='none'">`;
    arena.appendChild(player);
    this.playerEl = player;
    // Sprite animation: preload walk/idle/attack frames (fallback keeps the suit img)
    this.playerSprite = { frames: { walk: [], idle: [], attack: [] }, atkTimer: null, lastSwap: 0 };
    ['walk', 'idle', 'attack'].forEach(anim => {
      for (let i = 0; i < 4; i++) {
        const img = new Image();
        img.src = `assets/player_${anim}_${i}.webp`;
        img.onload = () => { if (img.naturalWidth > 50) this.playerSprite.frames[anim][i] = img; };
      }
    });

    // Pet Mito
    const pet = document.createElement('div');
    pet.className = 'pet-mito';
    pet.innerHTML = `<img src="assets/pet_mito.webp" alt="Mito" style="width: 100%; height: 100%;">`;
    arena.appendChild(pet);
    this.petEl = pet;
    // Boss sprite: .boss-roam (inner) carries inline position/transform;
    // the outer .boss-sprite carries the animation so transforms never collide.
    const bossSprite = document.createElement('div');
    bossSprite.className = 'boss-sprite';
    const bossRoam = document.createElement('div');
    bossRoam.className = 'boss-roam';
    bossRoam.innerHTML = `<img src="${this.config.bossImg}" alt="${this.config.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%23222%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23aaa%22 font-size=%2248%22%3E👾%3C/text%3E%3C/svg%3E'">`;
    bossSprite.appendChild(bossRoam);
    arena.appendChild(bossSprite);
    this.bossSpriteEl = bossSprite;
    this.bossRoamEl = bossRoam;
    this.boss = { t: 0, jitterX: 0, jitterUntil: 0, tauntAt: performance.now() + 5000, attackUntil: 0 };

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
    // ซ่อนบอสขณะ intro ไม่ให้โผล่ซ้อน intro overlay
    const introBoss = this.arenaEl.querySelector(".boss-roam");
    if (introBoss) introBoss.style.visibility = "hidden";

    setTimeout(() => {
      cutIn.style.opacity = '0';
      setTimeout(() => {
        cutIn.remove();
        const postBoss = this.arenaEl.querySelector(".boss-roam");
        if (postBoss) postBoss.style.visibility = "visible";
        this.startBattle();
      }, 500);
    }, 3000);
  }

  startBattle() {
    this.running = true;
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
    // แมปวิชาของบอส → คีย์ข้อความจริงใน QV.QUESTIONS (โครงสร้างเดิม: ดาว 5 ดวง x โซน)
    const map = { math: 'numberon', science: 'bionia', thai: 'aksara', english: 'lingua', social: 'civilis' };
    const planetKey = map[subject] || subject;
    const planet = QV.QUESTIONS[planetKey] || {};
    // รวมข้อความทั้งหมดจากทุกโซนของดาวดวงนั้น
    const questions = [];
    Object.values(planet).forEach(zoneQs => {
      if (Array.isArray(zoneQs)) questions.push(...zoneQs);
    });
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
    const qText = this.arenaEl.querySelector('#boss-q-text');
    if (qText) qText.innerHTML = typeof QV.formatFrac === 'function' ? QV.formatFrac(QV.escapeHtml(q.q)) : QV.escapeHtml(q.q);
    
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
    const available = [...CONFIG.PAD_SLOTS].filter(s => s.top >= CONFIG.PAD_MIN_TOP);
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
        width: 13vw;
        height: 13vw;
        background: radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(56, 189, 248, 0.05) 55%, transparent 72%);
        border: 2.5px solid rgba(125, 249, 255, 0.75);
        border-radius: 999px;
        box-shadow: 0 0 18px rgba(125, 249, 255, 0.4), inset 0 0 14px rgba(125, 249, 255, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: clamp(0.95rem, 1.7vw, 1.3rem);
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
        width: 62%;
        height: 62%;
        background: rgba(255, 255, 255, 0.12);
        border: 1.5px solid rgba(125, 249, 255, 0.55);
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        text-shadow: 0 0 10px rgba(125, 249, 255, 0.9);
        backdrop-filter: blur(3px);
        letter-spacing: 0.5px;
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
      this.playerEl.classList.add('combo-dash');
    } else {
      this.playerEl.classList.remove('combo-dash');
    }

    this.gameState.player.vx = dx * speed;
    this.gameState.player.vy = dy * speed;

    this.gameState.player.x += this.gameState.player.vx;
    this.gameState.player.y += this.gameState.player.vy;

    // Bounds
    this.gameState.player.x = Math.max(5, Math.min(95, this.gameState.player.x));
    this.gameState.player.y = Math.max(5, Math.min(95, this.gameState.player.y));

    this.playerEl.style.left = `calc(${this.gameState.player.x}% - ${this.playerEl.offsetWidth / 2}px)`;
    this.playerEl.style.top = `calc(${this.gameState.player.y}% - ${this.playerEl.offsetHeight / 2}px)`;
    if (this.gameState.player.vx < -0.001) {
      this.playerEl.style.transform = 'scaleX(-1)';
    } else if (this.gameState.player.vx > 0.001) {
      this.playerEl.style.transform = 'scaleX(1)';
    }
    // Sprite animation: walk / idle / attack frames
    this.updatePlayerSprite(dt);

    // Shield visual
    if (this.gameState.player.shielded) {
      this.playerEl.classList.add('shielded');
    } else {
      this.playerEl.classList.remove('shielded');
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

      const effDist = dist;
      if (effDist < 6) {
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
      this.gameState.correctCount = (this.gameState.correctCount || 0) + 1;
      // ชนะบอส: ตอบถูกครบ WIN_AT ข้อ
      if (this.gameState.correctCount >= CONFIG.WIN_AT) {
        this.showVictory();
        return;
      }
      if (this.gameState.combo > this.gameState.maxCombo) this.gameState.maxCombo = this.gameState.combo;

      // Time Attack: โบนัสเวลา +5 วิ
      if (this.gameState.timeLimit > 0) {
        this.gameState.timeRemaining = Math.min(this.gameState.timeLimit, this.gameState.timeRemaining + 5);
        const taTimer = this.arenaEl.querySelector('.ta-timer');
        if (taTimer) taTimer.textContent = Math.ceil(this.gameState.timeRemaining) + 's';
        // ตอบครบ 10 ข้อ = ชนะ Time Attack
                if (this.gameState.questionCount >= 10) {
          this.timeAttackBonus();
          return;
        }
      }
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

      // บอสสะเทือนถูกทำร้าย
      this.bossHurt();
      this.playerAttack(); // ตัวละครทำท่าตีบอสจริง
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

  // ---- อนิเมชันบอสขยับ (roam + ลีลา) ----
  updateBoss(dt) {
    if (!this.bossSpriteEl) return;
    const now = performance.now();
    const b = this.boss;
    b.t += dt;
    const t = b.t / 1000;
    // เลื่อนซ้าย-ขวาช้าๆ แบบ wave + ลีลาเอียงตามทิศ
    const swayX = 20 * Math.sin(t / 3.5);
    const swayY = 1.2 * Math.sin(t / 2.2);
    const dir = Math.cos(t / 3.5);
    const tilt = 4 * Math.sin(t / 0.9);
    const armSwing = 2.2 * Math.sin(t / 0.55);
    const legBounce = Math.abs(Math.sin(t / 0.9)) * 1.6;
    // กระชากสั้นๆ (jitter) สุ่มทุก 4-7 วิ
    let jx = 0;
    if (now < b.jitterUntil) {
      jx = b.jitterX * Math.sin((b.jitterUntil - now) / 120);
    } else if (Math.random() < 0.004) {
      b.jitterX = (Math.random() - 0.5) * 26;
      b.jitterUntil = now + 420;
    }
    // ลีลา Taunt ชูแขน/โยกแรง สั้นๆ ทุก ~6 วิ
    let taunt = 0;
    if (now > b.tauntAt && now < b.tauntAt + 700) {
      taunt = (1 - (now - b.tauntAt) / 700) * 6;
    } else if (now > b.tauntAt) {
      b.tauntAt = now + 5500 + Math.random() * 2500;
    }
    // หาวหน้าลุ้นเมื่อยิง projectile (bossLunge)
    let atk = 0;
    if (now < b.attackUntil) {
      atk = (1 - (b.attackUntil - now) / 450) * 14;
    }
    const x = 50 + swayX + jx;
    const y = swayY + taunt + atk + legBounce * 0.4;
    const rot = tilt + dir * 2;
    this.bossRoamEl.style.cssText = `bottom: calc(8% - ${y.toFixed(2)}vw); left: ${x.toFixed(2)}%; transform: translateX(-50%) rotate(${rot.toFixed(1)}deg) skewY(${(armSwing * 0.5).toFixed(1)}deg) scaleX(${dir < 0 ? -1 : 1});`;
    // สถานะ angry เมื่อคอมโบสูง
    if (this.gameState.combo >= 3) {
      this.bossSpriteEl.classList.add('angry');
    } else {
      this.bossSpriteEl.classList.remove('angry');
    }
  }
  // กระตุ้นให้บอสทำท่าโจมตี (นำหน้า projectile)
  bossLunge() {
    if (this.boss) this.boss.attackUntil = performance.now() + 450;
    if (this.bossSpriteEl) this.bossSpriteEl.classList.add('attacking');
    if (this.bossAtkTimer) clearTimeout(this.bossAtkTimer);
    this.bossAtkTimer = setTimeout(() => {
      if (this.bossSpriteEl) this.bossSpriteEl.classList.remove('attacking');
    }, 460);
  }
  // อนิเมชันตีของผู้เล่น: เล่น sprite attack ตามเฟรม
  playerAttack() {
    const fs = this.playerSprite.frames.attack.filter(Boolean);
    const imgEl = this.playerEl.querySelector('img');
    if (!fs.length || !imgEl) return;
    let f = 0;
    const total = fs.length * 2;
    const tick = () => {
      const frame = fs[f % fs.length];
      if (frame) {
        imgEl.src = frame.src;
        imgEl.style.objectFit = 'contain';
      }
      f++;
      if (f < total) {
        this.playerSprite.atkTimer = setTimeout(tick, 90);
      } else {
        this.playerSprite.atkTimer = null;
      }
    };
    if (this.playerSprite.atkTimer) clearTimeout(this.playerSprite.atkTimer);
    tick();
  }
  updatePlayerSprite(dt) {
    if (this.playerSprite.atkTimer) return;
    const imgEl = this.playerEl.querySelector('img');
    if (!imgEl) return;
    const moving = Math.abs(this.gameState.player.vx) > 0.001 || Math.abs(this.gameState.player.vy) > 0.001;
    const interval = moving ? 130 : 700;
    if (performance.now() - this.playerSprite.lastSwap < interval) return;
    this.playerSprite.lastSwap = performance.now();
    const frames = (moving ? this.playerSprite.frames.walk : this.playerSprite.frames.idle).filter(Boolean);
    if (!frames.length) return;
    const idx = moving ? Math.floor(performance.now() / 130) % frames.length : Math.floor(performance.now() / 700) % Math.max(1, frames.length);
    imgEl.src = frames[idx].src;
    imgEl.style.objectFit = 'contain';
  }
  // กระตุ้นให้บอสสะเทือนเมื่อผู้เล่นตอบถูก
  bossHurt() {
    if (!this.bossSpriteEl) return;
    this.bossSpriteEl.classList.remove('damaged');
    void this.bossSpriteEl.offsetWidth;
    this.bossSpriteEl.classList.add('damaged');
    if (this.bossDmgTimer) clearTimeout(this.bossDmgTimer);
    this.bossDmgTimer = setTimeout(() => {
      this.bossSpriteEl.classList.remove('damaged');
    }, 320);
  }
  gameLoop(timestamp = 0) {
    if (!this.running) return;
    const dt = timestamp - this.lastTime;
    this.lastTime = timestamp;

    // Time Attack countdown
    if (this.gameState.timeLimit > 0) {
      this.gameState.timeRemaining -= dt / 1000;
      const taTimer = this.arenaEl.querySelector('.ta-timer');
      if (taTimer) taTimer.textContent = Math.ceil(Math.max(0, this.gameState.timeRemaining)) + 's';
      if (this.gameState.timeRemaining <= 0) {
        this.showTimeUp();
        return;
      }
    }

    if (dt < 100) {
      this.updatePlayer(dt);
      this.updatePet(dt);
      this.updateBoss(dt);
      this.checkPadCollision();
      this.updateCampingDetection(dt);
      this.updateAttacks(dt);
    }

    this.rafId = requestAnimationFrame((t) => this.gameLoop(t));
  }

  timeAttackBonus() {
    const bonus = Math.floor(this.gameState.timeRemaining * 10);
    QV.state.player.xp += bonus;
    this.gameState.score += bonus;
    this.cleanup();
    const victory = document.createElement('div');
    victory.className = 'boss-result victory';
    victory.innerHTML = `
      <h2>หมดเวลา — ทำสำเร็จ!</h2>
      <p>ตอบครบ 10 ข้อ | เวลาเหลือ: ${Math.ceil(this.gameState.timeRemaining)}s</p>
      <p class="score">คะแนนรวม: ${this.gameState.score} XP (+โบนัสเวลา ${bonus} XP)</p>
      ${this.onTimeUpCallback ? '' : '<button class="btn btn-gold" id="btn-ta-back">กลับห้องโถง</button>'}
    `;
    this.root.appendChild(victory);
    const btn = document.getElementById('btn-ta-back');
    if (btn) btn.addEventListener('click', () => QV.app.show('boss-hall'));
    if (this.onTimeUpCallback) this.onTimeUpCallback(this.gameState.score);
    QV.saveState();
    if (typeof QV.refreshEnergy === 'function') QV.refreshEnergy(QV.state);
  }

  showTimeUp() {
    this.cleanup();
    const defeat = document.createElement('div');
    defeat.className = 'boss-result defeat';
    defeat.innerHTML = `
      <h2>หมดเวลา!</h2>
      <p>ตอบได้ ${this.gameState.questionCount} ข้อ</p>
      ${this.onTimeUpCallback ? '<button class="btn btn-gold" id="btn-tu-back">กลับห้องโถง</button>' : '<button class="btn btn-gold" id="btn-tu-back">กลับห้องโถง</button>'}
    `;
    this.root.appendChild(defeat);
    document.getElementById('btn-tu-back').addEventListener('click', () => QV.app.show('boss-hall'));
    if (this.onTimeUpCallback) this.onTimeUpCallback(null);
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
      <button class="btn btn-gold" id="btn-victory-home">กลับบ้าน</button>
      <button class="btn btn-primary" id="btn-victory-rematch">ท้าใหม่อีกครั้ง</button>
    `;
    this.root.appendChild(victory);

    // Bonus XP และ Badge
    const victoryXp = Math.floor(this.gameState.score * 0.5);
    if (victoryXp > 0) QV.state.player.xp += victoryXp;
    const bossBadge = `boss-${this.config.id}`;
    QV.state.player.badges = QV.state.player.badges || [];
    if (!QV.state.player.badges.includes(bossBadge)) QV.state.player.badges.push(bossBadge);

    // Leaderboard
    QV.state.leaderboard = QV.state.leaderboard || [];
    QV.state.leaderboard.push({ name: QV.state.player.name || 'นักเรียน', xp: this.gameState.score, boss: this.config.name, timestamp: Date.now() });
    QV.state.leaderboard.sort((a, b) => b.xp - a.xp);
    QV.state.leaderboard = QV.state.leaderboard.slice(0, 10);

    QV.state.boss = QV.state.boss || {};
    QV.state.boss.selectedItem = null;
    QV.saveState();
    if (typeof QV.refreshEnergy === 'function') QV.refreshEnergy(QV.state);

    document.getElementById('btn-victory-home').addEventListener('click', () => QV.app.show('boss-hall'));
    document.getElementById('btn-victory-rematch').addEventListener('click', () => QV.app.show('boss', { bossId: this.config.id }));
  }

  showDefeat() {
    this.cleanup();
    const defeat = document.createElement('div');
    defeat.className = 'boss-result defeat';
    defeat.innerHTML = `
      <h2>พ่ายแพ้!</h2>
      <img src="${this.config.bossImg}" alt="${this.config.name}" style="width:180px;border-radius:12px;">
      <p>${this.config.defeatMsg}</p>
      <p class="score">ตอบถูก: ${this.gameState.questionCount} ข้อ | คอมโบสูงสุด: ${this.gameState.maxCombo || this.gameState.combo}x</p>
      <button class="btn btn-gold" id="btn-defeat-rematch">แก้อีกครั้ง</button>
      <button class="btn btn-primary" id="btn-defeat-home">กลับห้องโถง</button>
    `;
    this.root.appendChild(defeat);
    document.getElementById('btn-defeat-rematch').addEventListener('click', () => QV.app.show('boss', { bossId: this.config.id }));
    document.getElementById('btn-defeat-home').addEventListener('click', () => QV.app.show('boss-hall'));
  }

  cleanup() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.attackTimerId) clearTimeout(this.attackTimerId);
    if (this.eventTimerId) clearTimeout(this.eventTimerId);
    if (this.comboTimerId) clearTimeout(this.comboTimerId);
    if (this.keydownHandler) window.removeEventListener('keydown', this.keydownHandler);
    if (this.keyupHandler) window.removeEventListener('keyup', this.keyupHandler);
    this.rafId = null;
    this.attackTimerId = null;
    this.eventTimerId = null;
  }
}

// ลงทะเบียน screen กับ app.js (contract: render(state, params), mount(params))
if (typeof QV !== 'undefined' && QV.app) {
  let currentBattle = null;
  QV.app.screens.boss = {
    render(state, params) {
      return null;
    },
    mount(params) {
      const container = document.getElementById('app');
      container.innerHTML = '';
      currentBattle = new BossBattle(container, params?.bossId || 'mathos');
      currentBattle.mount();
    },
    cleanup() {
      if (currentBattle) { try { currentBattle.cleanup(); } catch (e) { console.error(e); } currentBattle = null; }
    }
  };
}
