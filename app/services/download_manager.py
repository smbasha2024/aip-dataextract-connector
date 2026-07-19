from pathlib import Path

from app.events.broker import EVENT_BROKER
from app.runtime.connector_metrics import METRICS

class DownloadManager:
    async def register(self, task, filepath,):
        path = Path(filepath)

        if not path.exists():
            raise FileNotFoundError(filepath)
        
        METRICS.downloads += 1
        await EVENT_BROKER.download_ready(
            task=task,
            filename=path.name,
            path=str(path),
        )

DOWNLOAD_MANAGER = DownloadManager()