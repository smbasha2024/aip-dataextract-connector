import httpx
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

async def send_result(result):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                settings.result_api,
                json=result,
            )
            response.raise_for_status()
        
        logger.info(
            "Result sent successfully. job_id=%s",
            result["job_id"],
        )

    except httpx.ConnectError:
        logger.warning(
            "Result API is not available. Skipping result submission."
        )

    except httpx.HTTPStatusError as ex:
        logger.error(
            "Result API returned %s",
            ex.response.status_code,
        )

    except Exception:
        logger.exception(
            "Unexpected error while sending result."
        )