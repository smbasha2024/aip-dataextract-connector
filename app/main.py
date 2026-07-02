import asyncio
from app.database.create_db import create_database
from app.orchestrator.orchestrator import Orchestrator
from app.websocket.websocket_client import (websocket_client) 
from app.workers.worker import (Worker)
from app.recovery import (recover)
from app.config.settings import settings

import logging

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

async def main():
    create_database()   # Create tables if they don't exist
    await recover()

    orchestrator = Orchestrator()

    orchestrator_task = asyncio.create_task(
        orchestrator.run(),
        name="orchestrator",
    )
    
    workers = []
    worker_id = 0
    for _ in range(settings.max_parallel_agents):
        worker = Worker()
        worker_id = worker_id + 1
        workers.append(
            asyncio.create_task(
                worker.run(),
                name=f"worker-{worker_id}",
            )
        )

    websocket = asyncio.create_task(
        websocket_client(),
        name="websocket-client",
    )
    await asyncio.gather(websocket, orchestrator_task, *workers)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Connector shutting down...")