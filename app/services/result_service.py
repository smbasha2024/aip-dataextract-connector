import httpx
from app.config.settings import settings

async def send_result(result):
    async with httpx.AsyncClient() as client:
        await client.post(settings.result_api, json=result)