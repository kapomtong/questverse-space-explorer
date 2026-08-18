import re

files = ['js/landing.js', 'js/character.js', 'js/galaxy_map.js', 'js/leaderboard.js', 'js/game_state.js']
header = 'window.QV = window.QV || {};\nconst QV = window.QV;\n'

for f in files:
    code = open(f).read()
    # ตรวจว่ามี const/var/let QV declaration อยู่แล้วหรือไม่
    if re.search(r'^(const|var|let)\s+QV\s*=', code, re.M):
        print(f, 'already declares QV')
        continue
    # ตรวจว่ามี strict mode IIFE wrapper หรือไม่
    if '(function()' in code or code.startswith('(function'):
        print(f, 'is IIFE — check manually')
        continue
    # แทรก header หลังบรรทัดคอมเมนต์เปิด
    lines = code.split('\n')
    insert_at = 0
    for i, line in enumerate(lines):
        if line.startswith('//'):
            insert_at = i + 1
        elif line.strip() == '':
            continue
        else:
            break
    lines.insert(insert_at, 'window.QV = window.QV || {};')
    lines.insert(insert_at + 1, 'const QV = window.QV;')
    open(f, 'w').write('\n'.join(lines))
    print(f, 'fixed — inserted at line', insert_at + 1)
