import json
import asyncio
import websockets

from app.database.repository import create_task
from app.runtime.task_queue import (TASK_QUEUE)
from app.config.settings import settings

async def websocket_client():
    async with websockets.connect(
        settings.server_ws,
        ping_interval=20,
        ping_timeout=20
    ) as websocket:

        print("Connected")

        while True:
            message = await websocket.recv()
            task = json.loads(message)

            task_id = create_task(task)

            await TASK_QUEUE.put(task_id)

            print(
                f"Task queued "
                f"{task['job_id']}"
            )