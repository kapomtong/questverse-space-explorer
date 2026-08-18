"""Optimize QuestVerse assets for the web:
- remove *_original.png files
- resize large images, convert PNGs to optimized web size
- create SVG item icons (shield, compass, telescope)
"""
import os
from PIL import Image

ASSETS = "/home/ubuntu/questverse-game/assets"

def save_optimized(path, out_path, max_side, fmt="PNG", quality=85):
    im = Image.open(path)
    if max(im.size) > max_side:
        ratio = max_side / max(im.size)
        im = im.resize((round(im.width * ratio), round(im.height * ratio)), Image.LANCZOS)
    if fmt in ("JPEG", "JPG") and im.mode in ("RGBA", "P"):
        im = im.convert("RGB")
    im.save(out_path, fmt, quality=quality, optimize=True)

# 1. Remove originals
for f in os.listdir(ASSETS):
    if "_original" in f:
        os.remove(os.path.join(ASSETS, f))

# 2. Optimize images (web-friendly sizes)
optimize_map = {
    "landing_bg.jpg": ("landing_bg.jpg", 1920, "JPEG", 88),
    "explorer_ship.png": ("explorer_ship.png", 512, "PNG", 90),
    "planet_numberon.png": ("planet_numberon.png", 600, "PNG", 88),
    "planet_bionia.png": ("planet_bionia.png", 600, "PNG", 88),
    "planet_aksara.png": ("planet_aksara.png", 600, "PNG", 88),
    "planet_lingua.png": ("planet_lingua.png", 600, "PNG", 88),
    "planet_civilis.png": ("planet_civilis.png", 600, "PNG", 88),
    "suit_blue.png": ("suit_blue.png", 512, "PNG", 88),
    "suit_red.png": ("suit_red.png", 512, "PNG", 88),
    "suit_green.png": ("suit_green.png", 512, "PNG", 88),
}
for src, (dst, side, fmt, q) in optimize_map.items():
    p = os.path.join(ASSETS, src)
    if os.path.exists(p):
        save_optimized(p, os.path.join(ASSETS, dst), side, fmt, q)
        print("optimized:", src, "->", dst)

# 3. SVG item icons
svg_shield = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><radialGradient id="sg" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#7df9ff"/><stop offset="70%" stop-color="#00b4d8"/><stop offset="100%" stop-color="#023e8a"/></radialGradient></defs>
  <path d="M32 6 L52 16 L52 30 Q52 46 32 58 Q12 46 12 30 L12 16 Z" fill="url(#sg)" stroke="#90e0ef" stroke-width="2"/>
  <path d="M32 12 L46 19 L46 30 Q46 42 32 51 Q18 42 18 30 L18 19 Z" fill="rgba(255,255,255,0.25)"/>
  <path d="M32 20 L32 44 M24 28 L40 28" stroke="#caf0f8" stroke-width="3" stroke-linecap="round"/>
  <circle cx="32" cy="32" r="4" fill="#e0fbfc"/>
</svg>'''

svg_compass = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><radialGradient id="cg" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="#ffd166"/><stop offset="60%" stop-color="#f5a623"/><stop offset="100%" stop-color="#b07800"/></radialGradient></defs>
  <circle cx="32" cy="32" r="26" fill="url(#cg)" stroke="#ffe9a8" stroke-width="2"/>
  <circle cx="32" cy="32" r="19" fill="#1a2b3c" stroke="#7df9ff" stroke-width="1.5"/>
  <polygon points="32,16 36,32 32,30 28,32" fill="#ef476f"/>
  <polygon points="32,48 28,32 32,34 36,32" fill="#d8e2e8"/>
  <circle cx="32" cy="32" r="3" fill="#7df9ff"/>
  <circle cx="32" cy="10" r="2" fill="#7df9ff"/>
  <circle cx="32" cy="54" r="2" fill="#7df9ff"/>
  <circle cx="10" cy="32" r="2" fill="#7df9ff"/>
  <circle cx="54" cy="32" r="2" fill="#7df9ff"/>
</svg>'''

svg_telescope = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><linearGradient id="tg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#d0d0d0"/></linearGradient></defs>
  <rect x="8" y="24" width="38" height="16" rx="8" fill="url(#tg)" stroke="#f5a623" stroke-width="2" transform="rotate(-20 27 32)"/>
  <circle cx="52" cy="20" r="9" fill="#1a2b3c" stroke="#f5a623" stroke-width="2"/>
  <circle cx="52" cy="20" r="6" fill="#7df9ff"/>
  <circle cx="52" cy="20" r="3" fill="#e0fbfc"/>
  <rect x="30" y="44" width="6" height="14" rx="2" fill="#f5a623"/>
  <circle cx="14" cy="12" r="7" fill="rgba(125,249,255,0.4)"/>
  <path d="M10 12 L18 12 M14 8 L14 16" stroke="#7df9ff" stroke-width="2" stroke-linecap="round"/>
</svg>'''

for name, content in [("item_shield.svg", svg_shield), ("item_compass.svg", svg_compass), ("item_telescope.svg", svg_telescope)]:
    with open(os.path.join(ASSETS, name), "w") as f:
        f.write(content)
    print("created:", name)

print("DONE")
