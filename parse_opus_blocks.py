"""Extract code blocks from Opus markdown output into files."""
import re
import sys

path = sys.argv[1]
outdir = sys.argv[2]

text = open(path).read()

pattern = re.compile(r"```(\w+)?\s*\n(.*?)```", re.DOTALL)
blocks = pattern.findall(text)

print(f"{len(blocks)} code blocks found")
for lang, code in blocks:
    code = code.strip()
    first_line = code.split("\n")[0].strip()
    # Try to find filename hint from comment line like "// file: js/xxx.js"
    fname = None
    m = re.search(r"(js/[\w\-]+\.(?:js|html|css))", first_line)
    if m:
        fname = m.group(1)
    m2 = re.search(r"([\w\-]+\.(?:js|html|css))", first_line)
    if not fname and m2:
        fname = "js/" + m2.group(1)
    if not fname:
        fname = "block_" + lang + "_" + str(abs(hash(code)) % 10000) + "." + (lang or "txt")
    out = f"{outdir}/{fname}"
    open(out, "w").write(code)
    print(f"  -> {out} ({len(code)} chars)")
