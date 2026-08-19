#!/usr/bin/env python3
"""Add skill button + modal to boss hall."""
import re

F = 'js/bossHall.js'
src = open(F, encoding='utf-8').read()

def must(pattern, s, label):
    if not re.search(pattern, s):
        raise AssertionError(f'{label}: not found')

# 1. Add skill button into hall-actions
must(r'<button class="btn-time-attack">⏱️ Time Attack</button>', src, 'time-attack btn')
src = src.replace(
    '<button class="btn-time-attack">⏱️ Time Attack</button>',
    '<button class="btn-time-attack">⏱️ Time Attack</button>\n'
    '            <button class="btn-skills" data-action="skills">📘 สกิลการสู้</button>', 1)

# 2. Skills modal HTML + CSS (modal appended inside container)
SKILLS_HTML = r"""
  showSkillsModal() {
    this.removeSkillsModal();
    const container = document.getElementById('app');
    const modal = document.createElement('div');
    modal.id = 'boss-skills-modal';
    modal.className = 'skills-modal';
    modal.innerHTML = `
      <div class="skills-overlay" data-action="close-skills"></div>
      <div class="skills-panel">
        <button class="skills-close" data-action="close-skills" aria-label="ปิด">✕</button>
        <h3>📘 คู่มือสกิลการสู้บอส</h3>
        <div class="skills-list">
          <div class="skill-row">
            <div class="skill-icon">🎯</div>
            <div><b>คำตอบถูก = โจมตีบอส</b> — ตอบถูก 10 ข้อ = ชนะ! เดินเท้าไปยืนบนป้ายคำตอบ แล้วบอสจะโดนดาเมจ</div>
          </div>
          <div class="skill-row">
            <div class="skill-icon">🛡️</div>
            <div><b>โล่พิทักษ์</b> — กันดาเมจจากการโดนบอสโจมตีครั้งแรก 1 ครั้ง</div>
          </div>
          <div class="skill-row">
            <div class="skill-icon">🧪</div>
            <div><b>ยาฟื้นฟู</b> — ฟื้น HP 1 ดวง ทุก 3 คำตอบถูก</div>
          </div>
          <div class="skill-row">
            <div class="skill-icon">⚡</div>
            <div><b>เวลาชะลอ</b> — บอสโจมตีช้าลง 40% ใน 10 วินาทีแรก</div>
          </div>
          <div class="skill-row">
            <div class="skill-icon">🔥</div>
            <div><b>คอมโบ</b> — ตอบถูกติดกันสะสมคอมโบ! คอมโบยิ่งสูงยิ่งต่อแต้ม และยิ่งคอมโบสูงบอสจะโกรธจัด เร่งความเร็ว</div>
          </div>
          <div class="skill-row">
            <div class="skill-icon">🐾</div>
            <div><b>เพ็ท Mito</b> — แมวคู่หูจะลอยตามเจ้าไปทุกที่ คอยให้กำลังใจตลอดเวลา</div>
          </div>
          <div class="skill-row">
            <div class="skill-icon">🃏</div>
            <div><b>อีเวนต์การ์ด</b> — ทุก 3 ข้อ อาจเกิด: ☄️ อุกกาบาต (ลูกบอมบ์ตก), 🌀 หลุมดำ (แรงดูดเข้าศูนย์กลาง), 🎁 ของขวัญ (บอสมอบไอเทมฟรี!)</div>
          </div>
          <div class="skill-row">
            <div class="skill-icon">🧊</div>
            <div><b>การโจมตีบอส</b> — พลุไฟ 💥 และน้ำแข็งเยือกแข็ง 🧊 (โดนแช่แข็ง = เคลื่อนที่ไม่ได้จนกว่าจะละลาย) เดินหลบไปให้ทัน!</div>
          </div>
          <div class="skill-row">
            <div class="skill-icon">🚶</div>
            <div><b>ห้ามยืนแช่!</b> — ยืนที่เดิมนานเกิน 4.5 วิ จะโดนเตือนและบอสจะโจมตีรัว การเดินและตอบสลับตำแหน่งคือกุญแจสู่ชัยชนะ</div>
          </div>
          <div class="skill-row">
            <div class="skill-icon">❄️</div>
            <div><b>ใจเย็น ๆ</b> — บอสมี HP 3 ดวงเช่นเดียวกับเจ้า โดน 3 ครั้ง = แพ้ พิชิตบอสครบรับ Badge และ XP ปลดล็อกบอสถัดไป!</div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(modal);
    modal.querySelectorAll('[data-action="close-skills"]').forEach(b => {
      b.addEventListener('click', () => this.removeSkillsModal());
    });
  }
  removeSkillsModal() {
    const m = document.getElementById('boss-skills-modal');
    if (m) m.remove();
  }
"""

# 3. Insert methods into screen object, before attachEventListeners or after renderBody
if 'showSkillsModal' not in src:
    src = src.replace(
        '  mount(params) {',
        SKILLS_HTML + '\n  mount(params) {', 1)

# 4. Bind button in attachEventListeners (or mount listeners)
must(r"querySelector\(\.btn-time-attack|btn-time-attack", src, 'btn binding area')
# Find attachEventListeners body
idx = src.find('attachEventListeners')
if idx == -1:
    raise AssertionError('attachEventListeners missing')

if 'btn-skills' not in src[src.find('addEventListener', idx):]:
    # insert listener after existing hall button bindings
    anchor = re.search(r"querySelector\(\s*['\"]\.btn-time-attack['\"]\s*\)\s*\.\s*addEventListener\([^)]*\)", src)
    if not anchor:
        # fallback: after hall-actions binding block
        anchor = re.search(r"btn-time-attack[^;]{0,300}?;", src)
    if anchor:
        insert_text = ("\n"
                       "    // ปุ่มสกิลการสู้\n"
                       "    const btnSkills = container.querySelector('.btn-skills');\n"
                       "    if (btnSkills) btnSkills.addEventListener('click', () => this.showSkillsModal());\n")
        end = src.find(anchor.group(0)) + len(anchor.group(0))
        src = src[:end] + insert_text + src[end:]
    else:
        raise AssertionError('no insertion anchor for skill listener')

open(F, 'w', encoding='utf-8').write(src)
print('bossHall.js: skill button + modal added, listeners bound:', 'btn-skills' in src)
