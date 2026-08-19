// js/character.js
// หน้าสร้างตัวละคร
window.QV = window.QV || {};
// QV local ref merged

QV.screens.character = {
  selectedSuit: 'blue',

  render: function() {
    const suits = [
      { id: 'blue', name: 'นักบินฟ้า', image: 'suit_blue.webp', color: '#38BDF8' },
      { id: 'red', name: 'นักรบไฟ', image: 'suit_red.webp', color: '#EF4444' },
      { id: 'green', name: 'นักสำรวจใบ', image: 'suit_green.webp', color: '#6EE7B7' }
    ];

    return `
      <div class="screen-character">
        <div class="character-form">
          <h2 style="text-align: center; font-size: clamp(1.75rem, 4vw, 2.5rem); margin-bottom: 2rem; color: #fff;">
            เลือกสูทนักสำรวจ
          </h2>

          <div style="margin-bottom: 2rem;">
            <label for="player-name" style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: rgba(255,255,255,0.9);">
              ชื่อของนักสำรวจ
            </label>
            <input 
              type="text" 
              id="player-name" 
              placeholder="กรอกชื่อเล่นของคุณ" 
              maxlength="20"
              style="width: 100%; padding: 0.875rem 1.25rem; border-radius: 999px; border: 2px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: #fff; font-size: 1rem; transition: all 0.3s ease;"
            />
          </div>

          <div class="suit-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            ${suits.map(suit => `
              <div class="suit-card ${suit.id === 'blue' ? 'selected' : ''}" data-suit="${suit.id}" style="cursor: pointer; transition: transform 0.2s ease;">
                <img src="assets/${suit.image}" alt="${suit.name}" style="width: 100%; height: auto; border-radius: 12px; margin-bottom: 0.75rem;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22${suit.color}%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2255%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3E🚀%3C/text%3E%3C/svg%3E'" />
                <h3 style="text-align: center; font-size: 1rem; font-weight: 600; color: ${suit.color}; margin: 0;">
                  ${suit.name}
                </h3>
              </div>
            `).join('')}
          </div>

          <div class="character-actions text-center">
            <button id="btn-confirm" class="btn btn-primary" style="min-width: 240px;">
              ✨ ยืนยันและออกเดินทาง
            </button>
          </div>
        </div>
      </div>
    `;
  },

  mount: function() {
    const suitCards = document.querySelectorAll('.suit-card');
    const playerNameInput = document.getElementById('player-name');
    const btnConfirm = document.getElementById('btn-confirm');

    // เลือกสูท
    suitCards.forEach(card => {
      card.addEventListener('click', () => {
        suitCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        QV.screens.character.selectedSuit = card.dataset.suit;
      });
    });

    // ยืนยันและเริ่มเกม
    if (btnConfirm) {
      btnConfirm.addEventListener('click', () => {
        const name = playerNameInput.value.trim();
        
        if (!name) {
          // แสดง shake animation
          playerNameInput.style.animation = 'shake 0.5s ease';
          setTimeout(() => {
            playerNameInput.style.animation = '';
          }, 500);
          
          QV.app.toast('กรุณากรอกชื่อก่อนนะ! 😊', 'wrong');
          playerNameInput.focus();
          return;
        }

        // บันทึกข้อมูลผู้เล่น
        QV.state.player.name = QV.escapeHtml(name.substring(0, 20));
        QV.state.player.suit = QV.screens.character.selectedSuit;
        QV.saveState(QV.state);

        // ไปหน้าแผนที่
        QV.app.show('boss-hall');
      });
    }

    // Focus ที่ช่องชื่อ
    if (playerNameInput) {
      playerNameInput.focus();
    }
  }
};

// เพิ่ม shake animation ถ้ายังไม่มี
if (!document.getElementById('shake-style')) {
  const style = document.createElement('style');
  style.id = 'shake-style';
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }
  `;
  document.head.appendChild(style);
}
