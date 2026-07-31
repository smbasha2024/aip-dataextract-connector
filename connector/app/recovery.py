from app.runtime.task_queue import (TASK_QUEUE)
from app.database.repository import (get_unfinished_tasks, mark_queued, reset_unfinished_tasks)

import logging

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

async def recover():
    #tasks = get_unfinished_tasks()
    count = reset_unfinished_tasks()

    logger.info(
        "Recovered %s unfinished tasks.",
        count,
    )
    """
    for task in tasks:
        mark_queued(task.id)
        await TASK_QUEUE.put(task.id)

    logger.info(
        f"Recovered "
        f"{len(tasks)} tasks"
    )
    """