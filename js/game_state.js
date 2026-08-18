// js/game_state.js
// จัดการ state และความคืบหน้าของเกม
window.QV = window.QV || {};
// QV local ref merged

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
  },

  /**
   * จำนวนการเล่น minigame ที่เหลือในวันนี้ (ฟรี 3 ครั้ง/วัน)
   */
  minigameRemaining(state) {
    const todayKey = QV.todayKey();
    const count = (state.minigamePlays && state.minigamePlays[todayKey]) || 0;
    return Math.max(0, 3 - count);
  },

  /**
   * จำนวนครั้งที่เล่น minigame ไปแล้ววันนี้
   */
  getMiniGamePlays(state) {
    const todayKey = QV.todayKey();
    return (state.minigamePlays && state.minigamePlays[todayKey]) || 0;
  },

  /**
   * บันทึกผล minigame และมอบรางวัล (ชนะ: +1 ใจ +30 XP / แพ้: +10 XP)
   */
  minigamePlay(state, won) {
    const todayKey = QV.todayKey();
    state.minigamePlays = state.minigamePlays || {};
    state.minigamePlays[todayKey] = (state.minigamePlays[todayKey] || 0) + 1;
    if (won) {
      state.energy = Math.min(state.energy + 1, QV.MAX_ENERGY);
      state.xp += 30;
    } else {
      state.xp += 10;
    }
    return this.checkBadgeEarns(state);
  }
};
