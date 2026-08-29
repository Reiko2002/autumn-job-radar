import hashlib, html, re, unicodedata
from datetime import datetime, timezone
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from bs4 import BeautifulSoup
import yaml
from scripts.models import RawJob

TRACKING={'utm_source','utm_medium','utm_campaign','utm_term','utm_content','from'}
def load_yaml(path):
    with open(path, encoding='utf-8') as f: return yaml.safe_load(f)
def clean_text(value):
    if not value: return ''
    text=BeautifulSoup(html.unescape(value),'html.parser').get_text('\n')
    return re.sub(r'\n{3,}','\n\n',re.sub(r'[ \t]+',' ',unicodedata.normalize('NFKC',text))).strip()
def canonicalize_url(url):
    parts=urlsplit(url.strip());
    if parts.scheme not in ('http','https'): raise ValueError('only http/https URLs are allowed')
    query=urlencode([(k,v) for k,v in parse_qsl(parts.query,keep_blank_values=True) if k.lower() not in TRACKING])
    return urlunsplit((parts.scheme.lower(),parts.netloc.lower(),parts.path,query,''))
def normalize_name(value): return re.sub(r'[\s\-_/()（）]+','',unicodedata.normalize('NFKC',value)).lower()
def match_labels(text, mapping):
    lowered=text.lower(); return [label for label, aliases in mapping.items() if any(alias.lower() in lowered for alias in aliases)]
def normalize_raw_job(raw: RawJob, configs: dict, now: datetime | None=None):
    now=now or datetime.now(timezone.utc); desc=clean_text(raw.description_text or raw.description_html); title=raw.title.strip(); company=raw.company.strip(); location=raw.location_text or ''
    company_n=normalize_name(company); title_n=normalize_name(title); cities=match_labels(location,configs['locations']); roles=match_labels(title,configs['roles']) or match_labels(title+' '+desc[:2000],configs['roles']); skills=match_labels(desc,configs['skills']); industries=match_labels(title+' '+desc,configs['industries'])
    source_url=canonicalize_url(raw.source_url); apply_url=canonicalize_url(raw.apply_url or raw.source_url)
    years_in_title=re.findall(r'20(?:2[5-9]|3[0-5])',title)
    years_in_context=re.findall(r'(?:class of|graduating in)\s*(20(?:2[5-9]|3[0-5]))|(20(?:2[5-9]|3[0-5]))\s*届',desc.lower())
    years=sorted({int(y) for y in years_in_title} | {int(y) for pair in years_in_context for y in pair if y})
    title_lower=title.lower(); job_type='intern' if re.search(r'\b(intern|internship)\b|实习',title_lower) else 'campus' if (re.search(r'\b(new grad|graduate program|university graduate)\b|校招|应届',title_lower) or years) else 'experienced'
    stable=f"{raw.source_key}|{raw.external_id}" if raw.external_id else f"{company_n}|{title_n}|{'|'.join(sorted(cities))}|{source_url}"
    job_id=hashlib.sha256(stable.encode()).hexdigest()[:16]
    content=hashlib.sha256('|'.join([company,title,location,desc,str(raw.published_at),str(raw.deadline_at),apply_url]).encode()).hexdigest()
    return {'id':job_id,'externalId':raw.external_id,'company':company,'companyNormalized':company_n,'title':title,'titleNormalized':title_n,'roleCategory':roles[0] if roles else None,'industryTags':industries,'cityTags':cities,'locationText':location or None,'jobType':job_type,'graduateYears':years,'description':desc,'responsibilities':'','requirements':'','skillTags':skills,'publishedAt':raw.published_at.isoformat() if raw.published_at else None,'deadlineAt':raw.deadline_at.isoformat() if raw.deadline_at else None,'sourceKey':raw.source_key,'sourceName':raw.source_name,'sourceType':raw.source_type,'sourceUrl':source_url,'applyUrl':apply_url,'status':'active','firstSeenAt':now.isoformat(),'lastSeenAt':now.isoformat(),'missedSyncCount':0,'contentHash':content}
