import asyncio
from app.database.create_db import create_database
from app.events.connector_status import ConnectorStatus
from app.orchestrator.orchestrator import Orchestrator
from app.websocket.websocket_client import (websocket_client) 
from app.workers.worker import (Worker)
from app.recovery import (recover)
from app.config.settings import settings
from app.events.broker import EVENT_BROKER

import uvicorn
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

async def start_local_ui():
    try:
        logger.info("Starting Local UI...")

        server = uvicorn.Server(
            uvicorn.Config(
                "app.ui.server:app",
                host="0.0.0.0",
                port=5050,
                log_level="info",
            )
        )

        await server.serve()

    except Exception:
        logger.exception("Failed to start Local UI")

async def main():
    create_database()   # Create tables if they don't exist
    await EVENT_BROKER.status(ConnectorStatus.STARTING)

    await recover()
    await EVENT_BROKER.status(ConnectorStatus.RECOVERING)
    
    await EVENT_BROKER.start()

    # 1. Local UI
    ui_task = asyncio.create_task(
        start_local_ui(),
        name="ui",
    )

    # 2. Cloud WebSocket client
    websocket = asyncio.create_task(
        websocket_client(),
        name="websocket-client",
    )

    # 3. Orchestrator
    orchestrator = Orchestrator()

    orchestrator_task = asyncio.create_task(
        orchestrator.run(),
        name="orchestrator",
    )
    
    # 4. Workers
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
    
    await asyncio.gather(websocket, orchestrator_task, ui_task, *workers)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Connector shutting down...")