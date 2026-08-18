# 🎨 Prompt ภาพเกม QuestVerse — แยกตามไฟล์

> ใช้เจนภาพด้วย AI ใดก็ได้ (Nano Banana, Gemini, GPT-image ฯลฯ)
> บันทึกไฟล์ตามชื่อที่กำหนด แล้ววางในโฟลเดอร์ `assets/` ทับไฟล์เดิมได้เลย

---

## 1️⃣ ฉากหลังก่อนตอบคำถาม — แยกตามดาว 5 ดวง (16:9)

แต่ละภาพเป็นฉากอวกาศบรรยากาศตามวิชา ใช้เป็นพื้นหลังหน้า mission — **ห้ามมีข้อความ/ตัวอักษรที่อ่านได้ในภาพ**

### ไฟล์: `assets/mission_bg_numberon.jpg` — ดาวนัมเบอร์รอน (คณิตศาสตร์)

```
Epic cinematic space background for a middle-school math quiz game screen, 16:9, landscape. A vast cosmic scene dominated by deep violet and purple nebula clouds mixed with glowing cyan. In the distance, a large translucent purple planet with glowing cyan mathematical symbols floating around it: plus sign, division sign, pi symbol and digits like 2, 7, 8 drifting in orbit. In the foreground, a cute small cartoon rocket ship flies from the bottom-left corner toward the planet. Millions of tiny bright stars, soft star clusters, distant galaxies. The lower third of the image is darker (deep navy, almost black) so that white Thai quiz text remains readable. No readable words, no UI elements. Fantasy cartoon space style, vibrant but not oversaturated, high detail.
```

### ไฟล์: `assets/mission_bg_bionia.jpg` — ดาวไบโอเนีย (วิทยาศาสตร์)

```
Epic cinematic space background for a middle-school science quiz game screen, 16:9, landscape. A vast cosmic scene dominated by emerald green and teal nebula clouds. In the distance, a large translucent green planet with a glowing DNA double helix wrapped around it, plus glowing cells, floating leaves and a small atom model in orbit. In the foreground, a cute small cartoon rocket ship flies from the bottom-left corner toward the planet. Bright stars, soft green aurora-like nebula glow, a few distant moons. The lower third of the image is darker (deep green-black) so that white Thai quiz text remains readable. No readable words, no UI elements. Fantasy cartoon space style, vibrant, high detail.
```

### ไฟล์: `assets/mission_bg_aksara.jpg` — ดาวอักษรา (ภาษาไทย)

```
Epic cinematic space background for a middle-school Thai language quiz game screen, 16:9, landscape. A vast cosmic scene dominated by warm golden amber and orange nebula clouds with soft lantern-like glow. In the distance, a large translucent golden planet surrounded by glowing ornate Thai-style calligraphy brush strokes, floating parchment scrolls and a glowing open book with magical sparkles. In the foreground, a cute small cartoon rocket ship flies from the bottom-left corner toward the planet. Bright stars, warm firefly-like golden sparkles. The lower third of the image is darker (deep brown-black) so that white Thai quiz text remains readable. No readable words, no UI elements. Fantasy cartoon space style, warm and magical, high detail.
```

### ไฟล์: `assets/mission_bg_lingua.jpg` — ดาวลิงกัว (ภาษาอังกฤษ)

```
Epic cinematic space background for a middle-school English quiz game screen, 16:9, landscape. A vast cosmic scene dominated by sky blue and silver nebula clouds with cool crystal-like sparkle. In the distance, a large translucent blue planet with floating glowing speech bubbles, a quill pen, and glowing book pages circling in orbit (no readable words). In the foreground, a cute small cartoon rocket ship flies from the bottom-left corner toward the planet. Bright stars, icy silver comet trails. The lower third of the image is darker (deep navy-black) so that white Thai quiz text remains readable. No readable words, no UI elements. Fantasy cartoon space style, cool and elegant, high detail.
```

### ไฟล์: `assets/mission_bg_civilis.jpg` — ดาวซิวิลิส (สังคมศึกษา)

```
Epic cinematic space background for a middle-school social studies quiz game screen, 16:9, landscape. A vast cosmic scene dominated by terracotta orange and warm brown nebula clouds. In the distance, a large translucent amber planet with a small glowing Earth globe, a glowing pyramid, and an ancient temple silhouette circling in orbit. In the foreground, a cute small cartoon rocket ship flies from the bottom-left corner toward the planet. Bright stars, warm golden dust clouds like a desert sky in space. The lower third of the image is darker (deep brown-black) so that white Thai quiz text remains readable. No readable words, no UI elements. Fantasy cartoon space style, warm and historic, high detail.
```

---

> ✅ ดาวเคราะห์ 5 ดวง (`planet_*.png`) มีอยู่แล้ว — ไม่ต้องเจนใหม่

## 2️⃣ ไอเทม 3 ชิ้น (1:1, โปรงใส)

### ไฟล์: `assets/item_shield.png`

```
Cute cartoon game item icon, centered, isolated on solid magenta background (#FF00FF), fantasy cartoon style, high detail: a futuristic space shield with a glowing cyan energy core in the center, dark metallic frame with gold trim, soft outer glow, slight front 3/4 view. No text.
```

### ไฟล์: `assets/item_compass.png`

```
Cute cartoon game item icon, centered, isolated on solid magenta background (#FF00FF), fantasy cartoon style, high detail: a golden space compass with a purple gemstone in the center, engraved celestial star patterns on the dial, small orbiting rings, soft warm glow. No text, no letters.
```

### ไฟล์: `assets/item_telescope.png`

```
Cute cartoon game item icon, centered, isolated on solid magenta background (#FF00FF), fantasy cartoon style, high detail: a sleek silver space telescope angled diagonally, glowing blue lens at the front, small star sparkle near the eyepiece, soft cool glow. No text.
```

---

## 3️⃣ ยานสำรวจ (1:1, โปรงใส)

### ไฟล์: `assets/explorer_ship.png`

```
Cute cartoon spaceship game icon, centered, isolated on solid magenta background (#FF00FF), fantasy cartoon style, high detail: a friendly rounded white-and-blue explorer rocket ship with a glowing cyan engine trail, a small glass dome cockpit with a cute smiling astronaut silhouette inside, small antenna with a star on top, cheerful and child-friendly, soft glow. No text.
```

---

## 📝 หมายเหตุการใช้
- ภาพฉากหลัง 16:9 → ทับไฟล์เดิม `assets/mission_bg_*.jpg` จากนั้นแก้ `style.css` บรรทัด `.screen-mission` ให้เปลี่ยน path ตามดาว (ทำให้ bg เปลี่ยนตามดาวที่เลือกใน mission)
- ดาวเคราะห์ `planet_*.png` — มีแล้ว ไม่ต้องเจนใหม่
- ไอเทม + ยาน → ทับ `assets/item_*.png`, `assets/explorer_ship.png` แล้วแก้ config.js `image` path จาก .svg → .png
- ถ้า AI ไม่รองรับ transparent background ให้เจนบนพื้นเขียว (#00FF00) หรือแมเจนต้า (#FF00FF) แล้วใช้ tool ลบพื้นหลัง
