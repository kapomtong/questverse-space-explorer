# Task State — Boss Rush Academy (อัปเดตล่าสุด)

## สถานะผู้ใช้
- ผู้ใช้: ทำทั้งหมด (5 บอส+ไอเทม+Combo+Event+TimeAttack+Pet+Intro), "ฉันจะพักละ รันยาวไปเลย ตัดสินใจเอง", "โยนโค้ดให้ opus" → ผมทำ PM: ตรวจ/รวม/QA/deploy/push
- ภาพ 13/13 เสร็จแล้ว (ดู ASSETS_STATUS.md) — boss_kawi/lex/terra.webp, arena_*.webp, item_*.webp, event_*.webp, pet_mito.webp
- ตรวจภาพครบแล้ว สวยผ่าน

## โค้ดจาก Opus (4 รอบ)
- opus_out_v3/boss.js — boss engine ครบ 961 บรรทัด: BOSS_CONFIGS (5 บอส), class BossBattle(root,bossId) {mount(), cleanup(), gameLoop, updatePlayer, updateAttacks, updatePet, checkPadCollision, updateCampingDetection, events, combo, confetti, updateHPDisplay} — ใช้ BOSS_CONFIGS key mathos/chronos/kawi/lex/terra, QV.questions[subject].questions, QV.state.player.xp, QV.state.leaderboard, QV.state.boss?.item_selected, DOM: .j-base .j-stick (joystick), .answer-pad[data-index], .camping-warning, .hp-heart, .combo-counter
- ⚠️ v3 หยุดกลาง showVictory() บรรทัด 961 (inner `<button ...onclick="QV.app.navigate('boss-hall')">ก` ขาด)
- opus_out_v5/boss_new.js — tail ที่ Opus เขียนต่อ แต่มีบั๊ก: บรรทัด 1 ติดเศษ "ลับบ้าน</button>" (ต้องตัดออก + เติม `<` หน้าก), ใช้ ID ที่ไม่ตรง v3 (`#game-over-ui`, QV.app.currentView.mount(), this.config.image→ต้อง config.bossImg, this.config.baseXp→ไม่มีใน v3 config, this.config.attackInterval → config.baseDifficulty.attackInterval, QV.state.player.badges → v3 config ไม่มีการ์ด badges ใน player — v3 ใช้ leaderboard อย่างเดียว)
- opus_out_v4/bossHall.js (210 บรรทัด) + timeAttack.js (127 บรรทัด) + style_css.addition (471 บรรทัด CSS) — extract เป็น opus_out_v4/
- ⚠️ v4 ใช้ `const BOSS_CONFIGS` — ถ้า undefine ต้อง import จาก boss.js ที่โหลดก่อน (ใส่ <script src="js/boss.js"> ก่อนใน index.html)

## แผนรวมโค้ด — ความคืบหน้าล่าสุด
- ✅ boss.js: js/boss_new_base.js (opus v3 + tail fix เสร็จแล้ว: showVictory/showDefeat/cleanup/register QV.app.screens.boss) — syntax OK — เหลือตรวจสอบ: item shielded init (boss.js ใช้ gameState.item==='shield' → constructor ต้อง set shielded=true), maxCombo tracking, attackTimerId/eventTimerId/var names ตรงใช้ไหม (grep ใน base), energy cost per battle, timeLimit support (เวลา timeAttack) — v3 constructor ไม่มี timeLimit/attacks timer loop ตรวจสอบ gameLoop ว่ามี timer หรือ requestAnimationFrame ล้วน
- ✅ app.js contract = render(state,params)→html/null, mount(params), cleanup() (ใน js/app.js)
- ⏳ bossHall: js/bossHall_new_base.js ต้อง fix: (1) บรรทัด 1 missing `const BOSS_CONFIGS = window.BOSS_CONFIGS || [` — grep พบ `const BOSS_CONFIGS = window.BOSS_CONFIGS || [` ที่บรรทัด 1 ตาม grep ก่อนหน้า? ตรวจอีกที; (2) mount(root,params)→ต้องเปลี่ยนเป็น render(state,params){this.root=document.getElementById('app');...} mount(params){this.attach?} — แปลง: render(state,params){this.root=getElementById('app');this.renderBody()} mount(params){this.attachEventListeners? already in render} — ใช้ pattern: render(state,params){this.render()} + mount(params){/* attach events อยู่ใน renderแล้ว ทำอะไรเพิ่ม*/}; (3) QV.app.navigate('time-attack') → QV.app.show('time-attack'); (4) QV.state.save() → QV.saveState(); (5) energy bar — player.energy = QV.state.energy/10 (energy 10 heart) — แสดงเป็น hearts แทน % หรือใช้ QV.state.energy; (6) BOSS_CONFIGS map ใช้ fields ครบ — v3 config ใช้ BOSS_CONFIGS[bossId] (object) แต่ bossHall ใช้ BOSS_CONFIGS.find — ต้องเป็น array หรือ Object.values — เปลี่ยนเป็น const BOSS_LIST = Object.values(BOSS_CONFIGS)
- ⏳ timeAttack: js/timeAttack_new_base.js — mount(root,params)→convert เป็น contract; new BossBattle(root,bossId,{timeLimit:90,onAnswer:...}) — v3 BossBattle constructor ไม่รับ options!! → ต้องแก้ v3 constructor ให้รับ options.timeLimit + option callbacks onAnswer/timeUp แล้ว in gameLoop ลด timeRemaining, win at 10 questions/time bonus; ปิด timeAttack: victoryXP = base + timeRemaining
- ⏳ CSS: opus_out_v4/style_css.addition (471 lines) — cat เข้า style.css (ตรวจสอบไม่ซ้ำ class เดิม: .boss-hall,.boss-card,.intro-cutin,.pet-mito,.boss-arena,.boss-hud,.answer-pad,.pad-core,.camping-warning,.combo-counter,.boss-player,.j-base,.j-stick — ถ้าซ้ำให้เก็บส่วนใหม่)
- ⏳ index.html: เพิ่ม <script src="js/bossHall.js"><script src="js/timeAttack.js"> (หลัง boss.js) — ตรวจ script order เดิมก่อน
- ⏳ app.js: เปลี่ยน route default จาก 'map' → 'boss-hall' (ถ้า m1 player มีชื่อ) — ต้องทำให้ 'boss-hall' เป็นหน้าหลัก; 'map' ยังคงอยู่เป็น legacy route
- ⏳ QA: boss-hall (ล็อกบอส + ปลด), item select, สู้, victory, time attack
## ความคืบหน้าใหม่ (รอบนี้)
- ✅ boss.js เสร็จ: js/boss.js = boss_new_base.js (timeLimit/onTimeUp options, timeAttackBonus/showTimeUp, maxCombo, shield init, screen registration via QV.app.screens.boss render/mount/cleanup) — syntax OK
- ✅ js/bossHall.js rewritten (screen 'boss-hall', BOSS_LIST = Object.values(window.BOSS_CONFIGS), app.js contract render/mount, nav=QV.app.show, energy=QV.state.energy hearts, badge check boss-${id})
- ✅ js/timeAttack.js rewritten (intro page, BossBattle with timeLimit/onTimeUp, result screen)
- ✅ index.html: added bossHall.js + timeAttack.js after boss.js
- ✅ app.js: default route 'map' → 'boss-hall'
- ⏳ CSS: opus_out_v4/style_css.addition (471 lines, Boss Hall/Item Select/Time Attack styles) — cat เข้า style.css (ไม่มี class ซ้ำกับเดิม — grep ยืนยันแล้ว .boss-hall .boss-card ไม่มีใน style.css เดิม)
- ⏳ QA: http://localhost:8777/?r=250 — landing/create character → boss-hall → locked bosses (100/250/450/700 XP) → item select → battle (w key) → victory → defeat → time-attack
- ⏳ Deploy: python3 make_vercel_payload.py && python3 shrink_payload.py && manus-mcp-cli tool call deploy_to_vercel --server vercel --input-file vercel_deploy_input.json; production = https://questverse-space-explorer.vercel.app (domain tpgame.vercel.app)
- ⏳ GitHub: git add -A && git commit -m "Boss Rush Academy: boss hall, 5 bosses, items, combo, events, time attack, pet, intro" && git push origin main

## โครงสร้าง v3 ที่ต้องรู้ (สำหรับ fix)
- gameState: player{x,y,hp,maxHp}, boss{hp}, score, xp, combo, maxCombo, attacks[], padPositions[], nextAttackTime, nextEventTime, eventCountdown, campingDetection{positionHistory,warningShown}, timeLimit, timeRemaining, item
- boss config fields: id,name,subject,difficulty,requiredXP,arenaBg,bossImg,introCutIn,victoryMsg,defeatMsg,attackTheme{fireball:{color,name},ice,portal},baseDifficulty{attackInterval,firstAttackDelay}
- v3 ใช้ var: this.joystickEl, this.arenaEl, this.rafId, this.lastTime, this.gameState, this.config
- victory ใน v3: victory.className='boss-result victory', victory.innerHTML h2 img p p.score button.btn.btn-gold onclick="QV.app.navigate('boss-hall')"
- app.js เดิม: QV.app.show(screenName, params), QV.app.screens, QV.app.currentScreen, QV.loadState/saveState, QV.refreshEnergy, QV.state.player.xp/name, QV.state.energy, route params: app.show('boss',{bossId:'mathos'}) — CHECK syntax จริงใน app.js ก่อนใช้

## Deploy
```bash
cd /home/ubuntu/questverse-game && python3 make_vercel_payload.py && python3 shrink_payload.py && manus-mcp-cli tool call deploy_to_vercel --server vercel --input-file vercel_deploy_input.json
git add -A && git commit -m "..." && git push origin main
```
- production: https://questverse-space-explorer.vercel.app
- Local server: python3 -m http.server 8777 (session: main/diag/check — kill ก่อนถ้าตาย)

## Opus API notes
- claude-opus-5 streaming SSE — call_opus.py (stream parser) ทำงาน
- ต้องเติม "ห้ามใช้ tool" ใน prompt ไม่งัน stop_reason=tool_use
- max_output 64000 tokens; รอบละ ~30K chars ตอบได้
- Image API: gpt-image-2 + User-Agent header (gen_images.py)
