```javascript
const QV = window.QV || {};
QV.screens = QV.screens || {};

QV.screens.mission = function(params) {
  const { planetId, zoneIdx } = params;
  const state = QV.state;
  const planet = QV.PLANETS.find(p => p.id === planetId);
  const zoneName = QV.ZONE_NAMES[planetId][zoneIdx];
  const questions = QV.QUESTIONS[planetId][zoneIdx];

  // ตรวจสอบ zone เสร็จแล้วหรือไม่ (เลือก: ให้เล่นซ้ำได้แต่ไม่ได้ XP)
  const alreadyDone = state.player.zonesDone[planetId] && state.player.zonesDone[planetId].includes(zoneIdx);

  // ตรวจสอบ energy
  if (state.player.energy <= 0) {
    QV.app.toast('พลังงานหมดแล้ว! รอการเติมพลังงาน', 'wrong');
    QV.app.navigate('map');
    return;
  }

  // หัก energy
  state.player.energy -= 1;
  QV.save();

  // Mission state
  let currentQuestionIdx = 0;
  let correctCount = 0;
  let totalXpGained = 0;
  let questionStartTs = Date.now();
  let shieldActive = false;
  let comboCount = 0;

  const missionScreen = document.getElementById('mission');
  missionScreen.innerHTML = '';

  // Mission title
  const titleDiv = document.createElement('div');
  titleDiv.className = 'mission-title';
  titleDiv.innerHTML = `<span style="font-size: 2rem;">${QV.escapeHtml(planet.icon)}</span> ${QV.escapeHtml(planet.nameTh)} — ${QV.escapeHtml(zoneName)}`;
  missionScreen.appendChild(titleDiv);

  // Progress dots
  const progressDiv = document.createElement('div');
  progressDiv.className = 'progress-dots';
  for (let i = 0; i < 5; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.dataset.index = i;
    progressDiv.appendChild(dot);
  }
  missionScreen.appendChild(progressDiv);

  // Question container
  const questionDiv = document.createElement('div');
  questionDiv.className = 'mission-question';
  missionScreen.appendChild(questionDiv);

  // Choices container
  const choicesDiv = document.createElement('div');
  choicesDiv.className = 'mission-choices';
  missionScreen.appendChild(choicesDiv);

  // Feedback container
  const feedbackDiv = document.createElement('div');
  feedbackDiv.className = 'feedback';
  feedbackDiv.style.display = 'none';
  missionScreen.appendChild(feedbackDiv);

  // HUD (items + hint)
  const hudDiv = document.createElement('div');
  hudDiv.className = 'hud';
  hudDiv.style.marginTop = '2rem';
  hudDiv.style.display = 'flex';
  hudDiv.style.gap = '1rem';
  hudDiv.style.justifyContent = 'center';
  hudDiv.style.flexWrap = 'wrap';

  // Shield button
  const shieldBtn = document.createElement('button');
  shieldBtn.className = 'item-btn';
  shieldBtn.innerHTML = `🛡️ โล่ (${state.player.items.shield})`;
  shieldBtn.onclick = () => useItem('shield');
  if (state.player.items.shield <= 0) shieldBtn.disabled = true;
  hudDiv.appendChild(shieldBtn);

  // Compass button
  const compassBtn = document.createElement('button');
  compassBtn.className = 'item-btn';
  compassBtn.innerHTML = `🧭 เข็มทิศ (${state.player.items.compass})`;
  compassBtn.onclick = () => useItem('compass');
  if (state.player.items.compass <= 0) compassBtn.disabled = true;
  hudDiv.appendChild(compassBtn);

  // Telescope button
  const telescopeBtn = document.createElement('button');
  telescopeBtn.className = 'item-btn';
  telescopeBtn.innerHTML = `🔭 กล้อง (${state.player.items.telescope})`;
  telescopeBtn.onclick = () => useItem('telescope');
  if (state.player.items.telescope <= 0) telescopeBtn.disabled = true;
  hudDiv.appendChild(telescopeBtn);

  // Hint button
  const hintBtn = document.createElement('button');
  hintBtn.className = 'item-btn';
  hintBtn.innerHTML = '💡 ใช้คำใบ้';
  hintBtn.onclick = showHint;
  hudDiv.appendChild(hintBtn);

  missionScreen.appendChild(hudDiv);

  // Shield status indicator
  const shieldStatusDiv = document.createElement('div');
  shieldStatusDiv.style.marginTop = '1rem';
  shieldStatusDiv.style.textAlign = 'center';
  shieldStatusDiv.style.color = '#6EE7B7';
  shieldStatusDiv.style.fontWeight = 'bold';
  shieldStatusDiv.style.display = 'none';
  missionScreen.appendChild(shieldStatusDiv);

  function updateProgressDots() {
    const dots = progressDiv.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      if (idx < currentQuestionIdx) {
        dot.style.backgroundColor = '#6EE7B7';
      } else if (idx === currentQuestionIdx) {
        dot.style.backgroundColor = '#38BDF8';
      } else {
        dot.style.backgroundColor = '#1E2636';
      }
    });
  }

  function renderQuestion() {
    if (currentQuestionIdx >= questions.length) {
      completeMission();
      return;
    }

    const q = questions[currentQuestionIdx];
    questionStartTs = Date.now();

    questionDiv.innerHTML = `<p style="font-size: 1.25rem; margin-bottom: 1.5rem;">${QV.escapeHtml(q.q)}</p>`;

    choicesDiv.innerHTML = '';
    q.choices.forEach((choice, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice;
      btn.onclick = () => handleAnswer(idx);
      choicesDiv.appendChild(btn);
    });

    feedbackDiv.style.display = 'none';
    feedbackDiv.className = 'feedback';

    // Update item buttons
    shieldBtn.innerHTML = `🛡️ โล่ (${state.player.items.shield})`;
    shieldBtn.disabled = state.player.items.shield <= 0;
    compassBtn.innerHTML = `🧭 เข็มทิศ (${state.player.items.compass})`;
    compassBtn.disabled = state.player.items.compass <= 0;
    telescopeBtn.innerHTML = `🔭 กล้อง (${state.player.items.telescope})`;
    telescopeBtn.disabled = state.player.items.telescope <= 0;

    if (shieldActive) {
      shieldStatusDiv.style.display = 'block';
      shieldStatusDiv.textContent = '🛡️ โล่กำลังปกป้องคุณ!';
    } else {
      shieldStatusDiv.style.display = 'none';
    }

    updateProgressDots();
  }

  function handleAnswer(selectedIdx) {
    const q = questions[currentQuestionIdx];
    const buttons = choicesDiv.querySelectorAll('.choice-btn');
    buttons.forEach(btn => btn.disabled = true);

    const isCorrect = selectedIdx === q.answerIdx;
    const timeTaken = (Date.now() - questionStartTs) / 1000;

    if (isCorrect) {
      correctCount++;
      comboCount++;
      let xp = 20;

      // Fast bonus
      if (timeTaken <= 5) {
        xp += 5;
      }

      // Combo bonus
      if (comboCount >= 3 && comboCount % 3 === 0) {
        xp += 10;
      }

      totalXpGained += xp;

      feedbackDiv.className = 'feedback correct';
      let msg = `ถูกต้อง! +${xp} XP`;
      if (timeTaken <= 5) msg += ' (เร็วมาก! +5)';
      if (comboCount >= 3 && comboCount % 3 === 0) msg += ' (คอมโบ! +10)';
      feedbackDiv.textContent = msg;
      feedbackDiv.style.display = 'block';

      QV.app.toast(msg, 'correct');

      setTimeout(() => {
        currentQuestionIdx++;
        shieldActive = false;
        renderQuestion();
      }, 1500);

    } else {
      // Wrong answer
      if (shieldActive) {
        // Shield protects
        shieldActive = false;
        feedbackDiv.className = 'feedback correct';
        feedbackDiv.textContent = '🛡️ โล่ช่วยคุณไว้! ไม่ถือว่าผิด';
        feedbackDiv.style.display = 'block';
        QV.app.toast('โล่ช่วยคุณไว้!', 'item');

        setTimeout(() => {
          currentQuestionIdx++;
          renderQuestion();
        }, 1500);

      } else {
        comboCount = 0;
        feedbackDiv.className = 'feedback wrong';
        feedbackDiv.textContent = `ผิด! คำตอบที่ถูกคือ: ${QV.escapeHtml(q.choices[q.answerIdx])}`;
        feedbackDiv.style.display = 'block';

        // Shake animation
        choicesDiv.style.animation = 'shake 0.5s';
        setTimeout(() => {
          choicesDiv.style.animation = '';
        }, 500);

        QV.app.toast('ผิด! ลองใหม่ในข้อถัดไป', 'wrong');

        setTimeout(() => {
          currentQuestionIdx++;
          renderQuestion();
        }, 2000);
      }
    }
  }

  function useItem(itemId) {
    if (state.player.items[itemId] <= 0) return;

    state.player.items[itemId] -= 1;
    QV.save();

    if (itemId === 'shield') {
      shieldActive = true;
      shieldStatusDiv.style.display = 'block';
      shieldStatusDiv.textContent = '🛡️ โล่กำลังปกป้องคุณ!';
      QV.app.toast('เปิดใช้โล่! ข้อผิดครั้งถัดไปจะถูกยกเว้น', 'item');
      shieldBtn.innerHTML = `🛡️ โล่ (${state.player.items.shield})`;
      if (state.player.items.shield <= 0) shieldBtn.disabled = true;

    } else if (itemId === 'compass') {
      const q = questions[currentQuestionIdx];
      const buttons = choicesDiv.querySelectorAll('.choice-btn');
      let wrongRemoved = false;
      buttons.forEach((btn, idx) => {
        if (!wrongRemoved && idx !== q.answerIdx && !btn.disabled) {
          btn.disabled = true;
          btn.style.opacity = '0.3';
          wrongRemoved = true;
        }
      });
      QV.app.toast('เข็มทิศตัดตัวเลือกผิด 1 ตัว!', 'item');
      compassBtn.innerHTML = `🧭 เข็มทิศ (${state.player.items.compass})`;
      if (state.player.items.compass <= 0) compassBtn.disabled = true;

    } else if (itemId === 'telescope') {
      showHint();
      telescopeBtn.innerHTML = `🔭 กล้อง (${state.player.items.telescope})`;
      if (state.player.items.telescope <= 0) telescopeBtn.disabled = true;
    }
  }

  function showHint() {
    const q = questions[currentQuestionIdx];
    if (q.hint) {
      QV.app.toast(`💡 คำใบ้: ${q.hint}`, 'info');
    } else {
      QV.app.toast('ไม่มีคำใบ้สำหรับข้อนี้', 'info');
    }
  }

  function completeMission() {
    // Call game functions
    const completeResult = QV.game.completeZone(state, planetId, zoneIdx, correctCount);
    const addXpResult = QV.game.addXp(state, totalXpGained, questionStartTs);

    // Store mission result
    state.missionResult = {
      planetId,
      zoneIdx,
      correct: correctCount,
      xpGained: totalXpGained,
      rankUp: addXpResult.rankUp,
      newRank: addXpResult.newRank,
      badgesNew: [...new Set([...completeResult, ...addXpResult.badgesNew])],
      alreadyDone
    };

    QV.save();
    QV.app.navigate('summary');
  }

  renderQuestion();
};

QV.screens.summary = function() {
  const state = QV.state;
  const result = state.missionResult;

  if (!result) {
    QV.app.navigate('map');
    return;
  }

  const planet = QV.PLANETS.find(p => p.id === result.planetId);
  const zoneName = QV.ZONE_NAMES[result.planetId][result.zoneIdx];

  const summaryScreen = document.getElementById('summary');
  summaryScreen.innerHTML = '';

  const container = document.createElement('div');
  container.style.maxWidth = '600px';
  container.style.margin = '0 auto';
  container.style.padding = '2rem';

  // Title
  const titleDiv = document.createElement('div');
  titleDiv.className = 'mission-title';
  titleDiv.style.marginBottom = '2rem';
  titleDiv.innerHTML = `<span style="font-size: 2.5rem;">${QV.escapeHtml(planet.icon)}</span><br>${QV.escapeHtml(planet.nameTh)} — ${QV.escapeHtml(zoneName)}`;
  container.appendChild(titleDiv);

  // Summary card
  const card = document.createElement('div');
  card.className = 'summary-card glass-card';
  card.style.padding = '2rem';
  card.style.marginBottom = '2rem';

  // Stars
  const starsDiv = document.createElement('div');
  starsDiv.className = 'result-stars';
  starsDiv.style.fontSize = '3rem';
  starsDiv.style.marginBottom = '1.5rem';
  let stars = '';
  for (let i = 0; i < 5; i++) {
    if (i < result.correct) {
      stars += '★';
    } else {
      stars += '☆';
    }
  }
  starsDiv.textContent = stars;
  card.appendChild(starsDiv);

  // Correct count
  const correctDiv = document.createElement('div');
  correctDiv.style.fontSize = '1.5rem';
  correctDiv.style.marginBottom = '1rem';
  correctDiv.style.color = '#6EE7B7';
  correctDiv.textContent = `ตอบถูก ${result.correct}/5 ข้อ`;
  card.appendChild(correctDiv);

  // XP gained
  const xpDiv = document.createElement('div');
  xpDiv.className = 'xp-gained';
  xpDiv.style.fontSize = '1.25rem';
  xpDiv.style.marginBottom = '1rem';
  xpDiv.style.color = '#38BDF8';
  if (result.alreadyDone) {
    xpDiv.textContent = `(โซนนี้เคลียร์แล้ว — ไม่ได้ XP)`;
  } else {
    xpDiv.textContent = `+${result.xpGained} XP`;
  }
  card.appendChild(xpDiv);

  // Rank up
  if (result.rankUp && !result.alreadyDone) {
    const rankDiv = document.createElement('div');
    rankDiv.style.fontSize = '1.5rem';
    rankDiv.style.marginTop = '1.5rem';
    rankDiv.style.padding = '1rem';
    rankDiv.style.backgroundColor = 'rgba(110, 231, 183, 0.2)';
    rankDiv.style.borderRadius = '12px';
    rankDiv.style.color = '#6EE7B7';
    rankDiv.innerHTML = `🎉 ยินดีด้วย! เลื่อนยศเป็น ${QV.escapeHtml(result.newRank.emoji)} ${QV.escapeHtml(result.newRank.name)}`;
    card.appendChild(rankDiv);

    // Confetti effect
    setTimeout(() => {
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.textContent = ['🎉', '✨', '🌟', '⭐'][Math.floor(Math.random() * 4)];
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-50px';
        confetti.style.fontSize = '2rem';
        confetti.style.animation = `fall ${2 + Math.random() * 2}s linear`;
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
      }
    }, 100);
  }

  container.appendChild(card);

  // Badges
  const badgesTitle = document.createElement('h3');
  badgesTitle.textContent = 'เหรียญที่ได้รับ';
  badgesTitle.style.marginBottom = '1rem';
  badgesTitle.style.fontSize = '1.5rem';
  container.appendChild(badgesTitle);

  if (result.badgesNew && result.badgesNew.length > 0 && !result.alreadyDone) {
    const badgesDiv = document.createElement('div');
    badgesDiv.style.display = 'flex';
    badgesDiv.style.gap = '1rem';
    badgesDiv.style.flexWrap = 'wrap';
    badgesDiv.style.justifyContent = 'center';
    badgesDiv.style.marginBottom = '2rem';

    result.badgesNew.forEach(badgeId => {
      const badge = QV.BADGES[badgeId];
      if (badge) {
        const badgeCard = document.createElement('div');
        badgeCard.className = 'badge-new glass-card';
        badgeCard.style.padding = '1.5rem';
        badgeCard.style.textAlign = 'center';
        badgeCard.style.minWidth = '150px';
        badgeCard.innerHTML = `
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">${QV.escapeHtml(badge.emoji)}</div>
          <div style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem;">${QV.escapeHtml(badge.nameTh)}</div>
          <div style="font-size: 0.875rem; opacity: 0.8;">${QV.escapeHtml(badge.descTh)}</div>
        `;
        badgesDiv.appendChild(badgeCard);
      }
    });

    container.appendChild(badgesDiv);
  } else {
    const noBadges = document.createElement('div');
    noBadges.style.textAlign = 'center';
    noBadges.style.opacity = '0.6';
    noBadges.style.marginBottom = '2rem';
    noBadges.textContent = 'ยังไม่มีเหรียญใหม่ — สู้ต่อ!';
    container.appendChild(noBadges);
  }

  // Buttons
  const buttonsDiv = document.createElement('div');
  buttonsDiv.style.display = 'flex';
  buttonsDiv.style.gap = '1rem';
  buttonsDiv.style.justifyContent = 'center';
  buttonsDiv.style.flexWrap = 'wrap';

  const mapBtn = document.createElement('button');
  mapBtn.className = 'btn btn-primary';
  mapBtn.textContent = 'กลับสู่แผนที่';
  mapBtn.onclick = () => {
    QV.app.navigate('map');
    QV.app.updatePlayerStatus();
  };
  buttonsDiv.appendChild(mapBtn);

  const replayBtn = document.createElement('button');
  replayBtn.className = 'btn btn-secondary';
  replayBtn.textContent = 'เล่นซ้ำโซนนี้';
  replayBtn.onclick = () => {
    if (state.player.energy <= 0) {
      QV.app.toast('พลังงานหมดแล้ว!', 'wrong');
      return;
    }
    QV.app.navigate('mission', { planetId: result.planetId, zoneIdx: result.zoneIdx });
  };
  buttonsDiv.appendChild(replayBtn);

  container.appendChild(buttonsDiv);
  summaryScreen.appendChild(container);
};

// Add fall animation for confetti
if (!document.getElementById('confetti-style')) {
  const style = document.createElement('style');
  style.id = 'confetti-style';
  style.textContent = `
    @keyframes fall {
      to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
      20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
  `;
  document.head.appendChild(style);
}

window.QV = QV;
```