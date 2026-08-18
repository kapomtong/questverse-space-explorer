# บทบาท: Programmer — ไฟล์ js/mission.js ของเกม "QuestVerse M.1: Space Explorer"

คุณคือ Programmer งานของคุณคือ **เขียนโค้ด 1 ไฟล์ในคำตอบ** ส่งเป็น code block 1 บล็อก (javascript) ในคำตอบเดียวทันที (คุณไม่มี file system access — อย่าถามกลับ)

## ข้อมูลโปรเจกต์
เกมผจญภัยอวกาศเพื่อการเรียนรู้เด็ก ม.1 (ภาษาไทย) — Static Web Game (ไม่เรียก API) — Deploy บน GitHub Pages

## ไฟล์อื่นที่มีอยู่แล้ว (อย่านิยามซ้ำ — ใช้อย่างเดียว)
- `QV.PLANETS` — array ดาว 5 ดวง { id, name, nameTh, icon, color, descTh } — id: numberon, bionia, aksara, lingua, civilis
- `QV.ZONE_NAMES` — { planetId: [ชื่อโซน 5 โซน] }
- `QV.ranks` — array [[minXp, emoji, name], ...], ฟังก์ชัน QV.getRank(xp) → { index, emoji, name, xp }
- `QV.MAX_ENERGY` = 5, `QV.ZONE_QUESTIONS` = 5
- `QV.ITEMS` — { shield: {...}, compass: {...}, telescope: {...} } มี id, nameTh, emoji, descTh
- `QV.BADGES` — object badge { id, nameTh, emoji, descTh, check(state) }
- `QV.SAVE_KEY` — key localStorage
- `QV.state` — { player: { name, suit, xp, energy, items: { shield, compass, telescope } (จำนวนคงเหลือ), badges: [...], zonesDone: { planetId: [zoneIdx,...] } }, fastCorrect5s }
- `QV.QUESTIONS` — { planetId: { zoneIdx(0-4): [{ q, choices:[4], answerIdx, hint }] } }
- `QV.game.addXp(state, amount, questionStartTs)` → { newRank, rankUp, badgesNew } — เพิ่ม XP + ตรวจ rank up + badge
- `QV.game.completeZone(state, planetId, zoneIdx, correctCount)` → [badge ids ใหม่]
- `QV.app.navigate(screen)` — เปลี่ยนหน้า; มี screens: landing, character, map, mission, summary, leaderboard
- `QV.app.updatePlayerStatus()` — รีเฟรช status bar บนหน้า map
- `QV.app.toast(message, 'correct'|'wrong'|'item'|'info')` — แสดง toast
- `QV.escapeHtml(str)` — escape HTML
- `QV.save() / QV.load()` — บันทึก/โหลด localStorage
- CSS class ที่มีใน style.css: `.screen { display:none }` + `.screen.active { display:block }`, `.btn, .btn-primary, .btn-secondary, .btn-success`, `.glass-card`, `.mission-title`, `.progress-dots`, `.choice-btn`, `.feedback.correct/.feedback.wrong`, `.item-btn`, `.item-btn.used`, `.hud`, `.mission-question`, `.mission-choices`, `.result-stars` (★), `.summary-card`, `.badge-new`, `.xp-gained`

## งาน: mission.js (1 file)

### 1. QV.screens.mission = function(params)
- params = { planetId, zoneIdx } — ตรวจสอบ QV.state.player.zonesDone ถ้า zone นี้เสร็จแล้วและถูกกดอีก → navigate('summary') เลย (หรือให้เล่นซ้ำได้ไม่ได้ XP — เลือก: ให้เล่นซ้ำได้แต่ไม่ได้ XP)
- หัก energy -1 (ถ้า energy = 0 → toast และ navigate('map'))
- QV.save()
- แสดง UI mission:
  - mission-title: "ดาว[ชื่อดาวไทย] — โซน[ชื่อโซน]" + planet icon
  - progress-dots: 5 จุด (แสดงความคืบหน้า 5 ข้อ)
  - mission-question: ข้อความคำถาม
  - mission-choices: ปุ่ม 4 ตัวเลือก (choice-btn) — กดแล้วดิสเบิลทุกปุ่ม
  - ไอเทม 3 ปุ่ม (item-btn): โล่🛡️ / เข็มทิศ🧭 / กล้อง🔭 — แสดงจำนวนคงเหลือ
  - ปุ่ม "ใช้คำใบ้💡" ( telescope เปรียบเทียบ hint ได้ฟรี)
- คำถามข้อแรกบันทึก questionStartTs = Date.now() (สำหรับ addXp ตรวจ fast answer)

### 2. ระบบตอบคำถาม
- กด choice-btn → ตรวจ answerIdx:
  - **ถูก**: แสดง feedback.correct ("ถูกต้อง! +20 XP"), ข้อต่อไป
  - **ผิด**: แสดง feedback.wrong (shake animation + แสดงคำตอบถูก 1 วิ), ข้อต่อไป — แต่ถ้าใช้โล่ป้องกันอยู่: ไม่ถือว่าผิด ไม่เสียอะไร โล่หาย 1 ชิ้น ข้อความ "โล่ช่วยคุณไว้!"
- ข้อถูก = +20 XP, ข้อที่ตอบถูกภายใน 5 วินาทีแรกของข้อนั้น +5 XP โบนัส (fast bonus, มากสุด 1 ครั้งต่อข้อ), combo: ตอบถูกติดต่อกัน 3 ข้อ +10 XP โบนัส
- ครบ 5 ข้อ → QV.game.completeZone(state, planetId, zoneIdx, correctCount) + QV.game.addXp → navigate('summary') พร้อมผลรวม

### 3. ระบบไอเทม (3 ปุ่ม)
- โล่🛡️: เปิดโหมดป้องกันข้อถัดไป (ข้อผิดครั้งแรกถูกยกเว้น) — ใช้ได้ 1 ครั้งต่อชิ้น
- เข็มทิศ🧭: ตัดตัวเลือกผิด 1 ตัว (ดิสเบิลปุ่มนั้น) — ใช้ได้ต่อข้อ
- กล้อง🔭: แสดง hint ของข้อปัจจุบัน
- ทุกไอเทม: state.items[id] -= 1, ถ้า 0 ดิสเบิลปุ่ม (item-btn.used), QV.save()

### 4. QV.screens.summary = function()
- แสดงผลการเล่นโซนล่าสุด (บันทึก missionResult ไว้ก่อนหน้า): ดาว + โซน, ข้อถูก X/5 (result-stars ★), XP ที่ได้รวม (xp-gained), rank ใหม่ (ถ้า rankUp แสดง confetti + "ยินดีด้วย! เลื่อนยศเป็น [rank]")
- แสดง badge ที่ได้ใหม่ (badge-new) — ถ้าไม่มี แสดง "ยังไม่มีเหรียญใหม่ — สู้ต่อ!"
- ปุ่ม "กลับสู่แผนที่" (btn-primary) → navigate('map') + updatePlayerStatus(); ปุ่ม "เล่นซ้ำโซนนี้" (btn-secondary) — energy -1 แล้วเริ่ม zone เดิม

### โครงสร้างไฟล์
```javascript
const QV = window.QV || {};
QV.screens = QV.screens || {};
QV.screens.mission = function(params) { ... };
QV.screens.summary = function() { ... };
window.QV = QV;
```
- ใช้ DOM manipulation ล้วน (document.createElement / innerHTML) — ไม่มี framework
- state ชั่วคราว mission ติดตั้งบน QV.state ช่อง missionResult: { planetId, zoneIdx, correct, xpGained, rankUp, newRank, badgesNew }
- ใช้ QV.escapeHtml ทุกที่แสดงข้อความจากข้อมูล

## กติกาเคร่งครัด
1. 1 code block ไฟล์เดียว — สมบูรณ์ ไม่มี TODO
2. ใช้ฟังก์ชัน/ตัวแปรจาก config.js, game_state.js, app.js ตามที่ระบุ — ห้ามประกาศซ้ำ
3. UI ต้องใช้ CSS class ตามลิสต์ด้านบน (ตรงกับ style.css)
4. ภาษาไทยทุก UI
