import asyncio
import uuid

from app.events.broker import EVENT_BROKER
from app.runtime.connector_metrics import METRICS

class InputService:

    def __init__(self):
        self.pending = {}
        self.active_request_id = None

    async def publish_next_request(self):
        if self.active_request_id is not None:
            return

        for request_id, item in self.pending.items():
            if item["future"].done():
                continue

            self.active_request_id = request_id

            await EVENT_BROKER.input_required(
                request_id=request_id,
                job_id=item["job_id"],
                title=item["title"],
                message=item["message"],
                input_type=item["type"],
                image=item["image"],
            )

            break

    async def request_input(self, job_id, title, message, input_type, image=None, timeout=300,):
        request_id = str(uuid.uuid4())
        future = asyncio.Future()

        self.pending[request_id] = {
            "future": future,
            "job_id": job_id,
            "title": title,
            "message": message,
            "type": input_type,
            "image": image,
        }
        METRICS.pending_inputs += 1
        if self.active_request_id is None:
            self.active_request_id = request_id
            await EVENT_BROKER.input_required(
                request_id=request_id,
                job_id=job_id,
                title=title,
                message=message,
                input_type=input_type,
                image=image,
            )
        
        try:
            return await asyncio.wait_for(future, timeout,)

        finally:
            self.pending.pop(
                request_id,
                None,
            )
            if self.active_request_id == request_id:
                self.active_request_id = None
                await self.publish_next_request()
            #METRICS.pending_inputs -= 1

    def get_request(self):
        if self.active_request_id is None:
            return None

        item = self.pending.get(self.active_request_id)

        if item is None:
            return None

        return {
            "request_id": self.active_request_id,
            "job_id": item["job_id"],
            "title": item["title"],
            "message": item["message"],
            "type": item["type"],
            "image": item["image"],
        }

    async def submit(self, request_id, value,):
        item = self.pending.get(request_id)

        if item is None:
            return False

        await EVENT_BROKER.input_received(
            request_id=request_id,
            job_id=item["job_id"],
        )

        if not item["future"].done():
            item["future"].set_result(value)
            METRICS.pending_inputs -= 1
            self.active_request_id = None
            await self.publish_next_request()

        return True


INPUT_SERVICE = InputService()