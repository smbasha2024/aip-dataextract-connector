from app.runtime.task_queue import (TASK_QUEUE)
from app.registry.agent_registry import (AGENTS)
from app.database.repository import (get_task, update_status, mark_running, mark_completed, mark_failed)
from app.services.result_service import (send_result)
from app.config.settings import settings

import json
import httpx

class Worker:
    async def run(self):
        while True:
            task_id = await TASK_QUEUE.get()
            await self.process_task(
                task_id
            )
            TASK_QUEUE.task_done()
    
    async def process_task(self, task_id):
        try:
            task = get_task(task_id)
            mark_running(task.id)
            #update_status(task.id, "RUNNING")
            payload = json.loads(task.payload)

            agent_class = AGENTS[task.agent_name]
            agent = agent_class()

            result = await agent.execute(payload)
            mark_completed(task.id)
            #update_status(task.id, "COMPLETED")

            await send_result(
                {
                    "job_id": task.job_id,
                    "status": "completed",
                    "output": result
                }
            )
        except Exception as ex:
            mark_failed(task_id, str(ex))