from fastapi import APIRouter
from fastapi import WebSocket
from fastapi import WebSocketDisconnect

from app.events.websocket_manager import WS_MANAGER

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
):

    await WS_MANAGER.connect(websocket)

    try:

        while True:

            await websocket.receive_text()

    except WebSocketDisconnect:

        WS_MANAGER.disconnect(websocket)