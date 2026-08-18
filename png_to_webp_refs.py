"""เปลี่ยน reference ภาพในโค้ดจาก .png เป็น .webp (ภาพจริงแปลงเป็น webp แล้ว)"""
import os, re

targets = [
    'index.html',
    'js/landing.js',
    'js/character.js',
    'js/galaxy_map.js',
    'js/mission.js',
    'js/leaderboard.js',
    'js/config.js',
    'js/app.js',
    'js/game_state.js',
    'style.css',
]
for name in targets:
    p = os.path.join('/home/ubuntu/questverse-game', name)
    if not os.path.exists(p):
        continue
    s = open(p, encoding='utf-8').read()
    # จับเฉพาะชื่อไฟล์ภาพที่แปลงเป็น webp แล้ว
    webp_names = {'planet_numberon', 'planet_bionia', 'planet_aksara', 'planet_lingua',
                  'planet_civilis', 'suit_blue', 'suit_green', 'suit_red',
                  'explorer_ship', 'landing_bg'}
    n = 0
    def repl(m):
        global n
        base = m.group(1)
        if base in webp_names and os.path.exists(f'/home/ubuntu/questverse-game/assets/{base}.webp'):
            n += 1
            return f'{base}.webp'
        return m.group(0)
    s2 = re.sub(r'([a-z_]+)\.png', repl, s)
    if n:
        open(p, 'w', encoding='utf-8').write(s2)
        print(f'{name}: replaced {n}')
print('done')
