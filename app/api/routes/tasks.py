from fastapi import APIRouter
from app.database.repository import get_unfinished_tasks
import json

tasks_router = APIRouter(
    prefix="/api/tasks",
    tags=["Tasks"],
)

@tasks_router.get("/unfinished")
async def unfinished_tasks():
    tasks = get_unfinished_tasks()

    return [
        {
            "id": task.id,
            "job_id": task.job_id,
            "tenant_id": task.tenant_id,
            "agent_name": task.agent_name,
            "payload":json.dumps(task.payload),
            "status": task.status,
            "received_at": task.created_at,
        }
        for task in tasks
    ]
