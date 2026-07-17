import asyncio

class DashboardManager:
    def __init__(self):
        self.connected = False
        self.websocket = None
        self.lock = asyncio.Lock()

    async def register(self, websocket):
        async with self.lock:
            self.connected = True
            self.websocket = websocket

    async def unregister(self):
        async with self.lock:
            self.connected = False
            self.websocket = None

    async def is_connected(self):
        return self.connected

DASHBOARD_MANAGER = DashboardManager()