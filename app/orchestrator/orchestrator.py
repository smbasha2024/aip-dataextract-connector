import json
import asyncio

import logging

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",)

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
"""
SEMAPHORE = asyncio.Semaphore(3)

async def execute_task(task):
    async with SEMAPHORE:

        try:
            mark_running(task.id)

            agent_class = AGENTS[task.agent_name]
            agent = agent_class()
            payload = json.loads(task.payload)
            logger.info(f"Agent {agent_class} Invoked.")
            result = await agent.execute(payload)
            logger.info(f"Agent {agent_class} Payload {payload} Result {result}.")
            mark_completed(task.id)

            await send_result(
                {
                    "job_id": task.job_id,
                    "status": "completed",
                    "output": result
                }
            )

        except Exception as ex:
            mark_failed(task.id, str(ex))
"""
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
                    mark_queued(task["id"])
                    #asyncio.create_task(execute_task(task))
                    await TASK_QUEUE.put(task["id"])

                    logger.info(
                        "Queued task %s (%s)",
                        task["id"],
                        task["job_id"],
                    )
                
                await asyncio.sleep(5)
                
            except Exception:
                logger.exception("Orchestrator failed.")
                await asyncio.sleep(5)