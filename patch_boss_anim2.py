"""Step 4 fix: insert bossHurt() before loadQuestion() in onAnswer correct branch,
by line-based insertion after the invincible bonus closing brace."""
JS = 'js/boss.js'
src = open(JS).read()
lines = src.split('\n')

# find line: '      this.loadQuestion();' right after 'this.gameState.score += 50;' (invincible block)
target_idx = None
for i, ln in enumerate(lines):
    if ln.strip() == 'this.loadQuestion();':
        # check previous non-empty lines include score += 50
        prev = [lines[j].strip() for j in range(max(0, i-6), i) if lines[j].strip()]
        if any('this.gameState.score += 50;' in p for p in prev):
            target_idx = i
            break
assert target_idx is not None, 'loadQuestion anchor not found'
lines.insert(target_idx, '      // บอสสะเทือนถูกทำร้าย')
lines.insert(target_idx + 1, '      this.bossHurt();')
open(JS, 'w').write('\n'.join(lines))
print('inserted bossHurt at line', target_idx + 1)
