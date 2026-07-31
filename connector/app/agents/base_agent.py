# base_agent.py

from app.events.broker import EVENT_BROKER
from app.events.log_level import LogLevel


class BaseAgent:
    async def execute(self, task):
        raise NotImplementedError()
    
    async def progress(self, task, step: str, progress: int,):
        await EVENT_BROKER.agent_progress(
            task=task,
            step=step,
            progress=progress,
        )
    
    async def log(self, task, level: LogLevel, message: str,):
        await EVENT_BROKER.log(
            source=self.__class__.__name__,
            level=level,
            job_id=task.job_id,
            message=message,
        )