# บทบาท: Programmer — ไฟล์ js/config.js ของเกม "QuestVerse M.1: Space Explorer"

คุณคือ Programmer งานของคุณคือ **เขียนโค้ด js/config.js ในคำตอบ** ส่งเป็น code block เดียวในคำตอบนี้ทันที (คุณไม่มี file system access — อย่าถามกลับ)

## ข้อมูลโปรเจกต์
เกมผจญภัยอวกาศเพื่อการเรียนรู้สำหรับเด็ก ม.1 (ภาษาไทย) — Static Web Game: HTML5 + CSS3 + Vanilla JS ล้วนๆ — Deploy บน GitHub Pages
ไฟล์อื่นในโปรเจกต์ (ทำแล้ว): index.html, style.css
ไฟล์ที่จะทำทีหลัง: js/app.js (router), js/landing.js, js/character.js, js/galaxy_map.js, js/mission.js, js/leaderboard.js, js/game_state.js — **ห้ามพึ่งพาไฟล์เหล่านี้ตอนนี้ออกแบบให้ config.js ทำงานเดี่ยวได้ (เรียก QV.xxx จากไฟล์อื่นในอนาคตได้)**

## ข้อกำหนดไฟล์ js/config.js — ส่งเป็น code block เดียว `javascript`
สร้าง namespace เดียว: `const QV = window.QV || {};` แล้วแนบ property ต่อด้านล่าง:

1. **ดาวเคราะห์ 5 ดวง** (QV.planets — array):
   { id:"numberon", name:"ดาวนัมเบอร์รอน", nameEn:"Numberon", subject:"คณิตศาสตร์", themeColor:"#7c6ff7", image:"assets/planet_numberon.png", desc:"อาณาจักรแห่งตัวเลขและรูปทรงที่รอผู้พิชิต..." }
   { id:"bionia", name:"ดาวไบโอเนีย", nameEn:"Bionia", subject:"วิทยาศาสตร์", themeColor:"#06d6a0", image:"assets/planet_bionia.png", desc:"..." }
   { id:"aksara", name:"ดาวอักษรา", nameEn:"Aksara", subject:"ภาษาไทย", themeColor:"#ffd166", image:"assets/planet_aksara.png", desc:"..." }
   { id:"lingua", name:"ดาวลิงกัว", nameEn:"Lingua", subject:"ภาษาอังกฤษ", themeColor:"#4cc9f0", image:"assets/planet_lingua.png", desc:"..." }
   { id:"civilis", name:"ดาวซิวิลิส", nameEn:"Civilis", subject:"สังคมศึกษา", themeColor:"#f5a623", image:"assets/planet_civilis.png", desc:"..." }
   desc ภาษาไทย น่ารัก 1-2 ประโยคเหมาะกับเด็ก ม.1 — เขียนจริงให้ครบ 5 ดาว
   และ zoneCount: 5 (ค่าเดียวกันทุกดาว)

2. **ค่าคงที่ระบบ**:
   MAX_ENERGY: 5, XP_CORRECT: 10, XP_COMBO: 5, QUESTIONS_PER_ZONE: 5, SAVE_KEY: "questverse_save_v1"
   DEFAULT_ITEMS: { shield: 2, compass: 2, telescope: 2 }
   ITEM_DEFS: { shield:{id:"shield",name:"โล่ป้องกัน",desc:"ตอบผิดไม่เสียพลังงาน",image:"assets/item_shield.svg"}, compass:{id:"compass",name:"เข็มทิศอวกาศ",desc:"ตัดตัวเลือกผิด 1 ตัว",image:"assets/item_compass.svg"}, telescope:{id:"telescope",name:"กล้องส่องทางไกล",desc:"ขอดูคำใบ้ 1 ครั้ง",image:"assets/item_telescope.svg"} }

3. **Rank** (QV.ranks — array of [threshold, name, emoji]):
   [0, "นักเรียนนายร้อยอวกาศ", "🚀"], [100, "กัปตัน", "⭐"], [300, "พลเรือเอกจักรวาล", "🌟"]
   + ฟังก์ชัน QV.getRank(xp) → { name, emoji, index }

4. **Badge** (QV.badges — array { id, name, desc, icon }):
   - explorer-numberon/bionia/aksara/lingua/civilis: "นักสำรวจดาว___" (ผ่านครบ 5 โซนของดาวนั้น) icon 🛸
   - combo-master: "จอมคอมโบ" (ตอบถูกติดต่อ 10 ข้อ) icon 🔥
   - globe-trotter: "นักเดินทางข้ามดาว" (เล่นครบทุกดาว) icon 🌌
   - universe-conqueror: "ผู้พิชิตจักรวาล" (ผ่านทุกด่านทั้งหมด) icon 🏆
   - speed-runner: "Speed Runner" (ตอบถูกใน 5 วินาที 10 ครั้ง) icon ⚡

5. **State default** (QV.newState()): return object {
   player:{name:"", suit:"blue"}, xp:0, totalCorrect:0, combo:0, maxCombo:0,
   energy:5, lastEnergyDate:"", planets:{numberon:{currentZone:0,zonesDone:[]},bionia:{...},aksara:{...},lingua:{...},civilis:{...}},
   items:{shield:2,compass:2,telescope:2}, badges:[], fastCorrect5s:0
   }
   + QV.saveState(state): localStorage.setItem(SAVE_KEY, JSON.stringify(state))
   + QV.loadState(): parse จาก localStorage ไม่มี → newState(); merge ค่า default ที่ขาด (เพื่อรองรับ save เก่า)
   + QV.todayKey(): "YYYY-MM-DD"
   + QV.refreshEnergy(state): ถ้า state.lastEnergyDate !== todayKey() → state.energy = MAX_ENERGY, state.lastEnergyDate = todayKey(), return true (หมายเหตุ energy เต็ม 5 ต่อวัน refresh ทุกวันใหม่)

6. **Utility**:
   QV.escapeHtml(s): แทนที่ &,<,>,",'
   QV.formatNumber(n): comma
   QV.planetById(id): find จาก planets

7. คอมเมนต์ในโค้ดเป็นภาษาไทย อธิบายแต่ละส่วน

## กติกาเคร่งครัด
1. ส่ง code block เดียวครบถ้วน — ห้ามถามกลับ ห้ามบอกว่าจะทำภายหลัง
2. โค้ดสมบูรณ์ทำงานได้จริง ไม่ใช่ skeleton ไม่มี TODO
3. Vanilla JS ล้วน
