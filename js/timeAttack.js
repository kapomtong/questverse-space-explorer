// Time Attack mode — ตอบครบ 10 ข้อภายในเวลา 90 วินาที
// ใช้ BossBattle engine ของ boss.js (options: timeLimit, onTimeUp)
QV.app.screens['time-attack'] = {
  render(state, params) {
    // BossBattle สร้าง DOM เองบน container
    return null;
  },
  mount(params) {
    this.timeLimit = 90;
    this.questionsAnswered = 0;
    this.correctAnswers = 0;
    this.scoreAtStart = QV.state.player.xp || 0;
    this.finished = false;

    const container = document.getElementById('app');
    container.innerHTML = '';

    this.battleInstance = new BossBattle(container, 'mathos', {
      timeLimit: this.timeLimit,
      onTimeUp: (finalScore) => {
        if (this.finished) return;
        this.finished = true;
        const bonus = Math.max(0, Math.floor((this.battleInstance ? this.battleInstance.gameState.timeRemaining : 0) * 10));
        const total = finalScore || 0;
        this.showResult(total >= this.battleInstance.gameState.questionCount * 5);
      }
    });

    // สร้างหน้า intro ของ Time Attack
    const intro = document.createElement('div');
    intro.className = 'ta-intro';
    intro.innerHTML = `
      <h1>⏱️ Time Attack</h1>
      <div class="ta-rules">
        <p>ตอบคำถามให้ครบ <b>10 ข้อ</b> ภายใน <b>90 วินาที</b></p>
        <p>ตอบถูก 1 ข้อ = ฟื้นเวลา +5 วิ</p>
        <p>เวลาเหลือ × 10 = โบนัส XP!</p>
      </div>
      <button class="btn btn-gold" id="btn-ta-start">เริ่มเลย!</button>
      <button class="btn btn-primary" id="btn-ta-back">กลับห้องโถง</button>
    `;
    container.appendChild(intro);

    document.getElementById('btn-ta-start').addEventListener('click', () => {
      container.innerHTML = '';
      this.battleInstance.mount();
    });
    document.getElementById('btn-ta-back').addEventListener('click', () => QV.app.show('boss-hall'));
  },
  showResult(totalXP) {
    this.cleanup();
    const container = document.getElementById('app');
    const won = this.battleInstance.gameState.questionCount >= 10;
    const result = document.createElement('div');
    result.className = 'ta-result ' + (won ? 'victory' : 'defeat');
    result.innerHTML = `
      <h1>${won ? '🎉 สำเร็จ!' : '⏰ หมดเวลา'}</h1>
      <div class="ta-stats">
        <div class="ta-stat">คำถามที่ตอบ: ${this.battleInstance.gameState.questionCount}/10</div>
        <div class="ta-stat">คอมโบสูงสุด: ${this.battleInstance.gameState.maxCombo}x</div>
        <div class="ta-stat total">รวม XP: +${totalXP}</div>
      </div>
      <button class="btn btn-gold" id="btn-ta-retry">เล่นใหม่อีกครั้ง</button>
      <button class="btn btn-primary" id="btn-ta-home">กลับห้องโถง</button>
    `;
    container.appendChild(result);
    document.getElementById('btn-ta-retry').addEventListener('click', () => QV.app.show('time-attack'));
    document.getElementById('btn-ta-home').addEventListener('click', () => QV.app.show('boss-hall'));
  },
  cleanup() {
    if (this.battleInstance && this.battleInstance.cleanup) {
      try { this.battleInstance.cleanup(); } catch (e) { console.error(e); }
    }
    this.battleInstance = null;
  }
};
