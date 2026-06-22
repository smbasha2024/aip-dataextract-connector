import json
import asyncio

from app.registry.agent_registry import AGENTS

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

SEMAPHORE = asyncio.Semaphore(3)

async def execute_task(task):
    async with SEMAPHORE:

        try:
            mark_running(task.id)

            agent_class = AGENTS[task.agent_name]
            agent = agent_class()
            payload = json.loads(task.payload)

            result = await agent.execute(payload)

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

class Orchestrator:
    async def run(self):

        while True:
            tasks = get_received_tasks()

            for task in tasks:
                mark_queued(task.id)
                asyncio.create_task(execute_task(task))

            await asyncio.sleep(5)