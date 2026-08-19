#!/usr/bin/env python3
"""Resize big background JPGs to max 1280px and recompress q75 to shrink payload."""
from PIL import Image
import os

ROOT = '/home/ubuntu/questverse-game/assets'
MAXW = 1280
targets = [
    'boss_arena.jpg', 'landing_bg.jpg', 'mission_bg.jpg',
    'mission_bg_numberon.jpg', 'mission_bg_bionia.jpg', 'mission_bg_aksara.jpg',
    'mission_bg_lingua.jpg', 'mission_bg_civilis.jpg',
]
for fn in targets:
    p = os.path.join(ROOT, fn)
    if not os.path.exists(p):
        continue
    img = Image.open(p).convert('RGB')
    w, h = img.size
    if w <= MAXW and os.path.getsize(p) < 150000:
        continue
    img.thumbnail((MAXW, MAXW), Image.LANCZOS)
    img.save(p, 'JPEG', quality=75, optimize=True)
    print(fn, img.size, os.path.getsize(p)//1024, 'KB')
