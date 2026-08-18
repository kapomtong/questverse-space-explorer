"""Extract questions.js from module4 response — fence may be unclosed."""
content = open('responses/module4.md', encoding='utf-8', errors='replace').read()
lines = content.split('\n')
# ตัดบรรทัดแรก (fence เปิด) และบรรทัดท้ายที่เป็น fence ปิด (ถ้ามี)
start = 1 if lines[0].strip().startswith('```') else 0
end = len(lines) - 1 if lines[-1].strip().startswith('```') else len(lines)
code = '\n'.join(lines[start:end]).strip()
open('js/questions.js', 'w').write(code + '\n')

# QA: ตรวจโครงสร้างและจำนวนคำถาม
import re
print('chars:', len(code))
qs = len(re.findall(r'q:\s*"', code))
hints = len(re.findall(r'hint:\s*"', code))
print('questions:', qs, '| hints:', hints)
print('tail:', code[-120:].replace('\n', ' '))
