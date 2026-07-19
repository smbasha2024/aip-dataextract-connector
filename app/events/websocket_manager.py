from fastapi import WebSocket
from app.events.event import Event
from app.runtime.connector_metrics import METRICS
from app.config.settings import settings
# For Last connected and disconnected attributes
from datetime import datetime, timezone

import webbrowser
import asyncio

import logging

logger = logging.getLogger(__name__)

class WebSocketManager:
    def __init__(self):
        #from app.events.broker import EVENT_BROKER
        self.connections = set()
        self.dashboard_url = settings.dashboard_url 
        self.launching = False
        self.last_connected = None
        self.last_disconnected = None

        async def broadcast(self, event):
            ...

        """
        EVENT_BROKER.subscribe(
            self.broadcast
        )
        """
    async def connect(self, websocket: WebSocket,):
        await websocket.accept()

        self.connections.add(websocket)
        self.last_connected = datetime.now(timezone.utc)
        logger.info(
            "Dashboard connected (%d connections)",
            len(self.connections),
        )

    def disconnect(self, websocket: WebSocket,):
        self.connections.discard(websocket)
        self.last_disconnected = datetime.now(timezone.utc)
        logger.info(
            "Dashboard disconnected (%d connections)",
            len(self.connections),
        )
    
    async def broadcast(self, event: Event,):
        if not self.connections:
            return
        
        disconnected = []
        message = event.to_dict()

        for conn in self.connections:
            try:
                await conn.send_json(message)

            except Exception:
                logger.exception(
                    "Failed sending dashboard event."
                )
                disconnected.append(conn)

        for conn in disconnected:
            self.disconnect(conn)

    @property
    def connected(self) -> bool:
        return len(self.connections) > 0
    
    @property
    def connection_count(self) -> int:
        return len(self.connections)

    async def ensure_dashboard(self):
        """
        Opens the dashboard browser only if
        there are no connected dashboards.
        """

        if self.connected:
            return
        
        if self.launching:
            return

        self.launching = True

        try:
            logger.info("No dashboard connected. Launching browser...")

            webbrowser.open(self.dashboard_url)
            METRICS.dashboard_launches += 1

            # Give the browser a few seconds to load
            timeout = 10
            for _ in range(timeout * 2):          # wait up to 10 seconds
                if self.connected:
                    return
                await asyncio.sleep(0.5)

        except Exception:
            logger.exception(
                "Failed to launch dashboard browser."
            )
        finally:
            self.launching = False

WS_MANAGER = WebSocketManager()