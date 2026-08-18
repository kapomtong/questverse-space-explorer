# Code Review: js/boss.js

à¸à¸£à¸§à¸à¸à¸ **4 à¸à¸±à¸à¸«à¸²** â 2 à¸à¹à¸­à¹à¸£à¸à¹à¸à¹à¸ bug à¸à¸£à¸´à¸à¸à¸µà¹à¸à¸§à¸£à¹à¸à¹

---

## 1. â Memory Leak: mount() à¸à¹à¸³à¸à¹à¸­à¸ cleanup()

**à¸à¸£à¸£à¸à¸±à¸**: 829-866 (mount)

**à¸à¸±à¸à¸«à¸²**: à¸à¹à¸² `mount()` à¸à¸¹à¸à¹à¸£à¸µà¸¢à¸à¸à¹à¸³à¸à¹à¸­à¸ `cleanup()` (à¹à¸à¹à¸ user switch screen à¹à¸£à¹à¸§) â `attackTimer`, `timerInterval`, `rafId` à¹à¸à¹à¸²à¸à¸°à¹à¸¡à¹à¸à¸¹à¸ clear â timers à¸¢à¸±à¸à¸à¸³à¸à¸²à¸à¸à¹à¸­à¹à¸à¸à¸·à¹à¸à¸«à¸¥à¸±à¸

**à¸§à¸´à¸à¸µà¹à¸à¹**: à¹à¸£à¸µà¸¢à¸ cleanup logic à¸à¸­à¸à¹à¸£à¸´à¹à¸¡ mount()

```javascript
function mount(params) {
  //  Clear previous instance à¸à¹à¸­à¸ mount à¹à¸«à¸¡à¹
  if (rafId) cancelAnimationFrame(rafId);
  if (attackTimer) clearTimeout(attackTimer);
  if (timerInterval) clearInterval(timerInterval);
  rafId = null;
  attackTimer = null;
  timerInterval = null;
  
  // Reset state
  gameState = {
    // ... (à¹à¸à¸´à¸¡)
  };
  
  // ... (à¸ªà¹à¸§à¸à¸à¸µà¹à¹à¸«à¸¥à¸·à¸­à¹à¸à¸´à¸¡)
}
```

---

## 2. â ï¸ Race Condition: gameLoop() à¸à¸³à¸à¸²à¸à¸à¹à¸­à¸«à¸¥à¸±à¸ endGame()

**à¸à¸£à¸£à¸à¸±à¸**: 735, 823

**à¸à¸±à¸à¸«à¸²**: `endGame()` à¹à¸£à¸µà¸¢à¸ `cancelAnimationFrame(rafId)` à¹à¸à¹à¸à¹à¸² `gameLoop()` frame à¸à¸±à¸à¹à¸à¸à¸³à¸à¸²à¸à¸à¸­à¸à¸µ (à¸à¹à¸­à¸ cancel à¸à¸±à¸) â à¸à¸°à¹à¸£à¸µà¸¢à¸ `requestAnimationFrame(gameLoop)` à¹à¸«à¸¡à¹ (à¸à¸£à¸£à¸à¸±à¸ 823) â loop à¸à¸³à¸à¸²à¸à¸à¹à¸­

**à¸§à¸´à¸à¸µà¹à¸à¹**: Set `rafId = null` à¸à¹à¸­à¸ cancel à¹à¸¥à¸°à¹à¸à¹à¸à¹à¸ gameLoop()

```javascript
function endGame(won) {
  gameState.phase = won ? 'win' : 'lose'; Stop loop à¸à¹à¸­à¸ â set null à¸à¹à¸­à¸ cancel
  const oldRafId = rafId;
  rafId = null; // à¸à¹à¸­à¸à¸à¸±à¸ gameLoop set à¹à¸«à¸¡à¹
  if (oldRafId) cancelAnimationFrame(oldRafId);
  
  if (attackTimer) {
    clearTimeout(attackTimer);
    attackTimer = null;
  }
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  // ... (à¸ªà¹à¸§à¸à¸à¸µà¹à¹à¸«à¸¥à¸·à¸­à¹à¸à¸´à¸¡)
}
```

à¹à¸¥à¸°à¹à¸à¸´à¹à¸¡à¸à¸²à¸£à¹à¸à¹à¸à¹à¸ gameLoop():

```javascript
function gameLoop(timestamp) {
  //à¸à¹à¸² rafId à¸à¸¹à¸ clear à¹à¸¥à¹à¸§ â à¸«à¸¢à¸¸à¸à¸à¸±à¸à¸à¸µ
  if (!rafId || gameState.phase !== 'question') {
    rafId = null;
    return;
  }
  
  // ... (à¸ªà¹à¸§à¸à¸à¸µà¹à¹à¸«à¸¥à¸·à¸­à¹à¸à¸´à¸¡)
  
  rafId = requestAnimationFrame(gameLoop);
}
```

---

## 3. ð Shuffle Quality: getRandomQuestions() à¹à¸¡à¹ uniform

**à¸à¸£à¸£à¸à¸±à¸**: 104

**à¸à¸±à¸à¸«à¸²**: `sort(() => Math.random() - 0.5)` à¹à¸¡à¹à¹à¸à¹à¹à¸à¹à¸ uniform shuffle â à¹à¸à¹à¸ªà¸³à¸«à¸£à¸±à¸ 10/125 à¸à¹à¸­ à¹à¸­à¸à¸²à¸ªà¸à¹à¸³à¸à¹à¸³à¸¡à¸²à¸ (à¹à¸¡à¹à¹à¸à¹ bug à¹à¸à¹à¸à¸§à¸£à¸à¸£à¸±à¸à¸à¸£à¸¸à¸)

**à¸§à¸´à¸à¸µà¹à¸à¹**: à¹à¸à¹ `shuffleArray()` à¸à¸µà¹à¸¡à¸µà¸­à¸¢à¸¹à¹à¹à¸¥à¹à¸§ (Fisher-Yates)

```javascript
function getRandomQuestions(count) {
  const allQuestions = [];
  const planets = ['numberon', 'bionia', 'aksara', 'lingua', 'civilis'];
  
  planets.forEach(planetId => {
    if (QV.QUESTIONS[planetId]) {
      Object.values(QV.QUESTIONS[planetId]).forEach(zone => {
        zone.forEach(q => {
          allQuestions.push(q);
        });
      });
    }
  });à¹à¸à¹ Fisher-Yates shuffle à¹à¸à¸ sort()
  const shuffled = shuffleArray(allQuestions);
  return shuffled.slice(0, count);
}
```

---

## 4. ð Performance: distance() à¹à¸£à¸µà¸¢à¸ window.innerWidth/Height à¸à¸¸à¸à¸à¸£à¸±à¹à¸

**à¸à¸£à¸£à¸à¸±à¸**: 148-153

**à¸à¸±à¸à¸«à¸²**: `distance()` à¸à¸¹à¸à¹à¸£à¸µà¸¢à¸ ~10-15 à¸à¸£à¸±à¹à¸/frame (4 pads + attacks) â à¹à¸£à¸µà¸¢à¸ `window.innerWidth/Height` à¸à¹à¸³ à¹

**à¸§à¸´à¸à¸µà¹à¸à¹**: Cache viewport size

```javascript
let cachedViewportWidth = window.innerWidth;
let cachedViewportHeight = window.innerHeight;

function distance(x1, y1, x2, y2) {
  const dxPx = (x2 - x1) / 100 * cachedViewportWidth;
  const dyPx = (y2 - y1) / 100 * cachedViewportHeight;
  const distPx = Math.sqrt(dxPx * dxPx + dyPx * dyPx);
  return (distPx / cachedViewportWidth) * 100;
}

function mount(params) {
  // Update cache à¸à¸­à¸ mount
  cachedViewportWidth = window.innerWidth;
  cachedViewportHeight = window.innerHeight;
  
  // ... (à¸ªà¹à¸§à¸à¸à¸µà¹à¹à¸«à¸¥à¸·à¸­à¹à¸à¸´à¸¡)
}

//à¸à¸´à¹à¸¡ resize handler (optional à¹à¸à¹à¹à¸à¸°à¸à¸³)
window.addEventListener('resize', () => {
  cachedViewportWidth = window.innerWidth;
  cachedViewportHeight = window.innerHeight;
});
```

---

## à¹à¸à¹à¸²à¸à¸à¸²à¸£à¸à¸£à¸§à¸à¸ªà¸­à¸

- **Holding logic**: reset à¸à¸¹à¸à¸à¹à¸­à¸à¸à¸¸à¸à¸à¸£à¸±à¹à¸à¸à¸µà¹à¹à¸«à¸¥à¸à¸à¸³à¸à¸²à¸¡à¹à¸«à¸¡à¹ â
- **formatFrac collision**: à¹à¸à¹ dataset.answerIdx à¹à¸¡à¹à¹à¸à¸£à¸µà¸¢à¸à¹à¸à¸µà¸¢à¸ text à¸à¸£à¸ à¹ â
- **Fireball dodge**: 2.7s travel + target à¸à¸³à¹à¸«à¸à¹à¸à¸à¸±à¸à¸à¸¸à¸à¸±à¸ â à¸«à¸¥à¸à¹à¸à¹à¸à¹à¸²à¸¢ â
- **endGame cleanup**: à¸«à¸¢à¸¸à¸ timers/RAF à¸à¸£à¸ (à¹à¸à¹à¸¡à¸µ race condition à¸à¹à¸­ 2) â
- **Input cleanup**: removeEventListener à¸à¹à¸­à¸ addEventListener â

---

## à¸ªà¸£à¸¸à¸

**à¹à¸à¹à¸à¹à¸§à¸**: à¸à¹à¸­ 1 (memory leak) à¹à¸¥à¸°à¸à¹à¸­ 2 (race condition)  
**à¸à¸£à¸±à¸à¸à¸£à¸¸à¸**: à¸à¹à¸­ 3 (shuffle) à¹à¸¥à¸°à¸à¹à¸­ 4 (performance)