from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Form

from app.services.input_service import INPUT_SERVICE
from app.api.routes.input import router as input_router
from app.api.routes.health import router as health_router
from fastapi import WebSocket
from fastapi import WebSocketDisconnect

from app.events.websocket_manager import WS_MANAGER

app = FastAPI(title="AIProxys Connector API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(input_router)
app.include_router(health_router)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket,):
    await WS_MANAGER.connect(websocket)

    try:
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        WS_MANAGER.disconnect(websocket)
