import json
import asyncio

import logging

from app.events.log_level import LogLevel

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",)

from app.events.broker import EVENT_BROKER
from app.registry.agent_registry import AGENTS
from app.runtime.task_queue import TASK_QUEUE
from app.config.settings import settings

from app.database.repository import (
    get_received_tasks,
    mark_queued,
    mark_running,
    mark_completed,
    mark_failed
)

from app.services.result_service import (
    send_result
)

class Orchestrator:
    async def run(self):
        while True:
            try:
                #tasks = get_received_tasks()
                if TASK_QUEUE.qsize() >= settings.max_parallel_agents * 2:
                        await asyncio.sleep(2)
                        continue
                tasks = get_received_tasks(limit=30)

                for task in tasks:
                    mark_queued(task.id)
                    await TASK_QUEUE.put(task.id)
                    await EVENT_BROKER.job_queued(task)

                    logger.info(
                        "Queued task %s (%s)",
                        task.id,
                        task.job_id,
                    )

                    await EVENT_BROKER.log(
                        source="orchestrator",
                        level=LogLevel.INFO,
                        job_id=task.job_id,
                        message="Task queued for execution",
                    )
                    
                await asyncio.sleep(5)
                
            except Exception:
                logger.exception("Orchestrator failed.")
                await asyncio.sleep(5)