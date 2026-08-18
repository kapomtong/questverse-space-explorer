# Prompt: เพิ่มระบบ Minigame ฟื้นฟูพลังงาน (Energy Recovery Minigame)

## บทบาท
คุณคือ Programmer ของเกม QuestVerse M.1: Space Explorer (เกม quiz ภาษาไทย 5 ดาวเคราะห์ = 5 วิชา, HTML5 + CSS3 + Vanilla JS, SPA ที่ `QV.screens[name] = { render(state, params), mount(params) }`)

## ปัญหา
ตอนนี้เมื่อ `state.energy <= 0` (หัวใจหมด) เกมจะตัน — แสดงแค่ป้าย "⚠️ พลังงานหมดแล้ว! รอพรุ่งนี้" ให้ผู้เล่นกลับบ้านโดยไม่มีทางแก้ เราต้องเพิ่ม **Minigame ฟื้นฟูพลังงาน** เพื่อไม่ให้เกมตัน

## API / โครงสร้างที่มีอยู่จริง (ใช้อ้างอิง — ห้ามเดาชื่อ API อื่นนอกเหนือจากนี้)
- Screen contract: `QV.screens[name] = { render(state, params): string, mount(params): void }` — screen ปัจจุบัน: `landing, character, map, mission, summary, leaderboard, guide`
- เข้าหน้า: `QV.app.show('screenName', params)`
- State: `{ player:{name,suit}, xp, energy(0-5), combo, maxCombo, totalCorrect, lastEnergyDate, planets:{planetId:{currentZone, zonesDone}}, items:{shield,compass,telescope}, badges:[], fastCorrect5s }` + `QV.saveState(state)` บันทึกลง localStorage
- `QV.todayKey()` = 'YYYY-MM-DD', `QV.MAX_ENERGY` = 5, `QV.getRank(xp)`, `QV.QUESTIONS_PER_ZONE`=5
- `QV.QUESTIONS` = คำถาม 125 ข้อ — **ห้ามแก้ questions.js**
- `js/mission.js` บรรทัด 33-40: ตรวจ energy — แสดงป้าย "⚠️ พลังงานหมดแล้ว! ... รอพรุ่งนี้" + ปุ่ม `btn-mission-nrg-back` ("กลับสู่แผนที่")
- `js/landing.js` บรรทัด 114-117: guide มี section "💛 ระบบพลังงาน" — ข้อความ "มีพลังงาน 5 หัวใจ เล่นได้ 5 โซนต่อวัน จะเติมเต็มอัตโนมัติในวันใหม่"
- `js/galaxy_map.js` บรรทัด 34-38: `playerStatusHtml` มี `<div class="energy-hearts">` — แถว hearts
- `index.html` โหลด script เรียง: config.js→app.js→landing.js→character.js→game_state.js→questions.js→galaxy_map.js→mission.js→leaderboard.js (ต้องแทรก minigame.js ก่อน leaderboard.js)

## งานที่ต้องทำ

### 1) สร้างไฟล์ใหม่ `js/minigame.js` — screen `minigame`: "⚡ Stellar Harvest — จับคู่ดวงดาว"
- grid 4x4 (16 ช่อง) ที่พลิกการ์ดจับคู่: 8 คู่ ใช้ emoji ดาว 8 แบบ (🌟💫⭐🌠✨☄️🔭🌙) แบบสุ่มตำแหน่งทุกครั้งที่เริ่มเกม
- กติกา: พลิกได้ครั้งละ 2 ช่อง ถ้าเหมือนกัน = match (ได้ 5 XP/คู่ + animation ✨) ไม่เหมือน = พลิกกลับใน 0.8 วิ
- ชนะ (จับครบทุกคู่ใน 45 วิ): พลังงาน +1 ใจ (max ไม่เกิน MAX_ENERGY) + XP 30 + ป้ายผลลัพธ์ชนะ
- แพ้ (หมดเวลา 45 วิ): ได้ XP 10 เท่านั้น + ป้ายผลลัพธ์แพ้ + ปุ่ม "ลองอีกครั้ง"
- ลิมิต: ฟรี 3 ครั้ง/วัน — พี่ง field `state.minigamePlays = {}` (key = todayKey, value = count) เช็คทุกครั้งที่เข้า screen (ถ้าครบแล้วให้แสดงข้อความ "พรุ่งนี้มาใหม่นะ" + ปุ่มกลับ)
- ใช้ timer bar animation เดียวกับ mission: class `.timer-row .timer-bar-track .timer-bar-fill` 45 วิ
- สไตล์ใช้ theme อวกาศ/กลาส์จาก style.css เดิม (class: btn, btn-primary, btn-secondary, zone-tag, card-glass) — ถ้าต้องการ class CSS ใหม่ ให้สร้างเพิ่มท้าย style.css ภายใต้ comment `/* === MINIGAME === */`
- mount(): ผูก event ทุกปุ่ม, เริ่ม timer; unbind ไม่จำเป็นแต่ต้อง clear timer เมื่อจบเกม
- จบเกม (ชนะ/แพ้/ลิมิตหมด): `QV.game.minigameWin()` หรือ `QV.game.minigamePlay()` จาก game_state.js แล้ว `QV.app.show('map')`

### 2) แก้ `js/game_state.js` — เพิ่ม state + ฟังก์ชัน:
- ใน `newState()` เพิ่ม field `minigamePlays: {}`
- ฟังก์ชัน `QV.game.minigamePlay(state, won)`:
  - todayKey = QV.todayKey(); state.minigamePlays[todayKey] = (state.minigamePlays[todayKey]||0) + 1
  - ถ้า won: state.energy = Math.min(state.energy + 1, QV.MAX_ENERGY); state.xp += 30
  - ไม่ won: state.xp += 10
  - เรียก this.checkBadgeEarns(state); return { energy: state.energy, xp: state.xp, playsToday: state.minigamePlays[todayKey] }

### 3) แก้ `js/mission.js`
- ป้าย "⚠️ พลังงานหมดแล้ว!" (บรรทัด 34-40): เพิ่มปุ่มอีกปุ่ม "⚡ เล่นมินิเกมฟื้นพลังงาน" → `QV.app.show('minigame')` โดยแสดงเมื่อยังไม่ครบลิมิตวันนี้เท่านั้น (`QV.game.minigameRemaining()` ฟังก์ชันช่วยใน game_state.js: return 3 - count)
- ถ้าลิมิตหมดแล้ว แสดงข้อความเล็ก "🔒 มินิเกมฟื้นพลังงานใช้ครบ 3 ครั้งแล้ว พรุ่งนี้มาใหม่นะ"

### 4) แก้ `js/galaxy_map.js`
- ใน `playerStatusHtml` หลัง energy-hearts (บรรทัด 38): ถ้า `state.energy <= 0` และ minigameRemaining() > 0 → เพิ่มปุ่มเล็ก "⚡ ฟื้นพลังงาน" → `QV.app.show('minigame')`

### 5) แก้ `js/landing.js`
- ใน guide section "💛 ระบบพลังงาน" (บรรทัด 114-117) เพิ่มประโยค: "เมื่อพลังงานหมด ไม่ต้องรอพรุ่งนี้! เล่นมินิเกม 'จับคู่ดวงดาว' ฟื้น +1 ใจ (ฟรี 3 ครั้ง/วัน)"

### 6) แก้ `index.html`
- เพิ่ม `<script src="js/minigame.js"></script>` ก่อน `js/leaderboard.js`

## ข้อกำหนด
- Vanilla JS ล้วน ห้ามใช้ library / ห้ามแก้ questions.js, config.js (นอกเหนือ minigamePlays ใน newState ถ้าจำเป็นอยู่ใน game_state.js)
- ตัวอักษรไทยทุก UI
- โค้ดทุกไฟล์ผ่าน `node --check`
- ส่งผลลัพธ์เป็นไฟล์สมบูรณ์: minigame.js (ไฟล์เต็ม) + CSS block ใหม่ (ระบุตำแหน่งท้าย style.css) + patch ที่ต้องแก้ใน mission.js, galaxy_map.js, landing.js, game_state.js, index.html (แสดงเดิม→ใหม่ชัดเจน)
