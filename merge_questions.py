"""Merge part1 (numberon+bionia+aksara+lingua0-3) + part2 (lingua4-5+civilis) into js/questions.js."""
import re

BASE = '/home/ubuntu/questverse-game'
p1 = open(f'{BASE}/responses/module4.md', encoding='utf-8', errors='replace').read()
p1 = '\n'.join(p1.split('\n')[1:]).strip()  # remove opening fence
p2 = open(f'{BASE}/responses/module4b.md', encoding='utf-8', errors='replace').read()
p2 = '\n'.join(p2.split('\n')[1:]).strip()

# ตัด closing fence ของ part2 ถ้ามี
if p2.rstrip().endswith('```'):
    p2 = p2.rstrip()[:-3].rstrip()

# part1: ตัดส่วนเกินหลัง lingua zone 3 — หาจุดเริ่มของ civilis (ไม่มี) และจุดสิ้นสุดที่สมบูรณ์
# part1 จบกะทันหันกลาง lingua zone 3 — แต่จากการวิเคราะห์: numberon 25, bionia 25, aksara 25 = 75 + lingua 4 = 79
# หมายความว่า lingua zone 3 ไม่ครบ (ควรมี 5 ข้อ, มี 4) — ต้องแก้
print('part1 chars:', len(p1))
print('part1 tail:', p1[-300:].replace('\n', ' '))
