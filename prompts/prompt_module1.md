คุณคือ Programmer ของโปรเจกต์เกม "QuestVerse M.1: Space Explorer" — เกมผจญภัยอวกาศเพื่อการเรียนรู้สำหรับเด็ก ม.1 (ภาษาไทย)

โปรเจกต์นี้เป็น Static Web Game (HTML5 + CSS3 + Vanilla JavaScript, ไม่มี framework) ที่จะ Deploy บน GitHub Pages
โครงสร้างโฟลเดอร์:
- index.html (หน้าหลักแบบ Single Page App — สลับหน้าด้วย JS โดยไม่ reload)
- style.css
- js/config.js
- js/app.js (router — จะทำใน module ถัดไป)
- assets/ (ภาพทั้งหมด: landing_bg.jpg, explorer_ship.png, planet_numberon.png, planet_bionia.png, planet_aksara.png, planet_lingua.png, planet_civilis.png, suit_blue.png, suit_red.png, suit_green.png, item_shield.svg, item_compass.svg, item_telescope.svg)

เกมมี 5 ดาวเคราะห์ (5 วิชา):
1. ดาวนัมเบอร์รอน (Numberon) — คณิตศาสตร์ — ธีมสีน้ำเงิน-ม่วง — assets/planet_numberon.png
2. ดาวไบโอเนีย (Bionia) — วิทยาศาสตร์ — ธีมสีเขียว-ฟ้า — assets/planet_bionia.png
3. ดาวอักษรา (Aksara) — ภาษาไทย — ธีมสีทอง-ทองแดง — assets/planet_aksara.png
4. ดาวลิงกัว (Lingua) — ภาษาอังกฤษ — ธีมสีฟ้า-ขาว — assets/planet_lingua.png
5. ดาวซิivilส (Civilis) — สังคมศึกษา — ธีมสีส้ม-น้ำตาล — assets/planet_civilis.png

ระบบเกมหลัก (สำหรับ config.js):
- Energy (พลังงาน): มี 5 หน่วยต่อวัน, ตอบถูก +1 หน่วย (สูงสุด 5), ตอบผิด -1 หน่วย
- XP: ตอบถูก +10 XP, combo ติดต่อกัน +5 โบนัส
- Rank: 0-99 XP = "นักเรียนนายร้อยอวกาศ", 100-299 = "กัปตัน", 300+ = "พลเรือเอกจักรวาล"
- ดาวแต่ละดวงมี 5 โซน (ด่าน)  unlock ตามลำดับ, แต่ละโซนมี 5 คำถาม
- ไอเทม: โล่ป้องกัน (ไม่เสียพลังงานเมื่อตอบผิด), เข็มทิศ (ตัดตัวเลือกผิด 1 ตัว), กล้องส่องทางไกล (ดูคำใบ้) — ไอเทมมี 2 ชิ้นต่อชนิดตอนเริ่มใหม่
- Badge: "นักสำรวจดาว___" (สำรวจครบ 5 โซน), "จอมคอมโบ" (ตอบถูกติดต่อกัน 10 ข้อ), "นักเดินทางข้ามดาว" (เล่นครบทุกดาว), "ผู้พิชิตจักรวาล" (ผ่านทุกด่าน), "Speed Runner" (ตอบถูกใน 5 วินาที 10 ครั้ง)
- คำถามสร้าง dynamic จาก AI API (จะ integrate ใน module ถัดไป)

งานของคุณใน Module 1: สร้าง 3 ไฟล์

## ไฟล์ 1: index.html
- หน้า SPA เดียว มี container `#app` สำหรับ inject หน้าต่างๆ
- import script เรียง: config.js, app.js (placeholder), landing.js, character.js, galaxy_map.js, mission.js, leaderboard.js (placeholder) — ใช้ <script src="js/...">
- meta viewport, title "QuestVerse — Space Explorer", font Kanit จาก Google Fonts
- preloader animation ง่ายๆ ขณะโหลดภาพ assets หลัก (landing_bg.jpg, explorer_ship.png) — แสดง progress
- ธีม: space สีน้ำเงินเข้ม/ม่วง พร้อม accent ทอง

## ไฟล์ 2: style.css
- CSS Variables: --space-deep #07081a, --space-mid #121438, --accent-cyan #7df9ff, --accent-gold #ffd166, --accent-purple #9d4edd, --danger #ef476f, --success #06d6a0, --text #e8eaf6
- base reset, body background สี space-deep, font Kanit
- ธีม UI: การ์ดกระจก (glassmorphism: background rgba(18,20,56,0.75), backdrop-filter blur, border 1px rgba(125,249,255,0.25), border-radius 16px, box-shadow)
- ปุ่ม primary (cyan glow), ปุ่ม secondary, ปุ่มอันตราย (danger)
- หน้า Landing (class .screen-landing): hero เต็มจอด้วย landing_bg.jpg, ชื่อเกม "QUESTVERSE" ตัวใหญ่มี glow, คำโปรย "ผจญภัยเรียนรู้ข้าม 5 ดาวเคราะห์", ปุ่มใหญ่ "เริ่มภารกิจ"
- หน้า Character (.screen-character): เลือกชื่อ (input) + เลือกสูท 3 แบบ (radio-style card พร้อมภาพ suit_blue/red/green.png) — hover มี glow border
- หน้า Galaxy Map (.screen-map): header แสดงสถานะผู้เล่น (ชื่อย่อ, XP bar, rank, energy hearts ♥), grid 5 การ์ดดาว (ภาพ planet_*.png ด้านบน + ชื่อ + จำนวนวิชา + badge "LOCKED/COMPLETE/progress N/5")
- หน้า Mission (.screen-mission): progress bar 5 ข้อ, คำถาม card, ปุ่มคำตอบ 4 ปุ่ม (grid 2x2), แถบไอเทม 3 ชิ้น (ไอคอน svg + จำนวน)
- หน้า Summary (.screen-summary): XP ได้, badges ใหม่, ปุ่มกลับแผนที่
- หน้า Leaderboard (.screen-leaderboard): ตารางอันดับ
- animation: fade-in, float (ดาวเคราะห์ลอย), glow-pulse, shake (ตอบผิด), confetti-burst
- responsive: mobile-first, max-width 1000px กลางจอ

## ไฟล์ 3: js/config.js
- window.QV = { ... } เก็บ:
  - API_BASE: "https://api.zero-ai.cc/v1"
  - API_MODEL: "gpt-5.6-sol"
  - PLANETS: array ของ object { id, name, subject, themeColor, image, description, icon } ครบ 5 ดาวตามด้านบน (id: numberon, bionia, aksara, lingua, civilis)
  - RANKS: array threshold -> ชื่อ rank
  - ITEMS: { shield: {...}, compass: {...}, telescope: {...} } ชื่อไทย + svg path
  - BADGES: array { id, name, description, condition }
  - MAX_ENERGY: 5, XP_CORRECT: 10, XP_COMBO: 5, QUESTIONS_PER_ZONE: 5, ZONES_PER_PLANET: 5
- ฟังก์ชัน utility: QV.saveState(state), QV.loadState() (localStorage key "questverse_save"), QV.getRank(xp)
- comment อธิบายแต่ละส่วนเป็นภาษาไทย

กฎการเขียนโค้ด:
- Vanilla JS 100% ไม่มี dependency
- comment ภาษาไทยในโค้ด
- ระวัง XSS (เมื่อ inject HTML ให้ escape ชื่อผู้เล่น)
- เขียนให้ clean, แยก function ชัดเจน, พร้อมให้ module ถัดไปมา extend
- ส่งโค้ดครบ 3 ไฟล์ ใช้ code fence `html`, `css`, `js` กำกับชื่อไฟล์
