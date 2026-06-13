import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        # Desktop
        page = await browser.new_page()
        await page.set_viewport_size({"width": 1400, "height": 900})
        await page.goto("http://localhost:3001")
        await page.wait_for_timeout(2500)
        await page.screenshot(path="c:/Users/ASDS/Desktop/REPTIME/homepage-screenshot.png", full_page=True)
        print("Desktop screenshot saved to homepage-screenshot.png")
        
        # Mobile
        mobile_page = await browser.new_page()
        await mobile_page.set_viewport_size({"width": 390, "height": 844})
        await mobile_page.goto("http://localhost:3001")
        await mobile_page.wait_for_timeout(2500)
        await mobile_page.screenshot(path="c:/Users/ASDS/Desktop/REPTIME/mobile-screenshot.png", full_page=True)
        print("Mobile screenshot saved to mobile-screenshot.png")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
