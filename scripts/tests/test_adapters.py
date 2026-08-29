import pytest
from scripts.fetchers.manual_csv import ManualCsvAdapter

@pytest.mark.asyncio
async def test_manual_csv_header_only(tmp_path):
    path=tmp_path/'jobs.csv'; path.write_text('external_id,company,title,location,job_type,graduate_years,published_at,deadline_at,source_url,apply_url,description,industry_tags,skill_tags,enabled\n',encoding='utf-8')
    assert await ManualCsvAdapter({'key':'manual','name':'Manual','path':str(path)}).fetch_jobs()==[]
