from base_agent import BaseAgent
from playwright.sync_api import Playwright, sync_playwright, expect
import asyncio

class BBMPTaxAgent(BaseAgent):
    async def execute(self, payload):
        job_id = payload["job_id"]

        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=False)
            context = browser.new_context()
            page = context.new_page()
            page.goto("https://bbmptax.karnataka.gov.in/")
            page.locator("#ContentPlaceHolder1_ContentPlaceHolder1_txtddlno").click()
            page.locator("#ContentPlaceHolder1_ContentPlaceHolder1_txtddlno").fill("160106617884")
            page.locator("#ContentPlaceHolder1_ContentPlaceHolder1_txtname").click()
            page.locator("#ContentPlaceHolder1_ContentPlaceHolder1_txtname").fill("XYZ")
            page.get_by_role("button", name="Retrieve").click()
            page.locator("#ContentPlaceHolder1_ContentPlaceHolder1_ListBox1").select_option("406")
            page.get_by_role("button", name="Confirm").click()

            text = page.locator("body").inner_text()
            baseApplnNo = page.locator("#ContentPlaceHolder1_ContentPlaceHolder1_pnl2oldappno").inner_text()
            print(baseApplnNo)

            context.close()
            browser.close()

            await asyncio.sleep(10)
            return {
                "success": True
            }
        