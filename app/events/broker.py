import asyncio
import logging
from typing import Any

from app.config.settings import settings
from app.events.event import Event
from app.events.event_types import EventType
from app.events.connector_status import ConnectorStatus
from app.events.log_level import LogLevel
from app.runtime.task_queue import TASK_QUEUE
from app.events.event_payloads import (
    JobReceivedPayload,
    JobQueuedPayload,
    JobStartedPayload,
    JobCompletedPayload,
    JobFailedPayload,
    ProgressPayload,
    DownloadPayload,
    LogPayload,
    StatusPayload,
    HeartbeatPayload,
    InputRequiredPayload,
    InputReceivedPayload,
)

logger = logging.getLogger(__name__)

class EventBroker:
    def __init__(self):
        self.queue = asyncio.Queue()
        self.subscribers = []
        self.running = False
        self.dispatcher_task = None
        self.running_workers = 0

    def subscribe(self, callback):
        self.subscribers.append(callback)
        logger.info(
            "Event subscriber registered: %s",
            callback.__qualname__,
)

    async def publish(self, event: Event,):
        await self.queue.put(event)

    async def start(self):
        if self.running:
            return

        logger.info("Starting Event Broker...")
        self.running = True
        self.dispatcher_task = asyncio.create_task(
            self._dispatcher(),
            name="event-dispatcher",
        )

    async def stop(self):
        self.running = False

        if self.dispatcher_task:
            await self.queue.put(None)
            await self.dispatcher_task

    async def _dispatcher(self):
        logger.info("Event Dispatcher Started")

        while self.running:
            event = await self.queue.get()
            if event is None:
                break

            for subscriber in list(self.subscribers):
                try:
                    await subscriber(event)

                except Exception:
                    logger.exception(
                        "Event subscriber failed."
                    )
            self.queue.task_done()

        logger.info("Event Dispatcher Stopped")
    
    async def worker_started(self):
        self.running_workers += 1

    async def worker_finished(self):
        if self.running_workers > 0:
            self.running_workers -= 1

    async def publish_event(self, event_type: EventType, source: str, job_id: str | None = None, payload: Any = None,):
        """
        Convenience helper to create and publish an Event.
        """
        if payload is None:
            payload = {}

        event = Event(
            type=event_type,
            source=source,
            job_id=str(job_id) if job_id is not None else None,
            payload=payload,
        )
        await self.publish(event)
    
    async def job_started(self, task):
        await self.publish_event(
            event_type=EventType.JOB_STARTED,
            source="worker",
            job_id=task.job_id,
            payload=JobStartedPayload(
                task_id=task.id,
                agent_name=task.agent_name,
            ),
        )
    
    async def job_completed(self, task, result,):
        await self.publish_event(
            event_type=EventType.JOB_COMPLETED,
            source="worker",
            job_id=task.job_id,
            payload=JobCompletedPayload(
                task_id=task.id,
                agent_name=task.agent_name,
                output=result,
            ),
        )
    
    async def job_failed(self, task, error,):
        await self.publish_event(
            event_type=EventType.JOB_FAILED,
            source="worker",
            job_id=task.job_id if task else None,
            payload=JobFailedPayload(
                task_id=task.id if task else None,
                agent_name=task.agent_name if task else None,
                error=str(error),
            ),
        )

    async def job_received(self, task):
        await self.publish_event(
            event_type=EventType.JOB_RECEIVED,
            source="websocket",
            job_id=task.job_id,
            payload=JobReceivedPayload(
                task_id=task.id,
                agent_name=task.agent_name,
            ),
        )

    async def job_queued(self, task):
        await self.publish_event(
            event_type=EventType.JOB_QUEUED,
            source="orchestrator",
            job_id=task.job_id,
            payload=JobQueuedPayload(
                task_id=task.id,
                agent_name=task.agent_name,
            ),
        )

    async def input_required(self, request_id, job_id, title, message, input_type, image=None,):
        await self.publish_event(
            event_type=EventType.INPUT_REQUIRED,
            source="input_service",
            job_id=job_id,
            payload=InputRequiredPayload(
                request_id=request_id,
                title=title,
                message=message,
                input_type=input_type,
                image=image,
            ),
        )
    
    async def input_received(self, request_id, job_id,):
        await self.publish_event(
            event_type=EventType.INPUT_RECEIVED,
            source="input_service",
            job_id=job_id,
            payload=InputReceivedPayload(
                request_id=request_id,
            ),
        )
    
    async def download_ready(self, task, filename, path,):
        await self.publish_event(
            event_type=EventType.DOWNLOAD_READY,
            source=task.agent_name,
            job_id=task.job_id,
            payload=DownloadPayload(
                task_id=task.id,
                filename=filename,
                path=path,
            ),
        )

    async def agent_progress(self, task, step, progress, level=LogLevel.INFO,):
        await self.publish_event(
            event_type=EventType.LOG,
            source=task.agent_name,
            job_id=task.job_id,
            payload=ProgressPayload(
                task_id=task.id,
                step=step,
                progress=progress,
            ),
        )
    
    async def log(self, source, level, message, job_id=None,):
        await self.publish_event(
            event_type=EventType.LOG,
            source=source,
            job_id=job_id,
            payload=LogPayload(
                level=level.value,
                message=message,
            ),
        )
    
    async def status(self, status,):
        await self.publish_event(
            event_type=EventType.STATUS,
            source="connector",
            payload=StatusPayload(
                status=status.value,
                running_workers=self.running_workers,
                queue_size=TASK_QUEUE.qsize(),
                max_workers=settings.max_parallel_agents,
            ),
        )
    
    async def heartbeat(self):
        await self.publish_event(
            event_type=EventType.HEARTBEAT,
            source="connector",
            payload=HeartbeatPayload()
        )

EVENT_BROKER = EventBroker()