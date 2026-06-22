from app.runtime.task_queue import (TASK_QUEUE)
from app.database.repository import (get_unfinished_tasks, mark_queued)

async def recover():
    tasks = get_unfinished_tasks()

    for task in tasks:
        await TASK_QUEUE.put(task.id)

    print(
        f"Recovered "
        f"{len(tasks)} tasks"
    )