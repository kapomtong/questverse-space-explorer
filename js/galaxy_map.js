// js/galaxy_map.js
// หน้าแผนที่กาแล็กซี่
window.QV = window.QV || {};
// QV local ref merged

QV.screens.map = {
  render() {
    const state = QV.state;
    const currentRank = QV.getRank(state.xp);
    
    // หา threshold ยศถัดไปจาก QV.ranks ของ config.js
    const nextRank = QV.ranks[currentRank.index + 1];
    const nextThreshold = nextRank ? nextRank[0] : state.xp || 1;
    const xpBase = currentRank.index > 0 ? QV.ranks[currentRank.index][0] : 0;
    const xpPercent = nextRank ? Math.min(100, ((state.xp - xpBase) / (nextThreshold - xpBase)) * 100) : 100;
    const nextRankName = nextRank ? `${nextRank[2]} ${nextRank[1]}` : 'ยศสูงสุด';

    // สร้าง HTML แถบสถานะผู้เล่น
    const playerStatusHtml = `
      <div class="player-status">
        <div class="player-info">
          <img src="assets/suit_${state.player.suit}.png" alt="ชุดอวกาศ" width="64" height="64" style="border-radius:50%;">
          <div class="player-name">${QV.escapeHtml(state.player.name)}</div>
        </div>
        <div class="rank-chip">
          ${currentRank.emoji} ${currentRank.name}
        </div>
        <div class="xp-bar-container">
          <div class="xp-bar-label">XP ${QV.formatNumber(state.xp)} → ${nextRankName} ที่ ${QV.formatNumber(nextThreshold)}</div>
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
            <button class="btn btn-secondary" id="btn-map-lb">🏆 กระดานผู้นำ</button>
            <button class="btn btn-secondary" id="btn-reset">🔄 รีสตาร์ตเกม</button>
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
