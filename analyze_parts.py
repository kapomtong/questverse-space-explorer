"""Analyze exact coverage of part1 and part2 questions."""
import re

BASE = '/home/ubuntu/questverse-game'
p1 = open(f'{BASE}/responses/module4.md', encoding='utf-8', errors='replace').read()
p1 = '\n'.join(p1.split('\n')[1:]).strip()
p2 = open(f'{BASE}/responses/module4b.md', encoding='utf-8', errors='replace').read()
p2 = '\n'.join(p2.split('\n')[1:]).strip()

# แบ่ง part1 ตามดาว: หาบรรทัดเริ่มต้นของแต่ละดาว
planet_starts = {}
for name in ['numberon', 'bionia', 'aksara', 'lingua', 'civilis']:
    for m in re.finditer(rf'^\s+({name})\s*:', p1, re.M):
        planet_starts.setdefault(name, []).append(m.start())

# นับคำถามใน part1 ตามช่วงดาว
def count_qs(text):
    return len(re.findall(r'q:\s*"', text))

for name, starts in planet_starts.items():
    for i, s in enumerate(starts):
        e = starts[i+1] if i+1 < len(starts) else len(p1)
        seg = p1[s:e]
        print(f'part1 {name} seg{i}: {count_qs(seg)} qs')

# ตรวจ part2: lingua zones + civilis zones
m_lingua = re.search(r'lingua\s*:\s*\{', p2)
m_civ = re.search(r'civilis\s*:\s*\{', p2)
if m_lingua and m_civ:
    ling = p2[m_lingua.end():m_civ.start()]
    civ = p2[m_civ.end():]
    print(f'part2 lingua zones: {re.findall(r"^\s+\d+:", ling, re.M)} | qs: {count_qs(ling)}')
    print(f'part2 civilis zones: {re.findall(r"^\s+\d+:", civ, re.M)} | qs: {count_qs(civ)}')
else:
    print('part2 structure not found as expected')
