Yes. What you are describing is essentially a distributed Playwright worker container that:

Connects to your server via WebSocket.
Receives jobs.
Stores jobs in a local queue (flat-file database).
Processes jobs sequentially (or configurable parallelism).
Executes one of 12 Playwright automations.
Sends results back to the server API.
Runs entirely inside Docker.
Uses a customer-specific .env file without rebuilding the image.

This is a good architecture for a commercial deployment model.

Recommended Architecture
+-------------------+
| Your Server       |
|                   |
| WebSocket Server  |
| REST API          |
+---------+---------+
          |
          |
          v
+--------------------------------------+
| Customer Docker Container            |
|                                      |
| +-------------------------------+    |
| | WebSocket Client              |    |
| +---------------+---------------+    |
|                 |                    |
|                 v                    |
| +-------------------------------+    |
| | SQLite Queue Database         |    |
| +---------------+---------------+    |
|                 |                    |
|                 v                    |
| +-------------------------------+    |
| | Worker Manager                |    |
| +---------------+---------------+    |
|                 |                    |
|                 v                    |
| +-------------------------------+    |
| | Playwright Executors          |    |
| |  agent1.py                    |    |
| |  agent2.py                    |    |
| |  agent3.py                    |    |
| |  ...                           |    |
| |  agent12.py                   |    |
| +---------------+---------------+    |
|                 |                    |
|                 v                    |
| +-------------------------------+    |
| | Result API Client             |    |
| +-------------------------------+    |
+--------------------------------------+
Technology Stack
Component	Technology
Queue Database	SQLite
Websocket	websockets
API Calls	httpx
Playwright	playwright
Config	python-dotenv
Container	Docker
Logging	Python logging
Scheduler	asyncio

SQLite is perfect here.

No need for PostgreSQL.

No need for Redis.

No need for RabbitMQ.

Folder Structure
client-worker/

│
├── app/
│   ├── main.py
│
│   ├── websocket_client.py
│   ├── worker.py
│   ├── api_client.py
│
│   ├── database/
│   │   ├── db.py
│   │   └── queue.db
│
│   ├── agents/
│   │   ├── bbmp_tax.py
│   │   ├── water_bill.py
│   │   ├── electricity.py
│   │   ├── gst.py
│   │   └── ...
│
│   ├── registry.py
│   │
│   └── models.py
│
├── .env
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
.env File

Customer changes this only.

CLIENT_ID=CUST001

WS_URL=ws://server.com/ws

RESULT_API=https://server.com/task-result

DB_PATH=/data/queue.db

WORKER_COUNT=1

Container never rebuilt.

Customer simply edits:

CLIENT_ID=CUST002

and restarts container.

SQLite Table
CREATE TABLE tasks
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    job_id TEXT,

    agent_name TEXT,

    payload TEXT,

    status TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
Incoming WebSocket Message
{
  "job_id": "JOB001",
  "agent_name": "bbmp_tax",
  "payload":
  {
      "application_no":"1601066184",
      "owner_name":"SHAI"
  }
}
WebSocket Consumer

Based on your uploaded file, modify it to only enqueue jobs.

async def save_job(task):

    conn = sqlite3.connect(DB_PATH)

    conn.execute(
        """
        INSERT INTO tasks
        (
            job_id,
            agent_name,
            payload,
            status
        )
        VALUES
        (
            ?,
            ?,
            ?,
            'PENDING'
        )
        """,
        (
            task["job_id"],
            task["agent_name"],
            json.dumps(task["payload"])
        )
    )

    conn.commit()

The websocket thread never executes Playwright.

Its job is only:

Receive Message
      ↓
Store in SQLite
      ↓
Wait for Next Message
Agent Registry
from agents.bbmp_tax import run as bbmp_tax
from agents.water_bill import run as water_bill

AGENTS = {
    "bbmp_tax": bbmp_tax,
    "water_bill": water_bill
}
Worker Process

Runs forever.

while True:

    task = get_next_pending_task()

    if not task:
        await asyncio.sleep(2)
        continue

    execute(task)
Dispatch to Correct Playwright Script
agent_func = AGENTS.get(task["agent_name"])

result = await agent_func(task["payload"])
BBMP Agent Example

Convert your script into:

async def run(payload):

    application_no = payload["application_no"]

    owner_name = payload["owner_name"]

    with sync_playwright() as p:

        browser = p.chromium.launch()

        page = browser.new_page()

        page.goto(
            "https://bbmptax.karnataka.gov.in/"
        )

        page.locator(
            "#ContentPlaceHolder1_ContentPlaceHolder1_txtddlno"
        ).fill(application_no)

        page.locator(
            "#ContentPlaceHolder1_ContentPlaceHolder1_txtname"
        ).fill(owner_name)

        page.get_by_role(
            "button",
            name="Retrieve"
        ).click()

        text = page.locator("body").inner_text()

        browser.close()

        return {
            "success": True,
            "content": text
        }
Result API
async def send_result(job_id, result):

    payload = {
        "job_id": job_id,
        "status": "completed",
        "output": result
    }

    async with httpx.AsyncClient() as client:

        await client.post(
            RESULT_API,
            json=payload
        )
Failure Handling

Store failures too.

{
  "job_id":"JOB001",
  "status":"failed",
  "error":"Timeout waiting for page"
}
Worker State Update
PENDING
RUNNING
COMPLETED
FAILED

This prevents duplicate execution.

Dockerfile

For Playwright, use Microsoft image.

FROM mcr.microsoft.com/playwright/python:v1.54.0

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

CMD ["python","app/main.py"]
Docker Compose
version: '3.8'

services:

  worker:

    image: aiproxy/playwright-worker

    env_file:
      - .env

    volumes:
      - ./data:/data

    restart: unless-stopped
Deployment by Customer

Customer receives:

docker-compose.yml

.env

README.pdf

Start:

docker compose up -d

Change customer ID:

CLIENT_ID=CUST005

Restart:

docker compose restart

No image rebuild required.

Additional Enterprise Features I Recommend

Since you plan to distribute this commercially:

Job Retry
FAILED
↓
Retry 3 times
↓
Permanent Failure
Screenshots on Failure
page.screenshot(
    path=f"logs/{job_id}.png"
)
Video Recording
record_video_dir="videos/"

Very useful for customer support.

Heartbeat API

Every 60 seconds:

{
  "client_id":"CUST001",
  "status":"ONLINE"
}
Auto Update

Container periodically checks:

Current Version = 1.0.0
Latest Version = 1.0.2

and notifies customer.

Encryption

Do not expose:

Server URLs
API keys
Internal endpoints

Use .env variables and optionally signed JWT authentication.

Final Recommendation

For a production-ready distributed Playwright client, use:

Python + AsyncIO
SQLite queue
Playwright executors (12 agents)
WebSocket receiver
Background worker
Docker container
.env for customer identity
Failure screenshots
Retry mechanism
Heartbeat monitoring

This architecture will comfortably support thousands of queued jobs per customer container while remaining simple to install (docker compose up -d) and easy to support.