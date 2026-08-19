#!/usr/bin/env python3
"""Downscale heavy webp assets so the deploy payload fits under 4 MB."""
from PIL import Image
import os

ROOT = '/home/ubuntu/questverse-game'

# target sizes: (path, max_width)
TARGETS = [
    ('assets/boss_mathos.webp', 640),
    ('assets/boss_chronos.webp', 640),
    ('assets/boss_kawi.webp', 640),
    ('assets/boss_lex.webp', 640),
    ('assets/boss_terra.webp', 640),
    ('assets/arena_mathos.webp', 1080),
    ('assets/arena_chronos.webp', 1080),
    ('assets/icons/skill_aim.webp', 384),
    ('assets/icons/skill_shield.webp', 384),
    ('assets/icons/skill_potion.webp', 384),
    ('assets/icons/skill_boost.webp', 384),
    ('assets/icons/skill_combo.webp', 384),
    ('assets/icons/skill_pet.webp', 384),
    ('assets/icons/skill_event.webp', 384),
    ('assets/icons/skill_ice.webp', 384),
    ('assets/icons/skill_dodge.webp', 384),
    ('assets/icons/skill_freeze.webp', 384),
]

total_before = 0
total_after = 0
for rel, max_w in TARGETS:
    full = os.path.join(ROOT, rel)
    before = os.path.getsize(full)
    total_before += before
    img = Image.open(full)
    if img.width > max_w:
        h = round(img.height * max_w / img.width)
        img = img.resize((max_w, h), Image.LANCZOS)
    img.save(full, 'WEBP', quality=70, method=6)
    after = os.path.getsize(full)
    total_after += after
    print(f'{rel}: {before//1024}KB -> {after//1024}KB')

print(f'TOTAL: {total_before/1e6:.2f}MB -> {total_after/1e6:.2f}MB')
