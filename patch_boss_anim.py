"""Patch boss.js + style.css: living boss animations (roam, sway, reactions).

Changes:
1. boss.js: wrap boss sprite img in .boss-roam inner div (position + transform
   inline live on inner, animation on outer avoids transform collision).
2. boss.js: add this.boss state + updateBoss() called each gameLoop tick.
3. boss.js: onAnswer correct -> add 'damaged' flash; combo>=3 -> 'angry'; taunt timer.
4. style.css: append new keyframes + classes.
"""
import re

JS = 'js/boss.js'
CSS = 'style.css'
src = open(JS).read()
orig = src

# ---------- 1. mount: replace boss sprite block with wrapper version ----------
old_block = """    // Boss sprite
    const bossSprite = document.createElement('div');
    bossSprite.className = 'boss-sprite';
    bossSprite.style.cssText = `bottom: 8%; left: 50%; transform: translateX(-50%);`;
    bossSprite.innerHTML = `<img src="${this.config.bossImg}" alt="${this.config.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%23222%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23aaa%22 font-size=%2248%22%3E👾%3C/text%3E%3C/svg%3E'">`;
    arena.appendChild(bossSprite);
    this.bossSpriteEl = bossSprite;"""

new_block = """    // Boss sprite (wrapper .boss-roam carries inline position/transform;
    // the outer .boss-sprite carries the animation so transforms never collide)
    const bossSprite = document.createElement('div');
    bossSprite.className = 'boss-sprite';
    const bossRoam = document.createElement('div');
    bossRoam.className = 'boss-roam';
    bossRoam.innerHTML = `<img src="${this.config.bossImg}" alt="${this.config.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%23222%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23aaa%22 font-size=%2248%22%3E👾%3C/text%3E%3C/svg%3E'">`;
    bossSprite.appendChild(bossRoam);
    arena.appendChild(bossSprite);
    this.bossSpriteEl = bossSprite;
    this.bossRoamEl = bossRoam;
    this.boss = {
      t: 0,            // animation clock
      roamBase: 50,    // % left position
      jitterX: 0,      // temporary dodge/jerk offset
      jitterUntil: 0,
      tauntAt: performance.now() + 5000,
      attackUntil: 0,
    };"""
assert old_block in src, 'mount block not found'
src = src.replace(old_block, new_block)

# ---------- 2. gameLoop: call updateBoss ----------
old_loop = """    if (dt < 100) {
      this.updatePlayer(dt);
      this.updatePet(dt);
      this.checkPadCollision();
      this.updateCampingDetection(dt);
      this.updateAttacks(dt);
    }"""
new_loop = """    if (dt < 100) {
      this.updatePlayer(dt);
      this.updatePet(dt);
      this.updateBoss(dt);
      this.checkPadCollision();
      this.updateCampingDetection(dt);
      this.updateAttacks(dt);
    }"""
assert old_loop in src, 'gameLoop block not found'
src = src.replace(old_loop, new_loop)

# ---------- 3. updateBoss method: insert before gameLoop ----------
update_boss = """  // ---- อนิเมชันบอสขยับ (roam + ลีลา) ----
  updateBoss(dt) {
    if (!this.bossSpriteEl) return;
    const now = performance.now();
    const b = this.boss;
    b.t += dt;
    const t = b.t / 1000;
    // ลอยส่าย + เลื่อนซ้าย-ขวาช้าๆ (wave)
    const swayX = 20 * Math.sin(t / 3.5);            // ±20% จากกลางสนาม
    const swayY = 1.2 * Math.sin(t / 2.2);           // ลอยขึ้นลง (vw)
    // ลีลา: หันเอียงตามทิศทางเลื่อน + โยกแขนขา
    const dir = Math.cos(t / 3.5);                    // +1 = ไปขวา, -1 = ไปซ้าย
    const tilt = 4 * Math.sin(t / 0.9);               // ส่ายตัว
    const armSwing = 2.2 * Math.sin(t / 0.55);        // ส่ายแขนเล็กๆ
    const legBounce = Math.abs(Math.sin(t / 0.9)) * 1.6; // กระเด้งขาตอนย่าง
    // กระชากสั้นๆ (jitter) ทุก 4-7 วิ
    let jx = 0;
    if (now < b.jitterUntil) {
      jx = b.jitterX * Math.sin((b.jitterUntil - now) / 120);
    } else if (Math.random() < 0.004) {
      b.jitterX = (Math.random() - 0.5) * 26;
      b.jitterUntil = now + 420;
    }
    // ลีลา Taunt ทุก ~6 วิ: สะดุ้งชูแขน
    let taunt = 0;
    if (now > b.tauntAt && now < b.tauntAt + 700) {
      taunt = (1 - (now - b.tauntAt) / 700) * 6;      // โยกแรงขึ้นเรื่อยๆ แล้วค่อยๆ หยุด
    } else if (now > b.tauntAt) {
      b.tauntAt = now + 5500 + Math.random() * 2500;
    }
    // หาวหน้าเมื่อถูกโจมตี (attacking window)
    let atk = 0;
    if (now < b.attackUntil) {
      atk = (1 - (b.attackUntil - now) / 450) * 14;   // lunge ลงมา
    }
    const x = b.roamBase + swayX + jx;
    const y = swayY + taunt + atk + legBounce * 0.4;
    const rot = tilt + dir * 2;
    this.bossRoamEl.style.cssText = `bottom: calc(8% - ${y.toFixed(2)}vw); left: ${x.toFixed(2)}%; transform: translateX(-50%) rotate(${rot.toFixed(1)}deg) skewY(${(armSwing * 0.5).toFixed(1)}deg) scaleX(${dir < 0 ? -1 : 1});`;
    // สถานะ angry เมื่อ combo สูง
    if (this.gameState.combo >= 3) {
      this.bossSpriteEl.classList.add('angry');
    } else {
      this.bossSpriteEl.classList.remove('angry');
    }
  }
  // กระตุ้นให้บอสทำท่าโจมตี (ล่วงหน้า projectile)
  bossLunge() {
    if (this.boss) this.boss.attackUntil = performance.now() + 450;
    if (this.bossSpriteEl) this.bossSpriteEl.classList.add('attacking');
    if (this.bossAtkTimer) clearTimeout(this.bossAtkTimer);
    this.bossAtkTimer = setTimeout(() => {
      if (this.bossSpriteEl) this.bossSpriteEl.classList.remove('attacking');
    }, 460);
  }
  // กระตุ้นให้บอสขึ้นใจเมื่อถูกทำร้าย
  bossHurt() {
    if (!this.bossSpriteEl) return;
    this.bossSpriteEl.classList.remove('damaged');
    void this.bossSpriteEl.offsetWidth;               // restart animation
    this.bossSpriteEl.classList.add('damaged');
    if (this.bossDmgTimer) clearTimeout(this.bossDmgTimer);
    this.bossDmgTimer = setTimeout(() => {
      this.bossSpriteEl.classList.remove('damaged');
    }, 320);
  }
"""
anchor = '  gameLoop(timestamp = 0) {'
assert anchor in src, 'gameLoop anchor not found'
src = src.replace(anchor, update_boss + anchor)

# ---------- 4. onAnswer: reactions ----------
old_correct_tail = """      // Combo 10 = invincible bonus
      if (this.gameState.correctStreak === CONFIG.COMBO_INVINCIBLE_THRESHOLD) {
        this.showConfetti();
        QV.state.player.xp += 50;
        this.gameState.score += 50;
      }
      this.loadQuestion();"""
new_correct_tail = """      // Combo 10 = invincible bonus
      if (this.gameState.correctStreak === CONFIG.COMBO_INVINCIBLE_THRESHOLD) {
        this.showConfetti();
        QV.state.player.xp += 50;
        this.gameState.score += 50;
      }
      // บอสสะเทือนถูกทำร้าย + ขึ้นใจเมื่อ combo สูง
      this.bossHurt();
      this.loadQuestion();"""
assert old_correct_tail in src, 'correct tail not found'
src = src.replace(old_correct_tail, new_correct_tail)

open(JS, 'w').write(src)
print('boss.js patched:', len(src) - len(orig), 'chars added')

# ---------- 5. CSS: append living-boss animations ----------
css_add = """
/* ==== Boss living animations (Aug 19) ====
   โครงสร้าง: .boss-sprite (outer, animation) > .boss-roam (inline transform) > img
   ต้องไม่ใช้ transform ใน keyframes ของ outer เพื่อไม่ชน inline ของ inner */
.boss-sprite {
    animation: boss-breathe 2.2s ease-in-out infinite;
    transition: filter 0.25s ease;
}
.boss-sprite img {
    transition: filter 0.25s ease;
}
/* ลิ้งใจค่อยๆ เติ่มขึ้นลง (แทน boss-idle ที่ใช้ transform) */
@keyframes boss-breathe {
    0%, 100% { transform: scale(1) translateY(0); }
    50% { transform: scale(1.02) translateY(-1vw); }
}
/* บอสขึ้นใจเมื่อผู้เล่น combo >= 3 */
.boss-sprite.angry img {
    filter: drop-shadow(0 0 24px rgba(239, 71, 111, 0.85)) hue-rotate(340deg) saturate(1.5) brightness(1.08);
    animation: boss-angry-pulse 0.8s ease-in-out infinite;
}
@keyframes boss-angry-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.045); }
}
/* ลีลาโจมตี: lunge รูดลงมาแล้วคืน */
.boss-sprite.attacking {
    z-index: 12;
}
.boss-sprite.attacking img {
    filter: drop-shadow(0 0 30px rgba(255, 209, 102, 0.95)) brightness(1.35);
}
/* ถูกทำร้าย (ผู้เล่นตอบถูก) */
.boss-sprite.damaged img {
    animation: boss-hit-flash 0.3s ease-in-out;
}
@keyframes boss-hit-flash {
    0%, 100% { filter: brightness(1) drop-shadow(0 0 18px rgba(157, 78, 221, 0.55)); }
    40% { filter: brightness(2.6) drop-shadow(0 0 32px rgba(255, 209, 102, 0.98)) hue-rotate(-20deg); }
    70% { filter: brightness(0.65) drop-shadow(0 0 20px rgba(239, 71, 111, 0.9)); }
}
/* mobile: ยังใช้ wrapper เดิม */
@media (max-width: 600px) {
    .boss-roam { max-width: 120px; }
}
"""
css = open(CSS).read()
if 'boss-breathe' not in css:
    open(CSS, 'a').write(css_add)
    print('style.css appended', len(css_add), 'chars')
else:
    print('style.css already has boss-breathe — skip')
