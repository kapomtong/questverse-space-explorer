"""Send coding instructions to Claude Opus 5 via zero-ai Claude endpoint."""
import json
import sys
import time
import requests

API_URL = "https://api.zero-ai.cc/claude/v1/messages"
API_KEY = "sk-0ai-551cf3c37d3359d7cedfd8d21e073e201ecd9bb4148dccb8"
MODEL = "claude-opus-5"

def call_claude(prompt_path, output_path, max_tokens=32000, retries=3):
    with open(prompt_path) as f:
        prompt = f.read()
    last_err = None
    for attempt in range(retries):
        try:
            r = requests.post(API_URL, json={
                "model": MODEL,
                "max_tokens": max_tokens,
                "messages": [{"role": "user", "content": prompt}],
            }, headers={
                "x-api-key": API_KEY,
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01",
                "User-Agent": "questverse-build/1.0",
            }, timeout=900, stream=True)
            r.raise_for_status()
            text = []
            for line in r.iter_lines():
                if not line:
                    continue
                line = line.decode("utf-8")
                if line.startswith("data: "):
                    try:
                        data = json.loads(line[6:])
                    except Exception:
                        continue
                    if data.get("type") == "content_block_delta":
                        delta = data.get("delta", {})
                        if delta.get("type") == "text_delta":
                            text.append(delta["text"])
                    elif data.get("type") == "error":
                        raise RuntimeError(json.dumps(data))
            content = "".join(text)
            with open(output_path, "w") as f:
                f.write(content)
            print(f"saved -> {output_path} ({len(content)} chars) [attempt={attempt+1}]")
            return content
        except Exception as e:
            last_err = e
            print(f"  attempt {attempt+1} failed: {type(e).__name__}: {str(e)[:200]}")
            time.sleep(5 * (attempt + 1))
    print("ALL ATTEMPTS FAILED:", last_err)
    sys.exit(1)

if __name__ == "__main__":
    call_claude(sys.argv[1], sys.argv[2])
