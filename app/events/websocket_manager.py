from fastapi import WebSocket

from app.events.broker import EVENT_BROKER
from app.events.event import Event

import logging

logger = logging.getLogger(__name__)

class WebSocketManager:
    def __init__(self):
        self.connections = set()

        EVENT_BROKER.subscribe(
            self.broadcast
        )

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

WS_MANAGER = WebSocketManager()