import re
BASE = '/home/ubuntu/questverse-game'
c = open(f'{BASE}/responses/module4.md', encoding='utf-8', errors='replace').read()
lines = c.split('\n')
p1 = '\n'.join(lines[1:]).strip()
m = re.search(r'^(\s+)lingua\s*:\s*\{', p1, re.M)
print('m:', m)
if m:
    body = p1[m.end():]
    print('body first 150:', repr(body[:150]))
    # หาเลข zone ใน lingua
    for mm in re.finditer(r'^\s*(\d+)\s*:', body, re.M):
        print('zone at', mm.start(), ':', mm.group(1), repr(body[mm.start():mm.start()+10]))
    print('body tail:', repr(body[-200:]))
