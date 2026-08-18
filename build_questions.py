"""Build final js/questions.js:
- p1 (module4): numberon+bionia+aksara ครบ + lingua block (4 ข้อ ถูกตัด — ทิ้งทั้ง block)
- p4d (module4d): QVL — lingua ครบ 25 ข้อ
- p2 (module4b): QV2 — civilis ครบ 25 ข้อ (lingua z4-5 ไม่ต้องใช้ เพราะ 4d ครบกว่า)
"""
import re

BASE = '/home/ubuntu/questverse-game'

def extract(path):
    c = open(f'{BASE}/{path}', encoding='utf-8', errors='replace').read()
    lines = c.split('\n')
    start = 1 if lines[0].strip().startswith('```') else 0
    end = len(lines) - 1 if lines[-1].strip().startswith('```') else len(lines)
    return '\n'.join(lines[start:end]).strip()

p1 = extract('responses/module4.md')   # header + numberon/bionia/aksara + lingua(incomplete)
p4d = extract('responses/module4d.md') # const QVL = { 0:[..] ... 4:[..] };
p2 = extract('responses/module4b.md')  # const QV2 = { lingua: {4,5}, civilis: {0..4} }

# ---------- 1. ตัด lingua block ออกจาก p1 ----------
m_lingua = re.search(r'^(\s+)lingua\s*:\s*\{', p1, re.M)
assert m_lingua
pre = p1[:m_lingua.start()]  # 'QV.QUESTIONS = {\n  numberon: {...}, bionia: {...}, aksara: {...},'
pre = pre.rstrip()
assert pre.endswith(','), 'pre does not end with comma'
pre = pre + '\n'
# ตัด header 'QV.QUESTIONS =' ออก — หาตำแหน่ง '=' แรกของบรรทัด QV.QUESTIONS
m_eq = re.search(r'^QV\.QUESTIONS\s*=\s*', pre, re.M)
assert m_eq
pre = pre[m_eq.end():]  # เหลือ '{\n  numberon: ...,'
pre = pre.lstrip('{').lstrip()  # ตัด '{' แรกออก เพราะ header ใส่แล้ว

# ---------- 2. lingua จาก 4d ----------
# p4d: 'const QVL = {\n  0: [ ... ], ... 4: [ ... ]\n};' อาจไม่มี closing
m_qvl = re.search(r'=\s*\{', p4d)
lingua_body = p4d[m_qvl.end():]
lingua_body = lingua_body.rstrip('`').strip()
# ตัด closing } }; และ ;
lingua_body = re.sub(r'\}\s*\}?\s*;?\s*$', '', lingua_body).rstrip()
# ตรวจจำนวนข้อ
qs4d = len(re.findall(r'q:\s*"', lingua_body))
zones4d = re.findall(r'^\s+(\d+)\s*:', lingua_body, re.M)
print('4d zones:', zones4d, '| qs:', qs4d)
assert qs4d == 25, f'4d has {qs4d} questions, need 25'

# ---------- 3. civilis จาก p2 ----------
m2c = re.search(r'civilis\s*:\s*\{', p2)
assert m2c
civ_body = p2[m2c.end():]
civ_body = civ_body.rstrip('`').strip()
civ_body = re.sub(r'\}\s*\}?\s*;?\s*$', '', civ_body).rstrip()
qsc = len(re.findall(r'q:\s*"', civ_body))
print('civilis qs:', qsc)
assert qsc == 25, f'civilis has {qsc} questions, need 25'

# ---------- 4. ประกอบ ----------
out = []
out.append('// js/questions.js — Claude Opus 5 (modules 4/4b/4d) + merge by Manus')
out.append('// ดาว 5 ดวง x โซน 5 โซน x 5 ข้อ = 125 ข้อ — ระดับ ม.1')
out.append('const QV = window.QV || {};')
out.append('QV.QUESTIONS = {')
# pre = '{\n  numberon: ...,'
out.append(pre)
out.append('  lingua: {')
out.append(lingua_body)
out.append('  },')
out.append('  civilis: {')
out.append(civ_body)
out.append('  }')
out.append('};')
out.append('window.QV = QV;')

final = '\n'.join(out) + '\n'
open(f'{BASE}/js/questions.js', 'w').write(final)
print('FINAL written:', len(final), 'chars | total qs:', len(re.findall(r'q:\s*"', final)))
