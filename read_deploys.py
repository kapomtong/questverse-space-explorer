import json, glob, re

f = sorted(glob.glob('/home/ubuntu/.mcp/tool-results/*list_deployments*.json'))[-1]
d = json.load(open(f))

def walk(obj, depths=0):
    if depths > 6: return
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == 'deployments' and isinstance(v, list):
                for dep in v:
                    print(dep.get('id'), dep.get('state'), dep.get('createdAt'), dep.get('url'))
            else:
                walk(v, depths+1)
    elif isinstance(obj, list):
        for item in obj: walk(item, depths+1)

walk(d)
print('---RAW keys:', list(d.keys()) if isinstance(d, dict) else type(d))
