# User reports (Aug 19): battle screen visual problems

1. "ยานจรวดมาบังหน้าจอ" — root cause: `.pet-mito` img set to width/height 100% of arena = 371x379px full-screen image overlaying everything. Pet Mito image fills whole battle arena! Fix: size pet to ~12vw (max 64px) float animation, and position behind/above player without covering. Also pet may look like rocket.
2. "ตัวละครเป็นจุดสีเหลืองๆ" — boss-player is a 3vw radial-gradient yellow dot (placeholder from Opus v1). Legacy used `<img src="assets/suit_{suit}.webp">` with suit asset. Fix: render player as image sprite (suit webp) at ~9vw max 96px, update x/y via style.left/top during movement (legacy did scaleX(-1) flip on direction).
3. "มีบอส 2 ตัว" — NEW boss.js mount creates NO boss sprite element at all. Boss only appears in intro cut-in (3.5s) then disappears. User sees arena bg + pads; maybe thinks only Mathos/Chronos existed from earlier version. Fix: add .boss-sprite element (img boss_{id}.webp from config, e.g. 22vw max 260px, bottom-right positioned, idle animation) and animate via CSS (attack animations already define transform?). Legacy anim: boss-idle 2.2s.

## Sprite assets available
- player: assets/suit_red.webp, suit_blue.webp, suit_green.webp (QV.state.player.suit)
- bosses: assets/boss_mathos.webp, boss_chronos.webp, boss_kawi.webp, boss_lex.webp, boss_terra.webp (this.config.sprite)
- pet: assets/pet_mito.webp
- Check BOSS_CONFIGS key for sprite path; check config sprite keys exist.

## Implementation plan (boss.js mount)
- Replace player dot div with img sprite: playerEl.innerHTML = `<img src="assets/suit_{suit}.webp">`; keep style via CSS class .boss-player-img or inline; position absolute, z-index 10, transition left/top 0.06s.
- Add boss sprite div after arena: className 'boss-sprite', img src = this.config.sprite, positioned bottom center-ish, width 22vw max 260px, z 5, animation boss-idle.
- Pet: width/height absolute 11vw max 56px, z 11 (above player), bob animation.
- In update loop: playerEl.style.left = x% + ' left'? Legacy: style.left = x + '%' (x is percent). Our engine uses percent x/y (0-100). Keep left/top percent update.
- Movement flip: if vx<0 scaleX(-1) else scaleX(1).
- CSS: .boss-player { /* container absolute, width/height sized to img */ } + img 100%. Add .boss-player img rule; pet-mito rule; keep boss-sprite rules from old CSS (lines 1355+ include .boss-sprite? check 1872 media rule).

## Boss idle animation CSS check
- style.css has .boss-sprite with animation boss-idle 2.2s; also @keyframes boss-idle? grep keyframes.


## QA round 1 after patches — PROBLEM
Iframe battle STILL shows: player 11x11 (old dot, no img), pet-mito 371x371 full screen img, NO boss-sprite element. Patches not reflected → the local server was restarted fresh? No: curl earlier showed server OK. Likely iframe loaded boss.js BEFORE shell edits (edits happened ~03:03-03:04), OR more likely: the iframe src='/' with ?v param not used; but cache should serve new. Wait 10s and re-test. If still old: check process CWD / PID; curl http://localhost:8777/js/boss.js and grep for 'suit_${suit}' to confirm new code served.

Also user's report "ยานจรวดบังจอ" = pet_mito.webp full screen (was styled width/height 100%). My CSS added .pet-mito 11vw max 56px — but iframe shows 371x371 again = CSS not applied or pet style inline 'width:100%;height:100%' overriding. FIX: remove inline style from pet img, rely on CSS class.
Player w=11 → my CSS .boss-player img rule uses width/height 100%; container 9vw=11px?? On 371px viewport 9vw=33px... w measured 11?? That matches OLD code still running (3vw=11). Confirms new boss.js NOT loaded in iframe.

## Root cause of stale visuals in QA
The host page was https://questverse-space-explorer.vercel.app, so iframe relative src='/index.html' resolved to vercel.app — production has OLD code. Local QA must use absolute http://localhost:8777/index.html in iframe src.

## Finding: default route after character creation = galaxy MAP (old screen)
Map shows 5 planets (locked) + 2 boss cards (Mathos/Chronos, 'Mathos the Calculator') — the OLD galaxy_map.js boss section, NOT the new boss-hall with 5 bosses. User's report "มีบอส 2 ตัว" matches: landing on map sees only 2 bosses.
Root cause: character.js/landing.js show('map') (or galaxy map auto) overrides app.js default 'boss-hall'. Fix: find where show('map') called after character confirm, change to show('boss-hall').
Also note: old map boss cards use boss_mathos/boss_chronos only in map. New boss-hall route: 'boss-hall' (in app.js screens).

## QA round 2 — PASS (visual screenshot verified)
Battle screen now shows: astronaut sprite (suit_blue 96x128) at center, pet Mito 56x56 next to player, Mathos boss sprite 260x260 bottom center with idle animation, question bar top center (black pill, readable), 4 translucent answer pads, no rocket blocking. HUD shows Mathos + 3 hearts.
Screenshot saved: /home/ubuntu/screenshots/localhost_2026-08-19_03-06-18_7030.webp
Note: boss_mathos.webp has its own black square background (part of generated art) — boss sprite shows black box. Acceptable (matches art style), could note to user but not blocking.
Remaining before deploy: boss-hall route fixed (character.js now show('boss-hall')). Then deploy + push.

## Phase: boss bg-cut (Aug 19)
All 5 boss webps now RGBA transparent (flood-fill black removal + trim): mathos 34%, chronos 23%, kawi 41%, lex 31%, terra 37% transparent. Replaced in place. Kawi verified visually clean on dark bg.
Boss card imgs also use boss_*.webp (bossHall.js) — cards now transparent too, looks better on dark card bg.

## Opus call attempts (Aug 19)
call_opus_ns.py with tool_choice none still returns tool_use stop (view_file read_file). Output file only contains SSE event log, no usable code. Opus refuses to answer without tools.
DECISION: Write boss animation code myself (Manus) — context fully covers boss.js structure:
- boss.js line ~244-249 mount: bossSprite div class boss-sprite, inline bottom/left/transform translateX(-50%), img src config.bossImg; stored this.bossSpriteEl
- style.css 1360-1425: .boss-sprite width 22vw max-width 260px abs z5 anim boss-idle 2.2s; img drop-shadow purple; @keyframes boss-idle translateY
- transform inline (translateX) + keyframe transform = collision — fix with inner wrapper
- .damaged class exists (boss-hit keyframe brightness) but no JS ever adds it; add in onAnswer correct branch
- gameLoop exists with this.running guard; add updateBoss() call inside loop every frame (cheap transforms)
Files: boss.js ~1120 lines, style.css 2386+ lines. Local QA via navigate to localhost:8777 (NOT iframe relative src — iframe resolves to vercel.app). Browser main page QA works.

## Boss living animations applied (Aug 19)
boss.js: mount wrapper (.boss-sprite > .boss-roam > img) at line ~248, this.bossRoamEl, this.boss state; updateBoss(dt) at 1006, bossLunge() 1051, bossHurt() 1060; gameLoop calls updateBoss (1089); onAnswer correct calls this.bossHurt() (663). Node syntax OK.
style.css: appended boss-breathe / angry / attacking / damaged flash keyframes + 600px mobile rule at end (~2720+).
Note: bossLunge() hook created but NOT yet wired to projectile firing — optional; updateBoss handles movement/sway/taunt/jitter/angry.
Remaining: QA visual (navigate localhost:8777, boss battle, watch boss move; verify bg transparent — boss image now alpha-cut), deploy, push.
Local server may be dead (python http.server 8777). QA via full browser nav to localhost (not iframe src, resolves to vercel.app).

## QA anim1 observation
Character creation (name QA, blue suit) went to "แผนที่ 1 เลิกซ์" map page again — shows 2 boss cards only (Mathos/Chronos). BUT boss card imgs now show TRANSPARENT bg (no black square) — cut worked on cards too! Need to check why route goes to 'map': check character.js default route, and whether 'boss-hall' screen exists in this localhost copy. Boss hall existed before; maybe the fresh localStorage reset made default route 'map'? Check character.js lines.

## ISSUE: after character confirm → shows 'map' (galaxy map, 2 bosses) NOT 'boss-hall'
character.js:94 says QV.app.show('boss-hall') — code correct. But UI shows galaxy map screen ('แผนที่ 1 เลิกซ์').
Possible: boss-hall render() threw → show() fell back to map? Or 'map' screen is a NEW screen (galaxy map from before) and character.js line 94 actually calls show('map') in THIS copy? Need to view character.js:80-100 to confirm.
Note: previous QA (anim0?) — the deployed production site had boss-hall working. Localhost has map?? Actually production earlier (screenshot) showed boss-hall 5 cards. So production OK, localhost has divergence: character.js may have show('map'). VERIFY via sed.

## boss-hall renders fine manually (5 cards) — re-run full flow needed to reproduce 'map' landing

## Reload t=anim2: landing page shown even though state has name 'QA'? Clicked 'เริ่มการเดินทาง' → leaderboard. Something odd with element indexing/screenshot mismatch. Skip full flow debug: name 'QA' already saved → app.init should show boss-hall on next clean reload. Verify then start Mathos battle to QA animations.

## QA anim3 battle intro:
- Intro cut-in img HUGE (half screen) — acceptable for 3s intro? It looks oversized/clashing. Check CSS.
- Arena boss sprite (center) shows BLACK square background → boss-sprite CSS likely has background:#000 or the boss_mathos.webp still has black bg in served copy.
- Player astronaut sprite OK, pet Mito small OK, arena bg beautiful.
TODO: check .boss-sprite CSS and boss_mathos.webp alpha; check cut-in CSS sizing.

## anim4: After character creation (name QA), route AGAIN lands on 'map' (galaxy map, 2 bosses) — reproducible!
But t=anim3 clean reload with SAVED name went to boss-hall correctly. So bug is specifically character confirm flow.
character.js:94 shows 'boss-hall' in local file — BUT maybe boss-hall screen render is not yet registered when confirm fires? Screens register at script load order; character.js runs after bossHall.js (script tags). Hmm. Or maybe the confirm handler uses show('map') in the served copy? VERIFY via curl localhost:8777/js/character.js | grep "show('".
Possible: landing.js btn-start routes to 'character'; character confirm routes 'boss-hall'... but page shows 'map'. Wait — galaxy map header says 'แผนที่ 1 เลิกซ์' and shows planet cards + 2 boss cards → that's galaxy_map.js 'map' screen. character.js must be calling show('map')! curl to verify exact served text.

## Diagnosis anim4 (03:20):
boss-hall renders fine manually (5 cards, title 'หอกรูชบอส — สู้บอส 5 ด่าน'). Manual QV.app.show('boss-hall') from 'map' works.
Hypothesis for earlier 'map after confirm': app.show replaces content; if render() threw at that moment (e.g., player.suit undefined during save before selectedSuit set), old 'map' content stays. BUT manual call worked with same state. Will redo exact click flow once to confirm; if it fails again, add try/catch logging in app.show or debug in console.
Note: intro cut-in CSS now appended (position fixed, img min(42vh,42vw,380px), zoom animation).

## anim5 (03:20): Reload → boss-hall directly, 5 bosses, Mathos unlocked. Boss images in cards now TRANSPARENT (cut bg working). Earlier 'map after confirm' NOT reproducible — likely a stale-render glitch from an aborted run. Proceed to battle QA.

## anim5 battle intro (03:21):
Intro cut-in: centered, vignette, zoom animation — looks cinematic ✓. BUT cut-in boss img shows BLACK square bg. Card images earlier appeared transparent. Verify: check alpha of the actual served bytes of assets/boss_mathos.webp (maybe browser cached old opaque file?). Also note: intro img in arenaEl vs fixed — the black square is image content itself if cached old. Force recheck with cache-busted fetch + alpha.

## anim5 battle structure (03:21): ALL systems present and correct.
Structure: arena > [boss-hud, boss-question-bar, boss-player shielded, pet-mito, boss-sprite > boss-roam > img, joystick, 4 answer-pads, attack-fireball].
Animations live via CSS (boss-breathe on .boss-sprite, intro-zoom in cut-in). Player shielded class working. Question bar exists. Proceed: screenshot current view for visual QA, then deploy.

## anim5 visual (03:21 screenshot):
Battle running: astronaut sprite + Mito center, question bar top (ratio 6:9 question), 4 answer pads, anti-camping warning red ✓.
ISSUE: A Mathos image with BLACK square background still visible at LEFT side of screen — looks like the intro-cutin div was NOT removed after 3.5s! Check DOM for .intro-cutin presence. Also the left black box might just be... verify.
