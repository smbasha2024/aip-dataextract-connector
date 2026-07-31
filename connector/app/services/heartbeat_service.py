import asyncio
import json
import logging

from app.config.settings import settings
from app.events.broker import EVENT_BROKER

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

async def send_heartbeat(websocket):
    while True:
        try:
            await websocket.send(json.dumps({
                "type": "heartbeat",
                "client_id": settings.client_id
            }))

            await EVENT_BROKER.heartbeat()
            
            logger.info("Cloud Service Heartbeat sent")

            await asyncio.sleep(10)

        except Exception:
            logger.exception("Error sending Cloud Service Heartbeat")
            break