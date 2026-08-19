#!/usr/bin/env python3
"""Update landing guide screen to Boss Rush Academy mode."""
F = 'js/landing.js'
src = open(F, encoding='utf-8').read()

def must(repl):
    raise AssertionError(f'anchor not found: {repl[0][:60]}')

# 1. Subtitle update (old '5 ดาวเคราะห์' wording)
old_sub = '<p class="guide-sub">ผจญภัย 5 ดาวเคราะห์ = 5 วิชา ตอบคำถาม 125 ข้อ สะสม XP และปลดล็อกยศ!</p>'
new_sub = ('<p class="guide-sub">🗡️ Boss Rush Academy: สู้บอส 5 ตน = 5 วิชา! เดินหลบการโจมตีและยืนบนคำตอบที่ถูก '
           'ตอบถูก 10 ข้อ = ชัยชนะ สะสม XP ปลดยศและปลดบอสที่ยากขึ้น!</p>')
assert old_sub in src, 'subtitle'
src = src.replace(old_sub, new_sub)

# 2. Items note update (old mode note about missions)
old_note = '<p class="guide-note">อิเทมจะเติมเต็มใหม่ในมิชชันที่เล่นถัดไป และหาเพิ่มได้จากการผ่านโซนครบ 5 ดาว</p>'
new_note = ('<p class="guide-note">ไอเทมเลือกได้ 1 ชิ้นต่อการต่อสู้ 1 รอบ: 🛡️ โล่กันดาเมจครั้งแรก · '
            '🧪 ยารักษา +1 ใจทุก 3 คำตอบถูก · ⚡ เวลาชะลอ บอสโจมตีช้าลง 40% (10 วิแรก)</p>')
assert old_note in src, 'item note'
src = src.replace(old_note, new_note)

# 3. XP section wording (add battle mode XP)
old_xp = '<h3>⭐ คะแนน XP</h3>'
if old_xp in src:
    # find the paragraph after it
    idx = src.find(old_xp)
    end = src.find('</div>', idx)
    old_xp_div = src[idx:end]
    new_xp_div = ('<h3>⭐ คะแนน XP</h3>\n'
                  '              <p>พิชิตบอส = รับ XP 30-80 + Badge! จ่ายทุก 100 XP เพื่อปลดบอสถัดไป '
                  '(Chronos 100 · Kawi 250 · Lex 450 · Terra 700) · '
                  'เวลาถูกเร็ว = โบนัส XP</p>')
    assert old_xp_div in src
    src = src.replace(old_xp_div, new_xp_div)

# 4. Insert new Boss Rush skills section after the items section
old_items_head = '<div class="guide-section">\n              <h3>💛 ระบบพลังงาน</h3>'
new_section = ('<div class="guide-section">\n'
               '              <h3>🗡️ สกิลการสู้บอส</h3>\n'
               '              <p>เดินด้วย <b>WASD</b> หรือ<b>โยก (Joystick)</b> บนมือถือ ยืนบน<b>ป้ายคำตอบ 4 ป้าย</b> = โจมตีบอส! '
               'ตอบถูก <b>10 ข้อ = ชนะ</b> · ตอบถูกติดต่อ = <b>คอมโบ</b> แต้มพิเศษ (แต่บอสจะโกรธเร่งโจมตีเมื่อคอมโบสูง!)</p>\n'
               '              <p>⚠️ <b>บอสโจมตี</b>: 💥 พลุไฟ และ 🧊 น้ำแข็งเยือกแข็ง (ถูกแช่ = ขยับไม่ได้จนกว่าจะละลาย) · '
               'ยืนแช่ที่เดิมนานเกิน 4.5 วิ = <b>เตือน + บอสโจมตีรัว</b> · '
               'ทุก 3 ข้อมีโอกาสเกิด<b>การ์ดอีเวนต์</b>: ☄️ อุกกาบาต 🌀 หลุมดำ 🎁 ของขวัญไอเทมฟรี · '
               '🐾 เพ็ท <b>Mito</b> แมวคู่หูลอยตามทุกที่ · บอสทุกตัวมี HP 3 ดวงและบอสตัวใหม่ 3 ตนเปิดตัวพร้อมอนิเมชันสู้จริง</p>\n'
               '            </div>\n'
               '            <div class="guide-section">\n'
               '              <h3>💛 ระบบพลังงาน</h3>')
assert old_items_head in src, 'energy head'
src = src.replace(old_items_head, new_section)

open(F, 'w', encoding='utf-8').write(src)
print('landing.js guide updated OK')
