// js/landing.js
// หน้า Landing Page
window.QV = window.QV || {};
// QV local ref merged

QV.screens.landing = {
  render: function(state) {
    const hasExistingPlayer = state && state.player && state.player.name;
    
    return `
      <div class="screen-landing">
        <div class="text-center">
          <h1 style="font-size: clamp(3rem, 8vw, 5rem); font-weight: 800; margin-bottom: 1rem; background: linear-gradient(135deg, #38BDF8, #6EE7B7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            QUESTVERSE
          </h1>
          <p style="font-size: clamp(1.125rem, 3vw, 1.5rem); color: rgba(255,255,255,0.7); margin-bottom: 3rem; max-width: 600px; margin-left: auto; margin-right: auto;">
            ผจญภัยเรียนรู้ข้าม 5 ดาวเคราะห์
          </p>
          
          <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 320px; margin: 0 auto;">
            <button id="btn-start" class="btn btn-primary">
              🚀 เริ่มการเดินทาง
            </button>
            ${hasExistingPlayer ? `
              <button id="btn-continue" class="btn btn-secondary">
                ⚡ เล่นต่อ
              </button>
            ` : ''}
            <button id="btn-leaderboard" class="btn btn-secondary">
              🏆 กระดานผู้นำ
            </button>
          </div>
        </div>
      </div>
    `;
  },

  mount: function() {
    const btnStart = document.getElementById('btn-start');
    const btnContinue = document.getElementById('btn-continue');
    const btnLeaderboard = document.getElementById('btn-leaderboard');

    // เริ่มเกมใหม่
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        QV.state = QV.newState();
        QV.saveState(QV.state);
        QV.app.show('character');
      });
    }

    // เล่นต่อ
    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        QV.app.show('map');
      });
    }

    // กระดานผู้นำ
    if (btnLeaderboard) {
      btnLeaderboard.addEventListener('click', () => {
        QV.app.show('leaderboard');
      });
    }
  }
};
