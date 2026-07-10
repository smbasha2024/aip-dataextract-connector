from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi import Form

from app.services.input_service import INPUT_SERVICE

from fastapi import WebSocket
from fastapi import WebSocketDisconnect

from app.events.websocket_manager import WS_MANAGER

app = FastAPI(title="AIProxys Connector API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket,):
    await WS_MANAGER.connect(websocket)

    try:
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        WS_MANAGER.disconnect(websocket)

@app.get("/", response_class=HTMLResponse)
async def home():
    req = INPUT_SERVICE.get_request()

    if req is None:
        return """
        <html>
        <body>
            <h2>No input required.</h2>
        </body>
        </html>
        """

    image_html = ""

    if req["image"]:
        image_html = f"""
        <img
            src="{req['image']}"
            style="max-width:300px;"
        />
        """

    return f"""
    <html>

    <body>
        <h2>{req['title']}</h2>
        <p>{req['message']}</p>
        {image_html}
        <form action="/submit" method="post">
            <input
                type="hidden"
                name="request_id"
                value="{req['request_id']}"
            />

            <input
                type="{req['type']}"
                name="value"
            />

            <br><br>

            <button type="submit">
                Submit
            </button>
        </form>
    </body>
    </html>
    """

@app.post("/submit")
async def submit(
    request_id: str = Form(...),
    value: str = Form(...),
):

    ok = INPUT_SERVICE.submit(
        request_id,
        value,
    )

    return {
        "success": ok
    }