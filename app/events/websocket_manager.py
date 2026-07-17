from fastapi import WebSocket
from app.events.event import Event

import webbrowser
import asyncio

import logging

logger = logging.getLogger(__name__)

class WebSocketManager:
    def __init__(self):
        #from app.events.broker import EVENT_BROKER
        self.connections = set()
        self.dashboard_url = "http://localhost:5050"

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
        logger.info(
            "Dashboard connected (%d connections)",
            len(self.connections),
        )

    def disconnect(self, websocket: WebSocket,):
        self.connections.discard(websocket)
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

    async def ensure_dashboard(self):
        """
        Opens the dashboard browser only if
        there are no connected dashboards.
        """

        if self.connected:
            return

        logger.info("No dashboard connected. Launching browser...")

        webbrowser.open(self.dashboard_url)
        # Give the browser a few seconds to load
        for _ in range(20):          # wait up to 10 seconds
            if self.connected:
                return
            await asyncio.sleep(0.5)

WS_MANAGER = WebSocketManager()