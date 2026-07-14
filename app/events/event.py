from dataclasses import dataclass, field
from datetime import datetime, timezone
import uuid
from typing import Any
from app.events.event_types import EventType
from dataclasses import dataclass, field, asdict

@dataclass
class Event:
    type: EventType
    source: str
    payload: Any = field(default_factory=dict)
    job_id: str | None = None
    task_id: int | None = None
    event_id: str = field(
        default_factory=lambda: str(uuid.uuid4())
    )
    timestamp: str = field(
        default_factory=lambda:
            datetime.now(
                timezone.utc
            ).isoformat()
    )

    def to_dict(self):
        return {
            "id": self.event_id,
            "timestamp": self.timestamp,
            "type": self.type.value,
            "source": self.source,
            "job_id": self.job_id,
            "payload": (
                asdict(self.payload)
                if hasattr(self.payload, "__dataclass_fields__")
                else self.payload
            ),
        }