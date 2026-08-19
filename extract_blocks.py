"""Lenient extractor: pairs fence lines sequentially; handles unbalanced fences by closing at EOF.
Splits a single long block into files when it contains section headers like '// js/name.js' comments."""
import re
import sys

src, outdir = sys.argv[1], sys.argv[2]
lines = open(src).read().split("\n")
blocks = []
buf = None
label = None
for ln in lines:
    s = ln.strip()
    if s.startswith("```"):
        if buf is None:
            label = s[3:].strip()
            buf = []
        else:
            blocks.append((label, buf))
            buf = None
            label = None
    elif buf is not None:
        buf.append(ln)
if buf is not None:
    blocks.append((label, buf))

print(f"{len(blocks)} blocks in {src}")
for label, body in blocks:
    if label in ("css", "html"):
        name = f"style_{label}.addition" if label == "css" else "index.addition"
        open(f"{outdir}/{name}", "w").write("\n".join(body))
        print(f"  {outdir}/{name} ({len(body)} lines)")
        continue
    # Split JS block by file-header comments
    text = "\n".join(body)
    splits = re.split(r"(?m)^// js/([\w\-]+\.js)\s*$", text)
    if len(splits) >= 3:
        cur = None
        for i in range(1, len(splits), 2):
            fname = splits[i]
            code = splits[i + 1].strip()
            if code:
                open(f"{outdir}/{fname}", "w").write(code + "\n")
                print(f"  {outdir}/{fname} ({len(code)} chars)")
    else:
        name = re.search(r"[\w\-]+\.js", text[:200])
        fn = name.group(0) if name else "boss_new.js"
        open(f"{outdir}/{fn}", "w").write(text.strip() + "\n")
        print(f"  {outdir}/{fn} ({len(text)} chars)")
