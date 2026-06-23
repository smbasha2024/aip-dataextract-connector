import asyncio
from app.database.create_db import create_database
from app.websocket.websocket_client import (websocket_client) 
from app.workers.worker import (Worker)
from app.recovery import (recover)
from app.config.settings import settings

async def main():
    create_database()   # Create tables if they don't exist
    await recover()

    workers = []
    for _ in range(settings.max_parallel_agents):
        worker = Worker()
        workers.append(
            asyncio.create_task(worker.run())
        )

    websocket = asyncio.create_task(websocket_client())
    await asyncio.gather(websocket, *workers)

if __name__ == "__main__":
    asyncio.run(main())