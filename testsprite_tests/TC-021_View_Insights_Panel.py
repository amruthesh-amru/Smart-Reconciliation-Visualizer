import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:5173", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Click 'Use Demo Data' button to load sample files for reconciliation
        frame = context.pages[-1]
        # Click 'Use Demo Data' button to load sample files for reconciliation
        elem = frame.locator('xpath=html/body/div/div/main/div[2]/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click 'Run Reconciliation' button to complete reconciliation
        frame = context.pages[-1]
        # Click 'Run Reconciliation' button to complete reconciliation
        elem = frame.locator('xpath=html/body/div/div/main/div[2]/div[4]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Scroll down to the insights panel to verify recommendations are displayed
        await page.mouse.wheel(0, 1000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Review records for "Marketing Plus" - 1 discrepancies found with total variance of $250.00').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Filter results by this vendor and review each transaction').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text="AMOUNT" field has 4 discrepancies - most common issue').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Consider adjusting amount tolerance or review pricing agreements').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=14 unmatched entries in Feb 2024').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Investigate if there were system changes or special events during this period').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Total amount variance of $31875.00 detected').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Significant financial discrepancy - prioritize reconciliation of high-value transactions').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=41.7% of records are completely unmatched').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Verify that both files cover the same time period and data sources').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    