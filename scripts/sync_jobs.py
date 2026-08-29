import asyncio, time
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
import yaml
from scripts.fetchers import ADAPTERS
from scripts.models import FetchResult
from scripts.normalize import load_yaml, normalize_raw_job
from scripts.deduplicate import deduplicate
from scripts.quality_gate import run_quality_gate
from scripts.storage import JOBS_PATH, META_PATH, atomic_write, load_previous

def configs(): return {'roles':load_yaml('config/role_aliases.yaml'),'skills':load_yaml('config/skill_keywords.yaml'),'industries':load_yaml('config/industry_keywords.yaml'),'locations':load_yaml('config/location_aliases.yaml')}
async def fetch_source(source):
    started=time.monotonic()
    try: return FetchResult(source['key'],'success',await ADAPTERS[source['type']](source).fetch_jobs(),duration_ms=int((time.monotonic()-started)*1000))
    except Exception as exc: return FetchResult(source['key'],'failed',error=f'{type(exc).__name__}: {str(exc)[:180]}',duration_ms=int((time.monotonic()-started)*1000))
def merge(previous_jobs,new_jobs,successful,configured,now):
    previous={j['id']:deepcopy(j) for j in previous_jobs}; fresh={j['id']:deepcopy(j) for j in new_jobs}; merged=[]
    for job in fresh.values():
        if job['id'] in previous: job['firstSeenAt']=previous[job['id']]['firstSeenAt']
        merged.append(job)
    for old in previous.values():
        if old['id'] in fresh: continue
        if old['sourceKey'] not in configured: continue
        if old['sourceKey'] in successful:
            old['missedSyncCount']=old.get('missedSyncCount',0)+1; old['status']='suspected_closed' if old['missedSyncCount']==1 else 'closed'
        merged.append(old)
    for job in merged:
        if job.get('deadlineAt') and datetime.fromisoformat(job['deadlineAt'].replace('Z','+00:00'))<now: job['status']='closed'
    return merged
async def main():
    started=datetime.now(timezone.utc); previous=load_previous(); source_doc=load_yaml('config/sources.yaml'); enabled=[s for s in source_doc['sources'] if s.get('enabled')]
    configured={s['key'] for s in enabled}
    results=await asyncio.gather(*(fetch_source(s) for s in enabled)); successful={r.key for r in results if r.status=='success'}
    normalized=[]; cfg=configs()
    for result in results:
        if result.status=='success': normalized.extend(normalize_raw_job(job,cfg,started) for job in result.jobs)
        print(f'{started.isoformat()} {"INFO" if result.status=="success" else "WARN"} source={result.key} status={result.status} fetched={len(result.jobs)} error={result.error or "-"}')
    jobs=merge(previous['jobs'],deduplicate(normalized),successful,configured,started)
    stats={'total':len(jobs),'active':sum(j['status']=='active' for j in jobs),'suspectedClosed':sum(j['status']=='suspected_closed' for j in jobs),'closed':sum(j['status']=='closed' for j in jobs),'sourcesSucceeded':len(successful),'sourcesFailed':len(results)-len(successful)}
    payload={'schemaVersion':1,'generatedAt':started.isoformat(),'stats':stats,'jobs':jobs}
    quality_previous=deepcopy(previous)
    quality_previous['jobs']=[job for job in previous['jobs'] if job['sourceKey'] in configured]
    quality_previous['stats']['active']=sum(job['status']=='active' for job in quality_previous['jobs'])
    errors=run_quality_gate(quality_previous,payload)
    finished=datetime.now(timezone.utc); meta={'schemaVersion':1,'startedAt':started.isoformat(),'finishedAt':finished.isoformat(),'status':'failed' if errors else ('partial' if stats['sourcesFailed'] else 'success'),'durationMs':int((finished-started).total_seconds()*1000),'summary':stats,'sources':[{'key':r.key,'status':r.status,'fetched':len(r.jobs),'durationMs':r.duration_ms,'error':r.error} for r in results],'qualityErrors':errors}
    atomic_write(META_PATH,meta)
    if errors: print('quality gate failed:',*errors,sep='\n- '); return 1
    atomic_write(JOBS_PATH,payload); print(f'sync complete total={stats["total"]} active={stats["active"]}'); return 0
if __name__=='__main__': raise SystemExit(asyncio.run(main()))
