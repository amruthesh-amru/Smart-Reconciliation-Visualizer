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
        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Smart Reconciliation Visualizer').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Intelligent data reconciliation with automated insights').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Upload Files').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Map Columns').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=View Results').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Upload two CSV or JSON files to compare and reconcile data').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Try the application with pre-loaded sample data').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Upload your first file (e.g., invoices)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Click to upload or drag and drop').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=CSV or JSON files only').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Upload your second file (e.g., payments)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Click to upload or drag and drop').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=CSV or JSON files only').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Map Columns').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Smart Reconciliation Visualizer © 2024 | Built for WFYI Assignment').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    