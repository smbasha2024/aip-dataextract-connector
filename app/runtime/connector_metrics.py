from datetime import datetime, timezone
from app.events.connector_status import ConnectorStatus

class ConnectorMetrics:
    def __init__(self):
        self.started_at = datetime.now(timezone.utc)
        self.jobs_received = 0
        self.jobs_completed = 0
        self.jobs_failed = 0

        self.downloads = 0
        self.pending_inputs = 0
        self.websocket_reconnects = 0
        self.dashboard_launches = 0
        self.notifications = 0
        self.cloud_status = ConnectorStatus.DISCONNECTED

    @property
    def uptime_seconds(self):
        return int(
            (
                datetime.now(timezone.utc)
                - self.started_at
            ).total_seconds()
        )

METRICS = ConnectorMetrics()