"""แปลง PNG ที่มี alpha (planet/suit/ship) เป็น WebP lossy เพื่อลดขนาด payload
- ดาว: 480px, suit/ship: 512px, WebP quality 80
- JPG คงเดิม (ดาว mission bg)
"""
import os
from PIL import Image

BASE = 'assets'
for name in sorted(os.listdir(BASE)):
    if not name.endswith('.png'):
        continue
    p = os.path.join(BASE, name)
    img = Image.open(p).convert('RGBA')

    if name.startswith('planet_'):
        limit = 480
    else:
        limit = 512
    if max(img.size) > limit:
        img.thumbnail((limit, limit), Image.LANCZOS)

    out = p[:-4] + '.webp'
    img.save(out, 'WEBP', quality=80, method=6)
    old = os.path.getsize(p)
    new = os.path.getsize(out)
    os.remove(p)
    print(f'{old//1024:>6} KB -> {new//1024:>5} KB  {name} -> {out.split("/")[-1]}')
