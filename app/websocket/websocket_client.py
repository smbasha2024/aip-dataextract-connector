import json
import asyncio
import websockets

from websockets.exceptions import (
    ConnectionClosed,
    ConnectionClosedError,
    InvalidURI,
)

from app.database.repository import create_task
from app.runtime.task_queue import (TASK_QUEUE)
from app.config.settings import settings

import logging

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

RECONNECT_DELAY = 10

async def websocket_client():
    while True:
        try:
            logger.info("Connecting to WebSocket server...")

            async with websockets.connect(
                f"{settings.server_ws}/{settings.client_id}",
                ping_interval=20,
                ping_timeout=20
            ) as websocket:

                logger.info("Connected to server")

                while True:
                    try:
                        message = await websocket.recv()
                        logger.info(f"Message Received: {message}")

                        task = json.loads(message)
                        logger.info(f"Task Loaded: {task}")

                        if "payload" not in task:
                            logger.warning("Received task without 'payload'. Skipping...")
                            continue
                        task_id = create_task(task)
                        logger.info(f"Task Created. Task ID: {task_id}")

                        await TASK_QUEUE.put(task_id)
                        logger.info(f"Task Queued. Task ID: {task_id}")
                        
                    except Exception as e:
                        logger.error(f"WebSocket connection failed: {e}")
                        logger.info("Retrying in 10 seconds...")
        except (
            ConnectionRefusedError,
            OSError,
            ConnectionClosed,
            ConnectionClosedError,
            InvalidURI,
        ) as e:
            logger.warning(f"Connection lost: {e}")

        except Exception:
            logger.exception("Unexpected error in websocket client")

        logger.info(f"Reconnecting in {RECONNECT_DELAY} seconds...")
        await asyncio.sleep(RECONNECT_DELAY)