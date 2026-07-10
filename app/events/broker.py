import asyncio
import logging

from app.events.event import Event

logger = logging.getLogger(__name__)


class EventBroker:
    def __init__(self):
        self.queue = asyncio.Queue()
        self.subscribers = []
        self.running = False
        self.dispatcher_task = None

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


EVENT_BROKER = EventBroker()