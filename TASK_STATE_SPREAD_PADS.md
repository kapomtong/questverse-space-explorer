# TASK STATE: Spread Answer Pads + Shuffle Per Question (User Request 2026-08-18)

## User Request
1. กระจายป้ายคำตอบให้ไกลกันมากขึ้น (ไม่ใช่ 2x2 กระจุกตรงกลาง)
2. มีระบบกันคนยืนแช่ — สุ่มตำแหน่งป้ายใหม่ทุกครั้งที่เปลี่ยนข้อคำถาม

## Current Architecture (boss.js)
- `CONFIG.PADS`: 4 ตำแหน่ง `{x,y}` % ของ viewport — ปัจจุบัน: `[{x:55,y:55},{x:75,y:55},{x:55,y:72},{x:75,y:72}]`
- `CONFIG.PLAYER_RADIUS`: 2.2 vw
- `CONFIG.PAD_RADIUS`: 4.5 vw
- `CONFIG.PAD_ANSWER_CORE`: 2.2 vw
- `CONFIG.ANSWER_HOLD_TIME`: 800 ms
- `CONFIG.MOVING_THRESHOLD`: 3 (%/s)
- `CONFIG.PLAYER_SPEED`: 24 (%/s)
- `checkPadCollision()`: iterate answerPads (มี dataset.answerIdx), คำนวณ distance vw, ตรวจ isStandingStill (speedVw < MOVING_THRESHOLD), ถ้า onCore → เริ่ม hold, ถ้า hold ครบ ANSWER_HOLD_TIME → `onAnswer(padIdx)`
- `loadQuestion()`: เรียกทุกข้อ, สร้างข้อความคำถาม + choices, assign answerIdx ให้ pads — ป้ายอยู่กับที่
- `BOSS_DATA`: mathos {x:12,y:15}, chronos {x:12,y:15}
- Player start: {x:57.5, y:88}
- ARENA_BOUNDS: {minX:2,maxX:94,minY:2,maxY:94}

## Plan: Spread Pads + Shuffle
1. เพิ่ม `CONFIG.PAD_SLOTS`: 8 ตำแหน่งรอบสนาม (กระจายไกล) — เช่น:
   ```js
   [{x:12,y:35},{x:38,y:25},{x:70,y:25},{x:90,y:40},
    {x:12,y:60},{x:38,y:80},{x:70,y:80},{x:90,y:65}]
   ```
2. ใน `mount()`: สุ่มเลือก 4 จาก 8 slots → assign ให้ answerPads (ตาม answerIdx ที่สับแล้ว)
3. ใน `loadQuestion()`: ทุกครั้งที่เรียก — สุ่มตำแหน่งใหม่สำหรับ 4 pads (จาก 8 slots ที่ไม่ใช่ตำแหน่งเดิม) — เคลื่อนย้าย answerPads ไปตำแหน่งใหม่ (update style.left/top)
4. เพิ่ม visual feedback: CSS transition เมื่อป้ายย้ายตำแหน่ง (transition: left 300ms, top 300ms)
5. กันคนยืนแช่: เพราะตำแหน่งเปลี่ยนทุกข้อ คนจะไม่สามารถยืนแช่ที่เดิมได้

## Important Constraints
- Player radius + core: ต้องแน่ใจว่า player ยังเดินถึงได้ไกลๆ
- Pads ต้องไม่ทับกัน (เลือก 4 จาก 8 slots ที่ห่างกัน ≥20vw)
- Boss position (12,15) — ควรเลือก slots ที่ไม่ทับบอส
- Player start (57.5,88) — ไม่ทับ slots
- CSS: เพิ่ม `transition: left 0.3s ease, top 0.3s ease` ใน `.answer-pad`

## Files
- /home/ubuntu/questverse-game/js/boss.js
- /home/ubuntu/questverse-game/style.css
- /home/ubuntu/questverse-game/QA_BOSS_CODE.md

## Deploy
```bash
cd /home/ubuntu/questverse-game
python3 make_vercel_payload.py && python3 shrink_payload.py
manus-mcp-cli tool call deploy_to_vercel --server vercel --input-file vercel_deploy_input.json
git add -A && git commit -m "..." && git push origin main
```

## Production
- https://questverse-space-explorer.vercel.app
- GitHub: kapomtong/questverse-space-explorer (main)
