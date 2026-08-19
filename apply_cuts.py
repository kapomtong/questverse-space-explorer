"""Replace original boss sprite webps with transparent-cut versions
(code references boss_mathos.webp etc., so overwrite in place)."""
import shutil, os

files = ['boss_mathos', 'boss_chronos', 'boss_kawi', 'boss_lex', 'boss_terra']
for f in files:
    src = f'assets/{f}_cut.webp'
    dst = f'assets/{f}.webp'
    shutil.copy(src, dst)
    print('replaced', dst, os.path.getsize(dst), 'bytes')
    os.remove(src)
