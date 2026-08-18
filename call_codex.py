"""Send coding instructions to Codex (gpt-5.6-sol) via zero-ai API and save the response."""
import json
import sys
import time
import requests

API_URL = "https://api.zero-ai.cc/v1/chat/completions"
API_KEY = "sk-0ai-18edf8a27ae96baa4a439a8fdb6f27ce1385a8cb01bcef4c"
MODEL = "gpt-5.6-sol"
FALLBACK_MODEL = "gpt-5.6-luna"

def call_codex(prompt_path, output_path, max_tokens=16000):
    with open(prompt_path) as f:
        prompt = f.read()
    last_err = None
    for attempt, model in enumerate([MODEL, FALLBACK_MODEL]):
        for retry in range(3):
            try:
                r = requests.post(API_URL, json={
                    "model": model,
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": max_tokens,
                }, headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "User-Agent": "questverse-build/1.0",
                }, timeout=600)
                r.raise_for_status()
                data = r.json()
                content = data["choices"][0]["message"]["content"]
                with open(output_path, "w") as f:
                    f.write(content)
                print(f"saved -> {output_path} ({len(content)} chars) [model={model}, attempt={attempt+1}]")
                return content
            except Exception as e:
                last_err = e
                print(f"  attempt {attempt+1}.{retry+1} failed ({model}): {type(e).__name__}: {e}")
                time.sleep(5 * (retry + 1))
    print("ALL ATTEMPTS FAILED:", last_err)
    sys.exit(1)

if __name__ == "__main__":
    call_codex(sys.argv[1], sys.argv[2])
