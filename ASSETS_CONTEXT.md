# Assets context

Existing assets in /home/ubuntu/questverse-game/assets/: boss_kawi/lex/terra/mathos/chronos.webp, arena_*.webp, item_*.webp, event_*.webp, pet_mito.webp — all fine, already used.

New work (this round):
- /home/ubuntu/questverse-game/assets/icons/skill_*.webp (10 files, DONE, black bg cut)
- /tmp/gen_art/boss_mathos.png DONE (1320KB, magenta bg). Others generating: chronos, kawi, lex, terra.
- gen_art.py: cd /home/ubuntu && nohup python3 -u gen_art.py bosses > /tmp/gen_bosses.log 2>&1 &
- cut_bg.py: python3 cut_bg.py bosses (magenta→transparent, crops, saves assets/boss_XX.webp)
- After cut bosses: replace bossHall.js emoji skills with img tags, QA, deploy, push.

Skill icon mapping (bossHall.js buildSkillsList ~L48-85):
1 🎯 ยิงคำตอบ → icons/skill_aim.webp
2 🛡️ โล่ทอง → icons/skill_shield.webp
3 🧪 ยาฟื้นฟู → icons/skill_potion.webp
4 ⚡ ชะลอเวลา → icons/skill_boost.webp
5 🔥 Combo → icons/skill_combo.webp
6 🐾 Pet Mito → icons/skill_pet.webp
7 🃏 Event Cards → icons/skill_event.webp
8 🧊 Ice Bolt → icons/skill_ice.webp
9 🚶 เดินหนี → icons/skill_dodge.webp
10 ❄ แช่แข็งบอส → icons/skill_freeze.webp
