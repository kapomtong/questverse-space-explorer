"""Call Claude Opus 5 API NON-streaming. Saves raw response JSON and full text."""
import json
import sys
import urllib.request

BASE = "https://api.zero-ai.cc/claude/v1"
KEY = "sk-0ai-551cf3c37d3359d7cedfd8d21e073e201ecd9bb4148dccb8"

if __name__ == "__main__":
    prompt_file = sys.argv[1]
    out_file = sys.argv[2]
    max_tokens = int(sys.argv[3]) if len(sys.argv) > 3 else 16000

    prompt = open(prompt_file).read()
    payload = json.dumps({
        "model": "claude-opus-5",
        "max_tokens": max_tokens,
        "stream": False,
        "tool_choice": {"type": "none"},
        "messages": [
            {"role": "user", "content": prompt},
        ],
    }).encode()
    req = urllib.request.Request(
        f"{BASE}/messages",
        data=payload,
        headers={
            "Authorization": f"Bearer {KEY}",
            "Content-Type": "application/json",
            "User-Agent": "python-requests/2.31",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=600) as resp:
        raw = resp.read().decode("utf-8", errors="replace")
    try:
        j = json.loads(raw)
        text = "\n".join(
            c.get("text", "") for c in j.get("content", []) if c.get("type") == "text"
        )
        stop = j.get("stop_reason", "")
        print("stop_reason =", stop)
    except Exception:
        text = raw
    open(out_file, "w").write(text)
    print(f"OK -> {out_file} ({len(text)} chars)")
