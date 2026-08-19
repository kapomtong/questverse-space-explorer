"""Test zero-ai image generation API (n=1) before mass production."""
import base64
import json
import sys
import urllib.parse
import urllib.request

BASE = "https://api.zero-ai.cc/img/v1"
KEY = "sk-0ai-dce0ebeb36b94eaa722e9f87e2aaa7f16dfb64b634f2c28e"

def gen_image(prompt: str, out_path: str, model: str = "flux-1.1-pro", size: str = "1024x1024") -> None:
    payload = json.dumps({
        "model": model,
        "prompt": prompt,
        "n": 1,
        "size": size,
    }).encode()
    req = urllib.request.Request(
        f"{BASE}/images/generations",
        data=payload,
        headers={
            "Authorization": f"Bearer {KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        body = json.loads(resp.read().decode())
    data = body["data"][0]
    if data.get("b64_json"):
        content = base64.b64decode(data["b64_json"])
    elif data.get("url"):
        content = urllib.request.urlopen(data["url"], timeout=60).read()
    else:
        raise RuntimeError(f"No image data: {json.dumps(body)[:300]}")
    with open(out_path, "wb") as f:
        f.write(content)
    print(f"saved {out_path} ({len(content)//1024} KB), model={body.get('model')}")

if __name__ == "__main__":
    prompt = "A small red circle centered on a plain white background, clean minimal style"
    gen_image(prompt, "assets/test_img_api.png")
    print("API test OK")
