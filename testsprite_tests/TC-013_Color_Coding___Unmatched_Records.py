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
        

        # -> Click 'Run Reconciliation' button to perform reconciliation and view results
        frame = context.pages[-1]
        # Click 'Run Reconciliation' button to perform reconciliation and view results
        elem = frame.locator('xpath=html/body/div/div/main/div[2]/div[4]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click 'Unmatched A' filter button to view unmatched records from File A and verify red background
        frame = context.pages[-1]
        # Click 'Unmatched A' filter button to view unmatched records from File A
        elem = frame.locator('xpath=html/body/div/div/main/div[2]/div/div[3]/div/button[4]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        unmatched_records = ["INV015 Local Vendor A 2024-01-29 $550.00 Unmatched A","INV016 Regional Corp 2024-01-30 $780.00 Unmatched A","INV017 City Services 2024-01-31 $1100.00 Unmatched A","INV018 Downtown Supplies 2024-02-01 $920.00 Unmatched A","INV019 Express Delivery 2024-02-02 $450.00 Unmatched A","INV026 Theta Corp 2024-02-09 $890.00 Unmatched A","INV027 Iota Systems 2024-02-10 $1750.00 Unmatched A","INV028 Kappa Industries 2024-02-11 $3100.00 Unmatched A","INV037 Tau Industries 2024-02-20 $720.00 Unmatched A","INV038 Upsilon Corp 2024-02-21 $1290.00 Unmatched A","INV039 Phi Systems 2024-02-22 $2980.00 Unmatched A","INV040 Chi Enterprises 2024-02-23 $1840.00 Unmatched A"]
        for record in unmatched_records:
            locator = frame.locator(f'text="{record}"')
            # Check if the unmatched record text is visible on the page
            assert await locator.is_visible(), f'Unmatched record not visible: {record}'
            # Check if the unmatched record has red background color
            # We check the background color style attribute contains 'red' or equivalent
            bg_color = await locator.evaluate("el => window.getComputedStyle(el).backgroundColor")
            assert bg_color in ['rgb(255, 0, 0)', 'rgba(255, 0, 0, 1)'], f'Record does not have red background: {record}'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    