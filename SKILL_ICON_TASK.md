# TASK: สกออลสีเหลืองตู่เร่ + บอสกรอบตัดไม่หมด (2026-08-19 ~05:00)

## ความหมายของ "สกออล"
จากข้อความ "ทำไมสกออลเป็นแค่ก้อนเหลืองๆ ค่ตทุเรศ" — น่าจะหมายถึง **สกิลไอคอน/ไอเทม** ที่แสดงเป็นก้อนเหลืองตู่เร่ๆ และภาพบอสกรอบตัดไม่หมด

## สกิลไอคอนปัจจุบัน (js/bossHall.js L48-85: คู่มือสกิลการสู้บอส)
ใช้ emoji ล้วนๆ: 🎯 🛡️ 🧪 ⚡ 🔥 🐾 🃏 🧊 🚶 ❄️ — emoji เหล่านี้บนบาง OS/browser แสดงเป็นกล่องเหลืองตู่เร่
- 10 สกิล: ยิงตอบ, โล่, ยา, ฟ้าแลบ, combo(ไฟ), pet(Mito), event cards, ice freeze, เดินหนี, freeze boss

## ที่ใช้ภาพจริง (assets/ ใน project root assets/):
- boss_mathos.webp, boss_chronos.webp, boss_kawi.webp, boss_lex.webp, boss_terra.webp (ภาพใหญ่บอส + cut-in)
- arena_kawi.webp, arena_lex.webp, arena_terra.webp (+arena_mathos?, arena_chronos?)
- item_shield.webp, item_potion.webp, item_boost.webp
- event_asteroid.webp, event_blackhole.webp, event_gift.webp
- pet_mito.webp
- suit_blue.webp ฯลฯ (assets/ suit_*.webp)

## โจทย์
1. เจนไอคอนสกิลใหม่ 10 ภาพสวยๆ ไม่ใช่ emoji (หรือใช้ภาพจริงแทน emoji ใน skill-icon)
2. แก้ภาพบอส: ตัดกรอบ/พื้นหลังซ้ำให้สะอาด (เช็ค alpha ของ boss_*.webp อีกครั้ง — ผู้ใช้ว่าตัดไม่หมด)
3. ทดสอบ → deploy → push GitHub → รายงานพร้อม URL

## QA state ล่าสุด (ก่อนงานนี้)
- PROD dep dpl_9HiXYfwuHZFrZXe2WtTsGrnHEndT READY, git commit f832863 main
- PROD QA: hall/lock/item/intro/pads no-overlap ผ่านหมดแล้ว (boss-img อาจมี white halo ตาม QA_STATE.md)

## ขั้นตอนถัดไป
1. เช็ค boss_*.webp alpha ด้วย Python (หา dark/border pixels)
2. สร้างพร้อมท์เจนไอคอนสกิล 10 ภาพ + ภาพบอสที่สะอาด (เจนใหม่หรือรีมูฟที่ local)
3. ตัด bg transparent, แทนไฟล์
4. ปรับ skill-icon ใน bossHall.js (และ guide landing) ให้ใช้ img tag
5. QA + deploy + push
