#!/usr/bin/env python3
"""Merge boss.js from two Opus outputs."""
import re

def extract_block(path, start, end):
    t = open(path).read()
    # split by ```
    parts = t.split('```')
    # parts[1] = first code block content
    return parts[start].strip('\n').split('\n')

# Output1: one code block
block1 = extract_block('opus_boss_output.md', 1, 2)
# Output2: first code block (continuation)
block2 = extract_block('opus_boss_output2.md', 1, 2)

# block1 ends with "...    timer" (truncated mid-line) — drop that last line
while block1 and block1[-1].strip() == '':
    block1.pop()
if block1[-1].strip() == 'timer':
    block1.pop()

# block2 starts with "    timerInterval = null;" — keep
merged = block1 + [''] + block2

with open('js/boss.js', 'w') as f:
    f.write('\n'.join(merged) + '\n')

print('merged lines:', len(merged))
print('first lines:', merged[:3])
print('last lines:', merged[-4:])
