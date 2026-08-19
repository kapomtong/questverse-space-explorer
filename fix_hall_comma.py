#!/usr/bin/env python3
"""Fix method commas in bossHall.js screen object."""
F = 'js/bossHall.js'
src = open(F, encoding='utf-8').read()

# 1. showSkillsModal body ends with:
#   b.addEventListener('click', () => this.removeSkillsModal());
# });
#   }   <-- needs trailing comma
old1 = """      b.addEventListener('click', () => this.removeSkillsModal());
    });
  }
  removeSkillsModal()"""
new1 = """      b.addEventListener('click', () => this.removeSkillsModal());
    });
  },
  removeSkillsModal()"""
if old1 in src:
    src = src.replace(old1, new1)
    print('fixed comma after showSkillsModal')
else:
    raise AssertionError('anchor 1 not found')

# 2. removeSkillsModal ends with `if (m) m.remove();\n  },` already? check and ensure comma
old2 = """    const m = document.getElementById('boss-skills-modal');
    if (m) m.remove();
  }
"""
new2 = """    const m = document.getElementById('boss-skills-modal');
    if (m) m.remove();
  },
"""
if 'if (m) m.remove();\n  },' not in src and old2 in src:
    src = src.replace(old2, new2)
    print('fixed comma after removeSkillsModal')
else:
    print('removeSkillsModal already has comma or different layout:',
          'if (m) m.remove();\\n  },' in src)

open(F, 'w', encoding='utf-8').write(src)
