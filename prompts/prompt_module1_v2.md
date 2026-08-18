# บทบาท: Programmer — โปรเจกต์เกม "QuestVerse M.1: Space Explorer"

คุณคือ Programmer ฝีมือเยี่ยม งานของคุณคือ **เขียนโค้ดในข้อความตอบกลับเท่านั้น**
⚠️ IMPORTANT: คุณไม่มีสิทธิ์เข้าถึงหรือสร้างไฟล์ในเครื่อง (ไม่มี file system access) — อย่าบอกว่า "กำลังสร้างไฟล์" ให้คุณเขียนโค้ดส่งออกมาเป็นข้อความในคำตอบเดี๋ยวนี้ ทันที

## ข้อมูลโปรเจกต์
เกมผจญภัยอวกาศเพื่อการเรียนรู้สำหรับเด็ก ม.1 (ภาษาไทย) เป็น Static Web Game ใช้ HTML5 + CSS3 + Vanilla JavaScript ล้วนๆ (ห้ามใช้ framework/library ภายนอก) จะ Deploy บน GitHub Pages
โครงสร้างโฟลเดอร์ปลายทาง (Manus จะจัดการ copy โค้ดจากคำตอบของคุณไปวางเอง):
- `index.html`, `style.css`, `js/config.js`, `js/app.js`, `js/landing.js`, `js/character.js`, `js/galaxy_map.js`, `js/mission.js`, `js/leaderboard.js`, `js/api_service.js`, `js/game_state.js`
- โฟลเดอร์ `assets/` มีภาพ: landing_bg.jpg, explorer_ship.png, planet_numberon.png, planet_bionia.png, planet_aksara.png, planet_lingua.png, planet_civilis.png, suit_blue.png, suit_red.png, suit_green.png, item_shield.svg, item_compass.svg, item_telescope.svg

## ระบบเกม (ต้องตรงตามสเปกนี้)
5 ดาวเคราะห์ = 5 วิชา: (1) ดาวนัมเบอร์รอน/Numberon/คณิตศาสตร์/น้ำเงิน-ม่วง/planet_numberon.png (2) ดาวไบโอเนีย/Bionia/วิทยาศาสตร์/เขียว-ฟ้า/planet_bionia.png (3) ดาวอักษรา/Aksara/ภาษาไทย/ทอง-ทองแดง/planet_aksara.png (4) ดาวลิงกัว/Lingua/อังกฤษ/ฟ้า-ขาว/planet_lingua.png (5) ดาวซิวิลิส/Civilis/สังคมศึกษา/ส้ม-น้ำตาล/planet_civilis.png
- Energy: 5 หน่วยต่อวัน ตอบถูก +1 (สูงสุด 5) ตอบผิด -1
- XP: ตอบถูก +10, combo ติดต่อกัน +5 โบนัส
- Rank: 0–99 = "นักเรียนนายร้อยอวกาศ", 100–299 = "กัปตัน", 300+ = "พลเรือเอกจักรวาล"
- แต่ละดาวมี 5 โซน unlock ตามลำดับ แต่ละโซนมี 5 คำถาม (คำถามจะได้จาก AI API ใน module ถัดไป)
- ไอเทม: โล่ป้องกัน (ตอบผิดไม่เสีย energy), เข็มทิศ (ตัดตัวเลือกผิด 1 ตัว), กล้องส่องทางไกล (ดูคำใบ้) — ทีมี 2 ชิ้นต่อชนิด
- Badges: นักสำรวจดาว___ (ครบ 5 โซน), จอมคอมโบ (ถูกติด 10 ข้อ), นักเดินทางข้ามดาว (ครบทุกดาว), ผู้พิชิตจักรวาล (ผ่านทุกด่าน), Speed Runner (ถูกใน 5 วิ 10 ครั้ง)
- Leaderboard: อันดับรวม + seed data ประกอบ

## งาน Module 1 — คืนรหัส 3 ไฟล์ต่อไปนี้
**ต้องคืนรหัสครบ 3 ไฟล์ในคำตอบเดียวกัน** โดยใช้ code fence พร้อมคำอธิบายชื่อไฟล์ด้านบน แต่ละ code block ทั้งหมดดังนี้:

```
ไฟล์: index.html
(code block html)
```

```
ไฟล์: style.css
(code block css)
```

```
ไฟล์: js/config.js
(code block js)
```

## สเปก index.html
- SPA หน้าเดียว `<div id="app"></div>` + import script เรียง: config.js → app.js → landing.js → character.js → galaxy_map.js → mission.js → leaderboard.js → api_service.js → game_state.js (ลักษณะ `src="js/xxx.js"`)
- preloader: จอโหลดน่ารักธีมอวกาศ (ยาน explorer_ship.png หมุน/ลอย) พร้อมข้อความ "กำลังเตรียมยานสำรวจ..."
- meta viewport, title "QuestVerse — Space Explorer", font Kanit (Google Fonts)

## สเปก style.css
- CSS Variables: --space-deep:#07081a --space-mid:#121438 --accent-cyan:#7df9ff --accent-gold:#ffd166 --accent-purple:#9d4edd --danger:#ef476f --success:#06d6a0 --text:#e8eaf6
- glassmorphism card: background rgba(18,20,56,.75), backdrop-filter blur(12px), border 1px rgba(125,249,255,.25), radius 16px
- ปุ่ม .btn-primary (cyan glow), .btn-secondary, .btn-danger, .btn-item
- หน้า Landing (.screen-landing): hero 16:9 background landing_bg.jpg cover, ชื่อ "QUESTVERSE" ใหญ่ + text-shadow glow, คำโปรย "ผจญภัยเรียนรู้ข้าม 5 ดาวเคราะห์", ปุ่ม "🚀 เริมมิชั่น"
- หน้า Character (.screen-character): ช่องกรอกชื่อ + การ์ดเลือกสูท 3 ใบ (ภาพ suit_*.png, hover border glow)
- หน้า Map (.screen-map): แถบสถานะผู้เล่น (ชื่อ, XP bar, rank, ♥ energy), grid 5 ดาว (ภาพ planet_*.png + ชื่อ + สถานะ LOCKED/progress N/5/COMPLETE)
- หน้า Mission (.screen-mission): progress dots 5 จุด, การ์ดคำถาม, ปุ่มคำตอบ 2x2, แถบไอเทม 3 ไอคอน (svg + จำนวนเหลือ)
- หน้า Summary (.screen-summary): การ์ดสรุป (XP, badge ใหม่, ปุ่ม "กลับแผนที่"), หน้า Leaderboard (.screen-leaderboard) ตารางอันดับ
- animation: fade-in, float (ดาวเคราะห์ลอย), glow-pulse, shake (ตอบผิด), confetti

## สเปก js/config.js
- window.QV = { ... } มี:
  - apiBaseUrl: "https://api.zero-ai.cc/v1", apiModel: "gpt-5.6-sol"
  - planets: array 5 object { id, name, nameEn, subject, themeColor, image, zones: 5 } ตามดาวข้างต้น
  - ranks: [[0,"นักเรียนนายร้อยอวกาศ"],[100,"กัปตัน"],[300,"พลเรือเอกจักรวาล"]]
  - items: { shield:{name:"โล่ป้องกัน",image:"assets/item_shield.svg"}, compass:{name:"เข็มทิศ",image:"assets/item_compass.svg"}, telescope:{name:"กล้องส่องทางไกล",image:"assets/item_telescope.svg"} }
  - badges: array object {id,name,desc} ตามแบดจ์ข้างต้น
  - MAX_ENERGY:5, XP_CORRECT:10, XP_COMBO:5, QUESTIONS_PER_ZONE:5, ZONES_PER_PLANET:5, DEFAULT_ITEMS:{shield:2,compass:2,telescope:2}
  - SAVE_KEY: "questverse_save_v1"
- ฟังก์ชัน util: QV.saveState(state), QV.loadState(), QV.getRank(xp), QV.escapeHtml(s) (ป้องกัน XSS)
- คอมเมนต์ในรหัสเป็นภาษาไทย

## กติกาเคร่งครัด
1. คืน code block ครบ 3 ไฟล์ในคำตอบเดียว — ห้ามสั้น ห้ามถามกลับ ห้ามบอกว่าจะทำภายหลัง
2. โค้ดต้องครบถ้วน ทำงานได้จริง (ไม่ใช่ skeleton ที่มี TODO) — screen ที่ยังไม่ใช่ module นี้ให้ register function เปล่า ๆ ไว้ใน app.js concept (แต่ module นี้ไม่ต้องเขียน app.js)
3. ไม่มี external library — เว้น Google Fonts Kanit
4. เขียน clean, แยก function ชัดเจน
