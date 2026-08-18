import json, glob

f = sorted(glob.glob('/home/ubuntu/.mcp/tool-results/*list_deployments*.json'))[-1]
d = json.load(open(f))
deps = d['deployments']
# deps อาจเป็น dict หรือ list
if isinstance(deps, dict):
    deps = deps.get('deployments') or [deps]
for dep in deps:
    print(json.dumps(dep)[:300])
    print('---')
