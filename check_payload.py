import json

d = json.load(open('vercel_deploy_input.json'))
files = d.get('files') or d if isinstance(d, dict) else d
if isinstance(files, list):
    names = [f.get('file', f) if isinstance(f, dict) else f for f in files]
    files = dict(zip(names, ['x'] * len(names)))
print(len(files), 'files')
req = ['index.html', 'style.css', 'js/config.js', 'js/minigame.js',
       'js/questions.js', 'assets/card_goldstar.webp',
       'assets/explorer_ship.webp', 'assets/mission_bg_aksara.jpg']
for r in req:
    print(('OK ' if r in files else 'MISSING '), r)
