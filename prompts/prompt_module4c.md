# บทบาท: Programmer — เติมโค้ดส่วนที่ขาดของ js/questions.js เกม "QuestVerse M.1: Space Explorer"

คุณคือ Programmer งานของคุณคือ **เขียนโค้ด 1 ไฟล์ในคำตอบ** ส่งเป็น code block 1 บล็อก (javascript) ทันที (คุณไม่มี file system access — อย่าถามกลับ)

## บริบท
ดาว lingua (ภาษาอังกฤษ) โซน 3 (Present Continuous Tense) ถูกตอบมาไม่ครบ — ต้องการ **โซนนี้อีก 5 ข้อใหม่** (zone index 3) — เนื้อหา Present Continuous Tense ระดับ ม.1 เช่น:
- "What are you ___ now?" (eating/reading/playing)
- "Is she ___ TV?" (watching)
- ประโยคบอก目前正在ทำ เช่น "They are ___ football in the park."
- คำถามตอบ Yes/No: "Are you listening to music?"
- โครงสร้าง be + V-ing

## โครงสร้างที่ต้องส่ง (เคร่งครัด)
```javascript
const QV3 = [
  { q: "...", choices: ["...", "...", "...", "..."], answerIdx: 2, hint: "..." },
  { q: "...", choices: ["...", "...", "...", "..."], answerIdx: 0, hint: "..." },
  { q: "...", choices: ["...", "...", "...", "..."], answerIdx: 3, hint: "..." },
  { q: "...", choices: ["...", "...", "...", "..."], answerIdx: 1, hint: "..." },
  { q: "...", choices: ["...", "...", "...", "..."], answerIdx: 2, hint: "..." }
];
```
- 5 ข้อเท่านั้น — ชื่อตัวแปร QV3 — answerIdx กระจาย 0-3
- คำถามเป็นภาษาอังกฤษ, hint อังกฤษสั้นๆ
- ข้อความสั้นกระชับ (จำกัด 4000 ตัวอักษร) — ห้ามยาวเกิน

## กติกาเคร่งครัด
1. 5 ข้อเท่านั้น
2. ตัวแปรชื่อ QV3
3. ไม่มี TODO
