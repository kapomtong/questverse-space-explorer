"""Call Claude Opus 5 API (streaming SSE) with user message. Saves full text to output file."""
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
        "stream": True,
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
    full_text = ""
    stop_reason = ""
    with urllib.request.urlopen(req, timeout=600) as resp:
        buf = b""
        for chunk in iter(lambda: resp.read(8192), b""):
            buf += chunk
            while b"\n\n" in buf:
                head, buf = buf.split(b"\n\n", 1)
                lines = head.decode("utf-8", errors="replace").split("\n")
                evt = ""
                data = ""
                for ln in lines:
                    if ln.startswith("event:"):
                        evt = ln[6:].strip()
                    elif ln.startswith("data:"):
                        data = ln[5:].strip()
                if evt == "content_block_delta" and data:
                    try:
                        j = json.loads(data)
                        delta = j.get("delta", {})
                        if delta.get("type") == "text_delta":
                            full_text += delta.get("text", "")
                    except Exception:
                        pass
                elif evt == "message_delta" and data:
                    try:
                        stop_reason = json.loads(data).get("delta", {}).get("stop_reason", "")
                    except Exception:
                        pass
    open(out_file, "w").write(full_text)
    print(f"OK -> {out_file} ({len(full_text)} chars), stop_reason={stop_reason}")
