#!/usr/bin/env python3
import json, sys

d = json.load(open('vercel_deploy_input.json'))
print('top-level keys:', list(d.keys()))
files = None
if isinstance(d.get('input'), dict):
    files = d['input'].get('files')
if files is None:
    files = d.get('files')
total = 0
for f in files:
    name = f.get('file') or f.get('filename') or '?'
    size = len(f['data']) // 1024
    total += size
print(f'total KB: {total}, n: {len(files)}')
print('file entry keys:', list(files[0].keys()))
for f in sorted(files, key=lambda f: -len(f['data']))[:18]:
    key = f.get('file') or f.get('path') or f.get('filename') or '?'
    print(f'{len(f["data"])//1024:6d} KB  {key}')
