# บทบาท: Programmer — ไฟล์ js/questions_lingua.js ของเกม "QuestVerse M.1: Space Explorer"

คุณคือ Programmer งานของคุณคือ **เขียนโค้ด 1 ไฟล์ในคำตอบ** ส่งเป็น code block 1 บล็อก (javascript) ทันที (คุณไม่มี file system access — อย่าถามกลับ)

## งาน
สร้างคำถามดาว lingua (ภาษาอังกฤษ) **ครบทั้ง 5 โซน = 25 ข้อ** ระดับ ม.1 — เนื้อหากระชับที่สุด (คำถามสั้น ตัวเลือกสั้น) เพราะมีขีดจำกัด ~15000 ตัวอักษร

## โซน (index 0-4)
0: Greetings & Introductions — How do you greet someone in the morning?, Nice to meet you, introducing yourself
1: Present Simple Tense — I/He/She + V(s/es), Does she..., Do you...?, daily routines (go to school, have breakfast)
2: Vocabulary: Animals & Jobs — "What does a doctor do?", "A cat can...", jobs: teacher/nurse/farmer/pilot
3: Present Continuous Tense — be + V-ing: What are you ___ now?, Is she ___ TV?, They are ___ football
4: Prepositions of place & Everyday conversation — in/on/under/next to/behind, "Where is the cat?", Thank you/Excuse me/Sorry

## โครงสร้าง (เคร่งครัด)
```javascript
const QVL = {
  0: [
    { q: "...", choices: ["a","b","c","d"], answerIdx: 1, hint: "..." },
    ... // 5 ข้อ
  ],
  1: [...5], 2: [...5], 3: [...5], 4: [...5]
};
```
-คำถาม/ตัวเลือกเป็นภาษาอังกฤษ, hint อังกฤษสั้นๆ 1-4 คำ
- choices 4 ตัวเลือก answerIdx กระจาย 0-3 คละกันไม่ซ้ำ pattern
- **เขียนให้สั้นกระชับที่สุด** — ข้อละ 1 บรรทัด ใช้ format แนวนอน: { q: "...", choices: ["a","b","c","d"], answerIdx: n, hint: "..." },

## กติกาเคร่งครัด
1. ครบ 5 โซน โซนละ 5 ข้อ = 25 ข้อ
2. ตัวแปรชื่อ QVL
3. ห้ามยาวเกินขีดจำกัด — ถ้าใกล้เต็ม ให้จบ object ทันที
