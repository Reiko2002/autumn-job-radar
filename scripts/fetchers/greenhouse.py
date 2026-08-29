import httpx
from .base import SourceAdapter
from scripts.models import RawJob

class GreenhouseAdapter(SourceAdapter):
    async def fetch_jobs(self):
        url = f"https://boards-api.greenhouse.io/v1/boards/{self.config['board_token']}/jobs?content=true"
        async with httpx.AsyncClient(timeout=30, headers={'User-Agent':'AutumnJobRadar/1.0 public-job-aggregator'}) as client:
            response = await client.get(url); response.raise_for_status(); items = response.json().get('jobs', [])
        jobs=[]
        for item in items:
            jobs.append(RawJob(source_key=self.config['key'], source_name=self.config['name'], source_type='greenhouse', external_id=str(item['id']), company=self.config['company'], title=item['title'], location_text=(item.get('location') or {}).get('name'), description_html=item.get('content'), source_url=item['absolute_url'], apply_url=item['absolute_url'], raw_data={'sourceUpdatedAt': item.get('updated_at')}))
        return jobs
