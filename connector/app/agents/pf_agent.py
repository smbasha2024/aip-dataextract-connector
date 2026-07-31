# py.agent
from app.agents.base_agent import BaseAgent
from playwright.sync_api import Playwright, sync_playwright, expect
from playwright.async_api import async_playwright, expect
import asyncio
import json
import logging
from pathlib import Path

from app.events.broker import EVENT_BROKER
from app.events.log_level import LogLevel
from app.services.download_manager import DOWNLOAD_MANAGER
from app.services.input_service import INPUT_SERVICE
from app.ui.browser import open_input_page

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
class PFAgent(BaseAgent):
    async def execute(self, task):
        job_id = task.job_id
        payload = json.loads(task.payload)
        uname = payload.get("username") 
        pwd = payload.get("password") 

        if not uname:
            #open_input_page()
            logger.warning("Username required. Please open http://localhost:5050")
            uname = await INPUT_SERVICE.request_input(job_id=job_id, title="PF Login", message="Enter your Username", input_type="text",)

        if not pwd:
            #open_input_page()
            logger.warning("Password required. Please open http://localhost:5050")
            pwd = await INPUT_SERVICE.request_input(job_id=job_id, title="PF Login", message="Enter your Password", input_type="password",)

        async with async_playwright() as pw:
            logger.info("Starting PF Agent. job_id=%s", job_id)
            await self.progress(task, step="Opening PF Portal", progress=5,)

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

                #######################################################
                # Capture Image Capturing
                """
                captcha = page.locator("#captchaImage")

                await captcha.screenshot(
                    path=f"/app/data/{job_id}_captcha.png"
                )

                import base64

                with open(
                    f"/app/data/{job_id}_captcha.png",
                    "rb"
                ) as f:
                    image = base64.b64encode(
                        f.read()
                    ).decode()

                captcha_text = await INPUT_SERVICE.request_input(job_id=job_id, title="CAPTCHA Required", message="Please enter the CAPTCHA", input_type="image", image=image,)
                """
                #######################################################


                await asyncio.sleep(3)

                logger.info(f"PF Agent: Task completed successfully:{job_id}")
                return {
                    "success": True
                }
            finally:
                await context.close()
                await browser.close()