import json
import asyncio
import websockets

from websockets.exceptions import (
    ConnectionClosed,
    ConnectionClosedError,
    InvalidURI,
    InvalidMessage,
    InvalidStatus,
)

from app.database.models import Task
from app.database.repository import create_task
from app.config.settings import settings
from app.events.broker import EVENT_BROKER
from app.events.connector_status import ConnectorStatus
from app.events.log_level import LogLevel
from app.services.heartbeat_service import send_heartbeat
from app.runtime.connector_metrics import METRICS

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
            ws_url = f"{settings.server_ws}/{settings.client_id}"
            logger.info("Connecting to WebSocket server... %s", ws_url)

            async with websockets.connect(
                ws_url,
                ping_interval=20,
                ping_timeout=20,
                open_timeout=20,
            ) as websocket:

                logger.info("Connected to Cloud server")
                METRICS.cloud_status = ConnectorStatus.CONNECTED
                await EVENT_BROKER.status(ConnectorStatus.CONNECTED)

                heartbeat_task = asyncio.create_task(send_heartbeat(websocket))

                while True:
                    message = await websocket.recv()
                    try:
                        logger.debug("Raw message: %s", message)

                        data = json.loads(message)
                        if not isinstance(data, dict):
                            logger.warning(
                                "Received invalid message from cloud server. Expected JSON object."
                            )
                            continue

                        task = Task(**data)
                        logger.info(
                            "Task received from cloud server. job_id=%s agent=%s",
                            task.job_id,
                            task.agent_name,
                        )

                        required_fields = [
                            "job_id",
                            "tenant_id",
                            "agent_name",
                            "payload"
                        ]

                        missing = [
                            field
                            for field in required_fields
                            if getattr(task, field, None) in (None, "")
                        ]

                        if missing:
                            logger.warning(
                                f"Received task from cloud server missing required fields: {missing}. Skipping..."
                            )
                            continue

                        saved_task = create_task(task)

                        if saved_task is None:
                            logger.warning(
                                "Duplicate job_id '%s'. Ignoring message.",
                                task.job_id,
                            )
                            continue

                        METRICS.jobs_received += 1
                    
                        logger.info("Task received from cloud server is stored successfully. job_id=%s task_id=%s agent=%s", saved_task.job_id, saved_task.id, saved_task.agent_name,)

                        await EVENT_BROKER.job_received(saved_task)
                        await EVENT_BROKER.log(
                            source="websocket",
                            level=LogLevel.INFO,
                            job_id=saved_task.job_id,
                            message=f"Task received ({saved_task.agent_name})",
                        )

                        logger.info(f"Cloud Server Task Stored Successfully. Task ID: {saved_task.id}")
                    
                    except json.JSONDecodeError:
                        logger.exception("Received invalid JSON from cloud server. Skipping message.")

                    except KeyError as e:
                        logger.exception(f"Required field missing from cloud server task: {e}. Skipping message.")

                    except ValueError as e:
                        logger.exception(f"Invalid task data from cloud server: {e}. Skipping message.")

                    except TypeError as e:
                        logger.exception(f"Invalid task type from cloud server: {e}. Skipping message.")

                    #except Exception as e:
                        #logger.error(f"WebSocket connection failed: {e}")
                        #logger.info("Retrying in 10 seconds...")
                        #logger.exception("Error processing received task")
        
        except asyncio.CancelledError:
            logger.info("WebSocket client stopped with the Cloud server.")
            raise

        except InvalidMessage as e:
            logger.warning(
                "WebSocket handshake failed. Cloud Server did not send a valid HTTP response: %s",
                e,
            )

        except InvalidStatus as e:
            logger.warning(
                "Cloud Server WebSocket rejected the connection: %s",
                e,
            )

        except (
            ConnectionRefusedError,
            OSError,
            ConnectionClosed,
            ConnectionClosedError,
            InvalidURI,
        ) as e:
            logger.warning(f"Connection lost with Cloud Server: {e}")
            METRICS.cloud_status = ConnectorStatus.DISCONNECTED
            await EVENT_BROKER.status(ConnectorStatus.DISCONNECTED)

        except Exception:
            logger.exception("Unexpected error in websocket client")

        finally:
            if heartbeat_task is not None:
                heartbeat_task.cancel()
                logger.info("Heartbeat stopped with Cloud Server.")
                try:
                    await heartbeat_task
                except asyncio.CancelledError:
                    pass
                heartbeat_task = None
        
        logger.info(f"Reconnecting to Cloud Server in {RECONNECT_DELAY} seconds...")
        METRICS.websocket_reconnects += 1
        await asyncio.sleep(RECONNECT_DELAY)