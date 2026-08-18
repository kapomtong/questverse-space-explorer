# บทบาท: Programmer — ไฟล์ js/galaxy_map.js และ js/game_state.js ของเกม "QuestVerse M.1: Space Explorer"

คุณคือ Programmer งานของคุณคือ **เขียนโค้ด 2 ไฟล์ในคำตอบ** ส่งเป็น code block 2 บล็อก (javascript) ในคำตอบเดียวทันที (คุณไม่มี file system access — อย่าถามกลับ)

## ข้อมูลโปรเจกต์
เกมผจญภัยอวกาศเพื่อการเรียนรู้เด็ก ม.1 (ภาษาไทย) — Static Web Game: HTML5 + CSS + Vanilla JS ล้วน — Deploy บน GitHub Pages

## โครงสร้าง state (จาก config.js — ใช้ตรงตามที่กำหนด ห้ามเปลี่ยน)
QV.state: { player:{name,suit}, xp:number, totalCorrect, combo, maxCombo, energy:number (1-5), lastEnergyDate, planets:{ numberon:{currentZone,zonesDone:[]}, bionia:{...}, aksara:{...}, lingua:{...}, civilis:{...} }, items:{shield,compass,telescope}, badges:[] (array ของ badge id string), fastCorrect5s }
**หมายเหตุ: xp, energy, combo วางที่ root ของ state — NOT ใน player**
- ดาวปลดล็อค: ดาวแรก numberon ปลดตลอด, ดาวถัดไปปลดเมื่อดาวก่อนหน้า zonesDone ครบ 5 โซน
- โซนปลด: โซน 0 ปลดตลอด, โซน n ปลดเมื่อโซน n-1 ทำเสร็จ
- แต่ละโซน 5 คำถาม (QV.QUESTIONS[planetId][zoneIdx] จาก questions.js — เรียกแบบ safe: `(QV.QUESTIONS && QV.QUESTIONS[id] && QV.QUESTIONS[id][idx]) || null`)

## ระบบที่ใช้ได้จากไฟล์อื่น
- QV.app.show(name): สว่างหน้า, QV.app.updatePlayerStatus(): อัปเดตแถบสถานะหน้า map, QV.app.toast(msg,type), QV.getRank(xp)→{name,emoji,index}, QV.planetById(id), QV.planets[{id,name,nameEn,subject,themeColor,image,desc,zoneCount}], QV.MAX_ENERGY=5, QV.XP_CORRECT=10, QV.XP_COMBO=5, QV.QUESTIONS_PER_ZONE=5, QV.escapeHtml, QV.formatNumber, QV.saveState(state), QV.badges[{id,name,desc,icon}], QV.DEFAULT_ITEMS

## งาน Module 3 — code block 2 ไฟล์

### js/game_state.js — logic การอัปเดตความคืบหน้า
QV.game = {
1. checkBadgeEarns(state): array ของ badge id ที่สมควรได้ — เช็คครบเงื่อนไข: explorer-{ดาว} (zonesDone.length>=5), combo-master (maxCombo>=10), globe-trotter (ครบ 5 ดาวมี zonesDone>=5), universe-conqueror (ครบ 25 โซน), speed-runner (fastCorrect5s>=10) → add เข้า state.badges ที่ยังไม่มี → return array badge id ใหม่ที่เพิ่งได้
2. addXp(state, amount, questionStartTs): state.xp += amount; ถ้า answerTime <= 5 วินาที state.fastCorrect5s++; check combo + badge → return { newRank: QV.getRank(state.xp), rankUp: bool, badgesNew: [...] }
3. completeZone(state, planetId, zoneIdx, correctCount): add zoneIdx ใน zonesDone (ถ้ายังไม่มี) + state.energy = MIN(energy+1, MAX_ENERGY) ทุกการผ่านโซน (energy 3/5 ของโซนนี้ต้องใช้จริง — ตัด -1 ต่อโซนที่เล่น) + return checkBadgeEarns(state)
**หมายเหตุ: การใช้พลังงาน — หัก energy 1 ครั้งต่อโซนที่เล่น (ก่อนเริ่มเช็คว่ามีพอ) ถ้าไม่พอ: return error. ถ้าตอบผิด (โดยไม่มี shield) energy -1 ต่อข้อที่ตอบผิด? ให้ตัด -1 ที่ถูกตอบผิดทันที และเช็คว่า energy เหลือ > 0 (0 = game over ของวันนั้น)**
4. useItem(state, itemId): ถ้าจำนวน > 0 ลด 1 → return true
5. zoneStatus(planet): คืน "done" (ครบ5), "active" (currentZone), "locked"

### js/galaxy_map.js — หน้า Galaxy Map
QV.screens.map = { render, mount }
render(): .screen-map โครง:
1. แถบหัว: h2 "แผนที่กาแล็กซี่" + ปุ่ม .btn-secondary "กระดานผู้นำ" (#btn-map-lb ไปหน้า leaderboard) + ปุ่ม "ออกจากระบบ/รีสตาร์ตเกม" (#btn-reset ยืนยัน confirm แล้ว clear localStorage + reload)
2. .player-status: .player-info (img suit_x.png 64px + .player-name escapeHtml), .rank-chip (emoji + ชื่อยศ), .xp-bar-container (label "XP 120 / ระดับถัดไป กัปตันที่ 100" — คำนวณจาก threshold ถัดไป, .xp-bar > .xp-bar-fill width %), .energy-hearts (5 หัวใจ .heart/.heart.empty ขึ้น state.energy)
3. .planets-grid 5 .planet-card: img (float), .planet-name, .planet-subject (ชื่อวิชา, background themeColor20%), .planet-status (.locked/"🔒 ต้องปลดดาวก่อน"  .active/"🚀 โซนที่ N/5"  .complete/"✅ ดาวพิชิตแล้ว!") — สี .planet-subject ตาม themeColor
- ดาวที่มีโซนที่ไม่ใช่โซนแรกที่ว่าง: เล่นต่อได้ที่โซนนั้น
- planet-card ไม่ locked: onclick ไปหน้า mission
- เล่า desc ดาวใต้ชื่อ (ตัวเล็ก สี text-dim)

## กติกาเคร่งครัด
1. code block ครบ 2 ไฟล์ในคำตอบเดียว — คอมเมนต์ไทย — ไม่มี TODO
2. ใช้ state ตามโครงสร้าง root xp/energy — ต้องตรงกับ config.js
3. หน้า mission (questions.js) จะตามหลัง — อย่าพึ่งพิงฟังก์ชันของมัน
