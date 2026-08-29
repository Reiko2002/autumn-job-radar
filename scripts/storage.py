import json, os
from pathlib import Path

JOBS_PATH=Path('public/data/jobs.json')
META_PATH=Path('public/data/sync-meta.json')
def load_previous():
    if not JOBS_PATH.exists(): return {'schemaVersion':1,'generatedAt':'','stats':{'total':0,'active':0,'suspectedClosed':0,'closed':0,'sourcesSucceeded':0,'sourcesFailed':0},'jobs':[]}
    payload=json.loads(JOBS_PATH.read_text(encoding='utf-8'))
    if payload.get('schemaVersion')!=1: raise ValueError('unsupported jobs schema')
    return payload
def atomic_write(path, value):
    path.parent.mkdir(parents=True,exist_ok=True); temp=path.with_suffix(path.suffix+'.next'); temp.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8'); os.replace(temp,path)
