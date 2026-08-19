import json, base64

d = json.load(open('vercel_deploy_input.json'))
files = d.get('files', d)
tot = 0
rows = []
if isinstance(files, dict):
    for k, v in files.items():
        try:
            size = len(base64.b64decode(v.get('data', ''), validate=False))
        except Exception:
            size = 0
        rows.append((k, size))
else:
    for f in files:
        data = f.get('data', '')
        try:
            size = len(base64.b64decode(data, validate=False))
        except Exception:
            size = len(data.encode('utf-8'))
        rows.append((f.get('file'), size))
rows.sort(key=lambda r: -r[1])
for k, size in rows:
    if size > 40000:
        print(f'{size//1024:>6} KB  {k}')
    tot += size
print('INCLUDED TOTAL', tot // 1024, 'KB')
