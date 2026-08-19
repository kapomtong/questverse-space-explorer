# คำสั่งงาน: อนิเมชันบอสขยับในสนามสู้ (Boss Rush Academy)

คุณคือ Programmer ที่เขียน Vanilla JS + CSS3 ได้แม่นยำ งานคือเพิ่ม "ความมีชีวิต" ให้บอสในสนามสู้ — ผู้ใช้อยากเห็นบอสขยับแขน ขยับขา โยกตัว ไม่ใช่แค่ลอยส่ายเดียวกันทั้งเกม

## ไฟล์ที่ต้องแก้ (2 ไฟล์):
1. `/home/ubuntu/questverse-game/js/boss.js` — class BossBattle
2. `/home/ubuntu/questverse-game/style.css` — เพิ่ม CSS animations

## โครงสร้างปัจจุบันที่ต้องรู้:

### boss.js constructor/mount (บรรทัด ~244-249):
```js
const bossSprite = document.createElement('div');
bossSprite.className = 'boss-sprite';
bossSprite.style.cssText = `bottom: 8%; left: 50%; transform: translateX(-50%);`;
bossSprite.innerHTML = `<img src="${this.config.bossImg}" alt="...">`;
arena.appendChild(bossSprite);
this.bossSpriteEl = bossSprite;
```
- `this.bossSpriteEl` ชี้ถึง container ของบอส (มี img ข้างใน)
- arena คือ `.boss-arena` (position:relative, 100vw)
- `this.config` คือ boss config object มี field: id, name, subject, bossImg, difficulty

### style.css ปัจจุบัน (บรรทัด 1360-1425):
```css
.boss-sprite {
    position: absolute;
    width: 22vw;
    max-width: 260px;
    pointer-events: none;
    z-index: 5;
    animation: boss-idle 2.2s ease-in-out infinite;
}
.boss-sprite img {
    width: 100%; height: auto;
    filter: drop-shadow(0 0 18px rgba(157, 78, 221, 0.55));
}
@keyframes boss-idle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-1.2vw); }
}
```
- ข้อควรระวัง: `.boss-sprite` มี inline style `transform: translateX(-50%)` และ keyframe `boss-idle` ก็ใช้ transform — จะชนกัน (keyframe ทับ inline) ต้องแก้ด้วย wrapper หรือใช้ wrapper div ส่วน transform อยู่กับ wrapper ส่วน idle animation อยู่บน img/container ที่ไม่ชน

## สิ่งที่ต้องทำ (ให้ครบ):

### 1. แยก transform ออกจาก animation (แก้ปัญหาชนกัน)
ห่อ img ด้วย wrapper: `<div class="boss-sprite"><div class="boss-roam" style="bottom:8%;left:50%;transform:translateX(-50%)"><img></div></div>` — `boss-roam` ใช้ `animation` (ลอย+โยก), inline style อยู่บน wrapper ไม่ชน

### 2. บอสโรดด้วย JS ในสนามสู้ (boss.js gameLoop)
- เพิ่ม `this.boss = { x: 50 (%left), phase: 0, ... }` และ `updateBoss()` ที่เรียกใน `gameLoop` ทุก ~30 frame
- บอสเลื่อนช้า ๆ ซ้าย-ขวา (±22% จากกลาง) ด้วย wave function: `x = 50 + 20*Math.sin(elapsed/3500)` — ให้รู้สึกคุมบริเวณ
- เพิ่ม random "กระชาก" ทุก 4-7 วินาที: เร่ง/เบรกกะทันหัน (scaleX ป้อง/เบื้อง)

### 3. อนิเมชันตาม stat (ผ่าน CSS class ที่ JS toogle):
- `.angry` (combo ของผู้เล่น >= 3): เร่ง boss-roam animation-duration, เพิ่ม red glow, โยกแรงขึ้น
- `.attacking` (ทันทีหลังยิง projectile): lunge ขึ้นมา 8% แล้วรูดกลับ — keyframe 0.45s แล้ว JS ลบ class
- `.taunt` (ทุก 6-8 วินาที): ส่ายตัว/กางแขน 0.6s
- `.roar` (ผู้เล่นตอบผิดติดต่อ 2 ข้อ): boss สะอ้างหัวเราะ — shake + scale pulse
- `.damaged` (ยังไม่มีการใช้ — เชื่อมกับเมื่อผู้เล่นตอบถูก): ปัจจุบันมี class `.damaged` + keyframe boss-hit อยู่แล้ว แต่ไม่เจอมี JS เพิ่ม class นี้ → เสริมให้ call เมื่อผู้เล่นตอบถูก (ใน onAnswer correct branch)

### 4. ห้ามกระทบ gameplay:
- ห้ามเปลี่ยน layout: pointer-events:none เดิม, z-index เดิม, position absolute เดิม
- ห้ามเปลี่ยน gameLoop timing (มี updatePlayer/updateAttacks อยู่แล้ว — แทรก updateBoss ใน loop เดิม)
- ต้องไม่สร้าง reflow หนัก: ใช้ transform/opacity เท่านั้น

### 5. ความเข้ากันได้:
- เดสก์ท็อป + มือถือ (มือถือ max-width:120px มีอยู่แล้วที่บรรทัด 2706)
- ใส่ class ตอน mount ผ่าน JS ไม่ใช่เพิ่ม class คงที่ใน HTML (เพื่อไม่ให้ animation เริ่มก่อน arena พร้อม)
- ไม่แตะส่วนคำถาม/pads/HUD/victory/defeat เลย

## ผลลัพธ์ที่ต้องการ:
- ส่ง full replacement block สำหรับ 2 จุด: (a) mount block ของ bossSprite ใน boss.js (a few lines around line 244-249 และ updateBoss method ที่ใส่ใน class) (b) CSS block ใหม่ที่ต่อท้ายไฟล์ style.css
- โค้ดต้องทำงานได้ทันทีโดยไม่ต้องแก้บรรทัดอื่น
- ภาษาไทยในคอมเมนต์ได้
