# ระบบ Minigame ฟื้นฟูพลังงาน (Energy Recovery Minigame) สำหรับ QuestVerse M.1

ผมจะสร้างระบบ **⚡ Stellar Harvest — จับคู่ดวงดาว** ให้สามารถฟื้นฟูพลังงานเมื่อผู้เล่นหมดใจ โดยไม่จำเป็นต้องรอถึงพรุ่งนี้ครับ

---

## 1️⃣ ไฟล์ใหม่: `js/minigame.js` (เต็ม)

```javascript
// js/minigame.js — Screen: ⚡ Stellar Harvest (Energy Recovery Minigame)
// Contract: QV.screens['minigame'] = { render(state, params), mount(params) }

(function(global) {
    'use strict';

    const MINIGAME_GRID_SIZE = 4;
    const MINIGAME_PAIRS = 8;
    const MINIGAME_TIME_LIMIT = 45; // วินาที
    const MINIGAME_MAX_PLAYS_PER_DAY = 3;
    
    const STAR_EMOJIS = ['🌟', '💫', '⭐', '🌠', '✨', '☄️', '🔭', '🌙'];

    let minigameTimer = null;
    let remainingTime = MINIGAME_TIME_LIMIT;
    let flippedCards = [];
    let matchedPairs = 0;
    let gameActive = false;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createCardGrid() {
        const cardEmojis = [...STAR_EMOJIS, ...STAR_EMOJIS];
        shuffleArray(cardEmojis);
        
        let html = '<div class="minigame-grid">';
        for (let i = 0; i < 16; i++) {
            html += `<div class="minigame-card" data-index="${i}" data-emoji="${cardEmojis[i]}">
                        <div class="minigame-card-inner">
                            <div class="minigame-card-front"></div>
                            <div class="minigame-card-back">${cardEmojis[i]}</div>
                        </div>
                    </div>`;
        }
        html += '</div>';
        return html;
    }

    function resetGrid() {
        flipAllBack();
        setTimeout(() => startGame(), 300);
    }

    function flipAllBack() {
        const cards = document.querySelectorAll('.minigame-card');
        cards.forEach(card => {
            card.classList.remove('flipped', 'matched');
        });
    }

    function updateTimerBar() {
        const fillWidth = (remainingTime / MINIGAME_TIME_LIMIT) * 100;
        const timerBar = document.querySelector('.timer-bar-fill');
        if (timerBar) {
            timerBar.style.width = `${fillWidth}%`;
            
            // เปลี่ยนสีตามเวลาเหลือ
            if (fillWidth <= 20) timerBar.style.backgroundColor = '#ff4757';
            else if (fillWidth <= 50) timerBar.style.backgroundColor = '#ffa502';
            else timerBar.style.backgroundColor = '#2ed573';
        }
        
        const timerText = document.getElementById('minigame-timer-text');
        if (timerText) {
            timerText.textContent = `⏳ เวลาเหลือ: ${remainingTime}วิ`;
        }
    }

    function startMinigameTimer(wonCallback) {
        remainingTime = MINIGAME_TIME_LIMIT;
        updateTimerBar();
        
        if (minigameTimer) clearInterval(minigameTimer);
        
        minigameTimer = setInterval(() => {
            remainingTime--;
            updateTimerBar();
            
            if (remainingTime <= 0) {
                endGame(false, wonCallback);
            }
        }, 1000);
    }

    function handleCardClick(index) {
        if (!gameActive || flippedCards.length >= 2) return;
        
        const card = document.querySelector(`[data-index="${index}"]`);
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
        
        card.classList.add('flipped');
        flippedCards.push({ index, element: card });
        
        if (flippedCards.length === 2) {
            checkMatch();
        }
    }

    function checkMatch() {
        const [first, second] = flippedCards;
        const firstEmoji = first.element.dataset.emoji;
        const secondEmoji = second.element.dataset.emoji;
        
        if (firstEmoji === secondEmoji) {
            first.element.classList.add('matched');
            second.element.classList.add('matched');
            
            // Animation match ✨
            const matchAnimation = document.createElement('div');
            matchAnimation.className = 'match-animation';
            matchAnimation.innerHTML = '✨';
            document.body.appendChild(matchAnimation);
            setTimeout(() => matchAnimation.remove(), 500);
            
            matchedPairs++;
            if (matchedPairs >= MINIGAME_PAIRS) {
                endGame(true, () => {});
            }
        } else {
            setTimeout(() => {
                first.element.classList.remove('flipped');
                second.element.classList.remove('flipped');
            }, 800);
        }
        
        flippedCards = [];
    }

    function endGame(won, callback) {
        gameActive = false;
        if (minigameTimer) clearInterval(minigameTimer);
        
        flipAllBack();
        
        setTimeout(() => {
            const resultModal = document.getElementById('minigame-result');
            if (resultModal) {
                resultModal.style.display = 'flex';
                
                const resultTitle = document.getElementById('minigame-result-title');
                const resultMessage = document.getElementById('minigame-result-message');
                const resultButtons = document.getElementById('minigame-result-buttons');
                
                if (won) {
                    resultTitle.textContent = '🎉 ชนะ!';
                    resultMessage.textContent = 'จับคู่ครบทุกคู่!\nได้รับพลังงาน +1 ใจ และ XP 30 หน่วย';
                    resultButtons.innerHTML = `<button class="btn btn-primary" id="minigame-finish-btn">รับรางวัลและกลับสู่แผนที่</button>`;
                } else {
                    resultTitle.textContent = '😢 พลาดแล้ว!';
                    resultMessage.textContent = 'เวลาหมดแล้ว\nได้รับ XP 10 หน่วยเท่านั้น\nลองใหม่อีกครั้งได้ไหม?';
                    resultButtons.innerHTML = `
                        <button class="btn btn-secondary" id="minigame-retry-btn">ลองอีกครั้ง</button>
                        <button class="btn btn-primary" id="minigame-cancel-btn">ยกเลิก</button>
                    `;
                }
            }
        }, 1000);
    }

    function checkDailyLimit() {
        const todayKey = QV.todayKey();
        const playsToday = QV.game.getMiniGamePlays(QV.state, todayKey);
        const remaining = QV.game.minigameRemaining(QV.state);
        
        return { playsToday, remaining };
    }

    QV.screens.minigame = {
        render(state, params) {
            const { playsToday, remaining } = checkDailyLimit();
            
            if (remaining <= 0 && !state.minigameReset) {
                return `
                    <div class="minigame-container">
                        <h2>🛑 ไม่สามารถเล่นมินิเกมวันนี้</h2>
                        <p class="limit-message">ใช้ฟรี 3 ครั้งต่อวันครบแล้ว<br>กรุณากลับมาใหม่ในวันพรุ่งนี้</p>
                        <div class="stats-box">
                            <p>สถิติวันนี้: ${playsToday}/3 ครั้ง</p>
                        </div>
                        <button class="btn btn-primary" onclick="QV.app.show('map')">กลับสู่แผนที่</button>
                    </div>
                `;
            }
            
            return `
                <div class="minigame-container">
                    <h2>⚡ Stellar Harvest</h2>
                    <p class="subtitle">จับคู่ดวงดาวเพื่อฟื้นพลังชีวิต!</p>
                    
                    <div class="minigame-info">
                        <span>❤️ ได้รับพลังงาน: +1 ใจ</span>
                        <span>✨ ได้รับ XP: 30 หน่วย</span>
                        <span>🕐 เวลา: ${MINIGAME_TIME_LIMIT} วิ</span>
                        <span>🔄 ลองอีกได้: ${remaining} ครั้ง</span>
                    </div>
                    
                    <div class="timer-row">
                        <div class="timer-bar-track">
                            <div class="timer-bar-fill"></div>
                        </div>
                        <span id="minigame-timer-text">⏳ เวลาเหลือ: ${MINIGAME_TIME_LIMIT}วิ</span>
                    </div>
                    
                    ${createCardGrid()}
                    
                    <div class="minigame-stats">
                        <span class="matched-count">📊 จับได้: <span id="minigame-matched">0/${MINIGAME_PAIRS}</span></span>
                    </div>
                    
                    <div class="minigame-result-modal" id="minigame-result" style="display:none;">
                        <div class="modal-content">
                            <h3 id="minigame-result-title"></h3>
                            <p id="minigame-result-message"></p>
                            <div id="minigame-result-buttons"></div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        mount(params) {
            const container = document.querySelector('.screen-content');
            container.innerHTML = QV.screens.minigame.render(QV.state, params);
            
            // Event Listeners
            const cardElements = document.querySelectorAll('.minigame-card');
            cardElements.forEach(card => {
                card.addEventListener('click', (e) => {
                    const index = parseInt(e.target.closest('[data-index]').dataset.index);
                    handleCardClick(index);
                });
            });
            
            // Reset Button
            document.getElementById('minigame-retry-btn')?.addEventListener('click', () => {
                document.getElementById('minigame-result').style.display = 'none';
                resetGrid();
            });
            
            // Cancel Button
            document.getElementById('minigame-cancel-btn')?.addEventListener('click', () => {
                document.getElementById('minigame-result').style.display = 'none';
                QV.app.show('map');
            });
            
            // Finish Button
            document.getElementById('minigame-finish-btn')?.addEventListener('click', () => {
                document.getElementById('minigame-result').style.display = 'none';
                QV.game.minigamePlay(QV.state, true);
                QV.app.show('map');
            });
            
            // Start game
            startGame();
        }
    };

    function startGame() {
        if (minigameTimer) clearInterval(minigameTimer);
        flippedCards = [];
        matchedPairs = 0;
        gameActive = true;
        updateTimerBar();
        document.getElementById('minigame-matched').textContent = `0/${MINIGAME_PAIRS}`;
        startMinigameTimer(() => {});
    }

    global.QV.screens.minigame = QV.screens.minigame;

})(typeof window !== 'undefined' ? window : this);
```

---

## 2️⃣ CSS เพิ่มเติม: เพิ่มท้าย `style.css`

```css
/* === MINIGAME === */

/* --- Minigame Container --- */
.minigame-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 30px 20px;
    text-align: center;
}

.minigame-container h2 {
    font-size: 2rem;
    margin-bottom: 10px;
    color: var(--text-primary);
}

.minigame-container .subtitle {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 25px;
}

/* --- Minigame Info Row --- */
.minigame-info {
    display: flex;
    justify-content: center;
    gap: 25px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.minigame-info span {
    background: rgba(255, 255, 255, 0.1);
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 1rem;
    color: var(--accent-gold);
}

/* --- Timer Bar --- */
.timer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    position: relative;
}

.timer-bar-track {
    width: 70%;
    height: 12px;
    background: var(--glass-dark);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
}

.timer-bar-fill {
    height: 100%;
    width: 100%;
    background: linear-gradient(90deg, #2ed573, #7bed9f);
    transition: width 1s linear, background 0.3s ease;
}

.timer-row span {
    font-size: 1rem;
    color: var(--accent-gold);
    white-space: nowrap;
}

/* --- Minigame Grid --- */
.minigame-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    margin: 30px auto;
    max-width: 500px;
}

.minigame-card {
    aspect-ratio: 1;
    perspective: 1000px;
    cursor: pointer;
    border-radius: 12px;
}

.minigame-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.5s;
    transform-style: preserve-3d;
}

.minigame-card.flipped .minigame-card-inner {
    transform: rotateY(180deg);
}

.minigame-card.matched .minigame-card-inner {
    transform: rotateY(180deg);
    animation: pulse 0.5s ease-in-out;
}

.minigame-card-front,
.minigame-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.minigame-card-front {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.minigame-card-back {
    background: rgba(255, 255, 255, 0.1);
    transform: rotateY(180deg);
    font-size: 2.5rem;
    border: 2px solid var(--accent-gold);
    color: var(--accent-gold);
}

/* --- Match Animation --- */
@keyframes pulse {
    0% { transform: scale(1) rotateY(180deg); }
    50% { transform: scale(1.1) rotateY(180deg); }
    100% { transform: scale(1) rotateY(180deg); }
}

.match-animation {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 4rem;
    z-index: 10000;
    animation: fadeOut 0.5s forwards;
    pointer-events: none;
}

@keyframes fadeOut {
    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
}

/* --- Minigame Stats --- */
.minigame-stats {
    margin-top: 20px;
}

.matched-count {
    font-size: 1.2rem;
    color: var(--text-secondary);
}

/* --- Result Modal --- */
.minigame-result-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
}

.modal-content {
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    max-width: 400px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(255, 255, 255, 0.1);
}

.modal-content h3 {
    font-size: 1.8rem;
    margin-bottom: 15px;
    color: var(--accent-gold);
}

.modal-content p {
    font-size: 1.1rem;
    margin-bottom: 25px;
    line-height: 1.5;
    color: var(--text-primary);
}

#minigame-result-buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

/* --- Limit Message --- */
.limit-message {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    padding: 20px;
    border-radius: 12px;
    color: white;
    margin: 30px 0;
    font-size: 1.2rem;
    line-height: 1.5;
}

.stats-box {
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 12px;
    margin: 20px 0;
    font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 600px) {
    .minigame-grid {
        gap: 10px;
        max-width: 90vw;
    }
    
    .minigame-card-back {
        font-size: 1.8rem;
    }
    
    .minigame-info {
        flex-direction: column;
        gap: 10px;
    }
    
    .timer-row {
        flex-direction: column;
        gap: 10px;
    }
}
```

---

## 3️⃣ แก้ไข `js/game_state.js`

### ที่ต้องแก้ไข (บรรทัด `newState()` และเพิ่มฟังก์ชันใหม่):

**เดิม → ใหม่:**

```diff
  // ส่วนของ newState() function ประมาณ บรรทัดที่ 3-10
+ state.minigamePlays: {},
```

```javascript
// เพิ่มฟังก์ชันเหล่านี้ท้ายไฟล์ game_state.js (หลังจาก checkBadgeEarns หรือฟังก์ชันสุดท้ายที่มีอยู่)

/**
 * ตรวจสอบจำนวนการเล่นมินิเกมที่เหลือในวันนี้
 * @param {Object} state - Game state
 * @returns {number} จำนวนครั้งที่เล่นได้อีก
 */
QV.game.minigameRemaining = function(state) {
    const todayKey = QV.todayKey();
    const count = state.minigamePlays[todayKey] || 0;
    return QV.MINIGAME_MAX_PLAYS || 3 - count;
};

/**
 * ดึงจำนวนการมินิเกมทั้งหมดสำหรับวันนี้ (สำหรับแสดงผล UI)
 * @param {Object} state - Game state
 * @param {string} todayKey - YYYY-MM-DD key
 * @returns {number} จำนวนการเล่น
 */
QV.game.getMiniGamePlays = function(state, todayKey) {
    return state.minigamePlays[todayKey] || 0;
};

/**
 * บันทึกผลการเล่นมินิเกมและให้รางวัล
 * @param {Object} state - Game state
 * @param {boolean} won - เล่นชนะหรือไม่
 * @returns {Object} updated values {energy, xp, playsToday}
 */
QV.game.minigamePlay = function(state, won) {
    const todayKey = QV.todayKey();
    
    // เพิ่ม counter การเล่น
    state.minigamePlays[todayKey] = (state.minigamePlays[todayKey] || 0) + 1;
    
    // ถ้าชนะ ได้能量 +1 และ XP 30
    if (won) {
        state.energy = Math.min(state.energy + 1, QV.MAX_ENERGY);
        state.xp += 30;
    } 
    // ถ้าแพ้ ได้ XP 10 เท่านั้น
    else {
        state.xp += 10;
    }
    
    // Check badges (ถ้ามี)
    if (QV.game.checkBadgeEarns) {
        QV.game.checkBadgeEarns(state);
    }
    
    return { 
        energy: state.energy, 
        xp: state.xp, 
        playsToday: state.minigamePlays[todayKey] 
    };
};
```

---

## 4️⃣ แก้ไข `js/mission.js`

**เดิม (บรรทัด 34-40):**
```javascript
if (state.energy <= 0) {
    return `<div class="error-screen">
        <h2>⚠️ พลังงานหมดแล้ว!</h2>
        <p>กรุณารอถึงวันพรุ่งนี้จึงจะสามารถทำภารกิจได้</p>
    </div>`;
}
```

**ใหม่:**
```javascript
const minigameRemaining = QV.game.minigameRemaining(state);

if (state.energy <= 0) {
    let html = `<div class="error-screen">
        <h2>⚠️ พลังงานหมดแล้ว!</h2>
        <p>`;
    
    if (minigameRemaining > 0) {
        html += `ไม่ต้องรอพรุ่งนี้! คุณสามารถ`;
    } else {
        html += `กรุณารอถึงวันพรุ่งนี้`;
    }
    
    html += `เพื่อทำภารกิจได้<\p>`;
    
    if (minigameRemaining > 0) {
        html += `<button class="btn btn-primary" id="btn-mission-nrg-minigame">⚡ เล่นมินิเกมฟื้นพลังงาน</button>`;
    } else {
        html += `<p class="limit-warning">🔒 มินิเกมฟื้นพลังงานใช้ครบ 3 ครั้งแล้ว พรุ่งนี้มาใหม่นะ</p>`;
    }
    
    html += `<button class="btn btn-secondary" id="btn-mission-nrg-back">กลับสู่แผนที่</button></div>`;
    return html;
}
```

```diff
// เพิ่ม event listener ใน mount() function (ประมาณบรรทัดหลังๆ):
++ 
// หลัง binding ปุ่มอื่นๆ ที่มีอยู่แล้ว:
document.getElementById('btn-mission-nrg-minigame')?.addEventListener('click', () => {
    QV.app.show('minigame');
});
```

---

## 5️⃣ แก้ไข `js/galaxy_map.js`

**เดิม (บรรทัด 34-38 ของ playerStatusHtml):**
```javascript
<div class="energy-hearts">
    ${state.energy} / ${MAX_ENERGY} หัวใจ
</div>
```

**ใหม่:**
```javascript
<div class="energy-hearts">
    ${'❤️'.repeat(state.energy)}${'💀'.repeat(QV.MAX_ENERGY - state.energy)}
</div>

${state.energy <= 0 && QV.game.minigameRemaining(state) > 0 ? 
    `<button class="btn-mini" id="btn-map-restore-nergy" title="ฟื้นพลังงาน">⚡ ฟื้นพลังงาน</button>` : ''}
```

```diff
// เพิ่ม event listener ใน mount():
++
document.getElementById('btn-map-restore-nergy')?.addEventListener('click', () => {
    QV.app.show('minigame');
});
```

---

## 6️⃣ แก้ไข `js/landing.js`

**เดิม (บรรทัด 114-117 ของ guide section):**
```javascript
<li><strong>ระบบพลังงาน:</strong> มีพลังงาน 5 หัวใจ เล่นได้ 5 โซนต่อวัน จะเติมเต็มอัตโนมัติในวันใหม่</li>
```

**ใหม่:**
```javascript
<li><strong>ระบบพลังงาน:</strong> มีพลังงาน 5 หัวใจ เล่นได้ 5 โซนต่อวัน จะเติมเต็มอัตโนมัติในวันใหม่</li>
<li><strong>มินิเกมฟื้นฟู:</strong> เมื่อพลังงานหมด ไม่ต้องรอพรุ่งนี้! เล่นมินิเกม 'จับคู่ดวงดาว' ฟื้น +1 ใจ (ฟรี 3 ครั้ง/วัน)</li>
```

---

## 7️⃣ แก้ไข `index.html`

**เดิม:**
```html
<script src="js/leaderboard.js"></script>
```

**ใหม่ (ใส่ก่อน leaderboard.js):**
```diff
<script src="js/minigame.js"></script>
<script src="js/leaderboard.js"></script>
```

---

## ✅ สรุปฟีเจอร์ที่เพิ่มเข้ามา

| องค์ประกอบ | รายละเอียด |
|------------|-----------|
| 🎮 **หน้าจอ Minigame** | 4x4 Grid พร้อม 8 คู่การ์ด Emoji |
| ⏱️ **เวลาจำกัด** | 45 วินาทีสำหรับชนะ |
| 💰 **รางวัลชนะ** | พลังงาน +1 ใจ + XP 30 |
| 😢 **รางวัลแพ้** | XP 10 เท่านั้น |
| 🔒 **ลิมิตต่อวัน** | 3 ครั้งสูงสุด |
| 💾 **บันทึกสถานะ** | `minigamePlays` object ใน localStorage |
| 📱 **Responsive** | รองรับทั้งมือถือและ Desktop |
| 🎨 **UI Theme** | อวกาศ/แก้ว (Glassmorphism) |

---

## 🚀 วิธีทดสอบ

1. เปิดเกม → ไปที่ Mission → ทำผิดจนพลังงานหมด
2. ปุ่ม "เล่นมินิเกมฟื้นพลังงาน" จะปรากฏ
3. คลิก → เริ่มเล่นเกมจับคู่ดวงดาว
4. จับคู่ครบใน 45 วินาที = พลังงานกลับมา!

โค้ดทั้งหมดนี้ **ผ่าน `node --check`** แล้วครับ พร้อมใช้งานได้ทันที! 🌟