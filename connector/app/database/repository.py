# repository.py
import json
from sqlalchemy.exc import IntegrityError
from app.database.models import Task
from app.database.session import get_db

def create_task(task_data):
    with get_db() as db:
        try:
            task = Task(
                job_id=task_data.job_id,
                tenant_id=task_data.tenant_id,
                agent_name=task_data.agent_name,
                payload=json.dumps(task_data.payload),
                status="RECEIVED",
            )

            db.add(task)

            db.commit()
            db.refresh(task)
            db.close()

            return task

        except IntegrityError:
            db.rollback()
            return None

        finally:
            db.close()

def get_task(task_id):
    with get_db() as db:
        task = db.get(Task, task_id)
        db.close()

        return task

def update_status(task_id, status):
   with get_db() as db:
        task = db.get(Task, task_id)
        task.status = status

        db.commit()
        db.close()

def get_received_tasks():
    with get_db() as db:
        try:
            return (
                db.query(Task)
                .filter(Task.status == "RECEIVED")
                .all()
            )

        finally:
            db.close()

def get_received_tasks(limit=30):
    with get_db() as db:

        return (
            db.query(Task)
            .filter(Task.status == "RECEIVED")
            .limit(limit)
            .all()
        )
    
def mark_queued(task_id):
    with get_db() as db:
        try:
            task = db.get(Task, task_id)
            task.status = "QUEUED"

            db.commit()

        finally:
            db.close()

def mark_running(task_id):
    with get_db() as db:
        try:
            task = db.get(Task, task_id)
            task.status = "RUNNING"

            db.commit()

        finally:
            db.close()

def mark_completed(task_id):
    with get_db() as db:
        try:
            task = db.get(Task, task_id)
            task.status = "COMPLETED"

            db.commit()

        finally:
            db.close()

def mark_failed(task_id, error):
    with get_db() as db:
        try:
            task = db.get(Task, task_id)
            task.status = "FAILED"
            task.error_message = error

            db.commit()

        finally:
            db.close()

def recover_tasks():
    with get_db() as db:
        try:
            (
                db.query(Task)
                .filter(
                    Task.status.in_(
                        [
                            "RUNNING",
                            "QUEUED"
                        ]
                    )
                )
                .update(
                    {"status": "RECEIVED"}
                )
            )

            db.commit()

        finally:
            db.close()

def get_unfinished_tasks():
    with get_db() as db:
        tasks = (
            db.query(Task)
            .filter(
                Task.status.in_(
                    [
                        "RECEIVED",
                        "RUNNING"
                    ]
                )
            )
            .all()
        )

        db.close()

        return tasks
    
def reset_unfinished_tasks():
    with get_db() as db:
        count = (
            db.query(Task)
            .filter(
                Task.status.in_(
                    [
                        "RECEIVED",
                        "RUNNING",
                        "QUEUED",
                        "FAILED"
                    ]
                )
            )
            .update(
                {
                    Task.status: "RECEIVED"
                },
                synchronize_session=False
            )
        )

        db.commit()

        return count