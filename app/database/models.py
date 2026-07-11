# models.py
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import DateTime

from sqlalchemy.orm import declarative_base
from datetime import datetime, timezone

Base = declarative_base()

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, autoincrement=True)

    job_id = Column(String, nullable=False)
    tenant_id = Column(String, nullable=False)
    agent_name = Column(String, nullable=False)
    msg_to = Column(String, nullable=True)
    payload = Column(Text, nullable=False)
    status = Column(String, nullable=False)

    error_message = Column(Text)

    retry_count = Column(Integer, default=0)
    last_attempt_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))