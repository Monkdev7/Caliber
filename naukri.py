import json
import sys
import re
import os
from selenium import webdriver
from bs4 import BeautifulSoup

# Selenium Imports
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def setup_driver():
    """Universal setup: Detects my Linux paths, otherwise defaults to Chrome."""

    # 1. Check for your specific Linux/Firefox paths
    geckodriver_path = "/home/makima/Desktop/geckodriver-v0.36.0-linux64/geckodriver"
    firefox_binary_path = (
        "/home/makima/Desktop/firefox-131.0a1.en-US.linux-x86_64/firefox/firefox"
    )

    if os.path.exists(geckodriver_path) and os.path.exists(firefox_binary_path):
        from selenium.webdriver.firefox.service import Service
        from selenium.webdriver.firefox.options import Options

        sys.stderr.write("Detected Makima's environment. Launching Firefox...\n")
        firefox_options = Options()
        firefox_options.add_argument("--headless")
        firefox_options.add_argument("--disable-gpu")
        firefox_options.add_argument("--no-sandbox")
        firefox_options.binary_location = firefox_binary_path

        service = Service(geckodriver_path)
        return webdriver.Firefox(service=service, options=firefox_options)

    # 2. Fallback for Windows/Other users (Chrome)
    else:
        from selenium.webdriver.chrome.service import Service as ChromeService
        from selenium.webdriver.chrome.options import Options as ChromeOptions

        sys.stderr.write("Environment mismatch. Launching default Chrome...\n")
        chrome_options = ChromeOptions()
        chrome_options.add_argument("--headless=new")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

        # This will work if 'chromedriver' is in the system PATH or
        # if using a library like webdriver-manager
        return webdriver.Chrome(options=chrome_options)


def get_job_links(driver, url):
    """Job URLs from the search page."""
    driver.get(url)
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "h2 > a.title"))
    )
    page_html = driver.page_source
    soup = BeautifulSoup(page_html, "lxml")

    job_links = []
    job_listings = soup.select("h2 > a.title")
    for job in job_listings:
        job_url = job.get("href")
        if job_url:
            job_links.append(job_url)
    return job_links


def scrape_job_details(job_url, driver):
    """Job details from an individual job."""
    sys.stderr.write(f"Scraping job: {job_url}\n")
    driver.get(job_url)

    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "section#job_header"))
    )

    page_html = driver.page_source
    soup = BeautifulSoup(page_html, "lxml")

    # ID Extraction Logic
    job_id_match = re.search(r"(\d{10,})", job_url)
    job_id = (
        job_id_match.group(1) if job_id_match else job_url.split("-")[-1].split("?")[0]
    )

    time_posted = "Recently"
    num_applicants = 0

    # Exact Sibling Lookup Logic
    stats_container = soup.select_one("div.styles_jhc__jd-stats__KrId0")
    if stats_container:
        stat_items = stats_container.select("span.styles_jhc__stat__PgY67")
        for item in stat_items:
            label = item.select_one("label")
            value = item.select_one("span")

            if label and value:
                label_text = label.get_text(strip=True).lower()
                val_text = value.get_text(strip=True)

                if "posted:" in label_text:
                    time_posted = val_text
                elif "applicants:" in label_text:
                    match = re.search(r"\d+", val_text)
                    num_applicants = int(match.group()) if match else 0

    job_title = soup.select_one("h1.styles_jd-header-title__rZwM1")
    company_name = soup.select_one("div.styles_jd-header-comp-name__MvqAI > a")

    # Exact Dictionary Keys and Selectors
    job_data = {
        "job_id": job_id,
        "job_title": job_title.get_text(strip=True) if job_title else "No Title",
        "company_name": (
            company_name.get_text(strip=True) if company_name else "No Company"
        ),
        "time_posted": time_posted,
        "num_applicants": num_applicants,
        "job_link": job_url,
        "job_location": (
            soup.select_one(
                "div.styles_jhc__loc___Du2H span.styles_jhc__location__W_pVs"
            ).get_text(strip=True)
            if soup.select_one(
                "div.styles_jhc__loc___Du2H span.styles_jhc__location__W_pVs"
            )
            else "No Location"
        ),
        "salary": (
            soup.select_one(
                "div.styles_jhc__exp-salary-container__NXsVd div.styles_jhc__salary__jdfEC span"
            ).get_text(strip=True)
            if soup.select_one(
                "div.styles_jhc__exp-salary-container__NXsVd div.styles_jhc__salary__jdfEC span"
            )
            else "Not Disclosed"
        ),
    }

    return job_data


def scrape_naukri_jobs(keyword, location, max_pages=1):
    base_url = (
        f"https://www.naukri.com/{keyword}-jobs-in-{location}?k={keyword}&l={location}"
    )
    driver = setup_driver()

    try:
        job_details = []
        for page in range(1, max_pages + 1):
            url = f"{base_url}&pno={page}" if page > 1 else base_url
            sys.stderr.write(f"Fetching job listings for page {page}...\n")

            job_links = get_job_links(driver, url)
            for job_url in job_links:
                try:
                    job_data = scrape_job_details(job_url, driver)
                    job_details.append(job_data)
                except Exception as e:
                    sys.stderr.write(f"Failed to fetch job {job_url}: {e}\n")
                    continue

        return job_details
    finally:
        driver.quit()


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.stderr.write("Usage: python naukri.py <keyword> <location> [max_pages]\n")
        sys.exit(1)

    keyword = sys.argv[1]
    location = sys.argv[2]
    max_pages = int(sys.argv[3]) if len(sys.argv) > 3 else 1

    sys.stderr.write(f"Starting Naukri scrape: {keyword} in {location}\n")
    jobs = scrape_naukri_jobs(keyword, location, max_pages)

    print(json.dumps(jobs, ensure_ascii=False, indent=2))
