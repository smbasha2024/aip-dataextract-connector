from fastapi import APIRouter

from app.runtime.connector_metrics import METRICS
from app.events.websocket_manager import WS_MANAGER
from app.config.settings import settings
from app.events.broker import EVENT_BROKER

router = APIRouter(
    prefix="/api/health",
    tags=["Health"],
)


@router.get("")
async def health():

    return {
        "status": EVENT_BROKER.status, 
        "version": settings.version,
        "uptime_seconds": METRICS.uptime_seconds,
        "jobs_received": METRICS.jobs_received,
        "jobs_completed": METRICS.jobs_completed,
        "jobs_failed": METRICS.jobs_failed,
        "downloads": METRICS.downloads,
        "pending_inputs": METRICS.pending_inputs,
        "dashboard_launches": METRICS.dashboard_launches,
        "websocket_reconnects": METRICS.websocket_reconnects,
        "dashboard_connected": WS_MANAGER.connected,
        "dashboard_connections": WS_MANAGER.connection_count,
    }