# Opus v3 Integration Notes — Anti-camping + Spread Pads

## User request
- ป้ายคำตอบควรกระจายกัน (spread pads)
- มีระบบกันคนยืนแช่ (anti-camping)

## What Opus suggested (from /home/ubuntu/questverse-game/opus_boss_v3_output.md)
1. **Anti-camping system:** Detect when player stands still (NOT on a pad) for CAMPING_TIME (4500ms). Show warning "⚠️ Keep moving!". After CAMPING_ATTACK_DELAY (1200ms), spawn targeted fireball at player position.
2. **Spread pads:** Use 8 slots, pick 4 random ones per question (already partially implemented by Manus).
3. **PAD_MIN_DISTANCE:** 18vw minimum distance between pads (to prevent overlap).

## What Manus already implemented in boss.js (current version)
- CONFIG.PAD_SLOTS (8 slots) — ✅ done
- loadQuestion() shuffles pad positions every question — ✅ done
- CSS transition on .answer-pad — ✅ done
- Intentional answer (isStandingStill, PAD_ANSWER_CORE) — ✅ done
- MOVING_THRESHOLD: 3 (but this is %/s not normalized — may need Opus fix: vx/vy is -1 to 1 normalized vector)
- MOVING_THRESHOLD fix from Opus: use `speed = Math.sqrt(vx²+vy²)` where vx/vy is normalized → threshold 0.15

## What still needs to be integrated from Opus
1. Anti-camping detection system (updateCampingDetection, resetCampingDetection, showCampingWarning, createTargetedFireball)
2. Fix MOVING_THRESHOLD to use normalized speed (Opus says threshold should be 0.15 on normalized vector)
3. PAD_MIN_DISTANCE check in selectPadSlots (currently just picks first 4 from shuffled — no distance check)
4. Camping attack timer variable (campingAttackTimer)
5. DOM element: campingWarning

## Current boss.js structure (for reference)
- Line 1-47: CONFIG
- Line 49-77: BOSS_DATA
- Line 81-88: gameState
- Line 90-118: DOM elements
- Line 120-131: distance/collide
- Line 133-160: getRandomQuestions/shuffleArray
- Line 162-257: createDOM
- Line 259-269: updatePlayerPosition
- Line 271-390: Movement (handleKeyDown/Up, setupJoystick, updatePlayerMovement)
- Line 392-637: Attacks (scheduleNextAttack, launchAttack, createFireball/Ice/Portal, updateAttacks)
- Line 639-687: hitPlayer, freezePlayer, onDodge
- Line 689-743: loadQuestion
- Line 745-793: checkPadCollision (intentional answer)
- Line 795-891: onAnswer/onAnswerCorrect/onAnswerWrong
- Line 923-1054: endGame/stopLoop
- Line 1057-1140: mount/cleanup
- Line 1147-1148: window.QVBossTest

## Key integration points (where to add)
1. CONFIG: Add CAMPING_TIME, CAMPING_ATTACK_DELAY, PAD_MIN_DISTANCE, MOVING_THRESHOLD (change from 3 to 0.15)
2. gameState: Add campingDetection object + campingAttackTimer variable
3. After attacks section: Add updateCampingDetection(), resetCampingDetection(), showCampingWarning(), createTargetedFireball()
4. In gameLoop: Call updateCampingDetection(now) after updateAttacks
5. In loadQuestion: Add PAD_MIN_DISTANCE check in selectPadSlots
6. In createDOM: Add campingWarning DOM element
7. In cleanup: Clear campingAttackTimer
