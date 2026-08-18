# บทบาท: Programmer — ไฟล์ js/config.js ของเกม "QuestVerse M.1: Space Explorer"

งานของคุณคือ **เขียนโค้ด js/config.js ในคำตอบ** ส่งเป็น code block เดียวในคำตอบนี้ทันที (คุณไม่มี file system access)

## ข้อมูลโปรเจกต์
เกมผจญภัยอวกาศเพื่อการเรียนรู้สำหรับเด็ก ม.1 (ภาษาไทย) Static Web Game: HTML5 + CSS3 + Vanilla JS ล้วนๆ — Deploy บน GitHub Pages
5 ดาวเคราะห์ = 5 วิชา: (1) ดาวนัมเบอร์รอน/Numberon/คณิตศาสตร์/สี #7c6ff7/planet_numberon.png (2) ดาวไบโอเนีย/Bionia/วิทยาศาสตร์/สี #06d6a0/planet_bionia.png (3) ดาวอักษรา/Aksara/ภาษาไทย/สี #ffd166/planet_aksara.png (4) ดาวลิงกัว/Lingua/อังกฤษ/สี #4cc9f0/planet_lingua.png (5) ดาวซิวิลิส/Civilis/สังคมศึกษา/สี #f5a623/planet_civilis.png

## ข้อกำหนดไฟล์ js/config.js — ส่งเป็น code block เดียว
1. สร้าง namespace เดียว: `window.QV = {}` (ใช้ `const QV = (window.QV || {});`)
2. คอนฟิกภายใน QV:
   - apiBaseUrl: "https://api.zero-ai.cc/v1"
   - apiModel: "gpt-5.6-sol"
   - apiModelFallback: "gpt-5.6-luna"
   - SAVE_KEY: "questverse_save_v1"
   - MAX_ENERGY: 5, XP_CORRECT: 10, XP_COMBO: 5, QUESTIONS_PER_ZONE: 5, ZONES_PER_PLANET: 5
   - DEFAULT_ITEMS: { shield: 2, compass: 2, telescope: 2 }
   - planets: array 5 object { id:"numberon", name:"ดาวนัมเบอร์รอน", nameEn:"Numberon", subject:"คณิตศาสตร์", themeColor:"#7c6ff7", image:"assets/planet_numberon.png", description:"...", zones:5 } ครบทั้ง 5 ดาว (description ภาษาไทย น่ารัก 1-2 ประโยค เหมาะกับเด็ก ม.1)
   - ranks: array [[0,"นักเรียนนายร้อยอวกาศ"],[100,"กัปตัน"],[300,"พลเรือเอกจักรวาล"]]
   - items: { shield:{id:"shield",name:"โล่ป้องกัน",desc:"ตอบผิดไม่เสียพลังงาน",image:"assets/item_shield.svg"}, compass:{id:"compass",name:"เข็มทิศอวกาศ",desc:"ตัดตัวเลือกผิด 1 ตัว",image:"assets/item_compass.svg"}, telescope:{id:"telescope",name:"กล้องส่องทางไกล",desc:"ขอดูคำใบ้ 1 ครั้ง",image:"assets/item_telescope.svg"} }
   - badges: array object {id,name,desc}: นักสำรวจดาวนัมเบอร์รอน/ไบโอเนีย/อักษรา/ลิงกัว/ซิวิลิส (ครบ 5 โซน), จอมคอมโบ (ถูกติด 10 ข้อ), นักเดินทางข้ามดาว (เล่นครบทุกดาว), ผู้พิชิตจักรวาล (ผ่านทุกด่าน), Speed Runner (ถูกใน 5 วินาที 10 ครั้ง) — รวม 9 แบดจ์
   - seedLeaderboard: array 5 object {name:"..." ,xp:...,rank:"..."} (ข้อมูลผู้นำคะแนนตัวอย่าง เช่น "กัปตันเอซ", "เรือโทมิลค์" xp 800, 540, 310, 260, 120)
3. ฟังก์ชัน utility ใน QV:
   - QV.getRank(xp): return ชื่อ rank จาก threshold
   - QV.getRankIndex(xp): return index
   - QV.saveState(state): JSON.stringify + localStorage.setItem(SAVE_KEY)
   - QV.loadState(): JSON.parse + fallback default state ถ้าไม่มี → default: {player:{name:"",suit:"blue"},xp:0,totalCorrect:0,combo:0,maxCombo:0,energy:5,lastEnergyDate:"",planets:{},items:{shield:2,compass:2,telescope:2},badges:[],fastCorrect5s:0,leaderboard:seedLeaderboard} — โครง planets: {numberon:{currentZone:0,zonesDone:0},...}
   - QV.escapeHtml(s): replace &,<,>,",' เพื่อป้องกัน XSS
   - QV.todayKey(): return "YYYY-MM-DD"
   - QV.updateEnergy(): ถ้า lastEnergyDate !== todayKey() → reset energy เป็น 5, update date, save (energy 5 หน่วยต่อวัน)
   - QV.addXp(amount, state): state.xp += amount, return new rank ถ้าเลื่อนระดับ
4. คอมเมนต์ในโค้ดเป็นภาษาไทย อธิบายแต่ละส่วน

## กติกาเคร่งครัด
1. ส่ง code block เดียวครบถ้วน — ห้ามถามกลับ
2. โค้ดต้องสมบูรณ์ทำงานได้จริง (ไม่ใช่ skeleton)
3. Vanilla JS ล้วน ไม่พึ่งพาไฟล์อื่น
