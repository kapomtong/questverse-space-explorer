```javascript
// js/leaderboard.js
(function() {
  'use strict';

  const LEADERBOARD_KEY = 'questverse-leaderboard';

  // Seed data: นักสำรวจอวกาศ
  const SEED_PLAYERS = [
    { name: 'กัปตันโอริออน', suit: 'blue', xp: 750 },
    { name: 'สตาร์ไคท์', suit: 'red', xp: 620 },
    { name: 'กาแล็กซี่เกอร์ล', suit: 'green', xp: 480 },
    { name: 'คอสโม่', suit: 'blue', xp: 380 },
    { name: 'นีบิวล่าไนท์', suit: 'red', xp: 290 },
    { name: 'สเปซเรนเจอร์', suit: 'green', xp: 180 },
    { name: 'อาสตร้าฮีโร่', suit: 'blue', xp: 95 }
  ];

  function getLeaderboard() {
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return [...SEED_PLAYERS];
      }
    }
    return [...SEED_PLAYERS];
  }

  function saveLeaderboard(leaderboard) {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  }

  function syncCurrentPlayer(leaderboard, state) {
    const currentName = state.player?.name || 'ผู้เล่น';
    const currentSuit = state.player?.suit || 'blue';
    const currentXP = state.xp || 0;

    const existingIndex = leaderboard.findIndex(p => p.name === currentName);
    
    if (existingIndex >= 0) {
      leaderboard[existingIndex].xp = currentXP;
      leaderboard[existingIndex].suit = currentSuit;
    } else {
      leaderboard.push({ name: currentName, suit: currentSuit, xp: currentXP });
    }

    return leaderboard;
  }

  function sortLeaderboard(leaderboard) {
    return leaderboard.sort((a, b) => b.xp - a.xp);
  }

  QV.screens.leaderboard = {
    render(state) {
      let leaderboard = getLeaderboard();
      leaderboard = syncCurrentPlayer(leaderboard, state);
      leaderboard = sortLeaderboard(leaderboard);
      saveLeaderboard(leaderboard);

      const currentName = state.player?.name || 'ผู้เล่น';

      const rows = leaderboard.map((player, idx) => {
        const rank = QV.getRank(player.xp);
        const isCurrent = player.name === currentName;
        const rowClass = isCurrent ? 'current-player' : '';
        const suitEmoji = player.suit === 'blue' ? '🔵' : player.suit === 'red' ? '🔴' : '🟢';

        return `
          <tr class="${rowClass}">
            <td style="font-weight: 700; color: #FFD166;">#${idx + 1}</td>
            <td>${suitEmoji} ${QV.escapeHtml(player.name)}${isCurrent ? ' ⭐' : ''}</td>
            <td>${rank.emoji} ${QV.escapeHtml(rank.name)}</td>
            <td style="font-weight: 600;">${QV.formatNumber(player.xp)} XP</td>
          </tr>
        `;
      }).join('');

      return `
        <div class="screen-leaderboard">
          <div class="glass-card" style="max-width: 700px; margin: 2rem auto; padding: 2rem;">
            <h1 class="text-center" style="margin-bottom: 1.5rem;">🏆 กระดานคะแนน</h1>
            <table class="leaderboard-table" style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
              <thead>
                <tr style="border-bottom: 2px solid rgba(255, 255, 255, 0.2);">
                  <th style="padding: 0.75rem; text-align: left;">อันดับ</th>
                  <th style="padding: 0.75rem; text-align: left;">ชื่อ</th>
                  <th style="padding: 0.75rem; text-align: left;">ยศ</th>
                  <th style="padding: 0.75rem; text-align: right;">คะแนน</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
            <div class="text-center">
              <button class="btn btn-primary" id="btn-back-to-map">🗺️ กลับสู่แผนที่</button>
            </div>
          </div>
        </div>
      `;
    },

    mount() {
      const btnBack = document.getElementById('btn-back-to-map');
      if (btnBack) {
        btnBack.addEventListener('click', () => {
          QV.app.show('map');
        });
      }
    }
  };
})();
```