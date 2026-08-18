"""Clean magenta fringe on transparent edges of assets that used #FF00FF chroma.
Strategy: for near-magenta pixels that are semi-transparent (edge pixels), shift their hue
toward a neutral dark/transparent tone to remove magenta fringe.
"""
from PIL import Image
import numpy as np

def clean(path):
    im = Image.open(path).convert("RGBA")
    a = np.array(im).astype(np.int16)
    r, g, b, alpha = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    # magenta-ish: red and blue high, green low
    magenta = (r > 120) & (b > 120) & (g < 130) & (alpha > 0)
    # Only affect pixels that are not fully opaque (edge/feathered pixels)
    edge = magenta & (alpha < 245)
    if edge.sum() == 0:
        print(path, "no magenta edges")
        return
    # Push RGB of those pixels toward dark, keep alpha (creates soft clean edge)
    a[..., 0][edge] = (r[edge] * 0.3 + g[edge] * 0.5).astype(np.int16)
    a[..., 2][edge] = (b[edge] * 0.3 + g[edge] * 0.5).astype(np.int16)
    Image.fromarray(a.astype(np.uint8)).save(path, "PNG")
    print(path, "cleaned", edge.sum(), "pixels")

clean("/home/ubuntu/questverse-game/assets/suit_green.png")
clean("/home/ubuntu/questverse-game/assets/planet_bionia.png")
