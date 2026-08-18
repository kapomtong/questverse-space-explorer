```html
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuestVerse — Space Explorer</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- จอโหลดเริ่มต้น -->
    <div id="preloader">
        <img src="assets/explorer_ship.png" alt="Explorer Ship" class="preloader-ship">
        <p class="preloader-text">กำลังเตรียมยานสำรวจ...</p>
    </div>

    <!-- Container หลักของแอป -->
    <div id="app"></div>

    <!-- โหลด JavaScript modules ตามลำดับ -->
    <script src="js/config.js"></script>
    <script src="js/app.js"></script>
    <script src="js/landing.js"></script>
    <script src="js/character.js"></script>
    <script src="js/galaxy_map.js"></script>
    <script src="js/mission.js"></script>
    <script src="js/leaderboard.js"></script>
    <script src="js/game_state.js"></script>

    <!-- ซ่อน preloader เมื่อโหลดเสร็จ -->
    <script>
        window.addEventListener('load', function() {
            const preloader = document.getElementById('preloader');
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    </script>
</body>
</html>
```

```css
/* ========================================
   CSS Variables — สีและค่าคงที่ของเกม
   ======================================== */
:root {
    --space-deep: #07081a;
    --space-mid: #121438;
    --space-mid2: #1a1d4a;
    --accent-cyan: #7df9ff;
    --accent-gold: #ffd166;
    --accent-purple: #9d4edd;
    --danger: #ef476f;
    --success: #06d6a0;
    --text: #e8eaf6;
    --text-dim: #9aa3c7;
}

/* ========================================
   Base Reset และ Typography
   ======================================== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: var(--space-deep);
    font-family: 'Kanit', sans-serif;
    color: var(--text);
    line-height: 1.6;
    overflow-x: hidden;
}

/* ========================================
   Layout — Container
   ======================================== */
.container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 16px;
}

/* ========================================
   Card Glass Effect
   ======================================== */
.card-glass {
    background: rgba(18, 20, 56, 0.78);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(125, 249, 255, 0.22);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
    padding: 24px;
}

/* ========================================
   Buttons — ระบบปุ่มทั้งหมด
   ======================================== */
.btn {
    padding: 12px 28px;
    border: none;
    border-radius: 12px;
    font-family: 'Kanit', sans-serif;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
}

.btn-primary {
    background: linear-gradient(135deg, var(--accent-cyan), #4cc9f0);
    color: var(--space-deep);
    box-shadow: 0 0 20px rgba(125, 249, 255, 0.4);
}

.btn-primary:hover {
    transform: scale(1.04);
    box-shadow: 0 0 30px rgba(125, 249, 255, 0.6);
}

.btn-primary:active {
    transform: scale(0.97);
}

.btn-secondary {
    border: 1px solid rgba(125, 249, 255, 0.5);
    background: transparent;
    color: var(--text);
}

.btn-secondary:hover {
    transform: scale(1.04);
    background: rgba(125, 249, 255, 0.1);
}

.btn-secondary:active {
    transform: scale(0.97);
}

.btn-danger {
    background: var(--danger);
    color: var(--text);
}

.btn-danger:hover {
    transform: scale(1.04);
    box-shadow: 0 0 20px rgba(239, 71, 111, 0.5);
}

.btn-danger:active {
    transform: scale(0.97);
}

.btn-item {
    background: rgba(18, 20, 56, 0.6);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(125, 249, 255, 0.3);
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
}

.btn-item:hover {
    transform: scale(1.04);
    border-color: var(--accent-cyan);
}

.btn-item:active {
    transform: scale(0.97);
}

.btn-item:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.btn-item:disabled:hover {
    transform: none;
}

/* ========================================
   Screen — Landing (หน้าแรก)
   ======================================== */
.screen-landing {
    min-height: 100vh;
    background: 
        linear-gradient(rgba(7, 8, 26, 0.35), rgba(7, 8, 26, 0.75)),
        url('../assets/landing_bg.jpg') center/cover no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 24px;
}

.screen-landing h1 {
    font-weight: 700;
    font-size: clamp(48px, 9vw, 96px);
    color: var(--accent-cyan);
    letter-spacing: 6px;
    text-shadow: 0 0 40px rgba(125, 249, 255, 0.6);
    animation: glowPulse 3s ease-in-out infinite;
}

.screen-landing .subtitle {
    font-weight: 300;
    font-size: clamp(18px, 3vw, 24px);
    color: var(--text-dim);
    max-width: 600px;
    margin: 0 16px;
}

.screen-landing #btn-start {
    font-size: 20px;
    padding: 16px 48px;
    margin-top: 16px;
}

/* ========================================
   Screen — Character Selection
   ======================================== */
.screen-character {
    min-height: 100vh;
    padding: 40px 16px;
}

.screen-character h2 {
    text-align: center;
    font-size: clamp(32px, 5vw, 48px);
    color: var(--accent-cyan);
    margin-bottom: 32px;
}

.character-form {
    max-width: 800px;
    margin: 0 auto;
}

.character-form label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--accent-gold);
}

.character-form input[type="text"] {
    width: 100%;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(125, 249, 255, 0.3);
    border-radius: 12px;
    color: var(--text);
    font-family: 'Kanit', sans-serif;
    font-size: 16px;
    margin-bottom: 32px;
    transition: all 0.3s ease;
}

.character-form input[type="text"]:focus {
    outline: none;
    border-color: var(--accent-cyan);
    box-shadow: 0 0 12px rgba(125, 249, 255, 0.3);
}

.suit-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 32px;
}

.suit-card {
    background: rgba(18, 20, 56, 0.6);
    border: 2px solid rgba(125, 249, 255, 0.2);
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.suit-card:hover {
    border-color: var(--accent-cyan);
    transform: translateY(-4px);
}

.suit-card.selected {
    border: 3px solid var(--accent-gold);
    box-shadow: 0 0 24px rgba(255, 209, 102, 0.5);
}

.suit-card img {
    width: 100%;
    height: 220px;
    object-fit: contain;
    margin-bottom: 12px;
}

.suit-card h3 {
    color: var(--text);
    font-size: 18px;
    font-weight: 600;
}

.character-actions {
    text-align: center;
}

/* ========================================
   Screen — Galaxy Map (แผนที่ดาวเคราะห์)
   ======================================== */
.screen-map {
    min-height: 100vh;
    padding: 24px 16px;
}

.player-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 32px;
    padding: 20px;
    background: rgba(18, 20, 56, 0.78);
    border: 1px solid rgba(125, 249, 255, 0.22);
    border-radius: 16px;
}

.player-info {
    display: flex;
    align-items: center;
    gap: 16px;
}

.player-name {
    font-size: 24px;
    font-weight: 700;
    color: var(--accent-cyan);
}

.rank-chip {
    padding: 4px 12px;
    border-radius: 20px;
    background: linear-gradient(135deg, var(--accent-gold), #f4a261);
    font-size: 12px;
    font-weight: 600;
    color: var(--space-deep);
    text-transform: uppercase;
}

.xp-bar-container {
    flex: 1;
    min-width: 200px;
}

.xp-bar-label {
    font-size: 14px;
    margin-bottom: 4px;
    color: var(--text-dim);
}

.xp-bar {
    width: 100%;
    height: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 999px;
    overflow: hidden;
}

.xp-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent-cyan), #4cc9f0);
    border-radius: 999px;
    transition: width 0.5s ease;
}

.energy-hearts {
    display: flex;
    gap: 6px;
    font-size: 24px;
}

.heart {
    color: var(--danger);
    transition: all 0.3s ease;
}

.heart.empty {
    opacity: 0.3;
}

.planets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;
}

.planet-card {
    background: rgba(18, 20, 56, 0.78);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(125, 249, 255, 0.22);
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.planet-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}

.planet-card.locked {
    opacity: 0.6;
    cursor: not-allowed;
}

.planet-card.locked:hover {
    transform: none;
}

.planet-card img {
    width: 140px;
    height: 140px;
    object-fit: contain;
    margin-bottom: 16px;
    animation: float 3s ease-in-out infinite;
}

.planet-name {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--text);
}

.planet-subject {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 12px;
}

.planet-status {
    display: inline-block;
    padding: 6px 16px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
}

.planet-status.locked {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-dim);
}

.planet-status.active {
    background: rgba(125, 249, 255, 0.2);
    color: var(--accent-cyan);
    border: 1px solid var(--accent-cyan);
}

.planet-status.complete {
    background: rgba(255, 209, 102, 0.2);
    color: var(--accent-gold);
    border: 1px solid var(--accent-gold);
}

/* ========================================
   Screen — Mission (ภารกิจคำถาม)
   ======================================== */
.screen-mission {
    min-height: 100vh;
    padding: 24px 16px;
}

.mission-header {
    text-align: center;
    margin-bottom: 32px;
}

.mission-header h2 {
    font-size: clamp(28px, 5vw, 40px);
    color: var(--accent-cyan);
    margin-bottom: 8px;
}

.zone-tag {
    display: inline-block;
    padding: 6px 16px;
    border-radius: 999px;
    background: rgba(125, 249, 255, 0.15);
    color: var(--accent-cyan);
    font-size: 14px;
    font-weight: 600;
    border: 1px solid var(--accent-cyan);
}

.progress-dots {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 32px;
}

.progress-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
}

.progress-dot.completed {
    background: var(--success);
    box-shadow: 0 0 12px rgba(6, 214, 160, 0.6);
}

.progress-dot.active {
    background: var(--accent-cyan);
    box-shadow: 0 0 12px rgba(125, 249, 255, 0.6);
    transform: scale(1.3);
}

.question-card {
    max-width: 800px;
    margin: 0 auto 24px;
    background: rgba(18, 20, 56, 0.78);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(125, 249, 255, 0.22);
    border-radius: 16px;
    padding: 32px;
}

.question-text {
    font-size: clamp(18px, 3vw, 24px);
    font-weight: 600;
    color: var(--text);
    margin-bottom: 24px;
    line-height: 1.5;
}

.answers-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 24px;
}

.answer-btn {
    padding: 20px;
    background: rgba(26, 29, 74, 0.6);
    border: 2px solid rgba(125, 249, 255, 0.3);
    border-radius: 12px;
    color: var(--text);
    font-family: 'Kanit', sans-serif;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
}

.answer-btn:hover {
    background: rgba(125, 249, 255, 0.15);
    border-color: var(--accent-cyan);
    transform: translateY(-2px);
}

.answer-btn.selected {
    background: rgba(125, 249, 255, 0.25);
    border-color: var(--accent-cyan);
    box-shadow: 0 0 16px rgba(125, 249, 255, 0.4);
}

.answer-btn.correct {
    background: rgba(6, 214, 160, 0.2);
    border-color: var(--success);
    pointer-events: none;
}

.answer-btn.wrong {
    background: rgba(239, 71, 111, 0.2);
    border-color: var(--danger);
    animation: shake 0.5s;
    pointer-events: none;
}

.items-bar {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 24px;
}

.item-btn {
    display: flex;
    align-items: center;
    gap: 8px;
}

.item-btn img {
    width: 20px;
    height: 20px;
}

.item-count {
    background: rgba(255, 255, 255, 0.15);
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 12px;
}

.hint-box {
    background: rgba(157, 78, 221, 0.15);
    border: 1px solid var(--accent-purple);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    color: var(--text);
    font-size: 15px;
}

.hint-box::before {
    content: "💡 คำใบ้: ";
    font-weight: 600;
    color: var(--accent-purple);
}

.feedback {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 16px;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.feedback.correct {
    background: var(--success);
    color: var(--space-deep);
}

.feedback.wrong {
    background: var(--danger);
    color: var(--text);
}

.mission-actions {
    text-align: center;
    display: flex;
    justify-content: center;
    gap: 12px;
}

/* ========================================
   Screen — Summary (สรุปผล)
   ======================================== */
.screen-summary {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
}

.summary-card {
    max-width: 600px;
    width: 100%;
    background: rgba(18, 20, 56, 0.9);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(125, 249, 255, 0.22);
    border-radius: 16px;
    padding: 40px;
    text-align: center;
}

.summary-card h2 {
    font-size: clamp(32px, 6vw, 48px);
    color: var(--accent-cyan);
    margin-bottom: 24px;
}

.xp-gained {
    font-size: clamp(56px, 10vw, 80px);
    font-weight: 700;
    color: var(--accent-gold);
    margin: 24px 0;
    text-shadow: 0 0 30px rgba(255, 209, 102, 0.6);
}

.badges-earned {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    margin: 24px 0;
}

.badge-chip {
    padding: 8px 16px;
    border-radius: 999px;
    background: linear-gradient(135deg, var(--accent-purple), #c77dff);
    color: var(--text);
    font-size: 14px;
    font-weight: 600;
}

.summary-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 32px;
}

/* ========================================
   Screen — Leaderboard (กระดานคะแนน)
   ======================================== */
.screen-leaderboard {
    min-height: 100vh;
    padding: 40px 16px;
}

.screen-leaderboard h2 {
    text-align: center;
    font-size: clamp(32px, 5vw, 48px);
    color: var(--accent-cyan);
    margin-bottom: 32px;
}

.leaderboard-table {
    max-width: 900px;
    margin: 0 auto;
    background: rgba(18, 20, 56, 0.78);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(125, 249, 255, 0.22);
    border-radius: 16px;
    overflow: hidden;
}

.leaderboard-table table {
    width: 100%;
    border-collapse: collapse;
}

.leaderboard-table thead {
    background: linear-gradient(135deg, rgba(125, 249, 255, 0.2), rgba(76, 201, 240, 0.2));
}

.leaderboard-table th {
    padding: 16px;
    text-align: left;
    font-weight: 600;
    color: var(--accent-cyan);
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.leaderboard-table td {
    padding: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text);
}

.leaderboard-table tbody tr {
    transition: background 0.3s ease;
}

.leaderboard-table tbody tr:hover {
    background: rgba(125, 249, 255, 0.08);
}

.rank-number {
    font-weight: 700;
    font-size: 18px;
    color: var(--accent-gold);
}

/* ========================================
   Preloader
   ======================================== */
#preloader {
    position: fixed;
    inset: 0;
    background: var(--space-deep);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    transition: opacity 0.5s ease;
}

.preloader-ship {
    width: 120px;
    height: 120px;
    animation: spin 3s linear infinite;
}

.preloader-text {
    font-size: 18px;
    color: var(--accent-cyan);
    font-weight: 600;
}

/* ========================================
   Animations
   ======================================== */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-12px);
    }
}

@keyframes glowPulse {
    0%, 100% {
        text-shadow: 0 0 40px rgba(125, 249, 255, 0.6);
    }
    50% {
        text-shadow: 0 0 60px rgba(125, 249, 255, 0.9), 0 0 80px rgba(125, 249, 255, 0.5);
    }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes confetti {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
    }
}

/* ========================================
   Utility Classes
   ======================================== */
.hidden {
    display: none !important;
}

.text-center {
    text-align: center;
}

.text-gold {
    color: var(--accent-gold);
}

/* ========================================
   Responsive — Mobile
   ======================================== */
@media (max-width: 640px) {
    .suit-grid {
        grid-template-columns: 1fr;
        max-width: 300px;
        margin: 0 auto 32px;
    }

    .planets-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }

    .planet-card img {
        width: 100px;
        height: 100px;
    }

    .answers-grid {
        grid-template-columns: 1fr;
    }

    .player-status {
        flex-direction: column;
        align-items: stretch;
    }

    .xp-bar-container {
        min-width: 100%;
    }

    .mission-actions {
        flex-direction: column;
    }

    .summary-actions {
        flex-direction: column;
    }

    .feedback {
        left: 16px;
        right: 16px;
        top: 16px;
    }

    .leaderboard-table th,
    .leaderboard-table td {
        padding: 12px 8px;
        font-size: 14px;
    }
}
```