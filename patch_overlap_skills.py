#!/usr/bin/env python3
"""Fixes: (1) pad slots must never overlap question bar / HUD,
(2) hide boss during intro cut-in, (3) skill button in boss hall + skills modal,
(4) landing guide Boss Rush skills section."""
import re

SRC = 'js/boss.js'
CSS = 'style.css'
HALL = 'js/bossHall.js'
LAND = 'js/landing.js'

src = open(SRC, encoding='utf-8').read()

def repl(block_label, pattern, replacement, s, expected=1):
    n = len(re.findall(pattern, s))
    if n != expected:
        raise AssertionError(f'{block_label}: expected {expected} match, found {n}')
    s = re.sub(pattern, replacement, s, count=expected)
    return s

# --- FIX 1: PAD_SLOTS — remove dangerous top-15/20/25 slots, use deeper spread ---
old_slots = r"PAD_SLOTS: \[\s*\{ left: 15, top: 20 \},\s*\{ left: 75, top: 25 \},\s*\{ left: 10, top: 60 \},\s*\{ left: 85, top: 65 \},\s*\{ left: 40, top: 15 \},\s*\{ left: 60, top: 75 \},\s*\{ left: 25, top: 80 \},\s*\{ left: 70, top: 45 \}\s*\]"
new_slots = """PAD_SLOTS: [
    { left: 12, top: 55 },
    { left: 88, top: 55 },
    { left: 20, top: 72 },
    { left: 80, top: 72 },
    { left: 15, top: 88 },
    { left: 85, top: 88 },
    { left: 35, top: 85 },
    { left: 65, top: 85 }
  ]"""
src = repl('pad_slots', old_slots, new_slots, src)

# --- FIX 2: guard selectPadSlots — never allow a slot whose circle would touch the question bar ---
guard = """
  selectPadSlots() {
    const available = [...CONFIG.PAD_SLOTS].filter(s => s.top >= CONFIG.PAD_MIN_TOP);
    const selected = [];"""
src = repl('select_guard', r"selectPadSlots\(\) \{\n    const available = \[\.\.\.CONFIG\.PAD_SLOTS\];\n    const selected = \[\];",
           guard, src)

# Add PAD_MIN_TOP + PAD_MIN_DISTANCE config
cfg_block = """PAD_MIN_DISTANCE: 22,"""
src = repl('cfg_dist', r"PAD_MIN_DISTANCE: (\d+),", cfg_block, src)
# only add PAD_MIN_TOP once
if 'PAD_MIN_TOP' not in src:
    src = src.replace('PAD_MIN_DISTANCE: 22,',
                      'PAD_MIN_DISTANCE: 22,\n    PAD_MIN_TOP: 40,')

open(SRC, 'w', encoding='utf-8').write(src)
print('boss.js updated: slots=' , 'PAD_MIN_TOP' in src)

# --- FIX: boss hidden during intro ---
src = open(SRC, encoding='utf-8').read()
# after cutIn creation, hide boss sprite; after cutIn.remove, show it
p1 = r"(this\.arenaEl\.appendChild\(cutIn\);)"
if 'boss-roam' in src and 'bossIntroHide' not in src:
    src = src.replace(
        'this.arenaEl.appendChild(cutIn);',
        'this.arenaEl.appendChild(cutIn);\n'
        '    // ซ่อนบอสขณะ intro ไม่ให้โผล่ซ้อน intro overlay\n'
        '    const introBoss = this.arenaEl.querySelector(".boss-roam");\n'
        '    if (introBoss) introBoss.style.visibility = "hidden";', 1)
    src = src.replace(
        'cutIn.remove();',
        'cutIn.remove();\n'
        '        const postBoss = this.arenaEl.querySelector(".boss-roam");\n'
        '        if (postBoss) postBoss.style.visibility = "visible";', 1)
    open(SRC, 'w', encoding='utf-8').write(src)
    print('boss.js: intro hide/show added')
else:
    print('boss.js intro: already done or boss-roam missing')
