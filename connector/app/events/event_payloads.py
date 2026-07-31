from dataclasses import dataclass

@dataclass
class JobReceivedPayload:
    task_id: int
    agent_name: str
    status: str = "received"


@dataclass
class JobQueuedPayload:
    task_id: int
    agent_name: str
    status: str = "queued"


@dataclass
class JobStartedPayload:
    task_id: int
    agent_name: str
    status: str = "running"


@dataclass
class JobCompletedPayload:
    task_id: int
    agent_name: str
    status: str = "completed"
    output: dict | None = None


@dataclass
class JobFailedPayload:
    task_id: int | None
    agent_name: str | None
    status: str = "failed"
    error: str | None = None


@dataclass
class ProgressPayload:
    task_id: int
    step: str
    progress: int


@dataclass
class DownloadPayload:
    task_id: int
    filename: str
    path: str


@dataclass
class LogPayload:
    level: str
    message: str


@dataclass
class StatusPayload:
    status: str
    running_workers: int
    queue_size: int
    max_workers: int


@dataclass
class HeartbeatPayload:
    alive: bool = True


@dataclass
class InputRequiredPayload:
    request_id: str
    title: str
    message: str
    input_type: str
    image: str | None = None


@dataclass
class InputReceivedPayload:
    request_id: str