import csv
from datetime import datetime
from pathlib import Path
from dateutil.parser import parse
from .base import SourceAdapter
from scripts.models import RawJob

def date_or_none(value: str): return parse(value) if value.strip() else None

class ManualCsvAdapter(SourceAdapter):
    async def fetch_jobs(self):
        path = Path(self.config['path'])
        if not path.exists(): raise FileNotFoundError(path)
        jobs = []
        with path.open(encoding='utf-8-sig', newline='') as handle:
            for row in csv.DictReader(handle):
                if row.get('enabled', 'true').lower() != 'true': continue
                if not all(row.get(key, '').strip() for key in ('company', 'title', 'source_url')): raise ValueError('CSV row missing company/title/source_url')
                jobs.append(RawJob(source_key=self.config['key'], source_name=self.config['name'], source_type='manual_csv', external_id=row.get('external_id') or None, company=row['company'], title=row['title'], location_text=row.get('location'), description_text=row.get('description'), published_at=date_or_none(row.get('published_at','')), deadline_at=date_or_none(row.get('deadline_at','')), source_url=row['source_url'], apply_url=row.get('apply_url') or row['source_url'], raw_data={'job_type': row.get('job_type'), 'graduate_years': row.get('graduate_years'), 'industry_tags': row.get('industry_tags'), 'skill_tags': row.get('skill_tags')}))
        return jobs
