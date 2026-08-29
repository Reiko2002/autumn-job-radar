import pytest
from scripts.fetchers.manual_csv import ManualCsvAdapter
from scripts.import_feishu_tsv import convert

@pytest.mark.asyncio
async def test_manual_csv_header_only(tmp_path):
    path=tmp_path/'jobs.csv'; path.write_text('external_id,company,title,location,job_type,graduate_years,published_at,deadline_at,source_url,apply_url,description,industry_tags,skill_tags,enabled\n',encoding='utf-8')
    assert await ManualCsvAdapter({'key':'manual','name':'Manual','path':str(path)}).fetch_jobs()==[]

def test_feishu_import_never_publishes_personal_progress(tmp_path):
    source=tmp_path/'jobs.tsv'; target=tmp_path/'jobs.csv'
    source.write_text('某公司\t\tAI产品经理\t秋招正式批\t二面,一面\thttps://example.com/job\t公开备注\t大厂\t\n',encoding='utf-8')
    imported, skipped=convert(source,target)
    content=target.read_text(encoding='utf-8')
    assert (imported,skipped)==(1,0)
    assert '个人跟进状态' not in content and '二面' not in content
    assert '招聘批次：秋招正式批' in content and '备注：公开备注' in content
