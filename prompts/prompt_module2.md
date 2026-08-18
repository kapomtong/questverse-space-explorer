# บทบาท: Programmer — ไฟล์ js/app.js, js/landing.js, js/character.js ของเกม "QuestVerse M.1: Space Explorer"

คุณคือ Programmer งานของคุณคือ **เขียนโค้ด 3 ไฟล์ในคำตอบ** ส่งเป็น code block 3 บล็อก (javascript) ในคำตอบเดียวทันที (คุณไม่มี file system access — อย่าถามกลับ)

## ข้อมูลโปรเจกต์
เกมผจญภัยอวกาศเพื่อการเรียนรู้เด็ก ม.1 (ภาษาไทย) — Static Web Game: HTML5 + CSS + Vanilla JS ล้วน — Deploy บน GitHub Pages
ไฟล์ที่ทำเสร็จแล้ว (ใช้ตามที่กำหนด — อย่าเขียนทับ/อย่าสร้างใหม่): index.html (SPA `<div id="app"></div>` + preloader ซ่อนเมื่อ load, script ตามลำดับ config.js, app.js, landing.js, character.js, galaxy_map.js, mission.js, leaderboard.js, game_state.js), style.css (class: .screen-landing #btn-start, .screen-character .character-form input[type=text] .suit-grid .suit-card.selected .character-actions, .screen-map .player-status .player-info .player-name .rank-chip .xp-bar-container .xp-bar .xp-bar-fill .energy-hearts .heart.empty .planets-grid .planet-card .planet-card.locked .planet-card img .planet-name .planet-subject .planet-status .planet-status.locked/.active/.complete, .screen-mission .mission-header .zone-tag .progress-dots .progress-dot.completed/.active .question-card .question-text .answers-grid .answer-btn .answer-btn.selected/.correct/.wrong .items-bar .item-btn .item-count .hint-box .feedback.correct/.wrong .mission-actions, .screen-summary .summary-card .xp-gained .badges-earned .badge-chip .summary-actions, .screen-leaderboard .leaderboard-table, .card-glass, .btn/.btn-primary/.btn-secondary/.btn-item, .hidden, .text-center, .text-gold, .fade-in)
ไฟล์ config.js ที่มีแล้ว (property ที่ใช้ได้เลย): QV.planets[{id,name,nameEn,subject,themeColor,image,desc,zoneCount}], QV.MAX_ENERGY, QV.XP_CORRECT, QV.XP_COMBO, QV.QUESTIONS_PER_ZONE, QV.SAVE_KEY, QV.DEFAULT_ITEMS, QV.ITEM_DEFS, QV.ranks, QV.getRank(xp)→{name,emoji,index}, QV.badges[{id,name,desc,icon}], QV.newState(), QV.saveState(state), QV.loadState(), QV.todayKey(), QV.refreshEnergy(state), QV.escapeHtml(s), QV.formatNumber(n), QV.planetById(id)
ไฟล์จะทำได้หลัง module นี้: galaxy_map.js, mission.js, questions.js, leaderboard.js, game_state.js — **อย่าเรียกใช้ฟังก์ชันจากไฟล์เหล่านี้โดยตรง ยกเว้น QV.questions (questions.js) ให้เรียกแบบ safe: `const data = (QV.QUESTIONS && QV.QUESTIONS[planetId]) || null;`**

## งาน Module 2 — ส่ง code block 3 ไฟล์: js/app.js, js/landing.js, js/character.js

### js/app.js — SPA Router
1. สร้าง QV.app = { currentScreen: null, state: null, screens: {} }
2. QV.app.init(): QV.state = QV.loadState(); QV.refreshEnergy(QV.state); QV.saveState(QV.state); ตรวจ state.player.name — ถ้ายังไม่มีชื่อ → show('landing') ถ้ามีแล้ว → show('map')
3. QV.app.show(name, params): ล้าง #app.innerHTML, เรียก QV.screens[name] (ถ้ามี) — pattern: แต่ละ screen เป็น object { render(state,params):return html string, mount(): bind events } — หลัง render ให้ #app.innerHTML = html แล้ว mount(), แล้ว add class .fade-in ให้องค์ประกอบบน, บันทึก currentScreen
4. QV.app.updatePlayerStatus(): update แถบสถานะผู้เล่นใน .player-status ถ้าหน้า map อยู่ (XP bar, rank chip, hearts)
5. QV.app.toast(msg, type): แสดง feedback toast (div.feedback.correct/.wrong) ใน body 2 วินาทีแล้วลบ

### js/landing.js — หน้า Landing
- QV.screens.landing = { render, mount }
- render(): html ของ .screen-landing: h1 "QUESTVERSE", subtitle "ผจญภัยเรียนรู้ข้าม 5 ดาวเคราะห์", .btn-primary #btn-start "เริ่มการเดินทาง", .btn-secondary #btn-continue (แสดงเฉพาะเมื่อบันทึกชื่อแล้ว), .btn-secondary #btn-leaderboard "กระดานผู้นำ" (ไปหน้า leaderboard)
- mount(): #btn-start → reset state ใหม่ (QV.newState) + save แล้ว show('character'); #btn-continue → show('map'); #btn-leaderboard → show('leaderboard')
- ชื่อเกม "QUESTVERSE" ใหญ่ ใช้ class ตาม CSS ที่เตรียมไว้

### js/character.js — หน้าสร้างตัวละคร
- QV.screens.character = { render, mount, selectedSuit }
- render(): .screen-character: h2 "เลือกสูทนักสำรวจ", .character-form: label "ชื่อของนักสำรวจ" + input text #player-name (placeholder "กรอกชื่อเล่นของคุณ") + .suit-grid 3 การ์ด .suit-card (data-suit=blue/red/green, img suit_blue.png/suit_red.png/suit_green.png, h3 "นักบินฟ้า/นักรบไฟ/นักสำรวจใบ้") — ชื่อสูทน่ารักๆ 3 แบบ — default selected=blue + .character-actions .btn-primary #btn-confirm "ยืนยันและออกเดินทาง"
- mount(): คลิก .suit-card → ลบ .selected เก่า + add การ์ดที่คลิก, set selectedSuit; #btn-confirm → เช็คว่า input ชื่อไม่ว่าง (ถ้าว่าง: ขยับ input shake + toast "กรุณากรอกชื่อก่อนนะ!") → QV.state.player.name/suit → QV.saveState → show('map')
- ตัดชื่อยาวสุด 20 ตัว, escapeHtml ตอนแสดงผล

## กติกาเคร่งครัด
1. ส่ง code block ครบ 3 ไฟล์ในคำตอบเดียว — ห้ามถามกลับ
2. โค้ดสมบูรณ์ทำงานได้จริง เชื่อม class CSS ตรงตามที่ให้ — คอมเมนต์ไทย
3. ใช้ const/let, strict style, ไม่มี TODO
