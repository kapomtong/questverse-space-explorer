// js/minigame.js — Screen: ⚡ Stellar Harvest (Energy Recovery Minigame)
// Contract: QV.screens['minigame'] = { render(state, params), mount(params) }

(function(global) {
    'use strict';

    const MINIGAME_PAIRS = 8;
    const MINIGAME_TIME_LIMIT = 45; // วินาที
    const MINIGAME_MAX_PLAYS_PER_DAY = 3;

    // ไอคอนดวงดาว 8 แบบ (ภาพ AI — พื้นใส webp 256x256)
    const CARD_ICONS = [
        { id: 'goldstar',    img: 'assets/card_goldstar.webp' },
        { id: 'doublespark', img: 'assets/card_doublespark.webp' },
        { id: 'star3',       img: 'assets/card_star3.webp' },
        { id: 'nebula',      img: 'assets/card_nebula.webp' },
        { id: 'moon',        img: 'assets/card_moon.webp' },
        { id: 'sparkle',     img: 'assets/card_sparkle.webp' },
        { id: 'comet',       img: 'assets/card_comet.webp' },
        { id: 'telescope',   img: 'assets/card_telescope_icon.webp' },
    ];

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
        // สับลำดับ index ของไอคอน 8 แบบ × 2 (16 ใบ)
        const pairs = shuffleArray([...CARD_ICONS, ...CARD_ICONS]);

        let html = '<div class="minigame-grid">';
        for (let i = 0; i < 16; i++) {
            html += `<div class="minigame-card" data-index="${i}" data-card-id="${pairs[i].id}">
                        <div class="minigame-card-inner">
                            <div class="minigame-card-front">?</div>
                            <div class="minigame-card-back"><img src="${pairs[i].img}" alt="${pairs[i].id}" draggable="false"></div>
                        </div>
                    </div>`;
        }
        html += '</div>';
        return html;
    }

    function flipAllBack() {
        const cards = document.querySelectorAll('.minigame-card');
        cards.forEach(card => {
            card.classList.remove('flipped', 'matched');
        });
    }

    function updateTimerBar() {
        const fillWidth = (remainingTime / MINIGAME_TIME_LIMIT) * 100;
        const timerBar = document.querySelector('.minigame-timer .timer-bar-fill');
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

    function startMinigameTimer() {
        remainingTime = MINIGAME_TIME_LIMIT;
        updateTimerBar();

        if (minigameTimer) clearInterval(minigameTimer);

        minigameTimer = setInterval(() => {
            remainingTime--;
            updateTimerBar();

            if (remainingTime <= 0) {
                endGame(false);
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
        const firstId = first.element.getAttribute('data-card-id');
        const secondId = second.element.getAttribute('data-card-id');

        if (firstId === secondId) {
            first.element.classList.add('matched');
            second.element.classList.add('matched');

            // Animation match ✨
            const matchAnimation = document.createElement('div');
            matchAnimation.className = 'match-animation';
            matchAnimation.textContent = '✨';
            document.body.appendChild(matchAnimation);
            setTimeout(() => matchAnimation.remove(), 600);

            matchedPairs++;
            const matchedEl = document.getElementById('minigame-matched');
            if (matchedEl) matchedEl.textContent = `${matchedPairs}/${MINIGAME_PAIRS}`;
            if (matchedPairs >= MINIGAME_PAIRS) {
                endGame(true);
            }
        } else {
            setTimeout(() => {
                first.element.classList.remove('flipped');
                second.element.classList.remove('flipped');
            }, 800);
        }

        flippedCards = [];
    }

    function endGame(won) {
        if (!gameActive) return; // กัน timer เรียก endGame(false) ซ้อนหลังชนะ
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
                    resultTitle.textContent = '🎉 ชนะแล้ว!';
                    resultMessage.textContent = 'จับคู่ครบทุกดวงดาว!\nได้รับพลังงาน +1 ใจ และ XP +30';
                    resultButtons.innerHTML = `<button class="btn btn-primary" id="minigame-finish-btn" data-action="finish">🎁 รับรางวัลและกลับสู่แผนที่</button>`;
                } else {
                    resultTitle.textContent = '😢 เวลาหมดแล้ว!';
                    resultMessage.textContent = 'ไม่ผ่านด่านครั้งนี้ — ได้รับ XP +10 (ไม่ได้พลังงาน)\nใช้สิทธิ์ไป 1 ครั้ง พรุ่งนี้มาใหม่ได้นะ';
                    resultButtons.innerHTML = `<button class="btn btn-primary" id="minigame-giveup-btn" data-action="giveup">🗺️ กลับสู่แผนที่ (XP +10)</button>`;
                }
            }
        }, 900);
    }

    function resetGrid() {
        flipAllBack();
        setTimeout(() => startGame(), 300);
    }

    function startGame() {
        if (minigameTimer) clearInterval(minigameTimer);
        flippedCards = [];
        matchedPairs = 0;
        gameActive = true;
        const matchedEl = document.getElementById('minigame-matched');
        if (matchedEl) matchedEl.textContent = `0/${MINIGAME_PAIRS}`;
        updateTimerBar();
        startMinigameTimer();
    }

    QV.screens.minigame = {
        render(state, params) {
            const remaining = QV.game.minigameRemaining(state);
            const playsToday = QV.game.getMiniGamePlays(state);

            if (remaining <= 0) {
                return `
                    <div class="screen-minigame">
                        <div class="minigame-container">
                            <h2>🛑 วันนี้เล่นครบแล้ว!</h2>
                            <div class="limit-message">ใช้ฟรี 3 ครั้งต่อวันครบแล้ว<br>กลับมาใหม่วันพรุ่งนี้นะ 🌙</div>
                            <div class="stats-box"><p>สถิติวันนี้: ${playsToday}/3 ครั้ง · พลังงาน: ${state.energy}/${QV.MAX_ENERGY} ใจ</p></div>
                            <button class="btn btn-primary" id="minigame-limit-back">🗺️ กลับสู่แผนที่</button>
                        </div>
                    </div>
                `;
            }

            return `
                <div class="screen-minigame">
                    <div class="minigame-container">
                        <h2>⚡ Stellar Harvest</h2>
                        <p class="subtitle">พลิกการ์ดจับคู่ดวงดาวให้ครบภายใน 45 วินาที เพื่อฟื้นฟู +1 ใจ!</p>

                        <div class="minigame-info">
                            <span>❤️ +1 ใจเมื่อชนะ</span>
                            <span>✨ +30 XP เมื่อชนะ</span>
                            <span>🕐 45 วิ</span>
                            <span>🔄 เหลืออีก ${remaining} ครั้งวันนี้</span>
                        </div>

                        <div class="minigame-timer timer-row">
                            <div class="timer-bar-track">
                                <div class="timer-bar-fill"></div>
                            </div>
                            <span id="minigame-timer-text">⏳ เวลาเหลือ: ${MINIGAME_TIME_LIMIT}วิ</span>
                        </div>

                        ${createCardGrid()}

                        <div class="minigame-stats">
                            <span class="matched-count">📊 จับคู่ได้: <span id="minigame-matched">0/${MINIGAME_PAIRS}</span></span>
                        </div>

                        <div class="minigame-result-modal" id="minigame-result" style="display:none;">
                            <div class="modal-content">
                                <h3 id="minigame-result-title"></h3>
                                <p id="minigame-result-message"></p>
                                <div id="minigame-result-buttons"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        mount(params) {
            const state = QV.state;

            // ปุ่มลิมิตหมด
            const btnLimitBack = document.getElementById('minigame-limit-back');
            if (btnLimitBack) btnLimitBack.addEventListener('click', () => QV.app.show('map'));

            // Event delegation สำหรับปุ่มผลลัพธ์ (element ถูกสร้างใหม่ใน endGame — ผูกที่ container เท่าที่นั้น)
            const resultButtons = document.getElementById('minigame-result-buttons');
            if (resultButtons) {
                resultButtons.addEventListener('click', (e) => {
                    const btn = e.target.closest('[data-action]');
                    if (!btn) return;
                    const action = btn.getAttribute('data-action');
                    if (action === 'finish') {
                        QV.game.minigamePlay(state, true);
                        QV.saveState(state);
                        QV.app.toast(`🎁 ชนะ! +1 ใจ · XP +30 · เหลือเล่นอีก ${QV.game.minigameRemaining(state)} ครั้ง`, 'correct');
                        QV.app.show('map');
                    } else if (action === 'giveup') {
                        QV.game.minigamePlay(state, false);
                        QV.saveState(state);
                        QV.app.toast(`ได้รับ XP +10 · เหลือเล่นอีก ${QV.game.minigameRemaining(state)} ครั้งวันนี้`, 'info');
                        QV.app.show('map');
                    }
                });
            }

            // ปุ่มการ์ด
            const cardElements = document.querySelectorAll('.minigame-card');
            cardElements.forEach(card => {
                card.addEventListener('click', () => {
                    const index = parseInt(card.getAttribute('data-index'), 10);
                    handleCardClick(index);
                });
            });

            // เริ่มเกม
            startGame();
        }
    };

})(typeof window !== 'undefined' ? window : this);
