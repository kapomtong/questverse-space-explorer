### `index.html`
```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#07081a">
  <meta name="description" content="QuestVerse — Space Explorer เกมผจญภัยเรียนรู้ข้าม 5 ดาวเคราะห์">
  <title>QuestVerse — Space Explorer</title>

  <!-- ฟอนต์หลักของเกม -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- พื้นที่หลักสำหรับแสดงหน้าต่าง ๆ ของเกมแบบ SPA -->
  <div id="app" aria-live="polite"></div>

  <!-- หน้าจอโหลดเริ่มต้น -->
  <div id="preloader" class="preloader" role="status" aria-label="กำลังโหลดเกม">
    <div class="preloader-stars" aria-hidden="true"></div>
    <div class="preloader-content">
      <div class="loader-planet" aria-hidden="true">
        <span class="loader-ring loader-ring-one"></span>
        <span class="loader-ring loader-ring-two"></span>
        <span class="loader-core"></span>
      </div>
      <h1 class="preloader-title">QUESTVERSE</h1>
      <p>กำลังเตรียมยานสำรวจ...</p>
      <div class="loading-track" aria-hidden="true">
        <span class="loading-progress"></span>
      </div>
    </div>
  </div>

  <!-- โหลดไฟล์ตามลำดับของระบบเกม -->
  <script src="js/config.js"></script>
  <script src="js/app.js"></script>
  <script src="js/landing.js"></script>
  <script src="js/character.js"></script>
  <script src="js/galaxy_map.js"></script>
  <script src="js/mission.js"></script>
  <script src="js/leaderboard.js"></script>
  <script src="js/api_service.js"></script>
  <script src="js/game_state.js"></script>

  <script>
    // ซ่อนหน้าจอโหลดและเริ่มต้นแอปหลังจากโหลดทรัพยากรทั้งหมดแล้ว
    window.addEventListener('load', function () {
      var preloader = document.getElementById('preloader');

      if (preloader) {
        preloader.classList.add('is-hidden');

        window.setTimeout(function () {
          preloader.remove();
        }, 600);
      }

      if (window.QV && window.QV.app && typeof window.QV.app.init === 'function') {
        window.QV.app.init();
      }
    });
  </script>
</body>
</html>
```

### `style.css`
```css
/* =========================================
   ตัวแปรสีและค่าพื้นฐานของเกม
   ========================================= */
:root {
  --space-deep: #07081a;
  --space-mid: #121438;
  --accent-cyan: #7df9ff;
  --accent-gold: #ffd166;
  --accent-purple: #9d4edd;
  --danger: #ef476f;
  --success: #06d6a0;
  --text: #e8eaf6;

  --text-muted: #a7abc9;
  --text-dark: #11142e;
  --surface: rgba(18, 20, 56, 0.75);
  --surface-solid: #171a48;
  --surface-light: rgba(255, 255, 255, 0.08);
  --border: rgba(125, 249, 255, 0.25);
  --border-soft: rgba(232, 234, 246, 0.14);
  --shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  --cyan-glow: 0 0 18px rgba(125, 249, 255, 0.45);
  --gold-glow: 0 0 18px rgba(255, 209, 102, 0.42);

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 999px;

  --container-width: 1000px;
  --transition: 180ms ease;
}

/* =========================================
   รีเซ็ตและโครงสร้างทั่วไป
   ========================================= */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  min-width: 320px;
  min-height: 100%;
  scroll-behavior: smooth;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
  overflow-x: hidden;
  background: var(--space-deep);
  color: var(--text);
  font-family: "Kanit", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body::before {
  position: fixed;
  z-index: -2;
  inset: 0;
  content: "";
  pointer-events: none;
  background:
    radial-gradient(circle at 15% 15%, rgba(157, 78, 221, 0.16), transparent 30%),
    radial-gradient(circle at 85% 80%, rgba(125, 249, 255, 0.1), transparent 30%);
}

body::after {
  position: fixed;
  z-index: -1;
  inset: 0;
  content: "";
  opacity: 0.28;
  pointer-events: none;
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.82) 0 1px, transparent 1.5px),
    radial-gradient(circle, rgba(125, 249, 255, 0.7) 0 1px, transparent 1.5px);
  background-position: 8% 12%, 76% 70%;
  background-size: 190px 190px, 260px 260px;
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

img {
  display: block;
  max-width: 100%;
}

a {
  color: var(--accent-cyan);
}

h1,
h2,
h3,
h4,
p {
  margin-top: 0;
}

h1,
h2,
h3,
h4 {
  line-height: 1.2;
}

[hidden] {
  display: none !important;
}

/* =========================================
   คลาสช่วยจัดวางและการเข้าถึง
   ========================================= */
.container {
  width: min(calc(100% - 32px), var(--container-width));
  margin-inline: auto;
}

.text-center {
  text-align: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* =========================================
   หน้าจอโหลดเริ่มต้น
   ========================================= */
.preloader {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  background:
    radial-gradient(circle at center, rgba(30, 35, 93, 0.72), transparent 42%),
    var(--space-deep);
  transition: opacity 500ms ease, visibility 500ms ease;
}

.preloader.is-hidden {
  visibility: hidden;
  opacity: 0;
}

.preloader-stars,
.preloader-stars::before,
.preloader-stars::after {
  position: absolute;
  inset: 0;
  content: "";
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.95) 0 1px, transparent 1.5px),
    radial-gradient(circle, rgba(125, 249, 255, 0.8) 0 1px, transparent 1.5px);
  background-position: 10% 20%, 80% 65%;
  background-size: 180px 180px, 250px 250px;
  animation: star-drift 18s linear infinite;
}

.preloader-stars::before {
  opacity: 0.5;
  transform: scale(1.3);
  animation-duration: 26s;
}

.preloader-stars::after {
  opacity: 0.25;
  transform: scale(1.7);
  animation-duration: 36s;
}

.preloader-content {
  position: relative;
  z-index: 1;
  width: min(88%, 360px);
  text-align: center;
}

.preloader-title {
  margin: 18px 0 4px;
  color: var(--accent-cyan);
  font-size: clamp(2rem, 9vw, 3rem);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-shadow: 0 0 8px rgba(125, 249, 255, 0.75);
}

.preloader-content p {
  margin-bottom: 22px;
  color: var(--text-muted);
}

.loader-planet {
  position: relative;
  width: 86px;
  height: 86px;
  margin-inline: auto;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
  box-shadow:
    inset -12px -10px 22px rgba(0, 0, 0, 0.36),
    0 0 30px rgba(125, 249, 255, 0.48);
  animation: float 3s ease-in-out infinite;
}

.loader-core {
  position: absolute;
  inset: 18px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #ffffff, var(--accent-cyan) 25%, #4f62d8 75%);
}

.loader-ring {
  position: absolute;
  z-index: 2;
  top: 35px;
  left: -16px;
  width: 118px;
  height: 22px;
  border: 2px solid rgba(255, 209, 102, 0.9);
  border-radius: 50%;
  transform: rotate(-20deg);
}

.loader-ring-two {
  top: 29px;
  left: -11px;
  width: 108px;
  border-color: rgba(255, 255, 255, 0.35);
  transform: rotate(20deg);
}

.loading-track {
  width: 100%;
  height: 7px;
  overflow: hidden;
  border: 1px solid rgba(125, 249, 255, 0.25);
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.08);
}

.loading-progress {
  display: block;
  width: 42%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent-purple), var(--accent-cyan));
  box-shadow: var(--cyan-glow);
  animation: loading-progress 1.6s ease-in-out infinite;
}

/* =========================================
   โครงสร้างหน้าจอของ SPA
   ========================================= */
.screen {
  position: relative;
  min-height: 100vh;
  padding: 28px 0 48px;
  animation: fade-in 500ms ease both;
}

.screen-landing {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 32px 16px;
  overflow: hidden;
  background-image:
    linear-gradient(180deg, rgba(7, 8, 26, 0.12), rgba(7, 8, 26, 0.92)),
    url("../assets/landing_bg.jpg"),
    url("assets/landing_bg.jpg");
  background-position: center;
  background-size: cover;
  isolation: isolate;
}

.screen-landing::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  content: "";
  opacity: 0.6;
  background:
    radial-gradient(ellipse at center, transparent 8%, rgba(7, 8, 26, 0.3) 54%, rgba(7, 8, 26, 0.86)),
    linear-gradient(110deg, rgba(157, 78, 221, 0.16), transparent 50%, rgba(125, 249, 255, 0.12));
}

.screen-landing::after {
  position: absolute;
  z-index: -1;
  top: 11%;
  right: 7%;
  width: 5px;
  height: 5px;
  content: "";
  border-radius: 50%;
  background: white;
  box-shadow:
    -210px 100px 0 1px rgba(255, 255, 255, 0.82),
    -480px 210px 0 0 rgba(125, 249, 255, 0.8),
    90px 350px 0 1px rgba(255, 209, 102, 0.8),
    -120px 450px 0 0 rgba(255, 255, 255, 0.75);
  animation: glow-pulse 3s ease-in-out infinite;
}

.landing-content {
  width: min(100%, 720px);
  padding: 26px 0;
  text-align: center;
}

.landing-eyebrow {
  margin-bottom: 8px;
  color: var(--accent-gold);
  font-size: clamp(0.9rem, 2.8vw, 1.2rem);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.landing-title {
  margin: 0;
  color: var(--accent-cyan);
  font-size: clamp(3rem, 15vw, 8.5rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 0.95;
  text-shadow:
    0 0 7px rgba(125, 249, 255, 0.9),
    0 0 26px rgba(125, 249, 255, 0.7),
    0 0 58px rgba(157, 78, 221, 0.6);
}

.landing-tagline {
  margin: 20px auto 30px;
  color: var(--text);
  font-size: clamp(1.15rem, 4vw, 1.7rem);
  font-weight: 300;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.75);
}

.landing-description {
  max-width: 520px;
  margin: 0 auto 30px;
  color: var(--text-muted);
}

/* =========================================
   การ์ดกระจกและส่วนหัวหน้าจอ
   ========================================= */
.card-glass {
  border: 1px solid rgba(125, 249, 255, 0.25);
  border-radius: 16px;
  background: rgba(18, 20, 56, 0.75);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}

.screen-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.screen-title {
  margin-bottom: 6px;
  color: var(--text);
  font-size: clamp(1.6rem, 5vw, 2.3rem);
}

.screen-subtitle {
  margin-bottom: 0;
  color: var(--text-muted);
}

.panel {
  padding: 20px;
}

.divider {
  height: 1px;
  margin: 20px 0;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
}

/* =========================================
   ปุ่มทั่วไปและปุ่มหลักของเกม
   ========================================= */
.btn {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid transparent;
  border-radius: 10px;
  color: var(--text);
  font-weight: 500;
  line-height: 1.2;
  text-align: center;
  text-decoration: none;
  transition:
    transform var(--transition),
    box-shadow var(--transition),
    background var(--transition),
    border-color var(--transition),
    filter var(--transition);
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn:active:not(:disabled) {
  transform: translateY(1px) scale(0.98);
}

.btn:focus-visible,
.answer-btn:focus-visible,
.suit-card:focus-within,
.planet-card:focus-within {
  outline: 3px solid rgba(255, 209, 102, 0.8);
  outline-offset: 3px;
}

.btn-primary {
  border-color: rgba(125, 249, 255, 0.85);
  background: linear-gradient(135deg, #7df9ff, #4cc9f0 48%, #9d4edd);
  color: var(--text-dark);
  box-shadow:
    0 0 16px rgba(125, 249, 255, 0.38),
    0 7px 22px rgba(0, 0, 0, 0.25);
  font-weight: 600;
}

.btn-primary:hover:not(:disabled) {
  filter: brightness(1.12);
  box-shadow:
    0 0 24px rgba(125, 249, 255, 0.62),
    0 10px 28px rgba(0, 0, 0, 0.32);
}

.btn-secondary {
  border-color: rgba(125, 249, 255, 0.42);
  background: rgba(125, 249, 255, 0.08);
  color: var(--accent-cyan);
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--accent-cyan);
  background: rgba(125, 249, 255, 0.17);
  box-shadow: var(--cyan-glow);
}

.btn-danger {
  border-color: rgba(239, 71, 111, 0.65);
  background: rgba(239, 71, 111, 0.14);
  color: #ff9bb3;
}

.btn-danger:hover:not(:disabled) {
  background: rgba(239, 71, 111, 0.25);
  box-shadow: 0 0 18px rgba(239, 71, 111, 0.3);
}

.btn-large {
  min-width: 210px;
  min-height: 56px;
  padding: 14px 30px;
  border-radius: 14px;
  font-size: 1.2rem;
}

.btn-block {
  width: 100%;
}

.btn-icon {
  width: 42px;
  min-width: 42px;
  height: 42px;
  padding: 8px;
  border-radius: 50%;
}

/* =========================================
   ฟอร์มเลือกตัวละคร
   ========================================= */
.screen-character {
  padding-top: 40px;
}

.character-panel {
  max-width: 760px;
  margin: 0 auto;
  padding: 24px;
}

.field-group {
  margin-bottom: 24px;
}

.field-label {
  display: block;
  margin-bottom: 8px;
  color: var(--text);
  font-weight: 500;
}

.field-input {
  width: 100%;
  min-height: 48px;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  outline: none;
  background: rgba(7, 8, 26, 0.62);
  color: var(--text);
  transition: border-color var(--transition), box-shadow var(--transition);
}

.field-input::placeholder {
  color: rgba(232, 234, 246, 0.45);
}

.field-input:hover {
  border-color: rgba(125, 249, 255, 0.52);
}

.field-input:focus {
  border-color: var(--accent-cyan);
  box-shadow: 0 0 0 3px rgba(125, 249, 255, 0.12), var(--cyan-glow);
}

.suit-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.suit-option {
  position: relative;
}

.suit-option input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.suit-card {
  display: flex;
  min-height: 170px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border: 2px solid var(--border-soft);
  border-radius: var(--radius-lg);
  background: rgba(7, 8, 26, 0.46);
  cursor: pointer;
  transition:
    transform var(--transition),
    border-color var(--transition),
    box-shadow var(--transition),
    background var(--transition);
}

.suit-card:hover {
  border-color: var(--accent-cyan);
  background: rgba(125, 249, 255, 0.08);
  box-shadow: var(--cyan-glow);
  transform: translateY(-3px);
}

.suit-option input:checked + .suit-card,
.suit-card.selected {
  border-color: var(--accent-gold);
  background: rgba(255, 209, 102, 0.1);
  box-shadow: var(--gold-glow);
}

.suit-image {
  width: 92px;
  height: 92px;
  object-fit: contain;
  filter: drop-shadow(0 8px 8px rgba(0, 0, 0, 0.35));
}

.suit-name {
  color: var(--text);
  font-weight: 500;
}

.suit-description {
  color: var(--text-muted);
  font-size: 0.82rem;
}

/* =========================================
   แถบสถานะผู้เล่นบนแผนที่กาแล็กซี
   ========================================= */
.screen-map {
  padding-bottom: 50px;
}

.player-status {
  display: grid;
  gap: 14px;
  margin-bottom: 24px;
  padding: 16px;
}

.player-identity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.player-avatar {
  display: grid;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  place-items: center;
  overflow: hidden;
  border: 2px solid var(--accent-cyan);
  border-radius: 50%;
  background: var(--surface-light);
  box-shadow: var(--cyan-glow);
}

.player-avatar img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.player-name {
  margin-bottom: 2px;
  color: var(--text);
  font-size: 1.05rem;
  font-weight: 500;
}

.player-rank {
  margin: 0;
  color: var(--accent-gold);
  font-size: 0.88rem;
}

.status-stat {
  min-width: 0;
}

.status-label {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 5px;
  color: var(--text-muted);
  font-size: 0.82rem;
}

.status-value {
  color: var(--text);
  font-weight: 500;
}

.xp-track {
  width: 100%;
  height: 9px;
  overflow: hidden;
  border: 1px solid rgba(125, 249, 255, 0.28);
  border-radius: var(--radius-pill);
  background: rgba(7, 8, 26, 0.75);
}

.xp-progress {
  display: block;
  width: 0;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent-purple), var(--accent-cyan));
  box-shadow: var(--cyan-glow);
  transition: width 500ms ease;
}

.energy-display {
  color: var(--danger);
  font-size: 1.15rem;
  letter-spacing: 2px;
  white-space: nowrap;
}

.energy-display .heart-empty {
  color: rgba(232, 234, 246, 0.25);
}

/* =========================================
   การ์ดดาวเคราะห์ทั้ง 5 ดวง
   ========================================= */
.planet-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.planet-card {
  position: relative;
  display: flex;
  min-height: 250px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  padding: 22px 16px 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(180deg, transparent 30%, rgba(7, 8, 26, 0.9) 100%),
    rgba(18, 20, 56, 0.8);
  text-align: center;
  transition:
    transform var(--transition),
    border-color var(--transition),
    box-shadow var(--transition),
    filter var(--transition);
}

.planet-card:not(.is-locked):hover {
  border-color: var(--accent-cyan);
  box-shadow: var(--cyan-glow);
  transform: translateY(-5px);
}

.planet-card.is-locked {
  filter: grayscale(0.72);
  opacity: 0.7;
}

.planet-card.is-complete {
  border-color: rgba(6, 214, 160, 0.68);
  box-shadow: 0 0 18px rgba(6, 214, 160, 0.2);
}

.planet-image {
  position: absolute;
  top: 14px;
  left: 50%;
  width: 150px;
  height: 150px;
  object-fit: contain;
  transform: translateX(-50%);
  filter: drop-shadow(0 12px 14px rgba(0, 0, 0, 0.45));
}

.planet-card:not(.is-locked) .planet-image {
  animation: float 3s ease-in-out infinite;
}

.planet-card:nth-child(2) .planet-image {
  animation-delay: -0.7s;
}

.planet-card:nth-child(3) .planet-image {
  animation-delay: -1.2s;
}

.planet-card:nth-child(4) .planet-image {
  animation-delay: -1.8s;
}

.planet-card:nth-child(5) .planet-image {
  animation-delay: -2.4s;
}

.planet-info {
  position: relative;
  z-index: 1;
  width: 100%;
}

.planet-name {
  margin-bottom: 2px;
  color: var(--text);
  font-size: 1.3rem;
  font-weight: 600;
}

.planet-subject {
  margin-bottom: 10px;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.planet-badge,
.status-badge {
  display: inline-flex;
  min-height: 27px;
  align-items: center;
  justify-content: center;
  padding: 3px 10px;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-pill);
  background: rgba(7, 8, 26, 0.72);
  color: var(--text-muted);
  font-size: 0.76rem;
  font-weight: 500;
  letter-spacing: 0.04em;
}

.planet-badge.is-locked,
.status-badge.is-locked {
  border-color: rgba(239, 71, 111, 0.5);
  color: #ff9bb3;
}

.planet-badge.is-progress,
.status-badge.is-progress {
  border-color: rgba(255, 209, 102, 0.55);
  color: var(--accent-gold);
}

.planet-badge.is-complete,
.status-badge.is-complete {
  border-color: rgba(6, 214, 160, 0.55);
  color: var(--success);
}

.planet-progress {
  margin-top: 10px;
}

.planet-progress-track {
  width: 100%;
  height: 5px;
  overflow: hidden;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.12);
}

.planet-progress-fill {
  display: block;
  width: 0;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent-gold), var(--success));
}

/* =========================================
   หน้าภารกิจและคำถาม
   ========================================= */
.screen-mission {
  padding-top: 24px;
}

.mission-header {
  margin-bottom: 24px;
}

.mission-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.mission-subject {
  color: var(--accent-cyan);
  font-size: 0.95rem;
}

.mission-number {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.question-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 22px;
}

.progress-dot {
  width: 11px;
  height: 11px;
  border: 1px solid rgba(125, 249, 255, 0.42);
  border-radius: 50%;
  background: rgba(125, 249, 255, 0.1);
  transition: background var(--transition), box-shadow var(--transition), transform var(--transition);
}

.progress-dot.is-current {
  border-color: var(--accent-cyan);
  background: var(--accent-cyan);
  box-shadow: var(--cyan-glow);
  transform: scale(1.3);
}

.progress-dot.is-correct {
  border-color: var(--success);
  background: var(--success);
}

.progress-dot.is-wrong {
  border-color: var(--danger);
  background: var(--danger);
}

.question-card {
  max-width: 820px;
  margin: 0 auto 20px;
  padding: 22px;
}

.question-label {
  margin-bottom: 8px;
  color: var(--accent-gold);
  font-size: 0.9rem;
}

.question-text {
  margin-bottom: 0;
  color: var(--text);
  font-size: clamp(1.2rem, 4vw, 1.75rem);
  font-weight: 500;
  line-height: 1.45;
}

.question-media {
  max-width: 100%;
  max-height: 220px;
  margin: 18px auto 0;
  border-radius: var(--radius-md);
  object-fit: contain;
}

.answer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  max-width: 820px;
  margin: 0 auto;
}

.answer-btn {
  position: relative;
  display: flex;
  min-height: 62px;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  border: 1px solid rgba(125, 249, 255, 0.25);
  border-radius: var(--radius-md);
  background: rgba(18, 20, 56, 0.78);
  color: var(--text);
  text-align: left;
  transition:
    transform var(--transition),
    border-color var(--transition),
    background var(--transition),
    box-shadow var(--transition);
}

.answer-btn:hover:not(:disabled) {
  border-color: var(--accent-cyan);
  background: rgba(125, 249, 255, 0.11);
  box-shadow: var(--cyan-glow);
  transform: translateY(-2px);
}

.answer-btn.is-correct {
  border-color: var(--success);
  background: rgba(6, 214, 160, 0.17);
  box-shadow: 0 0 18px rgba(6, 214, 160, 0.25);
}

.answer-btn.is-wrong {
  border-color: var(--danger);
  background: rgba(239, 71, 111, 0.17);
}

.answer-letter {
  display: grid;
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 50%;
  color: var(--accent-cyan);
  font-size: 0.9rem;
  font-weight: 500;
}

.answer-text {
  flex: 1;
}

.feedback-message {
  min-height: 30px;
  margin: 16px auto 0;
  color: var(--text-muted);
  text-align: center;
}

.feedback-message.is-correct {
  color: var(--success);
}

.feedback-message.is-wrong {
  color: #ff9bb3;
}

/* =========================================
   แถบไอเทมช่วยเหลือ
   ========================================= */
.item-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  max-width: 820px;
  margin: 22px auto 0;
}

.item-bar-label {
  width: 100%;
  margin-bottom: 2px;
  color: var(--text-muted);
  font-size: 0.9rem;
  text-align: center;
}

.btn-item {
  position: relative;
  display: inline-flex;
  width: 64px;
  height: 64px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(157, 78, 221, 0.6);
  border-radius: 14px;
  background: rgba(157, 78, 221, 0.14);
  transition:
    transform var(--transition),
    border-color var(--transition),
    background var(--transition),
    box-shadow var(--transition);
}

.btn-item:hover:not(:disabled) {
  border-color: var(--accent-cyan);
  background: rgba(125, 249, 255, 0.14);
  box-shadow: var(--cyan-glow);
  transform: translateY(-3px);
}

.btn-item:active:not(:disabled) {
  transform: translateY(1px);
}

.btn-item img,
.btn-item svg {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.item-count {
  position: absolute;
  right: -6px;
  bottom: -6px;
  display: grid;
  min-width: 23px;
  height: 23px;
  place-items: center;
  padding: 2px 5px;
  border: 2px solid var(--space-mid);
  border-radius: 50%;
  background: var(--accent-gold);
  color: var(--text-dark);
  font-size: 0.75rem;
  font-weight: 600;
}

/* =========================================
   หน้าสรุปภารกิจ
   ========================================= */
.screen-summary {
  display: grid;
  place-items: center;
}

.summary-panel {
  width: min(100%, 620px);
  padding: 28px 20px;
  text-align: center;
}

.summary-icon {
  display: grid;
  width: 82px;
  height: 82px;
  margin: 0 auto 16px;
  place-items: center;
  border: 2px solid var(--accent-gold);
  border-radius: 50%;
  background: rgba(255, 209, 102, 0.12);
  color: var(--accent-gold);
  font-size: 2.4rem;
  box-shadow: var(--gold-glow);
}

.summary-title {
  margin-bottom: 8px;
  color: var(--accent-gold);
  font-size: clamp(1.8rem, 6vw, 2.6rem);
}

.summary-message {
  margin-bottom: 24px;
  color: var(--text-muted);
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 22px 0;
}

.summary-stat {
  padding: 14px 8px;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  background: rgba(7, 8, 26, 0.35);
}

.summary-stat-value {
  display: block;
  color: var(--accent-cyan);
  font-size: 1.7rem;
  font-weight: 600;
}

.summary-stat-label {
  color: var(--text-muted);
  font-size: 0.82rem;
}

.new-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0 24px;
  padding: 8px 16px;
  border: 1px solid rgba(255, 209, 102, 0.65);
  border-radius: var(--radius-pill);
  background: rgba(255, 209, 102, 0.12);
  color: var(--accent-gold);
  box-shadow: var(--gold-glow);
}

.summary-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

/* =========================================
   ตารางอันดับผู้เล่น
   ========================================= */
.screen-leaderboard {
  padding-bottom: 48px;
}

.leaderboard-panel {
  overflow-x: auto;
  padding: 0;
}

.leaderboard-table {
  width: 100%;
  min-width: 500px;
  border-collapse: collapse;
  text-align: left;
}

.leaderboard-table th,
.leaderboard-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-soft);
}

.leaderboard-table thead {
  background: linear-gradient(90deg, rgba(157, 78, 221, 0.42), rgba(125, 249, 255, 0.18));
  color: var(--accent-cyan);
}

.leaderboard-table th {
  font-weight: 500;
  white-space: nowrap;
}

.leaderboard-table tbody tr {
  transition: background var(--transition);
}

.leaderboard-table tbody tr:hover {
  background: rgba(125, 249, 255, 0.06);
}

.leaderboard-table tbody tr.is-current-player {
  background: rgba(255, 209, 102, 0.1);
}

.leaderboard-table tbody tr.is-current-player td {
  color: var(--accent-gold);
}

.rank-number {
  color: var(--accent-gold);
  font-weight: 600;
}

.table-player {
  display: flex;
  align-items: center;
  gap: 9px;
}

.table-avatar {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: rgba(7, 8, 26, 0.55);
}

.table-avatar img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.empty-state {
  padding: 36px 20px;
  color: var(--text-muted);
  text-align: center;
}

/* =========================================
   เอฟเฟกต์และแอนิเมชัน
   ========================================= */
.fade-in {
  animation: fade-in 500ms ease both;
}

.float {
  animation: float 3s ease-in-out infinite;
}

.glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
}

.shake {
  animation: shake 420ms ease-in-out;
}

.confetti {
  position: fixed;
  z-index: 50;
  top: -20px;
  width: 9px;
  height: 16px;
  pointer-events: none;
  animation: confetti-fall 2.8s linear forwards;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

@keyframes glow-pulse {
  0%,
  100% {
    opacity: 0.78;
    filter: brightness(1);
  }

  50% {
    opacity: 1;
    filter: brightness(1.25);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }

  20%,
  60% {
    transform: translateX(-7px);
  }

  40%,
  80% {
    transform: translateX(7px);
  }
}

@keyframes loading-progress {
  0% {
    width: 8%;
    transform: translateX(-100%);
  }

  50% {
    width: 62%;
  }

  100% {
    width: 22%;
    transform: translateX(440%);
  }
}

@keyframes star-drift {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(35px);
  }
}

@keyframes confetti-fall {
  0% {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }

  100% {
    opacity: 0;
    transform: translateY(100vh) rotate(720deg);
  }
}

/* =========================================
   การปรับหน้าจอสำหรับแท็บเล็ต
   ========================================= */
@media (min-width: 600px) {
  .panel {
    padding: 26px;
  }

  .character-panel {
    padding: 32px;
  }

  .suit-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .answer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .player-status {
    grid-template-columns: minmax(180px, 1.15fr) minmax(180px, 1.5fr) auto;
    align-items: center;
    padding: 16px 20px;
  }

  .item-bar-label {
    width: auto;
    margin-right: 8px;
    margin-bottom: 0;
  }

  .summary-panel {
    padding: 38px;
  }

  .summary-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* =========================================
   การปรับหน้าจอสำหรับเดสก์ท็อป
   ========================================= */
@media (min-width: 820px) {
  .screen {
    padding-top: 42px;
  }

  .planet-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .planet-card:first-child,
  .planet-card:nth-child(2) {
    grid-column: span 1;
  }

  .screen-header {
    margin-bottom: 30px;
  }

  .question-card {
    padding: 30px;
  }
}

/* =========================================
   การปรับสำหรับอุปกรณ์ที่ลดการเคลื่อนไหว
   ========================================= */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```