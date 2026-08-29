from urllib.parse import urlsplit
def valid_url(value):
    try: return urlsplit(value).scheme in ('http','https') and bool(urlsplit(value).netloc)
    except Exception: return False
def run_quality_gate(previous, payload):
    jobs=payload['jobs']; errors=[]; ids=[j['id'] for j in jobs]
    if payload['stats']['sourcesSucceeded']==0: errors.append('all enabled sources failed')
    if previous['jobs'] and not jobs: errors.append('new output is empty')
    old_active=sum(j['status']=='active' for j in previous['jobs']); new_active=sum(j['status']=='active' for j in jobs)
    if old_active>=10 and new_active<old_active*.5: errors.append('active jobs dropped more than 50%')
    if len(ids)!=len(set(ids)): errors.append('duplicate ids')
    invalid=[j['id'] for j in jobs if not j['company'] or not j['title'] or not valid_url(j['sourceUrl']) or not valid_url(j['applyUrl'])]
    if invalid and len(invalid)/max(len(jobs),1)>.1: errors.append('invalid job ratio exceeds 10%')
    return errors
