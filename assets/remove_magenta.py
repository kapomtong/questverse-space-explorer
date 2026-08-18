#!/usr/bin/env python3
"""Remove magenta (#FF00FF) background, crop to content, resize, save as webp."""
from PIL import Image
import sys
import numpy as np

def process(src, dst, size):
    img = Image.open(src).convert('RGB')
    a = np.asarray(img).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    # magenta-ish: high R, low G, high B
    mask = (r > 180) & (b > 180) & (g < 120)
    alpha = np.where(mask, 0, 255).astype(np.uint8)
    # soft edge: partial magenta pixels -> feather
    rgba = np.dstack([np.asarray(img), alpha])
    out = Image.fromarray(rgba.astype(np.uint8), 'RGBA')
    # crop to content bbox
    bbox = out.split()[-1].getbbox()
    if bbox:
        pad = 8
        l, t, rr, bb = bbox
        l = max(0, l - pad); t = max(0, t - pad)
        rr = min(out.width, rr + pad); bb = min(out.height, bb + pad)
        out = out.crop((l, t, rr, bb))
    out = out.resize((size, size), Image.LANCZOS)
    out.save(dst, 'WEBP', quality=92)
    print(f"{dst}: {out.size}")

if __name__ == '__main__':
    # src dst size
    jobs = [
        ('/tmp/shield_src.png', 'assets/item_shield.webp', 256),
        ('/tmp/compass_src.png', 'assets/item_compass.webp', 256),
        ('/tmp/telescope_src.png', 'assets/item_telescope.webp', 256),
        ('/tmp/ship_src.png', 'assets/explorer_ship.webp', 512),
        ('/tmp/card_goldstar.png', 'assets/card_goldstar.webp', 256),
        ('/tmp/card_sparkle.png', 'assets/card_sparkle.webp', 256),
        ('/tmp/card_comet.png', 'assets/card_comet.webp', 256),
        ('/tmp/card_moon.png', 'assets/card_moon.webp', 256),
        ('/tmp/card_nebula.png', 'assets/card_nebula.webp', 256),
        ('/tmp/card_star3.png', 'assets/card_star3.webp', 256),
        ('/tmp/card_telescope.png', 'assets/card_telescope_icon.webp', 256),
        ('/tmp/card_doublespark.png', 'assets/card_doublespark.webp', 256),
    ]
    for s, d, sz in jobs:
        process(s, d, sz)
