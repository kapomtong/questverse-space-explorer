# Image API Notes

## ผลทดสอบ API
- Endpoint: POST https://api.zero-ai.cc/img/v1/images/generations
- Key: sk-0ai-dce0ebeb36b94eaa722e9f87e2aaa7f16dfb64b634f2c28e
- **model ที่ทำงาน: `gpt-image-2`** (flux อื่นๆ = 400 invalid_image_request)
- n=1, size=1024x1024 → HTTP 200, ตอบ b64_json
- response keys: created, data[], model, quality, size
- data[0] keys: b64_json
- **ห้ามใช้ model อื่น — เสียโควตาเปล่า (ก่อนหน้านี้ลอง flux หลายชื่อ = 400 แต่ไม่คิดเงินเพราะ error)**

## สคริปต
- test_img_api.py — gen_image(prompt, out, model='gpt-image-2')

## ภาพที่ต้องเจน (12 ชิ้น)
1. บอส Kawi the Scribe (ไทย) — คชสารนักกวี สีม่วง-ทอง มงกุฎดอกบัว พู่กันยักษ์
2. บอส Lex the Oracle (อังกฤษ) — นกฟีนิกซ์สวมแว่น แหวนแสง แดง-ทอง
3. บอส Sage Terra (สังคม) — เทวรูปหินยักษ์ ครึ่งคนครึ่งโลก โล่แผนที่โลก เขียว-น้ำตาล
4. สนาม Kawi — ลานจารึกอักษรไทยกลางสวนไทย ยามเย็น
5. สนาม Lex — ยอดหอคอยคริสตัลคำศัพท์กลางฟ้า
6. สนาม Terra — โบราณสถานอารยธรรม หินผุ ล้อมด้วยแม่เหล็กโลกเขียว
7. ไอเทม โล่ (shield item) — โล่พันธุ์อวกาศเงิน-ฟ้า
8. ไอเทม ยาทวด (potion item) — ขวดน้ำสีเขียวเรืองแสง
9. ไอเทม Boost (bolt item) — สายฟ้าเหลือง-น้ำเงิน
10. Event card asteroid — อุกกาบาต
11. Event card blackhole — หลุมดำม่วง
12. Event card gift — กล่องของขวัญทอง
13. Pet companion — หุ่นหุ่นยนต์น้อยสีฟ้า (มิต) — ใช้เป็น pet ตามตัว
14. Mathos defeat/Victory (ใช้ท่า win?) — ไม่ต้อง อาจใช้ CSS

**ขนาดเกม:** บอส webp ≤150KB, สนาม jpg/webp ≤200KB — ต้อง convert เป็น webp หลังเจน แล้ว resize เหลือใช้จริง

## การวัน
- เจน png 1024x1024 → convert → assets/boss_kawi.webp ฯลฯ
- ทุกภาพ: พื้นหลังตัดออกสำหรับบอส/ไอเทม/pet (ใช้ remove_magenta หรือ rembg ถ้ามี)
- สนาม: ไม่ต้องตัดพื้นหลัง (เป็น background เต็มจอ)
