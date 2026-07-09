# py.agent
from app.agents.base_agent import BaseAgent
from playwright.sync_api import Playwright, sync_playwright, expect
from playwright.async_api import async_playwright, expect
import asyncio
import json
import logging

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
            browser = await pw.chromium.launch(headless=True)
            context = await browser.new_context()
            try:
                page = await context.new_page()
                await page.goto("https://www.google.com") # Replace with actual URL

                ########################################################
                # automation logic
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