ลับบ้าน</button>
      <button class="btn btn-primary" onclick="QV.app.navigate('boss-select', { bossId: '${this.config.id}' })">แก้อีกครั้ง</button>
    `;
    document.getElementById('game-over-ui').innerHTML = html;
    document.getElementById('game-over-ui').classList.remove('hidden');
    
    // Calculate victory XP
    let victoryXp = this.config.baseXp;
    if (this.gameState.timeLimit > 0) {
      const timeBonus = Math.floor(this.gameState.timeLimit * 0.5);
      victoryXp += timeBonus;
    }
    
    // Update player state
    QV.state.player.xp += victoryXp;
    const bossBadge = `boss-${this.config.id}`;
    if (!QV.state.player.badges.includes(bossBadge)) {
      QV.state.player.badges.push(bossBadge);
    }
    
    // Update leaderboard
    QV.state.leaderboard.push({
      name: QV.state.player.name || 'นักเรียน',
      xp: victoryXp,
      boss: this.config.name,
      timestamp: Date.now()
    });
    QV.state.leaderboard.sort((a, b) => b.xp - a.xp);
    QV.state.leaderboard = QV.state.leaderboard.slice(0, 10);
    
    // Reset selected item
    QV.state.selectedItem = null;
    
    QV.saveState();
    QV.refreshEnergy();
  }

  showDefeat() {
    this.stopGameLoop();
    const html = `
      <div class="game-over-card defeat">
        <h2>พ่ายแพ้!</h2>
        <p class="defeat-msg">${this.config.defeatMsg}</p>
        <div class="stats">
          <div class="stat-item">
            <span class="label">คะแนน</span>
            <span class="value">${this.gameState.score}</span>
          </div>
          <div class="stat-item">
            <span class="label">คอมโบสูงสุด</span>
            <span class="value">${this.gameState.maxCombo || this.gameState.combo}x</span>
          </div>
        </div>
      </div>
      <button class="btn btn-primary" onclick="QV.app.currentView.mount()">แก้อีกครั้ง</button>
      <button class="btn btn-secondary" onclick="QV.app.navigate('boss-hall')">กลับบ้าน</button>
    `;
    document.getElementById('game-over-ui').innerHTML = html;
    document.getElementById('game-over-ui').classList.remove('hidden');
  }

  mount() {
    this.createDOM();
    this.loadQuestion();
    
    // Show intro cut-in
    const introCutIn = document.createElement('div');
    introCutIn.className = 'intro-cutin';
    introCutIn.innerHTML = `
      <img src="${this.config.image}" alt="${this.config.name}" class="boss-intro-image">
      <h2 class="boss-intro-name">${this.config.name}</h2>
      <p class="boss-intro-text">${this.config.introCutIn}</p>
    `;
    this.root.appendChild(introCutIn);
    
    // Add intro animation styles
    const style = document.createElement('style');
    style.textContent = `
      .intro-cutin {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
        z-index: 9999;
        animation: fadeOut 3s forwards;
      }
      .boss-intro-image {
        width: 200px;
        height: 200px;
        object-fit: cover;
        border-radius: 50%;
        animation: scaleIn 0.6s ease-out;
      }
      .boss-intro-name {
        font-size: 2.5rem;
        color: var(--accent);
        animation: slideUp 0.6s ease-out 0.2s backwards;
      }
      .boss-intro-text {
        font-size: 1.25rem;
        color: var(--text-secondary);
        animation: slideUp 0.6s ease-out 0.4s backwards;
      }
      @keyframes fadeOut {
        0%, 85% { opacity: 1; }
        100% { opacity: 0; pointer-events: none; }
      }
      @keyframes scaleIn {
        from { transform: scale(0); }
        to { transform: scale(1); }
      }
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => introCutIn.remove(), 3000);
    
    // Start game loop after intro
    setTimeout(() => {
      this.startGameLoop();
      
      // First attack timer
      const firstAttackDelay = this.gameState.item?.id === 'shield-boost' ? 
        this.config.attackInterval * 1.4 : 
        this.config.attackInterval;
      
      this.gameState.nextAttackTime = performance.now() + firstAttackDelay;
      
      // Item boost effect for first 10 seconds
      if (this.gameState.item?.id === 'shield-boost') {
        setTimeout(() => {
          this.gameState.item = null;
        }, 10000);
      }
    }, 3000);
  }

  constructor(root, bossId, options = {}) {
    this.root = root;
    this.config = BOSS_CONFIGS[bossId];
    this.questions = [];
    this.currentQuestion = null;
    this.animationFrameId = null;
    this.lastFrameTime = 0;
    
    this.gameState = {
      player: {
        x: 57.5,
        y: 88,
        hp: 3,
        maxHp: 3
      },
      boss: {
        hp: this.config.maxHp,
        maxHp: this.config.maxHp
      },
      score: 0,
      xp: 0,
      combo: 0,
      maxCombo: 0,
      attacks: [],
      padPositions: [],
      nextAttackTime: 0,
      nextEventTime: 0,
      eventCountdown: 3,
      campingDetection: {
        positionHistory: [],
        warningShown: false
      },
      timeLimit: options.timeLimit || 0,
      timeRemaining: options.timeLimit || 0,
      item: QV.state.selectedItem ? { ...QV.state.selectedItem } : null
    };
  }
}
