```javascript
// js/game_state.js
// จัดการ state และความคืบหน้าของเกม

QV.game = {
  /**
   * ตรวจสอบและคืนค่า badge id ที่ผู้เล่นควรได้รับ
   * @param {Object} state - state ปัจจุบัน
   * @returns {Array} array ของ badge id ที่เพิ่งได้รับใหม่
   */
  checkBadgeEarns(state) {
    const newBadges = [];
    const currentBadges = state.badges || [];

    // explorer-{planetId}: ผ่านโซนใน planet นั้นครบ 5 โซน
    QV.planets.forEach(planet => {
      const badgeId = `explorer-${planet.id}`;
      const planetState = state.planets[planet.id];
      if (planetState && planetState.zonesDone && planetState.zonesDone.length >= 5) {
        if (!currentBadges.includes(badgeId)) {
          newBadges.push(badgeId);
          currentBadges.push(badgeId);
        }
      }
    });

    // combo-master: maxCombo >= 10
    if (state.maxCombo >= 10 && !currentBadges.includes('combo-master')) {
      newBadges.push('combo-master');
      currentBadges.push('combo-master');
    }

    // globe-trotter: ครบ 5 ดาวที่มี zonesDone >= 5
    let planetsCompleted = 0;
    QV.planets.forEach(planet => {
      const planetState = state.planets[planet.id];
      if (planetState && planetState.zonesDone && planetState.zonesDone.length >= 5) {
        planetsCompleted++;
      }
    });
    if (planetsCompleted >= 5 && !currentBadges.includes('globe-trotter')) {
      newBadges.push('globe-trotter');
      currentBadges.push('globe-trotter');
    }

    // universe-conqueror: ผ่านโซนรวมครบ 25 โซน
    let totalZones = 0;
    QV.planets.forEach(planet => {
      const planetState = state.planets[planet.id];
      if (planetState && planetState.zonesDone) {
        totalZones += planetState.zonesDone.length;
      }
    });
    if (totalZones >= 25 && !currentBadges.includes('universe-conqueror')) {
      newBadges.push('universe-conqueror');
      currentBadges.push('universe-conqueror');
    }

    // speed-runner: ตอบถูกภายใน 5 วินาที >= 10 ครั้ง
    if (state.fastCorrect5s >= 10 && !currentBadges.includes('speed-runner')) {
      newBadges.push('speed-runner');
      currentBadges.push('speed-runner');
    }

    state.badges = currentBadges;
    return newBadges;
  },

  /**
   * เพิ่ม XP และตรวจสอบการขึ้นยศและ badge
   * @param {Object} state - state ปัจจุบัน
   * @param {number} amount - จำนวน XP ที่จะเพิ่ม
   * @param {number} questionStartTs - timestamp เริ่มตอบคำถาม (ms)
   * @returns {Object} { newRank, rankUp, badgesNew }
   */
  addXp(state, amount, questionStartTs) {
    const oldRank = QV.getRank(state.xp);
    state.xp += amount;
    const newRank = QV.getRank(state.xp);
    const rankUp = newRank.index > oldRank.index;

    // ตรวจสอบเวลาตอบ
    if (questionStartTs) {
      const answerTime = (Date.now() - questionStartTs) / 1000;
      if (answerTime <= 5) {
        state.fastCorrect5s = (state.fastCorrect5s || 0) + 1;
      }
    }

    const badgesNew = this.checkBadgeEarns(state);

    return { newRank, rankUp, badgesNew };
  },

  /**
   * ทำเครื่องหมายโซนเสร็จสมบูรณ์
   * @param {Object} state - state ปัจจุบัน
   * @param {string} planetId - id ของดาว
   * @param {number} zoneIdx - index ของโซน
   * @param {number} correctCount - จำนวนข้อที่ตอบถูก
   * @returns {Array} badge id ที่เพิ่งได้รับใหม่
   */
  completeZone(state, planetId, zoneIdx, correctCount) {
    const planetState = state.planets[planetId];
    if (!planetState) return [];

    // เพิ่มโซนที่เสร็จแล้ว
    if (!planetState.zonesDone.includes(zoneIdx)) {
      planetState.zonesDone.push(zoneIdx);
    }

    // เพิ่ม energy คืนหนึ่งหัวใจต่อการผ่านโซน
    state.energy = Math.min(state.energy + 1, QV.MAX_ENERGY);

    // ตั้งค่า currentZone ถัดไป
    planetState.currentZone = zoneIdx + 1;

    // ตรวจสอบ badge
    return this.checkBadgeEarns(state);
  },

  /**
   * ใช้ไอเทม
   * @param {Object} state - state ปัจจุบัน
   * @param {string} itemId - id ของไอเทม
   * @returns {boolean} สำเร็จหรือไม่
   */
  useItem(state, itemId) {
    if (state.items[itemId] && state.items[itemId] > 0) {
      state.items[itemId]--;
      return true;
    }
    return false;
  },

  /**
   * คืนสถานะของโซน
   * @param {Object} planet - ข้อมูลดาว
   * @param {number} zoneIdx - index ของโซน
   * @param {Object} planetState - state ของดาว
   * @returns {string} "done" | "active" | "locked"
   */
  zoneStatus(planet, zoneIdx, planetState) {
    if (!planetState) return 'locked';
    
    // โซนที่ทำเสร็จแล้ว
    if (planetState.zonesDone.includes(zoneIdx)) {
      return 'done';
    }
    
    // โซนแรกปลดล็อกเสมอ
    if (zoneIdx === 0) {
      return 'active';
    }
    
    // โซนถัดไปปลดล็อกเมื่อโซนก่อนหน้าเสร็จ
    if (planetState.zonesDone.includes(zoneIdx - 1)) {
      return 'active';
    }
    
    return 'locked';
  }
};
```

```javascript
// js/galaxy_map.js
// หน้าแผนที่กาแล็กซี่

QV.screens.map = {
  render() {
    const state = QV.state;
    const currentRank = QV.getRank(state.xp);
    
    // หา threshold ยศถัดไป
    let nextThreshold = 1000; // default
    const allRanks = [
      { name: 'มือใหม่หัดบิน', threshold: 0 },
      { name: 'นักบินเดินทาง', threshold: 50 },
      { name: 'กัปตัน', threshold: 100 },
      { name: 'นักสำรวจอวกาศ', threshold: 200 },
      { name: 'ผู้พิชิตกาแล็กซี่', threshold: 400 }
    ];
    for (let i = 0; i < allRanks.length; i++) {
      if (allRanks[i].threshold > state.xp) {
        nextThreshold = allRanks[i].threshold;
        break;
      }
    }
    const xpPercent = Math.min(100, (state.xp / nextThreshold) * 100);

    // สร้าง HTML แถบสถานะผู้เล่น
    const playerStatusHtml = `
      <div class="player-status">
        <div class="player-info">
          <img src="img/${state.player.suit}.png" alt="ชุดอวกาศ" width="64" height="64">
          <div class="player-name">${QV.escapeHtml(state.player.name)}</div>
        </div>
        <div class="rank-chip">
          ${currentRank.emoji} ${currentRank.name}
        </div>
        <div class="xp-bar-container">
          <div class="xp-label">XP ${QV.formatNumber(state.xp)} / ระดับถัดไป ${currentRank.index < 4 ? allRanks[currentRank.index + 1].name : 'สูงสุด'} ที่ ${QV.formatNumber(nextThreshold)}</div>
          <div class="xp-bar">
            <div class="xp-bar-fill" style="width: ${xpPercent}%"></div>
          </div>
        </div>
        <div class="energy-hearts">
          ${Array.from({ length: QV.MAX_ENERGY }, (_, i) => {
            return `<span class="heart${i < state.energy ? '' : ' empty'}">${i < state.energy ? '❤️' : '🤍'}</span>`;
          }).join('')}
        </div>
      </div>
    `;

    // สร้าง planet cards
    const planetsHtml = QV.planets.map(planet => {
      const planetState = state.planets[planet.id];
      const isPlanetLocked = this._isPlanetLocked(planet.id, state);
      const zonesDoneCount = planetState ? planetState.zonesDone.length : 0;
      const currentZone = planetState ? planetState.currentZone : 0;
      
      let statusClass = 'locked';
      let statusText = '🔒 ต้องปลดดาวก่อน';
      
      if (!isPlanetLocked) {
        if (zonesDoneCount >= planet.zoneCount) {
          statusClass = 'complete';
          statusText = '✅ ดาวพิชิตแล้ว!';
        } else {
          statusClass = 'active';
          statusText = `🚀 โซนที่ ${currentZone + 1}/${planet.zoneCount}`;
        }
      }

      return `
        <div class="planet-card ${isPlanetLocked ? 'locked' : ''}" data-planet-id="${planet.id}">
          <img src="${planet.image}" alt="${planet.name}" class="planet-image">
          <div class="planet-name">${planet.name}</div>
          <div class="planet-desc">${planet.desc}</div>
          <div class="planet-subject" style="background-color: ${planet.themeColor}20; color: ${planet.themeColor};">
            ${planet.subject}
          </div>
          <div class="planet-status ${statusClass}">
            ${statusText}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="screen-map">
        <div class="map-header">
          <h2>แผนที่กาแล็กซี่</h2>
          <div class="map-actions">
            <button class="btn-secondary" id="btn-map-lb">กระดานผู้นำ</button>
            <button class="btn-secondary" id="btn-reset">ออกจากระบบ/รีสตาร์ต</button>
          </div>
        </div>
        ${playerStatusHtml}
        <div class="planets-grid">
          ${planetsHtml}
        </div>
      </div>
    `;
  },

  mount() {
    const state = QV.state;

    // ปุ่มกระดานผู้นำ
    const btnLb = document.getElementById('btn-map-lb');
    if (btnLb) {
      btnLb.addEventListener('click', () => {
        QV.app.show('leaderboard');
      });
    }

    // ปุ่ม reset
    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบและรีสตาร์ตเกม? ข้อมูลทั้งหมดจะถูกลบ')) {
          localStorage.clear();
          location.reload();
        }
      });
    }

    // คลิก planet card
    const planetCards = document.querySelectorAll('.planet-card');
    planetCards.forEach(card => {
      const planetId = card.getAttribute('data-planet-id');
      const isLocked = card.classList.contains('locked');
      
      if (!isLocked) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
          // บันทึก planetId ที่เลือกไว้ใน state ชั่วคราว
          QV.currentPlanetId = planetId;
          QV.app.show('mission');
        });
      }
    });

    // อัปเดตแถบสถานะ
    QV.app.updatePlayerStatus();
  },

  /**
   * ตรวจสอบว่าดาวถูกล็อกหรือไม่
   * @param {string} planetId - id ของดาว
   * @param {Object} state - state ปัจจุบัน
   * @returns {boolean}
   */
  _isPlanetLocked(planetId, state) {
    // ดาวแรก (numberon) ปลดล็อกเสมอ
    if (planetId === 'numberon') return false;

    // หา index ของดาวปัจจุบัน
    const currentPlanetIndex = QV.planets.findIndex(p => p.id === planetId);
    if (currentPlanetIndex === -1) return true;

    // ตรวจสอบดาวก่อนหน้า
    if (currentPlanetIndex > 0) {
      const prevPlanet = QV.planets[currentPlanetIndex - 1];
      const prevPlanetState = state.planets[prevPlanet.id];
      
      // ดาวก่อนหน้าต้องผ่านครบ 5 โซน
      if (!prevPlanetState || prevPlanetState.zonesDone.length < 5) {
        return true;
      }
    }

    return false;
  }
};
```