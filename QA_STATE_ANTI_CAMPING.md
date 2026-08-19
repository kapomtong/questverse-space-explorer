# QA State — Anti-camping integration (18 Aug 2026)

## สถานะล่าสุด
- ✅ boss.js patch Opus v3 สำเร็จ: MOVING_THRESHOLD 0.15, CAMPING_TIME 4500, CAMPING_ATTACK_DELAY 1200, PAD_MIN_DISTANCE 18, campingDetection state, selectPadSlots(), updateCampingDetection/resetCampingDetection/showCampingWarning/createTargetedFireball, fireball warnDuration 500ms for camping-attack, updateCampingDetection(timestamp) ใน gameLoop, mount ใหม่ reset campingDetection, cleanup clear campingAttackTimer, loadQuestion ใช้ selectPadSlots() + resetCampingDetection, checkPadCollision ใช้ normalized speed
- ✅ style.css: เพิ่ม .camping-warning, .pulse, @keyframes camping-pulse, .atk-tile.fireball.camping-attack
- ✅ node --check boss.js OK
- ✅ Local server http://localhost:8777 working

## QA ที่กำลังทำ
- อยู่ใน boss battle Mathos (Question 1/10: (3²)³) — ป้าย 4 ป้ายกระจายสวย (3⁶ กลางบน, 3⁶ ขวา, 6⁶ ซ้ายล่าง, 9⁶ กลางล่าง) — แต่เห็นคำตอบ 3⁶ ซ้ำ 2 ป้าย? ตรวจ: ตอน loadQuestion random.choices อาจทำให้คำตอบถูกซ้ำได้ถ้า q.choices มีซ้ำ (เช่น 3⁶ อยู่ 2 ตัว = ผิดปกติ) → ต้องตรวจ js/questions.js มีคำตอบซ้ำหรือไม่
- Player ยังไม่เห็น sprite (อาจโหลดช้า หรือ position y:88 x:57.5 ยังไม่ update) — ตรวจอีกที
- ทดสอบต่อไป: ยืนนิ่งไม่บนป้าย 5+ วิ → expect camping warning + targeted fireball

## QA Checklist คงเหลือ
1. ยืนนิ่ง → camping warning + targeted fireball
2. เคลื่อนไหว → warning หาย
3. ยืนบนป้าย (core) นาน 0.8s → ตอบผลิตได้ (intent answer ยัง work)
4. ป้ายซ้ำ 3⁶ = FALSE ALARM (markdown extraction สร้างภาพลวง; จริง 4 ป้ายมี 3⁵/3⁶/6⁶/9⁶ ไม่ซ้ำ, dataset answerIdx = 3,1,0,2 ครบ 4 index) — ไม่มีบั๊ก
5. deploy + push GitHub

## Deployment
- Deploy created (INITIALIZING): dpl_DdBP59gbicrph2wUKqK5QTkHPdvm — must wait for READY then verify production URL https://questverse-space-explorer.vercel.app
- After deploy: git add -A && git commit -m "Add anti-camping system: warning + targeted fireball + spread pads (Opus v3)" && git push origin main

## QA findings — resolved
- Camping warning + targeted fireball = ทำงานจริง (QA ผ่าน)

## QA findings — player death issue
- Player ตายทุกครั้งเพราะยืนแช่ตอน spawn (ไม่มีการเคลื่อนไหว) → targeted fireball ยิงใส่ + บอสโจมตีปกติ ด้วย HP=1 ถูก 1 hit ตายทันที
- console-injected KeyboardEvent เคลื่อนที่ไม่ได้ (events ไม่ทำงาน) — ต้องใช้ browser_press_key แท้จริง หรือทดสอบผ่าน touch joystick
- Plan: QA ต่อโดยใช้ browser_press_key 'd' แล้ว view ทันที หรือเพิ่ม QV.state.energy=5 ก่อน mount สำหรับ QA
