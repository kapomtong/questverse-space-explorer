#!/usr/bin/env python3
"""เรียก Claude Opus 5 ตรวจ boss.js รอบสุดท้าย — handle SSE streaming"""
import json
import requests

API_URL = "https://api.zero-ai.cc/claude/v1/messages"
KEY = "sk-0ai-551cf3c37d3359d7cedfd8d21e073e201ecd9bb4148dccb8"

prompt = open('/home/ubuntu/questverse-game/prompt_opus_boss_review.txt').read()
boss_code = open('/home/ubuntu/questverse-game/js/boss.js').read()

body = {
    "model": "claude-opus-5",
    "max_tokens": 8000,
    "stream": True,
    "messages": [
        {"role": "user", "content": prompt + "\n\n## โค้ดไฟล์ js/boss.js\n\n```javascript\n" + boss_code + "\n```"}
    ]
}

r = requests.post(API_URL, headers={"x-api-key": KEY, "content-type": "application/json"}, json=body, timeout=300)
print('status:', r.status_code)

text_parts = []
for line in r.iter_lines(decode_unicode=True):
    if not line or not line.startswith('data:'):
        continue
    data = line[5:].strip()
    if not data or data == '[DONE]':
        continue
    try:
        evt = json.loads(data)
    except Exception:
        continue
    t = evt.get('type', '')
    if t == 'content_block_delta':
        d = evt.get('delta', {})
        if d.get('type') == 'text_delta':
            text_parts.append(d.get('text', ''))

text = ''.join(text_parts)
open('/home/ubuntu/questverse-game/opus_boss_review_output.md', 'w').write(text)
print('total chars:', len(text))
print(text[:3000])
