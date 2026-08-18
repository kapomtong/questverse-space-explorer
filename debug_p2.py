import re
BASE = '/home/ubuntu/questverse-game'
c = open(f'{BASE}/responses/module4.md', encoding='utf-8', errors='replace').read()
p1 = '\n'.join(c.split('\n')[1:]).strip()
m = re.search(r'^(\s+)lingua\s*:\s*\{', p1, re.M)
body = p1[m.end():]
# หา pattern '    N:' — ตรวจแบบหลวมกว่า
for mm in re.finditer(r'(\d+)\s*:\s*\[', body):
    print('zone', mm.group(1), 'at pos', mm.start(), 'context:', repr(body[max(0,mm.start()-20):mm.start()+30]))
# ตรวจว่ามี '3:' ไหมเลย
print('has 3:', '3:' in body)
