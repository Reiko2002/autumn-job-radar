from datetime import datetime, timezone
from scripts.models import RawJob
from scripts.normalize import canonicalize_url, normalize_raw_job
from scripts.deduplicate import deduplicate
from scripts.quality_gate import run_quality_gate
from scripts.sync_jobs import merge

CFG={'roles':{'AI产品经理':['AI Product Manager']},'skills':{'SQL':['SQL'],'Agent':['Agent']},'industries':{'人工智能':['AI']},'locations':{'上海':['Shanghai']}}
def raw(description='Use SQL and Agent'):
    return RawJob(source_key='test',source_name='Test',source_type='manual_csv',external_id='1',company='Real Co',title='AI Product Manager',location_text='Shanghai',description_text=description,source_url='https://example.com/job/1?utm_source=x',apply_url='https://example.com/job/1')
def test_normalization_and_stable_id():
    first=normalize_raw_job(raw(),CFG); changed=normalize_raw_job(raw('Use SQL'),CFG)
    assert first['id']==changed['id']
    assert first['contentHash']!=changed['contentHash']
    assert first['cityTags']==['上海'] and first['roleCategory']=='AI产品经理'
    assert canonicalize_url(raw().source_url)=='https://example.com/job/1'
    assert first['jobType']=='experienced'
def test_deduplicate_keeps_different_companies():
    a=normalize_raw_job(raw(),CFG); b={**a,'id':'other','company':'Other Co','companyNormalized':'otherco'}
    assert len(deduplicate([a,a,b]))==2
def test_status_machine_and_failed_source():
    now=datetime.now(timezone.utc); old=normalize_raw_job(raw(),CFG,now)
    once=merge([old],[],{'test'},{'test'},now)[0]; assert once['status']=='suspected_closed'
    twice=merge([once],[],{'test'},{'test'},now)[0]; assert twice['status']=='closed'
    unchanged=merge([old],[],set(),{'test'},now)[0]; assert unchanged['missedSyncCount']==0

def test_merge_drops_removed_source():
    now=datetime.now(timezone.utc); old=normalize_raw_job(raw(),CFG,now)
    assert merge([old],[],set(),set(),now)==[]

def test_manual_metadata_is_normalized():
    item=raw(); item.raw_data={'job_type':'校招','graduate_years':'2026|2027','industry_tags':'国内企业','skill_tags':'产品|AI'}
    job=normalize_raw_job(item,CFG)
    assert job['jobType']=='campus' and job['graduateYears']==[2026,2027]
    assert '国内企业' in job['industryTags'] and 'AI' in job['skillTags']
def test_quality_gate_rejects_empty_and_all_failed():
    previous={'jobs':[normalize_raw_job(raw(),CFG)]}; payload={'stats':{'sourcesSucceeded':0},'jobs':[]}
    errors=run_quality_gate(previous,payload); assert 'all enabled sources failed' in errors and 'new output is empty' in errors
