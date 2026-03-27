import os
import sys
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.chrome.options import Options as ChromeOptions

# --- CONFIGURATION ---
MAKIMA_GECKO = "/home/makima/Desktop/geckodriver-v0.36.0-linux64/geckodriver"
MAKIMA_FIREFOX_BIN = (
    "/home/makima/Desktop/firefox-131.0a1.en-US.linux-x86_64/firefox/firefox"
)
MAKIMA_EXTENSION = "/home/makima/.mozilla/firefox/cwxefk67.default-nightly/extensions/{d7ce25e4-e6a8-433e-bb29-ec763dcd26bf}.xpi"


def setup_driver(headless=False):
    """
    Initializes the WebDriver based on environment detection.
    Returns a WebDriver instance (Firefox or Chrome).
    """
    # 1. Check for Makima's specific Arch Linux Nightly setup
    if os.path.exists(MAKIMA_GECKO) and os.path.exists(MAKIMA_FIREFOX_BIN):
        sys.stderr.write(
            "Detected Makima's environment. Launching Firefox Nightly...\n"
        )

        options = FirefoxOptions()
        options.binary_location = MAKIMA_FIREFOX_BIN
        if headless:
            options.add_argument("--headless")

        service = Service(MAKIMA_GECKO)
        driver = webdriver.Firefox(service=service, options=options)

        # Install extension if path is valid
        if os.path.exists(MAKIMA_EXTENSION):
            driver.install_addon(MAKIMA_EXTENSION, temporary=True)
            print(f"Extension loaded: {os.path.basename(MAKIMA_EXTENSION)}")

        return driver

    # 2. Fallback for other environments (Generic Chrome)
    else:
        sys.stderr.write("Environment mismatch. Launching default Chrome...\n")
        options = ChromeOptions()
        if headless:
            options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")

        return webdriver.Chrome(options=options)


def main():
    driver = None
    try:
        # Note: Set headless=False if your captcha solver needs to 'see' the UI
        driver = setup_driver(headless=True)

        # Navigate to a demo page
        print("Navigating to CAPTCHA demo...")
        driver.get("https://www.google.com/recaptcha/api2/demo")

        # Verification: Keep the window open for a bit to see the extension in action
        input("Press Enter to close the browser...")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if driver:
            driver.quit()


if __name__ == "__main__":
    main()
