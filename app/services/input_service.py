import asyncio
import uuid

from app.events.broker import EVENT_BROKER

class InputService:

    def __init__(self):
        self.pending = {}

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

    def get_request(self):
        if not self.pending:
            return None

        request_id = next(iter(self.pending))
        item = self.pending[request_id]

        return {
            "request_id": request_id,
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

        return True


INPUT_SERVICE = InputService()