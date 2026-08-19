#!/bin/bash
cat >> /home/ubuntu/questverse-game/style.css <<'EOCSS'

/* ===== Skills modal (Boss Rush guide) ===== */
.btn-skills {
  background: rgba(80, 120, 255, 0.15);
  border: 1px solid rgba(120, 150, 255, 0.4);
  color: #cfe0ff;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-skills:hover { background: rgba(80, 120, 255, 0.35); }
.skills-modal {
  position: fixed; inset: 0; z-index: 2000;
  display: flex; align-items: center; justify-content: center;
  animation: skillsIn 0.25s ease;
}
@keyframes skillsIn { from { opacity: 0; } to { opacity: 1; } }
.skills-overlay {
  position: absolute; inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}
.skills-panel {
  position: relative; z-index: 1;
  background: linear-gradient(160deg, #0d1220 0%, #121a30 100%);
  border: 1px solid rgba(160, 140, 255, 0.35);
  border-radius: 16px;
  padding: 24px 22px 20px;
  max-width: 640px; width: 92%;
  max-height: 86vh; overflow-y: auto;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.8);
}
.skills-panel h3 {
  margin: 0 0 14px; font-size: 19px; color: #ffd98a;
  border-bottom: 1px solid rgba(160, 140, 255, 0.25); padding-bottom: 10px;
}
.skills-list { display: flex; flex-direction: column; gap: 10px; }
.skill-row {
  display: flex; gap: 10px; align-items: flex-start;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px; padding: 9px 11px;
  font-size: 13.5px; color: #e4e8f2; line-height: 1.45;
}
.skill-icon { font-size: 18px; flex-shrink: 0; width: 24px; text-align: center; }
.skills-close {
  position: absolute; top: 10px; right: 12px;
  background: transparent; border: none; color: #aab;
  font-size: 20px; cursor: pointer; line-height: 1;
}
.skills-close:hover { color: #fff; }
@media (max-width: 600px) {
  .skills-panel { padding: 18px 14px 14px; }
  .skills-panel h3 { font-size: 16px; }
  .skill-row { font-size: 12.5px; padding: 8px 9px; }
  .btn-skills { padding: 7px 12px; font-size: 12px; }
}
EOCSS
echo "CSS skills modal appended"
