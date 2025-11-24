from playwright.sync_api import Page, expect, sync_playwright
import os

def verify_home_page(page: Page):
    # Use absolute path for local file
    cwd = os.getcwd()
    page.goto(f"file://{cwd}/index.html")

    # Check if title is correct
    expect(page).to_have_title("USTNIK_2.0 — Home")

    # Check if the glitch title is present
    title = page.locator(".title")
    expect(title).to_be_visible()
    expect(title).to_have_text("USTNIK_2.0")

    # Check if the theme switcher is present
    switcher = page.locator("#theme-switcher")
    expect(switcher).to_be_visible()

    # Screenshot
    page.screenshot(path="verification/home_page_verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_home_page(page)
        finally:
            browser.close()
