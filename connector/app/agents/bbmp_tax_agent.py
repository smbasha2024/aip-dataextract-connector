from app.agents.base_agent import BaseAgent
from playwright.sync_api import Playwright, sync_playwright, expect
from playwright.async_api import async_playwright, expect
import asyncio
import json
import logging
from pathlib import Path

from app.events.log_level import LogLevel
from app.services.download_manager import DOWNLOAD_MANAGER

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
class BBMPTaxAgent(BaseAgent):
    async def execute(self, task):
        job_id = task.job_id
        payload = json.loads(task.payload)
        uname = "" #payload.get("username") 
        pwd = "" #payload.get("password") 

        async with async_playwright() as pw:
            logger.info("Starting PF Agent. job_id=%s", job_id)
            await self.progress(task, step="Opening BBMP Portal", progress=5,)
            browser = await pw.chromium.launch(headless=True)
            context = await browser.new_context()
            try:
                await self.progress(task, step="Launching Browser", progress=10,)
                await self.log(task, LogLevel.INFO, "Launching browser",)
                
                page = await context.new_page()
                await page.goto("https://www.google.com") # Replace with actual URL

                ########################################################
                # automation logic
                await self.progress(task, step="Opening Login Page", progress=20,)

                await self.progress(task, step="Logging In", progress=35,)
                
                await self.progress(task, step="Searching Member", progress=60,)

                await self.progress(task, step="Downloading PDF", progress=90,)

                await self.progress(task, step="Completed", progress=100,)

                Path("/app/data/sample.pdf").write_text("Testing")
                await DOWNLOAD_MANAGER.register(task, filepath="/app/data/sample.pdf",)
                #######################################################

                await asyncio.sleep(3)

                logger.info(f"BBMPTax Agent: Task completed successfully:{job_id}")
                return {
                    "success": True
                }
            finally:
                await context.close()
                await browser.close()
        