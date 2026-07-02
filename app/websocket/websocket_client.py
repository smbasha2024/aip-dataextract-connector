import json
import asyncio
import websockets

from websockets.exceptions import (
    ConnectionClosed,
    ConnectionClosedError,
    InvalidURI,
)

from app.database.repository import create_task
from app.config.settings import settings
from app.services.heartbeat_service import send_heartbeat

import logging

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

RECONNECT_DELAY = 10

async def websocket_client():
    heartbeat_task = None
    while True:
        try:
            logger.info("Connecting to WebSocket server...")

            async with websockets.connect(
                f"{settings.server_ws}/{settings.client_id}",
                ping_interval=20,
                ping_timeout=20
            ) as websocket:

                logger.info("Connected to server")

                heartbeat_task = asyncio.create_task(send_heartbeat(websocket))

                while True:
                    message = await websocket.recv()
                    try:
                        logger.debug("Raw message: %s", message)

                        task = json.loads(message)
                        logger.info(
                            "Task received. job_id=%s agent=%s",
                            task["job_id"],
                            task["agent_name"],
                        )

                        if not isinstance(task, dict):
                            logger.warning("Received invalid task format. Expected a JSON object.")
                            continue

                        required_fields = [
                            "job_id",
                            "tenant_id",
                            "agent_name",
                            "payload"
                        ]

                        missing = [
                            field
                            for field in required_fields
                            if field not in task or task[field] in (None, "")
                        ]

                        if missing:
                            logger.warning(
                                f"Received task missing required fields: {missing}. Skipping..."
                            )
                            continue

                        task_id = create_task(task)
                        logger.info(f"Task Created. Task ID: {task_id}")
                        if task_id is None:
                            logger.warning(
                                "Duplicate job_id '%s'. Ignoring message.",
                                task["job_id"]
                            )
                            continue

                        logger.info(f"Task Stored Successfully. Task ID: {task_id}")
                    
                    except json.JSONDecodeError:
                        logger.exception("Received invalid JSON. Skipping message.")

                    except KeyError as e:
                        logger.exception(f"Required field missing: {e}. Skipping message.")

                    except ValueError as e:
                        logger.exception(f"Invalid task data: {e}. Skipping message.")

                    except TypeError as e:
                        logger.exception(f"Invalid task type: {e}. Skipping message.")

                    #except Exception as e:
                        #logger.error(f"WebSocket connection failed: {e}")
                        #logger.info("Retrying in 10 seconds...")
                        #logger.exception("Error processing received task")
        
        except asyncio.CancelledError:
            logger.info("WebSocket client stopped")
            raise

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

        finally:
            if heartbeat_task is not None:
                heartbeat_task.cancel()
                try:
                    await heartbeat_task
                except asyncio.CancelledError:
                    pass
                heartbeat_task = None
        
        logger.info(f"Reconnecting in {RECONNECT_DELAY} seconds...")
        await asyncio.sleep(RECONNECT_DELAY)