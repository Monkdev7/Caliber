from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from selenium.common.exceptions import (
    StaleElementReferenceException,
    NoSuchElementException,
)
from time import sleep
import json
import os
import sys
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor

load_dotenv()


def scrape_job_details(driver: webdriver.Firefox, job_url: str) -> dict:
    job_data = {
        "job_link": job_url,
        "job_id": job_url.split("/")[-1] if job_url else "Not available",
        "job_title": "Not available",
        "company_name": "Not available",
        "time_posted": "Not available",
        "num_applicants": "Not available",
        "experience_required": "Not available",
    }

    try:
        driver.get(job_url)
        sleep(2)

        def safe_text(by, selector):
            try:
                text = driver.find_element(by, selector).text.strip()
                return text if text else "Not available"
            except (NoSuchElementException, StaleElementReferenceException):
                return "Not available"

        # Fill only the required fields
        job_data["job_title"] = safe_text(
            By.CSS_SELECTOR, "h1.styles_jd-header-title__rZwM1"
        )
        job_data["company_name"] = safe_text(
            By.CSS_SELECTOR, "div.styles_jd-header-comp-name__MvqAI > a.title"
        )
        job_data["experience_required"] = safe_text(
            By.CSS_SELECTOR, "div.styles_jhc__exp__k_giM > span"
        )
        job_data["time_posted"] = safe_text(
            By.CSS_SELECTOR, "span.styles_jhc__stat__PgY67 > span"
        )
        job_data["num_applicants"] = safe_text(
            By.CSS_SELECTOR, "span.styles_jhc__stat__PgY67 > span"
        )

    except Exception as e:
        sys.stderr.write(f"Error scraping {job_url}: {str(e)}\n")

    return job_data


def scrape_naukri_jobs(keyword: str, location: str):
    gecko_driver_path = os.environ.get("GECKO_DRIVER_PATH")
    firefox_binary_path = os.environ.get("FIREFOX_BINARY")
    if not firefox_binary_path:
        raise ValueError("FIREFOX_BINARY environment variable not set")

    url = f"https://www.naukri.com/{keyword}-jobs-in-{location}?k={keyword}&l={location}&experience=0"

    options = Options()
    options.binary_location = firefox_binary_path
    # options.add_argument('--headless')

    service = Service(executable_path=gecko_driver_path)
    driver = webdriver.Firefox(service=service, options=options)

    jobs = []

    try:
        driver.get(url)
        sleep(5)

        # Collect all job links, filter out None immediately
        links = driver.find_elements(By.CSS_SELECTOR, "a.title")
        job_urls = [
            href for href in (link.get_attribute("href") for link in links) if href
        ]

        sys.stderr.write(f"Found {len(job_urls)} job URLs\n")

        # Scrape details in parallel with ThreadPoolExecutor
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [
                executor.submit(scrape_job_details, driver, job_url)
                for job_url in job_urls
            ]
            for future in futures:
                jobs.append(future.result())

    finally:
        driver.quit()

    return jobs


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.stderr.write("Usage: python linkedin.py <keyword> <location>\n")
        sys.exit(1)

    keyword = sys.argv[1]
    location = sys.argv[2]

    sys.stderr.write(f"Starting Naukri scrape: {keyword} in {location}\n")
    try:
        jobs = scrape_naukri_jobs(keyword, location)
        print(json.dumps(jobs, ensure_ascii=False, indent=2))
    except Exception as e:
        sys.stderr.write(f"Error: {str(e)}\n")
        sys.exit(1)
