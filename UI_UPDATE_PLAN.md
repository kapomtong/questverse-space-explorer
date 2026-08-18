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

## QA local (r=40) — 10:59 — พบปัญหาภาพ bg mission ไม่แสดง
- ✅ เศษส่วน setแนว + timer + items + hint ทำงาน
- ❌ ฉากหลังก่อนตอบแสดงเป็น dark ธรรมดา — ภาพ bg ไม่แสดง (data-bg มีค่า, mount set --mission-bg)
- สาเหตุสันนิษฐาน: CSS background shorthand ไม่รับ var ใน layer list อย่างคาดหมาย → ต้องตรวจว่า CSS .screen-mission ใช้ var(--mission-bg) ตรงไหน หรือ mission.js set inline backgroundImage ตรง (ซึ่งผมเพิ่งแก้เป็น set --mission-bg) และ CSS เดิม hardcode url('../assets/mission_bg.jpg') → ตอนนี้แสดง landing_bg ที่เป็น copy เดิม...แต่ใน screenshot จอ dark แปลว่า CSS อาจ override ไม่ทำงาน หรือ mount ยังใช้ code เก่า (รัน cache?) — reload ?r=40 แล้ว
- แก้ถัดไป: ตรวจ CSS ของ .screen-mission (grep lines 442-470) — ให้ use `background-image: linear-gradient(..), var(--mission-bg, url('../assets/mission_bg.jpg'))` แยกจาก background-color

## รอบ 5 — ภาพไอเทม/ยานจาก user (11:00)
- user ส่งภาพไอเทม 3 + ยาน บนพื้นแมเจนต้า (จาก upload/) — ลบแมเจนต้า+crop+resize+webp เสร็จแล้ว:
  - assets/item_shield.webp (256), item_compass.webp (256), item_telescope.webp (256), explorer_ship.webp (512) — ขอบสะอาดดี (glow ม่วงอ่อน เหลือนิดที่ขอบ shield/ship ดู OK)
- user บอก: "เอาจุดนั้นไปใส่ — ถ้าจะแก้ code โยนให้ Opus ทำได้" — หมายถึงแก้ bg mission code ให้ Claude Opus ผ่าน API (call_claude.py)
- config.js ITEM_DEFS image path เดิมเป็น .svg — ต้องเปลี่ยนเป็น .webp (item_shield.webp ฯลฯ) + explorer_ship.webp
- index.html/landing.js อ้าง explorer_ship.png — ต้องเป็น .webp
- mission.js: mount set --mission-bg แต่ CSS .screen-mission (บรรทัด 442-447) ใช้ `background: ...var(--mission-bg, url('../assets/mission_bg.jpg')) center/cover no-repeat fixed` — จาก console: resolvedBg = url("http://localhost:8777/mission_bg_numberon.jpg") ผิด path! ขาด assets/ เพราะ replace path ใน mission.js: `'../' + bg.replace(/^assets\//, '')` → bg='assets/mission_bg_numberon.jpg' → '../mission_bg_numberon.jpg' → ผิด path
  - **แก้:** ใช้ `url('${bg}')` (bg อยู่แล้ว = assets/xxx) — แต่ URL resolve จาก index.html root คือ /assets/xxx.html? ไม่ — index.html ที่ root, mission.js ชี้ ../assets? ไม่ — bg path ควรเป็น absolute `/assets/mission_bg_numberon.jpg` หรือ `assets/mission_bg_numberon.jpg` (จาก root)

## รอบ 6 — Minigame + deploy (11:10)
- minigame.js (QV.screens.minigame: จับคู่ดวงดาว 4x4, 45วิ, ชนะ +1 ใจ +30 XP, แพ้ +10 XP, 3 ครั้ง/วัน) + CSS ท้าย style.css + game_state.js (minigameRemaining/getMiniGamePlays/minigamePlay) + config.js (minigamePlays ใน newState) + mission.js (ปุ่ม energy น้อย + ปุ่ม minigame) + galaxy_map.js (⚡ ฟื้นพลังงาน ใน energy-hearts เมื่อ energy<=0) + landing.js guide + index.html (minigame.js ก่อน leaderboard) — node --check OK ครบ
- QA local map ปกติ: player "น้องทดสอบ" XP 50 โซน 3/5 เลข, energy 4/5
- เหลือ QA: ฉากหลัง mission ตามดาว (numberon zone3), ไอเทม webp, minigame flow, summary
- local server 8777 รันแล้ว

## QA ตรวจ (11:11)
- ✅ ฉากหลัง mission ตามดาว: --mission-bg = url('assets/mission_bg_numberon.jpg') โหลดจาก /assets/ ถูก path — ภาพ numberon (ดาว + ตัวเลข + จรวด) แสดงสวย
- ✅ ไอเทม webp แสดงใน items bar (item_shield.webp ฯลฯ) — added <img class="item-icon"> ใน renderItems
- ✅ timer, progress dots, คำใบ้, hit/wrong ทำงาน
- ❓ คำถาม 5²×5³ zone3 แสดง ansIdx=0 (5⁵) — user ตอบ 5⁶ แล้วระบบบอก "ผิด!" — ตูเองตอบผิด (ตอบ 5⁶ = index1 ผิด) = ทำงานถูกต้อง ไม่ใช่ bug
- energy ตอนนี้ 3/5 (ทดสอบ zone ต่อจะไปจน 0 เพื่อดู minigame) หรือตั้ง localStorage energy=0 ตรงๆ
- ถัดไป: ทดสอบ minigame flow (ตั้ง energy=0 หรือผ่าน zone จน energy หมด)

## QA minigame (11:12)
- ✅ map energy=0 → ป้ายสถานะแสดง 🤍5ดวง + ปุ่ม "⚡ ฟื้นพลังงาน" (btn-map-minigame) — ทำงาน
- ✅ เข้า minigame ได้: ⚡ Stellar Harvest, การ์ด 4x4, timer 44วิ, info chips (❤️+1 ใจ / ✨+30 XP / 🕐45วิ / 🔄เหลือ3ครั้ง), จับคู่ 0/8
- ❌ พบบกพร่อง: timer bar fill เขียวล้นเลยแถบ (overflow — timer-bar-track height 12px แต่ fill แสดงยืดเกิน, แถบ fill กว้างเกิน track, timer text "เวลาเหลือ: 455" ตัด) — ตรวจ CSS: .screen-minigame .minigame-timer ใช้ .timer-bar-track ของ mission (height 12px OK) แต่ fill กว้างเกิน = ไม่มี overflow:hidden บน .timer-bar-track ของ minigame? (mission timer-row ใช้ .timer-bar-track เดิม) — จริงๆ fill width 98% ของ track — ใน screenshot เหน็บ fill กินแนวตั้งเกิน? ไม่ — ภาพแสดง fill ยืดถึงขอบขวาเกิน (455 ตัดข้าง) — อาจเป็นเพราะ .timer-row ของ mission มี max-width:520px + margin auto แต่ .minigame-timer ซ้อน class เดิม → timer-bar-track มี flex:1 → width เป็น 0 เพราะไม่มี parent flex? ตรวจ: .minigame-timer ครอบ .timer-bar-track — track เป็น flex? ใช่ flex:1 → ใน container ไม่ใช่ flex มัน stretch เต็ม
- ไขโค้ด: minigame CSS .screen-minigame .minigame-timer {max-width:520px;margin:0 auto 18px;} — track width 100% ควร ok — แต่ screenshot แสดง fill เกิน → ปัญหาจริง: .timer-bar-track มี flex:1 ใน .timer-row (mission) → ใน minigame container เป็น flex? .timer-row display:flex → fill กินความกว้าง flex 100% ของ .minigame-timer=440px — ไม่ควรมีปัญหา...ต้อง reload ตรวจอีกที (อาจเป็น screenshot timing)
- ถัดไป: เล่นจับคู่ 1 คู่ ตรวจ matched + test win modal, ตรวจ timer bar อีกครั้ง
- หลัง QA: deploy (make_vercel_payload.py → shrink → deploy_to_vercel MCP) → URL https://questverse-space-explorer.vercel.app
