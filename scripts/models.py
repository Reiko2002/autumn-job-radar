from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

@dataclass
class RawJob:
    source_key: str
    source_name: str
    source_type: str
    company: str
    title: str
    source_url: str
    external_id: str | None = None
    location_text: str | None = None
    description_html: str | None = None
    description_text: str | None = None
    published_at: datetime | None = None
    deadline_at: datetime | None = None
    apply_url: str | None = None
    raw_data: dict[str, Any] = field(default_factory=dict)

@dataclass
class FetchResult:
    key: str
    status: str
    jobs: list[RawJob] = field(default_factory=list)
    error: str | None = None
    duration_ms: int = 0
