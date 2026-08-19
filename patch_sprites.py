#!/usr/bin/env python3
"""Fix battle visuals: player sprite (suit image), boss sprite element, pet-mito sizing."""

path = 'js/boss.js'
src = open(path).read()

# 1) Replace player yellow dot with suit sprite image
old_player = """    const player = document.createElement('div');
    player.className = 'boss-player';
    player.style.cssText = `
      position: absolute;
      width: 3vw;
      height: 3vw;
      background: radial-gradient(circle, #FFD700, #FFA500);
      border-radius: 999px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      transition: box-shadow 0.3s;
      z-index: 10;
    `;
    arena.appendChild(player);
    this.playerEl = player;"""
new_player = """    const suit = (QV.state && QV.state.player && QV.state.player.suit) || 'red';
    const player = document.createElement('div');
    player.className = 'boss-player';
    player.style.cssText = `
      position: absolute;
      width: 9vw;
      max-width: 96px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      transition: left 0.06s linear, top 0.06s linear;
      z-index: 10;
    `;
    player.innerHTML = `<img src="assets/suit_${suit}.webp" alt="นักผจญภัย" onerror="this.style.display='none'">`;
    arena.appendChild(player);
    this.playerEl = player;"""
assert old_player in src, 'player anchor not found'
src = src.replace(old_player, new_player, 1)

# 2) Add boss sprite element after pet creation
old_pet_end = """    arena.appendChild(pet);
    this.petEl = pet;"""
new_pet_end = """    arena.appendChild(pet);
    this.petEl = pet;
    // Boss sprite
    const bossSprite = document.createElement('div');
    bossSprite.className = 'boss-sprite';
    bossSprite.style.cssText = `bottom: 8%; left: 50%; transform: translateX(-50%);`;
    bossSprite.innerHTML = `<img src="${this.config.bossImg}" alt="${this.config.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%23222%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23aaa%22 font-size=%2248%22%3E👾%3C/text%3E%3C/svg%3E'">`;
    arena.appendChild(bossSprite);
    this.bossSpriteEl = bossSprite;"""
assert old_pet_end in src, 'pet end anchor not found'
src = src.replace(old_pet_end, new_pet_end, 1)

# 3) Update renderPlayer to flip sprite on direction (find block setting left/top + border)
old_move = """    this.playerEl.style.left = `${this.gameState.player.x}%`;
    this.playerEl.style.top = `${this.gameState.player.y}%`;"""
new_move = """    this.playerEl.style.left = `calc(${this.gameState.player.x}% - ${this.playerEl.offsetWidth / 2}px)`;
    this.playerEl.style.top = `calc(${this.gameState.player.y}% - ${this.playerEl.offsetHeight / 2}px)`;
    if (this.gameState.player.vx < -0.001) {
      this.playerEl.style.transform = 'scaleX(-1)';
    } else if (this.gameState.player.vx > 0.001) {
      this.playerEl.style.transform = 'scaleX(1)';
    }"""
assert old_move in src, 'move anchor not found'
src = src.replace(old_move, new_move, 1)

open(path, 'w').write(src)
print('boss.js sprites patched OK')

# 4) CSS: add boss-player img rule + pet-mito fixed sizing
css_path = 'style.css'
css = open(css_path).read()
marker = '/* ===== battle sprites ===== */'
if marker not in css:
    extra = """
/* ===== battle sprites ===== */
.boss-player img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.7));
  image-rendering: auto;
}
.pet-mito {
  position: absolute;
  width: 11vw;
  max-width: 56px;
  height: 11vw;
  max-height: 56px;
  z-index: 11;
  pointer-events: none;
  filter: drop-shadow(0 0 10px rgba(120, 200, 255, 0.8));
  animation: pet-bob 2s ease-in-out infinite;
}
.pet-mito img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
@keyframes pet-bob {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-8px) rotate(3deg); }
}
@media (max-width: 600px) {
  .boss-sprite { width: 28vw; max-width: 120px; }
  .boss-player { width: 12vw; max-width: 64px; }
}
"""
    css = css.rstrip() + '\n' + extra
    open(css_path, 'w').write(css)
    print('style.css sprites patched OK')
else:
    print('style.css already patched')
