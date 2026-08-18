// js/mission.js
// หน้าทำมิชชัน (ตอบคำถาม 5 ข้อต่อโซน) และหน้าสรุปผล
// Contract: QV.app.screens[screen] = { render(state, params), mount(params) }
// Entry: จาก galaxy_map.js — QV.currentPlanetId ถูกตั้งก่อนเรียก QV.app.show('mission')

const ZONE_LABELS = {
  numberon: ["การบวก/ลบจำนวนเต็ม", "การคูณ/หารจำนวนเต็ม", "เศษส่วน", "ทศนิยม", "รูปเรขาคณิตเบื้องต้น"],
  bionia: ["เซลล์และสิ่งมีชีวิต", "ระบบร่างกาย", "สารและสมบัติของสาร", "พลังงานและไฟฟ้า", "ระบบนิเวศ"],
  aksara: ["ภาษาเพื่อการสื่อสาร", "ประโยคและหน้าที่ของคำ", "การอ่านและตีความ", "การเขียนเชิงสร้างสรรค์", "วรรณคดีน่ารู้"],
  lingua: ["Greetings & Introductions", "Present Simple Tense", "Animals & Jobs Vocabulary", "Present Continuous Tense", "Prepositions & Conversation"],
  civilis: ["การแก้ปัญหาและความตัดสินใจ", "เวลาแล้วและเรื่องเล่าจากอดีต", "สิ่งแวดล้อมและการดำเนินชีวิต", "เศรษฐศาสตร์เบื้องต้น", "การเป็นพลเมืองที่ดี"]
};

window.QV = window.QV || {};
const QV = window.QV;
QV.screens = QV.screens || {};

QV.screens.mission = {
  render(state, params) {
    const planetId = params && params.planetId || QV.currentPlanetId;
    const planet = QV.planetById(planetId);
    const planetState = state.planets[planetId];
    const zoneIdx = params && params.zoneIdx !== undefined ? params.zoneIdx : planetState.currentZone;
    const zoneName = ZONE_LABELS[planetId] ? ZONE_LABELS[planetId][zoneIdx] : 'โซน ' + (zoneIdx + 1);
    const questions = QV.QUESTIONS[planetId] && QV.QUESTIONS[planetId][zoneIdx];

    // ตรวจสอบข้อมูล
    if (!planet || !questions) {
      return `<div class="screen-mission text-center"><p>ไม่พบข้อมูลมิชชัน — กลับสู่แผนที่</p>
        <button class="btn btn-primary" id="btn-mission-fail-back">กลับสู่แผนที่</button></div>`;
    }

    // ตรวจสอบ energy
    if (state.energy <= 0) {
      return `<div class="screen-mission text-center">
        <h2 style="color: var(--accent-cyan);">⚠️ พลังงานหมดแล้ว!</h2>
        <p>รอพรุ่งนี้พลังงานจะเติมเต็ม 5 หัวใจ หรือลองเลนโซนอื่น</p>
        <button class="btn btn-primary" id="btn-mission-nrg-back">กลับสู่แผนที่</button>
      </div>`;
    }

    // ตรวจสอบว่า zone นี้เคยทำแล้วหรือไม่ (เลนซ้ำได้แต่ไม่ได้ XP)
    const alreadyDone = planetState.zonesDone.includes(zoneIdx);

    return `
      <div class="screen-mission" data-bg="${planet.bg || ''}">
        <div class="mission-bg"></div>
        <div class="stars-field" aria-hidden="true"></div>
        <div class="mission-header">
          <img src="${planet.image}" alt="${planet.name}" style="width:64px;height:64px;border-radius:50%;">
          <h2>${QV.escapeHtml(planet.name)}</h2>
          <span class="zone-tag">โซนที่ ${zoneIdx + 1}/5 — ${QV.escapeHtml(zoneName)}</span>
          ${alreadyDone ? '<div class="zone-tag" style="background:rgba(6,214,160,0.15);color:var(--success);border-color:var(--success);margin-top:8px;">⚡ โหมดฝึกซ้อม — ไม่ได้ XP</div>' : ''}
        </div>
        <div class="progress-dots" id="progress-dots">
          ${Array.from({ length: 5 }, (_, i) => `<span class="progress-dot${i === 0 ? ' active' : ''}" data-idx="${i}"></span>`).join('')}
        </div>
        <div id="question-area"></div>
        <div id="hint-area"></div>
        <div class="items-bar" id="items-bar"></div>
      </div>
    `;
  },

  mount(params) {
    // ตั้งฉากหลังตามดาวที่เลือก (จาก data-bg)
    const screen = document.querySelector('.screen-mission');
    if (screen) {
      const bg = screen.getAttribute('data-bg');
      if (bg) {
        const url = bg.indexOf('://') >= 0 ? bg : '../' + bg.replace(/^assets\//, '');
        screen.style.backgroundImage = `linear-gradient(rgba(7, 8, 26, 0.72), rgba(7, 8, 26, 0.88)), url('${url}')`;
      }
    }
    const state = QV.state;
    const planetId = params && params.planetId || QV.currentPlanetId;
    const planetState = state.planets[planetId];
    const zoneIdx = params && params.zoneIdx !== undefined ? params.zoneIdx : planetState.currentZone;
    const questions = QV.QUESTIONS[planetId][zoneIdx];

    // ปุ่มย้อนกลับ
    const bindBack = (id) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => QV.app.show('map'));
    };
    bindBack('btn-mission-fail-back');
    bindBack('btn-mission-nrg-back');

    const questionArea = document.getElementById('question-area');
    const hintArea = document.getElementById('hint-area');
    const itemsBar = document.getElementById('items-bar');
    const dots = document.querySelectorAll('#progress-dots .progress-dot');

    let qIdx = 0;
    let correctCount = 0;
    let xpGained = 0;
    let combo = 0;
    let shieldActive = false;
    let questionStartTs = Date.now();
    let answered = false;
    let timerInterval = null;
    let timeLeft = QV.QUESTION_TIME_LIMIT;

    const alreadyDone = planetState.zonesDone.includes(zoneIdx);

    // หักพลังงาน
    state.energy -= 1;
    QV.saveState(state);

    function renderDots() {
      dots.forEach((dot, i) => {
        dot.className = 'progress-dot' + (i < qIdx ? ' completed' : i === qIdx ? ' active' : '');
      });
    }

    function renderItems() {
      itemsBar.innerHTML = ['shield', 'compass', 'telescope'].map(id => {
        const def = QV.ITEM_DEFS[id];
        const count = state.items[id] || 0;
        const labels = { shield: '🛡️ โล่', compass: '🧭 เข็มทิศ', telescope: '🔭 กล้อง' };
        return `<button class="btn btn-item item-btn" data-item="${id}" ${count <= 0 ? 'disabled' : ''}>
          ${labels[id]} <span class="item-count">×${count}</span>
        </button>`;
      }).join('') + `
        <button class="btn btn-secondary item-btn" id="btn-hint">💡 คำใบ้</button>
      `;
      itemsBar.querySelectorAll('.item-btn[data-item]').forEach(btn => {
        btn.addEventListener('click', () => useItem(btn.dataset.item));
      });
      const hintBtn = document.getElementById('btn-hint');
      if (hintBtn) hintBtn.addEventListener('click', () => showHint());
    }

    function useItem(itemId) {
      if ((state.items[itemId] || 0) <= 0 || answered) return;
      const q = questions[qIdx];
      if (itemId === 'shield') {
        state.items.shield--;
        shieldActive = true;
        QV.saveState(state);
        QV.app.toast('🛡️ เปิดใช้โล่! ตอบผิดครั้งถัดไปถูกยกเว้น', 'correct');
      } else if (itemId === 'compass') {
        state.items.compass--;
        QV.saveState(state);
        // ตัดตัวเลือกผิด 1 ตัว
        const btns = document.querySelectorAll('.answer-btn');
        for (let i = 0; i < btns.length; i++) {
          if (i !== q.answerIdx && !btns[i].disabled) {
            btns[i].disabled = true;
            btns[i].classList.add('wrong');
            QV.app.toast('🧭 เข็มทิศตัดตัวเลือกผิด 1 ตัว!', 'correct');
            break;
          }
        }
      } else if (itemId === 'telescope') {
        state.items.telescope--;
        QV.saveState(state);
        showHint();
      }
      renderItems();
    }

    function showHint() {
      const q = questions[qIdx];
      hintArea.innerHTML = q.hint ? `<div class="hint-box">${QV.formatFrac(QV.escapeHtml(q.hint))}</div>` : '';
    }

    function renderQuestion() {
      answered = false;
      hintArea.innerHTML = '';
      if (qIdx >= 5) {
        completeMission();
        return;
      }
      const q = questions[qIdx];
      questionStartTs = Date.now();

      questionArea.innerHTML = `
        <div class="timer-row" id="timer-row">
          <span class="timer-icon" id="timer-icon">⏱️</span>
          <div class="timer-bar-track"><div class="timer-bar-fill" id="timer-bar"></div></div>
          <span class="timer-sec" id="timer-sec">${QV.QUESTION_TIME_LIMIT}</span>
        </div>
        <div class="question-card">
          <div class="question-text">${QV.formatFrac(QV.escapeHtml(q.q))}</div>
          <div class="answers-grid">
            ${q.choices.map((c, i) => `<button class="answer-btn" data-i="${i}">${QV.formatFrac(QV.escapeHtml(c))}</button>`).join('')}
          </div>
        </div>
      `;

      questionArea.querySelectorAll('.answer-btn').forEach(btn => {
        btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.i)));
      });
      renderDots();
      renderItems();
      startTimer();
    }

    function startTimer() {
      clearInterval(timerInterval);
      timeLeft = QV.QUESTION_TIME_LIMIT;
      updateTimerUI();
      timerInterval = setInterval(() => {
        timeLeft -= 0.1;
        if (timeLeft <= 0) {
          timeLeft = 0;
          clearInterval(timerInterval);
          if (!answered) {
            answered = true;
            combo = 0;
            QV.app.toast('⏰ หมดเวลา! ลองข้อถัดไปนะ', 'wrong');
            setTimeout(() => {
              qIdx++;
              renderQuestion();
            }, 1400);
          }
        }
        updateTimerUI();
      }, 100);
    }

    function updateTimerUI() {
      const bar = document.getElementById('timer-bar');
      const sec = document.getElementById('timer-sec');
      const icon = document.getElementById('timer-icon');
      if (!bar || !sec) return;
      const pct = Math.max(0, (timeLeft / QV.QUESTION_TIME_LIMIT) * 100);
      bar.style.width = pct + '%';
      bar.style.background = timeLeft <= 10 ? 'var(--danger)' : 'linear-gradient(90deg, var(--accent-cyan), var(--success))';
      sec.textContent = Math.ceil(timeLeft);
      sec.style.color = timeLeft <= 10 ? 'var(--danger)' : 'var(--text)';
      if (icon) icon.style.animation = timeLeft <= 10 ? 'pulse 0.6s infinite' : 'none';
    }

    function handleAnswer(i) {
      if (answered) return;
      clearInterval(timerInterval);
      answered = true;

      const q = questions[qIdx];
      const btns = questionArea.querySelectorAll('.answer-btn');
      const isCorrect = i === q.answerIdx;

      btns.forEach((b, bi) => {
        b.disabled = true;
        if (bi === q.answerIdx) b.classList.add('correct');
        if (bi === i && !isCorrect) b.classList.add('wrong');
      });

      if (isCorrect) {
        correctCount++;
        combo++;
        let xp = QV.XP_CORRECT || 10;
        const elapsed = (Date.now() - questionStartTs) / 1000;
        let msg = `✅ ถูกต้อง! +${xp} XP`;

        if (elapsed <= 5) {
          xp += 5;
          msg += ' (+5 โบนัสเร็ว!)';
          state.fastCorrect5s = (state.fastCorrect5s || 0) + 1;
        }
        if (combo > 0 && combo % 3 === 0) {
          xp += QV.XP_COMBO || 5;
          msg += ` (+${QV.XP_COMBO || 5} โบนัสคอมโบ ${combo}x!)`;
        }

        xpGained += xp;
        QV.app.toast(msg, 'correct');

        setTimeout(() => {
          qIdx++;
          combo = 0;
          shieldActive = false;
          renderQuestion();
        }, 1400);
      } else {
        if (shieldActive) {
          shieldActive = false;
          state.maxCombo = Math.max(state.maxCombo || 0, combo);
          QV.app.toast('🛡️ โล่ช่วยคุณไว้! ไม่ถือว่าผิด', 'correct');
          setTimeout(() => {
            qIdx++;
            combo = 0;
            renderQuestion();
          }, 1500);
        } else {
          combo = 0;
          QV.app.toast('❌ ผิด! ลองข้อถัดไปนะ', 'wrong');
          setTimeout(() => {
            qIdx++;
            renderQuestion();
          }, 1800);
        }
      }
    }

    function completeMission() {
      // อย่าซ้ำ XP สำหรับโหมดฝึกซ้อม
      let badgesNew = [];
      let rankUp = false;
      let newRank = QV.getRank(state.xp);

      if (!alreadyDone) {
        badgesNew = QV.game.completeZone(state, planetId, zoneIdx, correctCount);
        state.combo = Math.max(state.combo || 0, 0);
        const addXpResult = QV.game.addXp(state, xpGained);
        rankUp = addXpResult.rankUp;
        newRank = addXpResult.newRank;
        if (addXpResult.badgesNew && addXpResult.badgesNew.length) {
          badgesNew = [...new Set([...badgesNew, ...addXpResult.badgesNew])];
        }
      }

      // ผลลัพธ์สำหรับหน้า summary
      state.missionResult = {
        planetId, zoneIdx,
        correct: correctCount,
        xpGained: alreadyDone ? 0 : xpGained,
        rankUp, newRank, badgesNew, alreadyDone
      };
      QV.saveState(state);
      QV.app.show('summary');
    }

    renderQuestion();
  }
};

QV.screens.summary = {
  render(state) {
    const result = state.missionResult;
    if (!result) {
      return `<div class="screen-summary"><p>กลับสู่แผนที่</p></div>`;
    }
    const planet = QV.planetById(result.planetId);
    const zoneName = ZONE_LABELS[result.planetId] ? ZONE_LABELS[result.planetId][result.zoneIdx] : 'โซน ' + (result.zoneIdx + 1);
    const rank = QV.getRank(state.xp);

    // จำนวนหาว
    const stars = Array.from({ length: 5 }, (_, i) => i < result.correct ? '⭐' : '☆').join('');

    const badgesHtml = result.badgesNew && result.badgesNew.length
      ? result.badgesNew.map(bid => {
          const b = QV.badges.find(x => x.id === bid);
          return b ? `<span class="badge-chip">${b.icon} ${QV.escapeHtml(b.name)}</span>` : '';
        }).filter(Boolean).join('')
      : '<p style="opacity:0.7;">ยังไม่มีเหรียญใหม่ — สู้ต่อ!</p>';

    return `
      <div class="screen-summary">
        <div class="summary-card">
          <h2>ภารกิจเสร็จสิ้น!</h2>
          <img src="${planet.image}" alt="${planet.name}" style="width:80px;height:80px;border-radius:50%;margin-bottom:8px;">
          <p style="font-size:18px;color:var(--accent-cyan);">${QV.escapeHtml(planet.name)} — ${QV.escapeHtml(zoneName)}</p>
          <div class="result-stars" style="font-size:40px;margin:16px 0;">${stars}</div>
          <div style="font-size:20px;color:var(--text);margin-bottom:16px;">ตอบถูก ${result.correct}/5 ข้อ</div>
          <div class="xp-gained">${result.alreadyDone ? 'โหมดฝึกซ้อม' : '+' + result.xpGained + ' XP'}</div>
          ${result.rankUp && !result.alreadyDone ? `<div style="background:rgba(6,214,160,0.2);border-radius:12px;padding:12px;margin:16px 0;color:var(--success);font-weight:600;">🎉 ยินดีด้วย! เลื่อนยศเป็น ${result.newRank.emoji} ${QV.escapeHtml(result.newRank.name)}</div>` : ''}
          <div style="margin:8px 0;font-size:14px;opacity:0.8;">ยศปัจจุบัน: ${rank.emoji} ${rank.name} (${QV.formatNumber(state.xp)} XP)</div>
          <div class="badges-earned">${badgesHtml}</div>
          <div class="summary-actions">
            <button class="btn btn-primary" id="btn-sum-map">🗺️ กลับสู่แผนที่</button>
            ${state.energy > 0 && !result.alreadyDone ? `<button class="btn btn-secondary" id="btn-sum-replay">🔁 เล่นซ้ำโซนนี้</button>` : ''}
          </div>
        </div>
      </div>
    `;
  },

  mount() {
    const state = QV.state;
    const result = state.missionResult;
    const mapBtn = document.getElementById('btn-sum-map');
    if (mapBtn) mapBtn.addEventListener('click', () => QV.app.show('map'));
    const replayBtn = document.getElementById('btn-sum-replay');
    if (replayBtn) replayBtn.addEventListener('click', () => QV.app.show('mission', { planetId: result.planetId, zoneIdx: result.zoneIdx }));

    // Confetti สำหรับ rank up
    if (result && result.rankUp && !result.alreadyDone) {
      for (let i = 0; i < 40; i++) {
        const c = document.createElement('div');
        c.textContent = ['🎉', '✨', '🌟', '⭐'][Math.floor(Math.random() * 4)];
        c.style.cssText = 'position:fixed;left:' + (Math.random() * 100) + '%;top:-40px;font-size:' + (20 + Math.random() * 20) + 'px;pointer-events:none;z-index:9999;animation:confetti ' + (2 + Math.random() * 2) + 's linear forwards;';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 5000);
      }
    }
  }
};
