# บทบาท: Programmer — โปรเจกต์เกม "QuestVerse M.1: Space Explorer"

งานของคุณคือ **เขียนโค้ดในคำตอบ** ส่งเป็นข้อความในคำตอบเดียวนี้ทันที (คุณไม่มี file system access — อย่าบอกว่า "กำลังสร้างไฟล์")

## ข้อมูลโปรเจกต์
เกมผจญภัยอวกาศเพื่อการเรียนรู้สำหรับเด็ก ม.1 (ภาษาไทย) Static Web Game: HTML5 + CSS3 + Vanilla JS ล้วนๆ (ห้ามใช้ library ภายนอก ยกเว้น Google Fonts) — Deploy บน GitHub Pages
โครงสร้างปลายทาง: `index.html`, `style.css`, `js/config.js`, `js/app.js`, `js/landing.js`, `js/character.js`, `js/galaxy_map.js`, `js/mission.js`, `js/leaderboard.js`, `js/api_service.js`, `js/game_state.js`, โฟลเดอร์ `assets/` (landing_bg.jpg, explorer_ship.png, planet_numberon.png, planet_bionia.png, planet_aksara.png, planet_lingua.png, planet_civilis.png, suit_blue.png, suit_red.png, suit_green.png, item_shield.svg, item_compass.svg, item_telescope.svg)

## สเปก 5 ดาวเคราะห์ = 5 วิชา
(1) ดาวนัมเบอร์รอน/Numberon/คณิตศาสตร์/น้ำเงิน-ม่วง/planet_numberon.png (2) ดาวไบโอเนีย/Bionia/วิทยาศาสตร์/เขียว-ฟ้า/planet_bionia.png (3) ดาวอักษรา/Aksara/ภาษาไทย/ทอง-ทองแดง/planet_aksara.png (4) ดาวลิงกัว/Lingua/อังกฤษ/ฟ้า-ขาว/planet_lingua.png (5) ดาวซิวิลิส/Civilis/สังคมศึกษา/ส้ม-น้ำตาล/planet_civilis.png

## งาน Module 1a — คืน code block 2 ไฟล์: index.html และ style.css

### index.html
- SPA หน้าเดียว: meta viewport, title "QuestVerse — Space Explorer", Google Fonts "Kanit"
- `<div id="app"></div>` + div preloader `#preloader` (แสดงตอนแรก ซ่อนเมื่อโหลดเสร็จ) — preloader ธีมอวกาศ มีข้อความ "กำลังเตรียมยานสำรวจ..."
- script src ตามลำดับ: js/config.js, js/app.js, js/landing.js, js/character.js, js/galaxy_map.js, js/mission.js, js/leaderboard.js, js/api_service.js, js/game_state.js
- script inline: ซ่อน preloader เมื่อ window load, เรียก QV.app.init() ถ้ามี

### style.css
- CSS Variables: --space-deep:#07081a --space-mid:#121438 --accent-cyan:#7df9ff --accent-gold:#ffd166 --accent-purple:#9d4edd --danger:#ef476f --success:#06d6a0 --text:#e8eaf6
- body: background var(--space-deep), font Kanit, color var(--text), margin 0
- .card-glass: glassmorphism (rgba(18,20,56,.75), backdrop-filter blur(12px), border 1px rgba(125,249,255,.25), radius 16px, box-shadow 0 8px 32px rgba(0,0,0,.4))
- ปุ่ม: .btn-primary (cyan gradient + glow), .btn-secondary, .btn-danger, .btn-item (ปุ่มไอเทม), hover/active states
- .screen-landing: full viewport, background url('../assets/landing_bg.jpg') center/cover, ชื่อ "QUESTVERSE" ใหญ่ (clamp font, color var(--accent-cyan), text-shadow glow), คำโปรย "ผจญภัยเรียนรู้ข้าม 5 ดาวเคราะห์", ปุ่มใหญ่ #btn-start
- .screen-character: ช่อง input ชื่อ + grid 3 การ์ดสูท (ภาพ suit_blue.png/suit_red.png/suit_green.png, radio-style, hover border cyan glow, .selected มี border gold)
- .screen-map: แถบสถานะผู้เล่น (ชื่อ, XP bar, rank, hearts ♥ energy), grid 5 การ์ดดาว (ภาพ planet_*.png + ชื่อ + badge สถานะ LOCKED / progress N/5 / COMPLETE)
- .screen-mission: progress dots 5 จุด, การ์ดคำถาม, ปุ่มคำตอบ 2x2 (.answer-btn), แถบไอเทม 3 ไอคอน svg + จำนวน
- .screen-summary: การ์ดสรุป XP, badge ใหม่, ปุ่มกลับแผนที่; .screen-leaderboard: ตารางอันดับ (thead themed)
- animation: .fade-in (opacity 0->1, .5s), .float (ดาวเคราะห์ลอยขึ้นลง 3s ease-in-out infinite), .glow-pulse, .shake (สำหรับตอบผิด), .confetti
- responsive: mobile-first, container max-width 1000px margin auto, grid ดาว: 1 คอลัมน์ mobile / 2-3 คอลัมน์ desktop

## กติกาเคร่งครัด
1. ส่ง code block ครบ 2 ไฟล์ในคำตอบเดียว — ห้ามถามกลับ ห้ามบอกว่ารอ module ถัดไป
2. โค้ดต้องสมบูรณ์ ใช้งานได้จริง — screen หน้าที่ไม่ใช่ module นี้จะ register class เปล่าใน app.js ตอนสร้าง module นั้น
3. คอมเมนต์ในโค้ดเป็นภาษาไทย
