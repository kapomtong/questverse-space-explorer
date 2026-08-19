"""Generate all Boss Rush Academy assets via zero-ai image API (model=gpt-image-2).

Usage: python3 gen_images.py [single-name]
  If single-name given, only generate that one image (saves quota).
"""
import base64
import json
import sys
import urllib.request

BASE = "https://api.zero-ai.cc/img/v1"
KEY = "sk-0ai-dce0ebeb36b94eaa722e9f87e2aaa7f16dfb64b634f2c28e"

PROMPTS = {
    "boss_kawi": {
        "out": "assets/boss_kawi.png",
        "prompt": (
            "A majestic Thai elephant-headed poet sage character (Kawi the Scribe), "
            "full body, front-facing, video-game boss sprite style, standing pose. "
            "Gray-blue elephant skin with golden ornate armor, wearing a glowing purple "
            "lotus-flower crown, holding a giant magical calligraphy brush dripping with "
            "glowing violet ink. Wise gentle face, wearing round scholar spectacles. "
            "Robe with Thai traditional patterns in purple and gold. Soft magical glow "
            "around the brush. Flat solid pure magenta background (#FF00FF), no shadows "
            "on background, character fully visible head to feet, centered, "
            "high quality 2D game art, vibrant colors, clean outlines."
        ),
    },
    "boss_lex": {
        "out": "assets/boss_lex.png",
        "prompt": (
            "A magnificent phoenix oracle character (Lex the Oracle), full body, "
            "video-game boss sprite style, majestic standing pose with wings partially "
            "spread. Fiery red and gold plumage, wearing elegant gold-rimmed "
            "spectacles over piercing wise eyes, a glowing golden halo ring floating "
            "behind its head, talons holding an ancient scroll. Mysterious prophetic "
            "aura with small floating glowing letters A B C around it. Flat solid "
            "pure magenta background (#FF00FF), no shadows on background, character "
            "fully visible, centered, high quality 2D game art, vibrant colors, "
            "clean outlines."
        ),
    },
    "boss_terra": {
        "out": "assets/boss_terra.png",
        "prompt": (
            "A colossal ancient stone golem titan (Sage Terra), full body, "
            "video-game boss sprite style, powerful standing pose. Made of weathered "
            "gray-brown ancient rock with glowing green earth-energy cracks, "
            "half-human half-planet body with a miniature glowing Earth globe "
            "embedded in its chest, wearing ancient warrior shoulder pads shaped "
            "like maps of the world, holding a huge round shield depicting a "
            "world map, moss and vines on its arms. Flat solid pure magenta "
            "background (#FF00FF), no shadows on background, character fully "
            "visible head to feet, centered, high quality 2D game art, vibrant "
            "colors, clean outlines."
        ),
    },
    "arena_kawi": {
        "out": "assets/arena_kawi.jpg",
        "prompt": (
            "A magical Thai garden courtyard arena at dusk for a video game boss "
            "battle, wide view of a large flat dark stone tile platform in the "
            "foreground (gameplay floor, occupying lower half), surrounded by "
            "elegant golden Thai temple pillars with glowing ancient Thai script "
            "carvings, floating glowing purple ink characters in the air, lotus "
            "ponds with glowing purple flowers at the sides, dreamy purple and gold "
            "night sky with floating parchment scrolls. The center floor must be "
            "relatively dark, flat and uncluttered so game characters can walk on it. "
            "Epic fantasy game background art, rich colors, no text, no watermark."
        ),
    },
    "arena_lex": {
        "out": "assets/arena_lex.jpg",
        "prompt": (
            "A crystal tower summit arena for a video game boss battle, wide view of "
            "a large flat dark reflective tile platform in the foreground (gameplay "
            "floor, occupying lower half), floating giant glowing golden alphabet "
            "letters suspended in a twilight sky, red-gold phoenix feathers drifting "
            "in the air, tall crystal spires around the edges glowing warm amber, "
            "a giant broken quill statue in the far background, dreamy orange and "
            "purple clouds. The center floor must be relatively dark, flat and "
            "uncluttered so game characters can walk on it. Epic fantasy game "
            "background art, rich colors, no text, no watermark."
        ),
    },
    "arena_terra": {
        "out": "assets/arena_terra.jpg",
        "prompt": (
            "An ancient civilization ruins arena for a video game boss battle, wide "
            "view of a large flat weathered dark stone tile platform in the foreground "
            "(gameplay floor, occupying lower half), crumbling ancient temple columns "
            "with map carvings around the edges, giant floating broken stone "
            "fragments and a glowing green planetary energy field in the sky, "
            "ancient stone compass rose carved into the far wall, warm torch light "
            "and emerald glow. The center floor must be relatively dark, flat and "
            "uncluttered so game characters can walk on it. Epic fantasy game "
            "background art, rich colors, no text, no watermark."
        ),
    },
    "item_shield": {
        "out": "assets/item_shield_new.png",
        "prompt": (
            "A futuristic space shield item icon for a video game, single object, "
            "centered, sleek silver and cyan energy shield with glowing blue hexagon "
            "pattern, small golden star emblem in the center, thick clean outlines, "
            "game item icon style, vibrant, flat solid pure magenta background "
            "(#FF00FF)."
        ),
    },
    "item_potion": {
        "out": "assets/item_potion.png",
        "prompt": (
            "A glowing energy potion flask item icon for a video game, single object, "
            "centered, glass flask filled with bright green glowing liquid, cork "
            "stopper, golden metal frame around the glass, small sparkles, thick "
            "clean outlines, game item icon style, vibrant, flat solid pure magenta "
            "background (#FF00FF)."
        ),
    },
    "item_boost": {
        "out": "assets/item_boost.png",
        "prompt": (
            "A lightning bolt power-up item icon for a video game, single object, "
            "centered, bright yellow electric bolt wrapped with cyan energy swirl, "
            "small speed lines, thick clean outlines, game item icon style, vibrant, "
            "flat solid pure magenta background (#FF00FF)."
        ),
    },
    "event_asteroid": {
        "out": "assets/event_asteroid.png",
        "prompt": (
            "A fiery asteroid meteor item icon for a video game event card, single "
            "object, centered, burning orange-red space rock with trailing flames and "
            "smoke, thick clean outlines, game icon style, vibrant, flat solid pure "
            "magenta background (#FF00FF)."
        ),
    },
    "event_blackhole": {
        "out": "assets/event_blackhole.png",
        "prompt": (
            "A mystical black hole item icon for a video game event card, single "
            "object, centered, swirling purple-violet vortex with glowing accretion "
            "ring, small stars being pulled in, thick clean outlines, game icon "
            "style, vibrant, flat solid pure magenta background (#FF00FF)."
        ),
    },
    "event_gift": {
        "out": "assets/event_gift.png",
        "prompt": (
            "A magical golden gift box item icon for a video game event card, single "
            "object, centered, shiny golden gift box with cyan ribbon, sparkles and "
            "small hearts floating around, thick clean outlines, game icon style, "
            "vibrant, flat solid pure magenta background (#FF00FF)."
        ),
    },
    "pet_mito": {
        "out": "assets/pet_mito.png",
        "prompt": (
            "A cute small floating space robot companion pet for a video game, single "
            "character, centered, round chubby baby robot, light blue body with white "
            "accents, big friendly glowing cyan eyes, tiny thruster flame at the "
            "bottom, small antenna with a glowing ball, happy expression, thick "
            "clean outlines, chibi style, game companion art, vibrant, flat solid "
            "pure magenta background (#FF00FF)."
        ),
    },
}


def gen(name: str) -> None:
    spec = PROMPTS[name]
    payload = json.dumps({
        "model": "gpt-image-2",
        "prompt": spec["prompt"],
        "n": 1,
        "size": "1024x1024",
    }).encode()
    req = urllib.request.Request(
        f"{BASE}/images/generations",
        data=payload,
        headers={
            "Authorization": f"Bearer {KEY}",
            "Content-Type": "application/json", "User-Agent": "python-requests/2.31",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=180) as resp:
        body = json.loads(resp.read().decode())
    content = base64.b64decode(body["data"][0]["b64_json"])
    with open(spec["out"], "wb") as f:
        f.write(content)
    print(f"OK {name} -> {spec['out']} ({len(content)//1024} KB)")


if __name__ == "__main__":
    names = [sys.argv[1]] if len(sys.argv) > 1 else list(PROMPTS)
    for n in names:
        try:
            gen(n)
        except Exception as e:
            print(f"FAIL {n}: {e}")
