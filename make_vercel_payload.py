#!/usr/bin/env python3
"""Pack questverse-game into Vercel deploy_to_vercel payload (base64 for images)."""
import json, base64, os

ROOT = '/home/ubuntu/questverse-game'
SKIP = {'call_claude.py', 'qa_all.js', 'qa_questions.js', 'repro.js', 'fix_app.js',
        'build_questions.py', 'module4.md', 'module4b.md', 'module4c.md',
        'module5.md', 'module6.md', 'vercel_deploy_input.json',
        'inspect_payload.py', 'inspect_payload2.py', 'optimize_assets2.py',
        'optimize_payload_imgs.py', 'make_arena_hd.py',
        'boss_lex.png', 'boss_kawi.png', 'boss_terra.png',
        'item_shield_new.png', 'item_potion.png', 'item_boost.png',
        'event_asteroid.png', 'event_blackhole.png', 'pet_mito.png',
        'event_gift.png', 'arena_kawi.jpg', 'arena_lex.jpg',
        'arena_terra.jpg', 'boss_arena.jpg', 'test_img_api.png',
        'remove_magenta.py', 'patch_boss_fixes.py', 'patch_sprites.py',
        'patch_boss_anim.py', 'patch_boss_anim2.py', 'patch_boss_anim3.py',
        'patch_overlap_skills.py', 'patch_hall_skills.py', 'fix_hall_comma.py',
        'patch_landing_guide.py', 'patch_skills_css.sh', 'patch_hall_comma.py',
        'shrink_payload.py',
        'arena_kawi.webp', 'arena_lex.webp', 'arena_terra.webp',
        'arena_mathos.webp', 'arena_chronos.webp',
        'boss_fireball.webp', 'boss_ice.webp', 'boss_portal.webp',
        'item_shield.svg', 'item_compass.svg', 'item_telescope.svg',
        'remove_bg.py', 'check_cut.py', 'apply_cuts.py', 'compress_assets.py',
        'webp_assets.py', 'png_to_webp_refs.py', 'remove_magenta.cpython-312.pyc'}
SKIP_DIR = {'prompts', 'responses', 'opus_out_v2', 'opus_out_v3', 'opus_out_v4', 'opus_out_v5', '__pycache__', 'screenshots'}
EXT_BINARY = {'.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.ico', '.mp3', '.wav'}

files = []
for dirpath, _, fnames in os.walk(ROOT):
    rel_dir = os.path.relpath(dirpath, ROOT)
    if '/.git' in ('/' + rel_dir) or rel_dir.startswith('.git'):
        continue
    if rel_dir in SKIP_DIR or rel_dir.split('/')[0] in SKIP_DIR:
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
