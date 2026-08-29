from difflib import SequenceMatcher

def completeness(job): return sum(bool(job.get(k)) for k in ('description','publishedAt','deadlineAt','locationText','skillTags'))
def deduplicate(jobs):
    by_id={}
    for job in jobs:
        current=by_id.get(job['id'])
        if not current or completeness(job)>completeness(current): by_id[job['id']]=job
    result=[]
    for job in by_id.values():
        duplicate=next((x for x in result if x['companyNormalized']==job['companyNormalized'] and set(x['cityTags'])==set(job['cityTags']) and SequenceMatcher(None,x['titleNormalized'],job['titleNormalized']).ratio()>=.94),None)
        if not duplicate: result.append(job)
        elif completeness(job)>completeness(duplicate): result[result.index(duplicate)]=job
    return result
