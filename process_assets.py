"""Process generated assets: remove magenta background -> transparent webp.

Usage: python3 process_assets.py [--regen]
"""
import io
import os
import sys

from PIL import Image


def remove_magenta(src: str, dst: str, max_w: int = 600) -> None:
    img = Image.open(src).convert("RGBA")
    img.thumbnail((max_w, max_w), Image.LANCZOS)
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            # magenta-ish: high R, low G, high B
            if r > 190 and g < 120 and b > 190:
                px[x, y] = (0, 0, 0, 0)
            else:
                # soft edge: partial magenta -> reduce alpha
                if r > 160 and g < 160 and b > 160 and (r + b) > 2.2 * g:
                    px[x, y] = (r, g, b, max(0, a - 60))
    img.save(dst, "WEBP", quality=90, lossless=False)
    size = os.path.getsize(dst)
    print(f"{src} -> {dst} ({w}x{h}, {size//1024} KB)")


def process_arena(src: str, dst: str, max_w: int = 1280) -> None:
    img = Image.open(src)
    img.thumbnail((max_w, max_w), Image.LANCZOS)
    img.convert("RGB").save(dst, "WEBP", quality=82)
    size = os.path.getsize(dst)
    print(f"{src} -> {dst} ({img.size[0]}x{img.size[1]}, {size//1024} KB)")


if __name__ == "__main__":
    regen = "--regen" in sys.argv
    base = "assets"
    # Cutout assets (magenta background)
    cutouts = {
        "boss_kawi": ("assets/boss_kawi.png", f"{base}/boss_kawi.webp", 700),
        "boss_lex": ("assets/boss_lex.png", f"{base}/boss_lex.webp", 700),
        "boss_terra": ("assets/boss_terra.png", f"{base}/boss_terra.webp", 700),
        "item_shield": ("assets/item_shield_new.png", f"{base}/item_shield.webp", 320),
        "item_potion": ("assets/item_potion.png", f"{base}/item_potion.webp", 320),
        "item_boost": ("assets/item_boost.png", f"{base}/item_boost.webp", 320),
        "event_asteroid": ("assets/event_asteroid.png", f"{base}/event_asteroid.webp", 280),
        "event_blackhole": ("assets/event_blackhole.png", f"{base}/event_blackhole.webp", 280),
        "event_gift": ("assets/event_gift.png", f"{base}/event_gift.webp", 280),
        "pet_mito": ("assets/pet_mito.png", f"{base}/pet_mito.webp", 300),
    }
    for name, (src, dst, maxw) in cutouts.items():
        if regen or not os.path.exists(dst):
            remove_magenta(src, dst, maxw)
    # Arena backgrounds
    arenas = {
        "arena_kawi": (f"{base}/arena_kawi.jpg", f"{base}/arena_kawi.webp"),
        "arena_lex": (f"{base}/arena_lex.jpg", f"{base}/arena_lex.webp"),
        "arena_terra": (f"{base}/arena_terra.jpg", f"{base}/arena_terra.webp"),
    }
    for name, (src, dst) in arenas.items():
        if regen or not os.path.exists(dst):
            process_arena(src, dst)
    print("done")
