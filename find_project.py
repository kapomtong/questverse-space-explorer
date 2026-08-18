import json, glob

f = sorted(glob.glob('/home/ubuntu/.mcp/tool-results/*list_projects*.json'))[-1]
d = json.load(open(f))

def walk(o, depths=0):
    if depths > 8: return
    if isinstance(o, dict):
        for k, v in o.items():
            if k == 'projects' and isinstance(v, list):
                for p in v:
                    print(p.get('id'), p.get('name'), p.get('repository', {}).get('url') if isinstance(p.get('repository'), dict) else '')
            else:
                walk(v, depths + 1)
    elif isinstance(o, list):
        for item in o: walk(item, depths + 1)

walk(d)
print('raw keys:', list(d.keys()) if isinstance(d, dict) else type(d))
