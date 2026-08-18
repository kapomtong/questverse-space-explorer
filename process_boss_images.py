#!/usr/bin/env python3
"""Process boss images v3:
- Build a "magenta-ish" mask with generous tolerance (r>160, b>160, g<150)
- Find connected components (4-connected) of that mask
- Keep only components that touch the image border OR are tiny border-touching noise
- BUT boss body is also purple -> risk of removing body!
  -> Restriction: only treat as background pixels whose *local* color is
     clearly magenta: r>=200, b>=200, g<=90  (pure-ish magenta)
     or slightly noisy: r>=180, b>=180, g<=120
  Body purple is much darker (r~90-140, b~140-180, g~60-110) -> won't match r>=180.
- For safety combine: loose mask (r>160&b>160&g<150) intersected with
  components touching border — removes both solid and noisy bg regions.
"""
from PIL import Image, ImageFilter
import numpy as np
from scipy import ndimage


def process(src, dst, size):
    img = Image.open(src).convert('RGB')
    a = np.asarray(img).astype(np.int32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    h, w = r.shape

    # strict-ish magenta candidate (background)
    cand = (r > 160) & (b > 160) & (g < 150)

    # connected components of candidates
    lab, n = ndimage.label(cand)

    # components touching border
    border_labels = set(lab[0, :]) | set(lab[-1, :]) | set(lab[:, 0]) | set(lab[:, -1])
    border_labels.discard(0)

    bg = np.isin(lab, list(border_labels))

    alpha = np.where(bg, 0, 255).astype(np.float32)

    # dehalo: pixels still magenta-ish AND near the new alpha edge -> desaturate to
    # the median of nearby non-magenta pixels (simple: shrink alpha border by
    # treating noisy magenta fringe as transparent, then blur)
    fringe = cand & ~bg
    # fringe is noisy pink halo around boss; push it transparent
    fringe = ndimage.binary_dilation(fringe, iterations=2) & ~bg
    alpha[fringe] = 0

    rgba = np.dstack([np.asarray(img), alpha.astype(np.uint8)])
    out = Image.fromarray(rgba.astype(np.uint8), 'RGBA')

    # soft edge
    alpha = out.split()[-1].filter(ImageFilter.GaussianBlur(1.0))
    out = Image.merge('RGBA', list(out.split()[:3]) + [alpha])

    bbox = out.split()[-1].getbbox()
    if bbox:
        pad = 6
        l, t, rr, bb = bbox
        l = max(0, l - pad); t = max(0, t - pad)
        rr = min(out.width, rr + pad); bb = min(out.height, bb + pad)
        out = out.crop((l, t, rr, bb))
    out = out.resize((size, size), Image.LANCZOS)
    out.save(dst, 'WEBP', quality=92)
    print(f"{dst}: {out.size}, bg components removed: {len(border_labels)}")


if __name__ == '__main__':
    jobs = [
        ('/home/ubuntu/upload/gpt-image-2-1787057433-1.png', 'assets/boss_mathos.webp', 512),
        ('/home/ubuntu/upload/gpt-image-2-1787057553-1.png', 'assets/boss_chronos.webp', 512),
        ('/home/ubuntu/upload/gpt-image-2-1787057622-1.png', 'assets/boss_fireball.webp', 256),
        ('/home/ubuntu/upload/gpt-image-2-1787057675-1.png', 'assets/boss_ice.webp', 256),
        ('/home/ubuntu/upload/gpt-image-2-1787057737-1.png', 'assets/boss_portal.webp', 256),
    ]
    for s, d, sz in jobs:
        process(s, d, sz)
