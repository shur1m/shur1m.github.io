from dataclasses import dataclass
from datetime import date


@dataclass(frozen=True)
class Post:
    title: str
    created_on: date
    description: str
    url: str

    def as_metadata(self) -> dict[str, str]:
        return {
            "title": self.title,
            "date": self.created_on.isoformat(),
            "description": self.description,
            "url": self.url,
        }
