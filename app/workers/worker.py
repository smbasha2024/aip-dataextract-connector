from app.runtime.task_queue import (TASK_QUEUE)
from app.registry.agent_registry import (AGENTS)
from app.database.repository import (get_task, update_status, mark_running, mark_completed, mark_failed)
from app.services.result_service import (send_result)
from app.config.settings import settings

import json
import httpx

import logging

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
class Worker:
    async def run(self):
        logger.info("Worker started...")
        while True:
            task_id = await TASK_QUEUE.get()
            try:
                await self.process_task(
                    task_id
                )
            except Exception as ex:
                logger.exception("Task %s execution failed.", task_id,)
                #logger.error(f"Error occurred while processing task {task_id}: {str(ex)}")
            finally:
                logger.info(
                    "Task %s completed. Marking task as done in the queue.",
                    task_id,
                )
                TASK_QUEUE.task_done()
    
    async def process_task(self, task_id):
        try:
            task = get_task(task_id)
            if task is None:
                logger.warning(
                    "Task %s not found.",
                    task_id,
                )
                return
            mark_running(task.id)
            
            #payload = json.loads(task.payload)

            agent_class = AGENTS.get(task.agent_name)
            if agent_class is None:
                raise ValueError(
                    f"Unknown agent: {task.agent_name}"
                )
            
            agent = agent_class()

            logger.info(f"Task {task_id} Execution Started. ")
            result = await agent.execute(task)
            mark_completed(task.id)
            
            logger.info(f"Task {task_id} completed. ")

            await send_result({
                    "job_id": task.job_id,
                    "status": "completed",
                    "output": result
                })
            logger.info(f"Task {task_id} Execution results are sent to Server. ")

        except Exception as ex:
            mark_failed(task_id, str(ex))
            logger.exception(
                "Task %s execution failed.",
                task_id,
            )
        