from abc import ABC, abstractmethod
from scripts.models import RawJob

class SourceAdapter(ABC):
    def __init__(self, config: dict): self.config = config
    @abstractmethod
    async def fetch_jobs(self) -> list[RawJob]: raise NotImplementedError
