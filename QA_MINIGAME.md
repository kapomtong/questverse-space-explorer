# QA Minigame — สรุปผลการวัด DOM

- trL=380, trR=900 (กว้าง 520), trackL=416, trackR=736 (320px), secL=748 → layout ปกติ, fill ไม่ล้น (fillR=545 < trackR=736)
- timerText เต็ม "⏳ เวลาเหลือ: 22วิ" (ไม่ถูกตัดแล้ว — min-width 110px + nowrap)
- สิ่งที่เห็นใน screenshot ว่า "เขียวยาว" = ภาพ track ปกติที่ขยายเต็ม 320px (เดิมภาพแคบ 320 ในจอ 1280 ดูยืนยันได้) — ไม่มี bug
- เหลือตรวจ: เล่นจับคู่จนชนะ/แพ้ → +1 ใจ / modal + energy refresh → deploy

## QA รอบ 2 (11:16) — สรุป
แก้ bug สำคัญ 2 จุดใน minigame.js:
1. **Timer bar CSS** (style.css บรรทัด 1136-1150): add `.screen-minigame .minigame-timer {justify-content:center}`, `.minigame-timer .timer-bar-track {flex:0 0 320px; width:320px}`, `#minigame-timer-text {flex:0 0 auto; white-space:nowrap; min-width:110px}` → timer bar + "เวลาเหลือ: Xวิ" แสดงครบ ไม่ล้น ไม่ถูกตัด (วัด DOM ยืนยัน: track 320px, fill < track, sec 117px ล้วนใน 520px)
2. **Exploit ควอต้า**: เดิม retry ไม่นับควอต้า → เล่นฟรีไม่จำกัด + finish-btn/giveup-btn ไม่ได้ bind (element ถูกสร้างใน endGame หลัง mount → addEventListener ใน mount ไม่เจอ element) — แก้โดย bind handler ใน endGame ทันทีหลังสร้างปุ่ม + ลบ retry (แพ้ = จบรอบ นับ 1 ควอต้า ได้ XP+10)
3. ผล bind fix: win → minigamePlay(state,true) → energy+1, xp+30, saveState, back to map + toast; lose → minigamePlay(state,false) → xp+10, นับควอต้า, back to map + toast

สถานะการทดสอบล่าสุด: หลังกด finish (รันท่าน fix แล้ว) ตรวจ localStorage ยัง energy=0, plays={} — แต่ fix ใหม่ยังไม่ได้ reload ทดสอบ! ต้อง reload ?r=64 แล้วทดสอบอีกครั้ง
หลัง test OK → deploy: cd /home/ubuntu/questverse-game && python3 make_vercel_payload.py && python3 shrink_payload.py && manus-mcp-cli tool call deploy_to_vercel --server vercel --input-file vercel_deploy_input.json
URL production: https://questverse-space-explorer.vercel.app

## QA รอบ 3 (11:19) — Bug ยังหลอกหลอน
หลังกด hard reload + ทดสอบใหม่อีกครั้ง: modal ชนะเปิด, finish-btn แสดง, แต่คลิก index 17 แล้วยังไม่เกิดอะไร (screenshot ยังค้าง modal)
ไฟล์ minigame.js ใหม่ (จาก fetch) มี handler finish ถูก bind ใน endGame แน่นอน
**สมมติฐานที่เหลือ**: app.js — QV.app.show('map') อาจ fail เพราะ updatePlayerStatus? ไม่ — energy ไม่เปลี่ยน แปล minigamePlay ไม่ถูกเรียก
**ตรวจ**: finishBtn ใน endGame closure ใช้ `state` — state = QV.state ตอน mount (บรรทัด 245) → ควรถูก
**สิ่งที่ควรทำต่อไป**: 
1. ตรวจ console error หลังกด finish
2. ลองทดสอบโดย: hard reload page → ไป minigame → กด finish ด้วย element.click() ใน console พร้อม try/catch log ทุกบรรทัด
3. สงสัย: ปุ่มอยู่ใน #minigame-result ซึ่งมี class .minigame-result-modal — CSS อาจ pointer-events:none บน modal เอง? ตรวจ style.css: .minigame-result-modal pointer-events
4. หรือ: btn คุณสมบัติ disabled? (class btn.btn-primary ปกติ)
5. อย่าลืม: การทดสอบใน browser sandbox อาจใช้ร่าง cache ของ script — ควร append cachebuster (?v=xxx) ใน index.html ชั่วคราว
Deploy checklist หลัง QA OK:
- cd /home/ubuntu/questverse-game && python3 make_vercel_payload.py && python3 shrink_payload.py
- manus-mcp-cli tool call deploy_to_vercel --server vercel --input-file vercel_deploy_input.json
- URL: https://questverse-space-explorer.vercel.app

## QA รอบ 4 (11:22) — state clean
- set energy=0, plays={}, xp=50 → reload → map แสดง ⚡ ฟื้นพลังงาน ✓
- เข้า minigame → dispatchEvent click ครบ 16 ใบ → จับคู่ 8/8 (modal ยังไม่ render เพราะ 900ms flipAllBack) — รอกด finish
- ทดสอบต่อ: รอ modal แล้วกดยึด finish-btn
- หลังกด finish ตรวจ: energy=1, xp=80, plays today=1, screen=map

## QA รอบ 5 (11:24) — สถานะก่อน compact
**ผล test สำเร็จ:** direct call minigamePlay+show('map') → energy 0→1, xp=80, plays={"2026-08-18":1}, map แสดงหัวใจแดง 1 ✓
**bug เหลือ:** finish-btn ใช้ addEventListener บน element ที่ replace ใน endGame (innerHTML ซ้ำ — endGame win + timer ≤0 ซ้อน — ปุ่มสุดท้ายคือ giveup-btn หรือ finish-btn แล้วแต่ลำดับ) → click ไม่ทำงานในการทดสอบ
**การแก้ (กำลังทำ):** ใช้ event delegation บน #minigame-result-buttons + data-action="finish"/"giveup" บนปุ่ม — ผูกตอน mount เท่าที่นั้น
**ไฟล์:** js/minigame.js (บรรทัด ~145-167 = endGame, บรรทัด ~244 = mount)
**หลังแก้ QA:** reload → energy=0 → minigame → win (auto-capture) → กด finish → ตรวจ energy=1, plays=1
**งานไอคอนการ์ด (รอ user เจน):** 8 ภาพ 1:1 พื้นแมเจนต้า #FF00FF ล้วน — card_star(🌟), card_sparkle(✦), card_comet(☄), card_moon(🌙), card_nebula(🌠), card_starcluster(🌟3ดวง), card_telescope(🔭), card_doublespark(💫) — user ส่งมา upload/ — ใช้ remove_magenta.py (assets/) แปลง webp → แทนที่ emoji ใน .minigame-card-back (JS: EMJOIS array หาใน minigame.js) — ที่ใช้: 🌟⭐🌠💫🌙✨☄️🔭
**deploy:** cd /home/ubuntu/questverse-game && python3 make_vercel_payload.py && python3 shrink_payload.py && manus-mcp-cli tool call deploy_to_vercel --server vercel --input-file vercel_deploy_input.json
**URL:** https://questverse-space-explorer.vercel.app

## QA รอบ 6 (11:27) — SUCCESS
- Fix ทำงาน: event delegation บน #minigame-result-buttons + data-action finish/giveup + กัน endGame ซ้ำ (if !gameActive return)
- Win flow สมบูรณ์: energy 0→1, XP 80→110 (+30), plays={"2026-08-18":1}, rank ขึ้น "คัพตัน", map แสดง ❤️ 1 ดวง ✓
- ถัดไป: QA ไหล full flow อื่น ๆ (ฉากหลังตามดาว, ไอเทม webp) → deploy

## สถานะไอคอนการ์ด (11:28)
- User ตัดสินใจไปเจนภาพ 8 ชิ้นเอง (prompt ส่งให้แล้ว — พื้นแมเจนตา #FF00FF ล้วน 1:1)
- เมื่อ user ส่งภาพมา: copy ไป /tmp ตามชื่อ card_*.png → รัน remove_magenta.py (assets/remove_magenta.py แปลง webp เข้า assets/) → แก้ minigame.js: EMJOIS array + render .minigame-card-back จาก img แทน emoji → CSS .minigame-card-back img
- deploy ทันทีหาก user ไม่รอภาพ: ถ้า user รอ deploy หลังมีภาพ
- QA full flow แล้ว deploy รอบสุดท้าย: make_vercel_payload.py → shrink_payload.py → manus-mcp-cli deploy_to_vercel --server vercel --input-file vercel_deploy_input.json (teamId team_M57w1DW5EdqJADbOQsFLkJPK projectId prj_sZAMieVaazfOEo1yEAxaaTjdBbgP)

## ผลตรวจภาพการ์ดหลังก่อน (256x256 webp, transparency)
| ไฟล์ | สถานะ |
|---|---|
| card_goldstar.webp | ❌ ภาพดาวทองมีฉากอวกาศ (จากภาพแรก user ส่ง พื้นอวกาศไม่ใช่แมเจนตา) — ยังไม่ได้ตัด — ต้องใช้ภาพ card_goldstar.png ต้นฉบับ (1024px) ตัดเองแบบ chroma หรือใช้ภาพ goldstar ตัวใหม่ |
| card_sparkle.webp | ✅ ดี (cyan sparkle 4 แฉก) |
| card_comet.webp | ✅ ดี (ดาวตกส้มทอง) |
| card_moon.webp | ✅ ดี ขอบ glow ชมพูอ่อน OK |
| card_star3.webp | ✅ ดี ขอบชมพูอ่อน OK |
| card_nebula.webp | ✅ ดี (purple-pink ไม่โดนถูก) |
| card_telescope_icon.webp | ✅ ดี ขอบม่วง OK |
| card_doublespark.webp | ✅ ภาพแรก user ส่ง (doublespark) ขอบ glow ชมพู |

**สรุป:** 7/8 ภาพดี ✅ เหลือ **card_goldstar — ❌ ภาพแรกที่ user ส่งมาพื้นเป็นฉากอวกาศ ไม่ใช่แมเจนตา** → ต้องขอ user เจนดาวทองใหม่พื้นแมเจนตา หรือใช้ภาพ goldstar อื่น

**แผนต่อไป:**
1. แทน emoji ใน minigame.js (EMOJIS array) → img assets/card_*.webp 8 ไฟล์ (goldstar ยังไม่ได้ — ใช้ emoji 🌟 ชั่วคราวหรือ wait user)
2. CSS .minigame-card-back img {width:100%; height:100%; object-fit:contain}
3. QA minigame + deploy รอบสุดท้าย

## QA รอบไอคอนใหม่ (r=70, 11:40)
- ✅ หน้า minigame โหลดครบ 16 ใบ — img src card_*.webp ครบ 8 แบบ (goldstar, moon, sparkle, comet, nebula, telescope_icon, star3, doublespark) — 2 ใบ/แบบ ✓
- ✅ ⚡ ฟื้นพลังงาน แสดงบน map ตอน energy=0 ✓
- ⚠️ timer text แสดง "⏳ เวลาเหลือ: 455" — ตัดเลข "วิ" (min-width ของ sec น้อยไป) — แก้ CSS: #minigame-timer-text min-width เพิ่ม / timer-sec font-size เล็กลง
- ⚠️ CSS fix timer รอบก่อน (QA รอบ 2: .screen-minigame .minigame-timer center + track 320px + min-width 110px) อาจหายไป — ตรวจ style.css บรรทัด ~1136-1150
- เหลือ: ทดสอบพลิกการ์ดเห็นภาพ → auto-win → finish → ตรวจ timer text → deploy
- หมายเหตุ: card_goldstar.webp เดิม (ฉากอวกาศ) ถูกแทนแล้ว — user ส่งภาพใหม่พื้นแมเจนตา (gpt-image-2-1787052824-1.png → /tmp/card_goldstar.png → assets/card_goldstar.webp ✓)

## QA รอบ 7 (11:41) — คลิกอัตโนมัติไม่ทำงาน
- ส่ง dispatchEvent click 16 ใบ (700ms) → timer 45→18 → 7 → grid ยังเป็น "?" ทั้งหมด (0/8) — การ์ดยังไม่ flip!
- timer text ตอน 45 → 18 แสดง "⏳ เวลาเหลือ: 18วิ" ครบถ้วน ✓ (หลัง CSS fix แล้ว)
- สาเหตุ: minigame-card click อาจใช้ .querySelector ภายใน card หรือ event delegation บน #minigame-board ต้อง click บน element เดียว (minigame-card .minigame-card-back? หรือ event.target ต้องเป็น specific) — ตรวจ minigame.js handleCardClick (อาจใช้ event.currentTarget ok) — หรือ "locked" flag ไม่ปลด? ตรวจ log: อาจเพราะ dispatchEvent ไม่ผ่าน event delegation (element delegation ใช้ click bubbles — ควรผ่าน) — แต่ทำไม 0/8? — ตรวจ selector ใน minigame.js
- เดิม QA รอบ 6 auto-win ทำงาน! แต่รอบนั้นใช้ code แบบเดียวกัน (16 ใบ 700ms) — ตรวจว่า code เดิมใช้ .minigame-card หรือ .card? + grid wrapper id ใด

## QA รอบ 8 (11:47) — QA สมบูรณ์ ทุกเคสผ่าน

| เคส | ผล |
|---|---|
| Auto-win (click ตามคู่ data-card-id 120ms/ใบ) | matched 8/8 → modal 🎉 ชนะ → finish-btn → energy 0→1, xp +30, plays 1, กลับ map ✓ |
| Lose (ไม่คลิกเลย 45วิ) | timer 45→0 → modal 😢 เวลาหมด → giveup-btn → xp +10, กลับ map ✓ |
| Timer text | "⏳ เวลาเหลือ: 44วิ" ครบถ้วน ไม่ตัด ✓ |
| ภาพไอคอน | img src card_*.webp แสดงทั้ง 16 ใบ ✓ |

สาเหตุที่ QA รอบ 7 คิดว่า auto-win ไม่ทำงาน: 700ms/ใบ ช้าไป (45วิหมด) + ผมตรวจ modal ก่อน 900ms delay — ไม่ใช่ bug
**สรุป QA: ทุกระบบทำงานถูกต้อง — พร้อม deploy**
