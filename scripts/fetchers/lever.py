import httpx
from datetime import datetime, timezone
from .base import SourceAdapter
from scripts.models import RawJob

class LeverAdapter(SourceAdapter):
    async def fetch_jobs(self):
        url=f"https://api.lever.co/v0/postings/{self.config['site_slug']}?mode=json"
        async with httpx.AsyncClient(timeout=30, headers={'User-Agent':'AutumnJobRadar/1.0 public-job-aggregator'}) as client:
            response=await client.get(url); response.raise_for_status(); items=response.json()
        jobs=[]
        for item in items:
            categories=item.get('categories') or {}; lists=item.get('lists') or []
            text='\n'.join([item.get('descriptionPlain',''), item.get('additionalPlain','')] + [entry.get('content','') for entry in lists])
            created=item.get('createdAt'); published=datetime.fromtimestamp(created/1000, tz=timezone.utc) if created else None
            jobs.append(RawJob(source_key=self.config['key'], source_name=self.config['name'], source_type='lever', external_id=item.get('id'), company=self.config['company'], title=item['text'], location_text=categories.get('location'), description_html=text, published_at=published, source_url=item['hostedUrl'], apply_url=item.get('applyUrl') or item['hostedUrl']))
        return jobs
