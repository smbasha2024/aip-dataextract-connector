from pathlib import Path

from app.events.broker import EVENT_BROKER


class DownloadManager:
    async def register(self, task, filepath,):
        path = Path(filepath)

        if not path.exists():
            raise FileNotFoundError(filepath)

        await EVENT_BROKER.download_ready(
            task=task,
            filename=path.name,
            path=str(path),
        )


DOWNLOAD_MANAGER = DownloadManager()