# Mobile fix notes

1. `.boss-result` panels (victory/defeat) are appended to arena root with NO positioning/overlay CSS anywhere in style.css → they currently render as plain block content (bug: panels won't look like overlays). Need base CSS: position fixed inset 0, z-index 200, centered flex, dark bg, white text, styled buttons.
2. `.combo-counter` and `.camping-warning` ARE created inside arenaEl with inline display:none; .camping-warning has CSS (line 1889), .combo-counter has NO CSS → add base styling (top-right corner, gold bg).
3. `.event-card` (line 880, class 'event-card') has no CSS → add base + mobile sizing.
4. My appended mobile block at end references .event-card-popup (wrong) — must remove/replace.

Fix plan: replace the appended mobile block with corrected version:
- Add base CSS: .boss-result, .boss-result h2, .boss-result p, .boss-result img, .combo-counter, .event-card (+ .ta-result styles if missing)
- Mobile (max-width:600px): boss-result tighter padding/font, combo-counter smaller, event-card max-width, plus earlier hall/item fixes.

Also verify .ta-result CSS exists (grep earlier showed .ta-result at 2316+ — exists).
