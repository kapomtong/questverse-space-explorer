"""ลดขนาดภาพใน assets/ เพื่อให้ deploy payload ใต้ 4 MB
- JPG: resize สูงสุด 1280px, quality 72
- PNG ดาว (planet): resize 512px + convert เป็น PNG optimized (quantize)
- PNG suit/ship: resize สูงสุด 512px
ไม่แตะ SVG
"""
import os
from PIL import Image

BASE = 'assets'
for name in sorted(os.listdir(BASE)):
    p = os.path.join(BASE, name)
    if not os.path.isfile(p):
        continue
    ext = name.rsplit('.', 1)[-1].lower()
    if ext == 'svg':
        continue
    img = Image.open(p)
    mode = 'RGBA' if ext == 'png' else 'RGB'
    img = img.convert(mode)

    if name.startswith('planet_'):
        # ดาวใช้ไอคอนเล็กใน map — 512px ก็คมพอ
        limit = 512
        if max(img.size) > limit:
            img.thumbnail((limit, limit), Image.LANCZOS)
        img.save(p, optimize=True)
    elif name.startswith('mission_bg') or name.startswith('landing_bg'):
        # ฉากหลัง — 1440x810 คุณภาพ 72
        limit = 1440
        if img.width > limit:
            h = int(img.height * limit / img.width)
            img = img.resize((limit, h), Image.LANCZOS)
        img.save(p, 'JPEG', quality=72, optimize=True, progressive=True)
    elif name.startswith('suit_') or name.startswith('explorer_ship'):
        limit = 512
        if max(img.size) > limit:
            img.thumbnail((limit, limit), Image.LANCZOS)
        img.save(p, optimize=True)
    new_kb = os.path.getsize(p) // 1024
    print(f'{new_kb:>6} KB  {name}')
