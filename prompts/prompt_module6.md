# Module 6: leaderboard.js — กระดานคะแนน (Leaderboard)

คุณคือ Programmer เขียนไฟล์ `js/leaderboard.js` เพียง 1 ไฟล์ สำหรับเกม QuestVerse (Static HTML5 game, Vanilla JS, ไม่มี backend)

## งานที่ต้องทำ
สร้างกระดานคะแนนที่แสดงอันดับผู้เล่นในเกม โดย:
1. มี seed data ผู้เล่นสมมติ 5-8 คน (คะแนน XP สุ่ม 50-800)
2. รวมผู้เล่นปัจจุบัน (จาก QV.state) ลงในตารางด้วย
3. เรียงอันดับตาม XP มากสุด
4. Highlight ผู้เล่นปัจจุบันในตาราง
5. ปุ่ม "กลับสู่แผนที่"
6. บันทึก Leaderboard ลง localStorage key `questverse-leaderboard` เพื่อคง seed data
7. อัปเดตผู้เล่นปัจจุบันลง Leaderboard ทุกครั้งที่เข้าหน้า (sync รายคน ไม่ทับ seed ของคนอื่น)

## Contract ที่ต้องทำตาม (ห้ามมั่ว — อ่านสเปกนี้ให้แม่น)

- Screen API: ต้อง register screen ใน `QV.app.screens` เป็น object ที่มี `render(state, params)` และ `mount(params)` — **render ต้อง return string HTML อย่างเดียว, mount เป็นตัว attach event**
  ```
  QV.screens.leaderboard = {
    render(state) { return '...HTML string...'; },
    mount() { ...attach event listeners... }
  };
  ```
- เข้าหน้าผ่าน `QV.app.show('leaderboard')` (ไม่มี QV.app.navigate — ใช้ไม่ได้)
- state root shape: `QV.state` มี `xp`, `energy`, `badges[]`, `items{}`, `player{name, suit}`, `planets{id: {currentZone, zonesDone[]}}`
- ยศ: `QV.getRank(xp)` → `{name, emoji, index}`
- เลข: `QV.formatNumber(n)` → string
- escape: `QV.escapeHtml(str)`
- localStorage: `QV.SAVE_KEY` ใช้กับ state ของผู้เล่นเท่านั้น — leaderboard ใช้ key ต่างหากคือ `'questverse-leaderboard'`
- โทนสี UI: ใช้ class CSS ที่มีแล้ว: `btn`, `btn-primary`, `btn-secondary`, `screen-leaderboard`, `leaderboard-table`, `text-center`, `glass-card`
- font สำหรับตัวเลขอันดับ: ตัวหนา สีทอง (inline style ใช้ #FFD166 ได้)

## Seed data ตัวอย่าง (ภาษาไทย)
นามปากกาเช่น "กัปตันโอริออน", "สตาร์ไคท์", "กาแล็กซี่เกอร์ล", "คอสโม่", "นีบิวล่าไนท์" ฯลฯ พร้อม suit สุ่ม blue/red/green

## Format Output
ส่งมาใน code block เดียว:
```javascript
// js/leaderboard.js
...code...
```
ห้ามอธิบายยาว ห้ามถามกลับ เขียนให้ครบถ้วนในครั้งเดียว
