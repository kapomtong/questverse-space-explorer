# UI Update Plan — Phase 4/5 ตาม feedback หัวหน้า (18 ส.ค. 2026)

## Feedback จากหัวหน้า (สกรีนช็อต)
1. ฉากตอบคำถาม (mission) โล่งไป — อยากได้ภาพฉากหลังเพิ่ม
2. UI ปุ่มคำตอบดูไม่น่าสนใจ — อยากให้งดงามขึ้น
3. เศษส่วนในคำถามงง — อยากได้ "จำนวนบน/จำนวนล่าง" (ตั้งแนว) + จำนวนคู้วางหน้า
4. ควรมีคำอธิบายไอเทม/สกิลก่อนเริ่มเล่น (AI เจนภาพได้)
5. ควรมีนับเวลาให้น่าสนใจ (timer)
6. "อยากให้ใช้ AI สร้าง UI และไอเทม ฉากหลังตามดาว และอื่นๆ" — ให้ Manus เจนภาพเอง ไม่ต้องให้ user เจน

## แก้โค้ด (Phase 4) — ทำแล้ว
- ✅ config.js: +QV.QUESTION_TIME_LIMIT=30, +QV.formatFrac(text) แปลง a/b→frac span + mixed a b/c (regex: mixed ก่อน แล้ว simple)
- ✅ mission.js: +mission-bg div +stars-field, +timer-row (icon⏱️, timer-bar-track/fill id=timer-bar, timer-sec id=timer-sec), +startTimer()/updateTimerUI() (100ms tick, <=10วิแดง+pulse), handleAnswer clearInterval, renderQuestion ใช้ QV.formatFrac(QV.escapeHtml(...)) สำหรับ q.q/choices/hint
- ✅ landing.js: +ปุ่ม btn-guide "ⓘ กติกาและไอเทม" + QV.screens.guide (guide-card card-glass, guide-item-card แสดงภาพไอเทม+ชื่อ+desc, guide-rank-row, ปุ่ม btn-guide-back → landing)
- ✅ prompt ภาพ ส่งให้ user แล้ว (รอ user เจน — ถ้า user ไม่ได้ส่งภาพมา อาจใช้ AI ของ Manus เจนเองได้)

## CSS — ทำแล้ว ✅ (style.css):
- .screen-mission background mission_bg.jpg + gradient + .timer-row/.timer-bar-track/.timer-bar-fill/.timer-sec + @keyframes pulse + .frac/.frac-n/.frac-d/.mixed/.mixed-num
- .answer-btn gradient ใหม่ + ::after gradient top bar + hover lift/glow + .question-card box-shadow
- .screen-guide/.guide-card/.guide-section/.guide-item-card/.guide-item-icon img/.guide-rank-row/.guide-sub/.guide-note
- .stars-field + ::before/::after (twinkle stars) + @keyframes twinkle
- ท้ายไฟล์ assets/mission_bg.jpg = copy ชั่วคราวของ landing_bg.jpg (รอเจนภาพจริงมาแทน)

## CSS เดิม
- .screen-mission {position:relative; background: linear-gradient(rgba(7,8,26,.7), rgba(7,8,26,.85)), url('../assets/mission_bg.jpg') center/cover fixed no-repeat;}
- .mission-bg (overlay), .stars-field (CSS star animation), .timer-row {display:flex;align-items:center;gap:12px;max-width:800px;margin:0 auto 12px;}, .timer-bar-track {flex:1;height:10px;background:rgba(255,255,255,.15);border-radius:999px;overflow:hidden;}, .timer-bar-fill {height:100%;transition:width .1s linear;}, .timer-sec {min-width:36px;font-weight:700;}, @keyframes pulse
- .answer-btn ใหม่: gradient border, hover lift+glow, font-size 18px, box-shadow
- .frac {display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 3px;line-height:1.1;}
- .frac-n {border-bottom:2px solid currentColor;padding:0 4px 1px;font-weight:700;}
- .frac-d {padding:1px 4px 0;font-weight:700;}
- .mixed {display:inline-flex;align-items:center;gap:3px;}
- .mixed-num {font-weight:700;font-size:1.2em;}
- .screen-guide {min-height:100vh;background:linear-gradient(rgba(7,8,26,.82), rgba(7,8,26,.92)), url('../assets/mission_bg.jpg') center/cover no-repeat;padding:24px 0;}
- .guide-card {max-width:760px;margin:0 auto;padding:40px;}
- .guide-section {margin-bottom:24px;}
- .guide-item-card {display:flex;gap:16px;align-items:center;background:rgba(255,255,255,.06);border-radius:12px;padding:16px;margin-bottom:12px;}
- .guide-item-icon img {width:56px;height:56px;}
- .guide-rank-row {display:flex;gap:12px;align-items:center;padding:8px 0;}
- @keyframes shake ปัจจุบันมีแล้ว (เส้น 556) — pulse ไม่มี ต้องเพิ่ม

## สถานะ 18 ส.ค. (รอบ 4 — QA browser)
- ✅ user ส่งภาพฉากหลังก่อนตอบ 5 ดาวมาเอง (จาก upload/) — วางใน assets/mission_bg_XXX.jpg ทับชั่วคราวแล้ว (1280x720 JPEG q82: 155/156/150/178/124 KB)
- ✅ QA: landing + map โหลดปกติ (XP 50 ดาวนัมเบอร์รอนปลดล็อก zone1 done)
- ✅ QA mission numberon zone2 สำเร็จ: เศษส่วน setแนว (2/5+1/5 คำเลือก 3/10, 3/5, 1/5, 2/10 แสดงบน/ล่างชัด), timer ⏱ 29s + แถบเขียว, starfield animation, ปุ่มไอเทม 3 + คำใบ้แสดงครบทั้งหมด
- 🔄 เหลือ: ทดสอบ guide page + commit/push/deploy Vercel
- ถัดไป: git add/commit/push → deploy Vercel (make_vercel_payload.py → deploy_to_vercel MCP) → ส่ง link
- URL production: https://questverse-space-explorer-lq3jd9k11-kapomtongs-projects.vercel.app

## สถานะ 18 ส.ค. (รอบ 3 — dynamic bg เสร็จแล้ว)
- ✅ ดาว planet_*.png — user บอกมีอยู่แล้ว ไม่ต้องเจน (ลบออกจาก PROMPTS_IMAGES.md แล้ว, เหลือ bg 5 + item 3 + ship = 9 ไฟล์)
- ✅ config.js: planets ทุกดวง +field bg: "assets/mission_bg_XXX.jpg" (numberon/bionia/aksara/lingua/civilis)
- ✅ mission.js edit 1 สำเร็จ: <div class="screen-mission" data-bg="${planet.bg || ''}"> — mount(params) ยังไม่ได้ set bg: จะเพิ่มบรรทัด `if (bg) screen.style.backgroundImage = 'linear-gradient(rgba(7,8,26,.72), rgba(7,8,26,.88)), url(' + bg + ')'` ที่ต้น mount(params) (บรรทัด 65, mount(params) { const state = QV.state; const planetId = ...})
- CSS .screen-mission background เดิมชี้ mission_bg.jpg (copy ของ landing_bg.jpg) — เมื่อ mount set inline style จะ override
- เหลือ: ตรวจ data-bg escapeHtml(planet.bg), QA node repro.js, browser test, deploy Vercel (make_vercel_payload.py → deploy_to_vercel MCP)
- URL: questverse-space-explorer-lq3jd9k11-kapomtongs-projects.vercel.app ; tpgame.vercel.app — MCP ไม่มี alias tool, รอ user login browser

## สถานะ 18 ส.ค. (รอบ 2)
- ✅ PROMPTS_IMAGES.md เสร็จ — prompt ครบ 10 ไฟล์ (bg ตามดาว 5, planet 5, item 3, ship) — ส่ง user แล้ว รอ user เจน
- 🔄 จะทำ dynamic mission bg ตามดาว: config planet += bgImage; mission.js เลือก .screen-mission[data-planet] CSS หลาย bg; style.css: .screen-mission.planet-NUMBERON {background:...mission_bg_numberon.jpg} ×5
- ดาวเดิม 5 ดวงสวย (planet_numberon แบบ crystal 600x600) — ค้างไว้ ไม่แตะ
- mission_bg.jpg ชั่วคราว = copy ของ landing_bg.jpg
- CSS + timer + frac + guide ทำเสร็จแล้ว (บรรทัดที่แล้ว)

## หมายเหตุ
- ไอเทมเดิม config ชี้ item_shield.svg/item_compass.svg/item_telescope.svg — ถ้าเจน PNG ใหม่ต้องอัปเดต config.js image path
- mission-bg.jpg + ดาว 5 ดวง (planet_numberon.png ฯลฯ) — ถ้าเจนใหม่ทับไฟล์เดิมได้เลย (ชื่อเดิม)
- หลังแก้ CSS/JS: node repro.js, node qa_questions.js, browser test flow
- Deploy: make_vercel_payload.py → deploy_to_vercel MCP

## เดิม
- ✅ เศษส่วน setแนว: แปลง `n/d` ใน question text/choices เป็น span .frac {numerator/border/denominator}; จำนวนคู้ (mixed) แปลง `a b/c` → `a <span class="frac">b/c</span>` — ฟัง์กชัน QV.formatFrac()
- ฉากหลัง mission: .screen-mission background image — ใช้ภาพ assets/landing_bg.jpg (อวกาศ) เป็น full-screen overlay + gradient เข้ม + star field (CSS animation)
- นาฬิกานับเวลา: timer 30 วิ/ข้อ — แสดง progress bar + นับถอยหลัง; หมดเวลา = ผิด; ตอบเร็ว bonus เดิม +5 XP ใน 5 วิ
- หน้าแนะนำไอเทม/สกิล: screen ใหม่ 'guide' (show guide จาก landing ด้วยปุ่ม "ⓘ กติกาและไอเทม") — อธิบาย shield/compass/telescope + ระบบ XP/combo/energy
- ปุ่มคำตอบ UI ใหม่: gradient, glow, hover lift, icon, ขอบมนใหญ่

## ภาพที่ต้องเจนใหม่ (Phase 5) — ใช้ generate_image (default quality ยกเว้น text-dense)
| # | ไฟล์ | คำอธิบาย prompt |
|---|------|--------------|
| 1 | assets/mission_bg.jpg | ฉากหลังอวกาศสุดยิ่ง (nebula ม่วง-ฟ้า-ทอง + ดาวสว่าง + ยานเล็ก + planet ไกล) 16:9 — ใช้เป็น bg mission |
| 2 | assets/planet_numberon.png | ดาวเคราะห์คณิตศาสตร์ — พื้นผิวด้วยตัวเลข ตัวเลข เรขาคณิต glowing cyan ลอยรอบ (iconic, ต้องกลมชัด) |
| 3 | assets/planet_bionia.png | ดาววิทยาศาสตร์ — เขียว มี DNA helix ใบไม้ เซลล์ glowing ลอยรอบ |
| 4 | assets/planet_aksara.png | ดาวภาษาไทย — ทอง/ส้ม มีตัวอักษรไทย/กนก/คัมภีร์ glowing ลอยรอบ |
| 5 | assets/planet_lingua.png | ดาวอังกฤษ — ฟ้า/เงิน มีตัวอักษร A-Z คำคำศัพท์ glowing ลอยรอบ |
| 6 | assets/planet_civilis.png | ดาวสังคม — ส้ม/น้ำตาล มีโบราณสถาน โลก ปิรามิด glowing ลอยรอบ |
| 7 | assets/item_shield.svg→.png | โล่อวกาศ futuristic cyan 1:1 โปรงใส |
| 8 | assets/item_compass.png | เข็มทิศอวกาศ futuristic gold/purple 1:1 |
| 9 | assets/item_telescope.png | กล้องส่องทางไกลอวกาศ 1:1 |
| 10 | assets/explorer_ship.png (ใหม่) | ยานสำรวจนักเรียน cute + ติดธงดาว 1:1 โปรงใส |
| 11 | assets/suit_3.png | ชุดอวกาศ 3 แบบ (แดง/น้ำเงิน/เขียว) — อาจเจน 3 ไฟล์แยก |

- ไอเทมเดิมเป็น SVG 3 ไฟล์ใน assets — replace ด้วย PNG จาก AI ใช้ transparent_background
- landing_bg.jpg เดิมดีอยู่ — ค้างไว้ (ถ้าไม่พอใจค่อยเปลี่ยน)

## สถานะ deploy
- Vercel project: questverse-space-explorer (prj_sZAMieVaazfOEo1yEAxaaTjdBbgP) team team_M57w1DW5EdqJADbOQsFLkJPK
- deploy_to_vercel MCP tool + make_vercel_payload.py — รัน "python3 make_vercel_payload.py" แล้ว "manus-mcp-cli tool call deploy_to_vercel --server vercel --input-file payload.json"
- URL เดิม: https://questverse-space-explorer-lq3jd9k11-kapomtongs-projects.vercel.app
- tpgame.vercel.app — MCP ไม่มี alias tool, GH_TOKEN ใช้กับ Vercel API ไม่ได้, Vercel login blocked — รอ user login browser หรือบอกวิธีอื่น

## QA Checklist
- node qa_questions.js → 125; node repro.js → screens ครบ; browser flow เต็ม
