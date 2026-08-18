import json

d = json.load(open('vercel_deploy_input.json'))
files = d.get('files')
print('before:', len(files))

skip_dir = {'prompts', 'responses'}
skip_names = {
    'DEPLOY_STATE.md', 'UI_UPDATE_PLAN.md', 'PROMPTS_IMAGES.md',
    'make_vercel_payload.py', 'optimize_assets.py', 'clean_edges.py',
    'call_codex.py', 'extract_blocks.py', 'extract_questions.py',
    'merge_questions.py', 'analyze_parts.py', 'debug_p1.py', 'debug_p2.py',
    'debug_qs.js', 'fix_qv.py', 'read_deploys.py', 'check_deploy_detail.py',
    'find_project.py', 'shrink_payload.py', 'git_push_plan.py',
}

keep = []
total = 0
for f in files:
    p = f.get('file') or f.get('path') or ''
    if not p:
        keep.append(f)
        continue
    top = p.split('/')[0]
    if top in skip_dir:
        continue
    bn = p.split('/')[-1]
    if bn in skip_names or bn.startswith('.'):
        continue
    content = f.get('content') or f.get('data') or ''
    f['size'] = len(content.encode('utf-8')) if isinstance(content, str) else len(content)
    total += f['size']
    keep.append(f)

d['files'] = keep
json.dump(d, open('vercel_deploy_input.json', 'w'))
print('after:', len(keep), 'total MB:', round(total / 1048576, 2))
