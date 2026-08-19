# Asset Generation Status (Boss Rush Academy)

## Image API (zero-ai)
- Endpoint: POST https://api.zero-ai.cc/img/v1/images/generations
- Key: sk-0ai-dce0ebeb36b94eaa722e9f87e2aaa7f16dfb64b634f2c28e
- Model ที่ใช้ได้: **gpt-image-2** (flux ทั้งหมด = 400; dall-e อื่น = 400)
- **ต้องมี header User-Agent** ไม่然 403 Forbidden
- size=1024x1024, n=1 → b64_json
- สคริปต: gen_images.py (มี PROMPTS ครบ + User-Agent แล้ว) — รัน: python3 gen_images.py [name]

## ผลการเจน (13/13 เสร็จ)
| ไฟล์ | สถานะ | หมายเหตุ |
|------|-------|----------|
| assets/boss_kawi.png | ✅ สวยมาก | คชสารนักกวี ม่วง-ทอง, พื้นหลังแมเจนต้า, ตัวหนังสือไทย "กวี" ปรากฏ — ตัดพื้นหลังต้องใช้ remove |
| assets/boss_lex.png | ✅ สวยมาก | ฟีนิกซ์สวมแว่น ม่วงแหวนแสง ม้วนกระดาษ |
| assets/boss_terra.png | ✅ สวยมาก | เทวรูปหิน เขียว-หิน ครบตามออกแบบ |
| assets/arena_kawi.jpg | ✅ | ลานจารึกไทยยามเย็น ม่วง-ทอง |
| assets/arena_lex.jpg | ✅ | ยอดหอคอยคริสทัล ตัวอักษรทองลอย |
| assets/arena_terra.jpg | ✅ | โบราณสถาน หินผุ เขียว |
| assets/item_shield_new.png | ✅ | โล่เงิน-ฟ้า |
| assets/item_potion.png | ✅ | ขวดเขียวเรืองแสง |
| assets/item_boost.png | ✅ | สายฟ้าเหลือง-ฟ้า |
| assets/event_asteroid.png | ✅ | อุกกาบาต |
| assets/event_blackhole.png | ✅ | หลุมดำม่วง |
| assets/event_gift.png | ✅ | กล่องทอง |
| assets/pet_mito.png | ✅ | หุ่นน้อยฟ้า |

## ต่อไป
1. Convert: png→webp (<200KB สำหรับบอส/pet, สนาม jpg→webp <300KB)
2. ตัดพื้นหลังแมเจนต้าบอส/ไอเทม/Event/Pet → transparent webp
   - ใช้: python rembg หรือ chromakey ง่ายๆ (มagenta #FF00FF ≈ 255,0,255 tolerance)
3. พัฒนาเกม: boss hall, 5 บอส, วิชา mapping, ไอเทม, combo, event cards, time attack, pet, intro/victory
4. หมายเหตุ: Mathos/Chronos ใช้ภาพเดิม boss_mathos.webp / boss_chronos.webp + arena เดิม

## โครงสร้างบอสในเกม (mapping วิชา)
| บอส | วิชา | ไฟล์ |
|-----|------|------|
| Mathos | คณิต | boss_mathos.webp (เดิม) |
| Chronos | วิทยาศาสตร์ | boss_chronos.webp (เดิม) |
| Kawi | ไทย | boss_kawi.webp |
| Lex | อังกฤษ | boss_lex.webp |
| Terra | สังคม | boss_terra.webp |
