"""Extract code blocks from Claude responses into files."""
import re, sys, os

os.chdir('/home/ubuntu/questverse-game')
src = sys.argv[1]
names = sys.argv[2].split(',') if len(sys.argv) > 2 else None
content = open(src).read()
blocks = re.findall(r'```(?:javascript|js)\n(.*?)```', content, re.DOTALL)
if not blocks:
    print('NO BLOCKS')
    sys.exit(1)
out_dir = 'js'
for i, code in enumerate(blocks):
    if names and i < len(names):
        fn = f'{out_dir}/{names[i]}'
    else:
        fn = f'{out_dir}/extra_{i}.js'
    with open(fn, 'w') as f:
        f.write(code.strip() + '\n')
    print(fn, len(code.strip()), 'chars')
