from PIL import Image
im = Image.open('/home/ubuntu/questverse-game/assets/boss_mathos_cut.webp')
print('mode', im.mode, 'size', im.size)
print('corner (3,3):', im.getpixel((3,3)))
print('center (256,256):', im.getpixel((256,256)))
# count transparent
if im.mode == 'RGBA':
    transparent = sum(1 for a in im.getdata()[3::4]) if False else 0
    alphas = [p[3] for p in im.getdata()]
    print('transparent px:', sum(1 for a in alphas if a == 0), 'of', len(alphas))
