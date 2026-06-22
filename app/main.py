import asyncio
from app.websocket.websocket_client import (websocket_client)
from app.workers.worker import (Worker)
from app.recovery import (recover)
from app.config.settings import settings

async def main():
    await recover()

    workers = []
    for _ in range(settings.MAX_PARALLEL_AGENTS):
        worker = Worker()
        workers.append(
            asyncio.create_task(worker.run())
        )

    websocket = asyncio.create_task(websocket_client())
    await asyncio.gather(websocket, *workers)

if __name__ == "__main__":
    asyncio.run(main())