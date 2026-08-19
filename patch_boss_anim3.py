"""Full boss animation patch (applied fresh). Each step checked independently."""
import sys

JS = 'js/boss.js'
CSS = 'style.css'

def step(desc, old, new, required=True):
    global src
    if old in src:
        src = src.replace(old, new, 1)
        print(f'[OK]   {desc}')
        return True
    print(f'[MISS] {desc}  <- skipped')
    if required:
        sys.exit(f'FAILED: {desc}')
    return False

src = open(JS).read()

def save():
    open(JS, 'w').write(src)

# 1. mount: wrapper boss-roam
step('mount wrapper',
"""    // Boss sprite
    const bossSprite = document.createElement('div');
    bossSprite.className = 'boss-sprite';
    bossSprite.style.cssText = `bottom: 8%; left: 50%; transform: translateX(-50%);`;
    bossSprite.innerHTML = `<img src="${this.config.bossImg}" alt="${this.config.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%23222%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23aaa%22 font-size=%2248%22%3E👾%3C/text%3E%3C/svg%3E'">`;
    arena.appendChild(bossSprite);
    this.bossSpriteEl = bossSprite;""",
"""    // Boss sprite: .boss-roam (inner) carries inline position/transform;
    // the outer .boss-sprite carries the animation so transforms never collide.
    const bossSprite = document.createElement('div');
    bossSprite.className = 'boss-sprite';
    const bossRoam = document.createElement('div');
    bossRoam.className = 'boss-roam';
    bossRoam.innerHTML = `<img src="${this.config.bossImg}" alt="${this.config.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%23222%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23aaa%22 font-size=%2248%22%3E👾%3C/text%3E%3C/svg%3E'">`;
    bossSprite.appendChild(bossRoam);
    arena.appendChild(bossSprite);
    this.bossSpriteEl = bossSprite;
    this.bossRoamEl = bossRoam;
    this.boss = { t: 0, jitterX: 0, jitterUntil: 0, tauntAt: performance.now() + 5000, attackUntil: 0 };""")
save()

# 2. gameLoop: insert updateBoss
step('gameLoop updateBoss',
"""      this.updatePlayer(dt);
      this.updatePet(dt);
      this.checkPadCollision();""",
"""      this.updatePlayer(dt);
      this.updatePet(dt);
      this.updateBoss(dt);
      this.checkPadCollision();""")
save()

# 3. insert updateBoss / bossLunge / bossHurt methods before gameLoop
step('insert methods',
'  gameLoop(timestamp = 0) {',
"""  // ---- อนิเมชันบอสขยับ (roam + ลีลา) ----
  updateBoss(dt) {
    if (!this.bossSpriteEl) return;
    const now = performance.now();
    const b = this.boss;
    b.t += dt;
    const t = b.t / 1000;
    // เลื่อนซ้าย-ขวาช้าๆ แบบ wave + ลีลาเอียงตามทิศ
    const swayX = 20 * Math.sin(t / 3.5);
    const swayY = 1.2 * Math.sin(t / 2.2);
    const dir = Math.cos(t / 3.5);
    const tilt = 4 * Math.sin(t / 0.9);
    const armSwing = 2.2 * Math.sin(t / 0.55);
    const legBounce = Math.abs(Math.sin(t / 0.9)) * 1.6;
    // กระชากสั้นๆ (jitter) สุ่มทุก 4-7 วิ
    let jx = 0;
    if (now < b.jitterUntil) {
      jx = b.jitterX * Math.sin((b.jitterUntil - now) / 120);
    } else if (Math.random() < 0.004) {
      b.jitterX = (Math.random() - 0.5) * 26;
      b.jitterUntil = now + 420;
    }
    // ลีลา Taunt ชูแขน/โยกแรง สั้นๆ ทุก ~6 วิ
    let taunt = 0;
    if (now > b.tauntAt && now < b.tauntAt + 700) {
      taunt = (1 - (now - b.tauntAt) / 700) * 6;
    } else if (now > b.tauntAt) {
      b.tauntAt = now + 5500 + Math.random() * 2500;
    }
    // หาวหน้าลุ้นเมื่อยิง projectile (bossLunge)
    let atk = 0;
    if (now < b.attackUntil) {
      atk = (1 - (b.attackUntil - now) / 450) * 14;
    }
    const x = 50 + swayX + jx;
    const y = swayY + taunt + atk + legBounce * 0.4;
    const rot = tilt + dir * 2;
    this.bossRoamEl.style.cssText = `bottom: calc(8% - ${y.toFixed(2)}vw); left: ${x.toFixed(2)}%; transform: translateX(-50%) rotate(${rot.toFixed(1)}deg) skewY(${(armSwing * 0.5).toFixed(1)}deg) scaleX(${dir < 0 ? -1 : 1});`;
    // สถานะ angry เมื่อคอมโบสูง
    if (this.gameState.combo >= 3) {
      this.bossSpriteEl.classList.add('angry');
    } else {
      this.bossSpriteEl.classList.remove('angry');
    }
  }
  // กระตุ้นให้บอสทำท่าโจมตี (นำหน้า projectile)
  bossLunge() {
    if (this.boss) this.boss.attackUntil = performance.now() + 450;
    if (this.bossSpriteEl) this.bossSpriteEl.classList.add('attacking');
    if (this.bossAtkTimer) clearTimeout(this.bossAtkTimer);
    this.bossAtkTimer = setTimeout(() => {
      if (this.bossSpriteEl) this.bossSpriteEl.classList.remove('attacking');
    }, 460);
  }
  // กระตุ้นให้บอสสะเทือนเมื่อผู้เล่นตอบถูก
  bossHurt() {
    if (!this.bossSpriteEl) return;
    this.bossSpriteEl.classList.remove('damaged');
    void this.bossSpriteEl.offsetWidth;
    this.bossSpriteEl.classList.add('damaged');
    if (this.bossDmgTimer) clearTimeout(this.bossDmgTimer);
    this.bossDmgTimer = setTimeout(() => {
      this.bossSpriteEl.classList.remove('damaged');
    }, 320);
  }
  gameLoop(timestamp = 0) {""")
save()

# 4. onAnswer correct: bossHurt before loadQuestion
step('onAnswer bossHurt',
"""      // Combo 10 = invincible bonus
      if (this.gameState.correctStreak === CONFIG.COMBO_INVINCIBLE_THRESHOLD) {
        this.showConfetti();
        QV.state.player.xp += 50;
        this.gameState.score += 50;
      }
      this.loadQuestion();""",
"""      // Combo 10 = invincible bonus
      if (this.gameState.correctStreak === CONFIG.COMBO_INVINCIBLE_THRESHOLD) {
        this.showConfetti();
        QV.state.player.xp += 50;
        this.gameState.score += 50;
      }
      // บอสสะเทือนเมื่อตอบถูก
      this.bossHurt();
      this.loadQuestion();""")

open(JS, 'w').write(src)
print('boss.js patched, total', len(src), 'chars')

# 5. CSS
css = open(CSS).read()
if 'boss-breathe' in css:
    print('style.css already has boss-breathe - skip')
else:
    css_add = """
/* ==== Boss living animations (Aug 19) ====
   โครงสร้าง: .boss-sprite (outer, animation) > .boss-roam (inline transform) > img */
.boss-sprite {
    animation: boss-breathe 2.2s ease-in-out infinite;
}
@keyframes boss-breathe {
    0%, 100% { transform: scale(1) translateY(0); }
    50% { transform: scale(1.02) translateY(-1vw); }
}
.boss-sprite.angry img {
    filter: drop-shadow(0 0 24px rgba(239, 71, 111, 0.85)) hue-rotate(340deg) saturate(1.5) brightness(1.08);
    animation: boss-angry-pulse 0.8s ease-in-out infinite;
}
@keyframes boss-angry-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.045); }
}
.boss-sprite.attacking img {
    filter: drop-shadow(0 0 30px rgba(255, 209, 102, 0.95)) brightness(1.35);
}
.boss-sprite.damaged img {
    animation: boss-hit-flash 0.3s ease-in-out;
}
@keyframes boss-hit-flash {
    0%, 100% { filter: brightness(1) drop-shadow(0 0 18px rgba(157, 78, 221, 0.55)); }
    40% { filter: brightness(2.6) drop-shadow(0 0 32px rgba(255, 209, 102, 0.98)) hue-rotate(-20deg); }
    70% { filter: brightness(0.65) drop-shadow(0 0 20px rgba(239, 71, 111, 0.9)); }
}
@media (max-width: 600px) {
    .boss-roam { max-width: 120px; }
}
"""
    open(CSS, 'a').write(css_add)
    print('style.css appended', len(css_add), 'chars')
