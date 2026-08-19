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
