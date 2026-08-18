#!/usr/bin/env python3
"""Pack questverse-game into Vercel deploy_to_vercel payload (base64 for images)."""
import json, base64, os

ROOT = '/home/ubuntu/questverse-game'
SKIP = {'call_claude.py', 'qa_all.js', 'qa_questions.js', 'repro.js', 'fix_app.js',
        'build_questions.py', 'module4.md', 'module4b.md', 'module4c.md',
        'module5.md', 'module6.md', 'vercel_deploy_input.json'}
EXT_BINARY = {'.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.ico', '.mp3', '.wav'}

files = []
for dirpath, _, fnames in os.walk(ROOT):
    rel_dir = os.path.relpath(dirpath, ROOT)
    if '/.git' in ('/' + rel_dir) or rel_dir.startswith('.git'):
        continue
    for fn in fnames:
        if fn in SKIP or fn.startswith('.'):
            continue
        full = os.path.join(dirpath, fn)
        rel = fn if rel_dir == '.' else f'{rel_dir}/{fn}'
        with open(full, 'rb') as f:
            raw = f.read()
        is_binary = b'\x00' in raw
        if is_binary:
            files.append({'file': rel, 'data': base64.b64encode(raw).decode(), 'encoding': 'base64'})
        else:
            try:
                files.append({'file': rel, 'data': raw.decode('utf-8'), 'encoding': 'utf-8'})
            except UnicodeDecodeError:
                # fallback: binary base64
                files.append({'file': rel, 'data': base64.b64encode(raw).decode(), 'encoding': 'base64'})

payload = {
    'teamId': 'team_M57w1DW5EdqJADbOQsFLkJPK',
    'name': 'questverse-space-explorer',
    'target': 'production',
    'projectSettings': {'framework': None},
    'files': files,
}
with open('/home/ubuntu/questverse-game/vercel_deploy_input.json', 'w') as f:
    json.dump(payload, f, ensure_ascii=False)
total = sum(len(x['data']) for x in files)
print(f'files: {len(files)}, total size: {total/1e6:.1f} MB')
for x in files:
    print(x['file'], len(x['data'])//1024, 'KB')
