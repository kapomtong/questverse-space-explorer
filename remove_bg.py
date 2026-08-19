"""Remove near-black background from boss sprites (flood fill from edges),
then trim transparent margins, keep RGBA webp."""
from PIL import Image
import sys
from collections import deque

def remove_black_bg(src, dst, thresh=42, margin=4):
    im = Image.open(src).convert('RGBA')
    w, h = im.size
    px = im.load()
    out = im.copy()
    po = out.load()
    visited = bytearray(w * h)

    def is_dark(x, y):
        r, g, b, a = px[x, y]
        return r < thresh and g < thresh and b < thresh

    # flood fill from all edge pixels
    dq = deque()
    for x in range(w):
        for y in (0, h - 1):
            if is_dark(x, y) and not visited[x + y * w]:
                visited[x + y * w] = 1
                dq.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if is_dark(x, y) and not visited[x + y * w]:
                visited[x + y * w] = 1
                dq.append((x, y))

    while dq:
        x, y = dq.popleft()
        po[x, y] = (0, 0, 0, 0)
        for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if 0 <= nx < w and 0 <= ny < h:
                k = nx + ny * w
                if not visited[k] and is_dark(nx, ny):
                    visited[k] = 1
                    dq.append((nx, ny))

    # trim transparent margins
    bbox = out.getbbox()
    if bbox:
        l, t, r, b = bbox
        # add small margin to be safe from edge artifacts
        l = max(0, l - margin); t = max(0, t - margin)
        r = min(w, r + margin); b = min(h, b + margin)
        out = out.crop((l, t, r, b))
    out.save(dst, 'WEBP', quality=90)
    print(dst, out.size, 'orig', im.size)

if __name__ == '__main__':
    files = ['boss_mathos', 'boss_chronos', 'boss_kawi', 'boss_lex', 'boss_terra']
    for f in files:
        remove_black_bg(f'assets/{f}.webp', f'assets/{f}_cut.webp')
