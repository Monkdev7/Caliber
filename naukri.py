import json
import os
import sys
import time
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from selenium.common.exceptions import (
    StaleElementReferenceException,
    NoSuchElementException,
)
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from concurrent.futures import ThreadPoolExecutor

load_dotenv()


# Helper function to handle retries
def retry(func, retries=3, delay=2):
    for i in range(retries):
        try:
            return func()
        except Exception as e:
            if i == retries - 1:
                raise e
            time.sleep(delay)


# Function to initialize the WebDriver
def init_driver():
    gecko_driver_path = os.environ.get("GECKO_DRIVER_PATH")
    firefox_binary_path = os.environ.get("FIREFOX_BINARY")

    if not firefox_binary_path:
        raise ValueError("FIREFOX_BINARY environment variable not set")

    options = Options()
    options.binary_location = firefox_binary_path

    service = Service(executable_path=gecko_driver_path)
    driver = webdriver.Firefox(service=service, options=options)
    return driver


# Helper function to safely extract text from a selector
def safe_wait(driver, selector, wait_time=10):
    try:
        wait = WebDriverWait(driver, wait_time)
        el = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
        return el.text.strip() if el.text.strip() else "Not available"
    except (NoSuchElementException, StaleElementReferenceException, TimeoutError):
        return "Not available"


# Function to scrape details from a single job page
def scrape_job_details(driver, job_url):
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

        # Wait for each element to load and extract data
        job_data["job_title"] = safe_wait(driver, "h1.styles_jd-header-title__rZwM1")
        job_data["company_name"] = safe_wait(
            driver, "div.styles_jd-header-comp-name__MvqAI > a.title"
        )
        job_data["experience_required"] = safe_wait(
            driver, "div.styles_jhc__exp__k_giM > span"
        )
        job_data["time_posted"] = safe_wait(
            driver, "span.styles_jhc__stat__PgY67 > span"
        )
        job_data["num_applicants"] = safe_wait(
            driver, "span.styles_jhc__stat__PgY67 > span"
        )

    except Exception as e:
        sys.stderr.write(f"Error scraping {job_url}: {str(e)}\n")

    return job_data


# Function to scrape Naukri job listings based on a keyword and location
def scrape_naukri_jobs(keyword, location):
    # Initialize driver
    driver = init_driver()
    jobs = []

    try:
        # Construct the job search URL
        url = f"https://www.naukri.com/{keyword}-jobs-in-{location}?k={keyword}&l={location}&experience=0"
        driver.get(url)
        time.sleep(5)

        # Collect all job links
        links = driver.find_elements(By.CSS_SELECTOR, "a.title")
        job_urls = [
            href for href in (link.get_attribute("href") for link in links) if href
        ]

        sys.stderr.write(f"Found {len(job_urls)} job URLs\n")

        # Scrape job details in parallel with ThreadPoolExecutor
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [
                executor.submit(scrape_job_details, driver, job_url)
                for job_url in job_urls
            ]
            for future in futures:
                jobs.append(future.result())

    except Exception as e:
        sys.stderr.write(f"Error while scraping job listings: {str(e)}\n")
    finally:
        driver.quit()

    return jobs


# Main script execution
if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.stderr.write("Usage: python naukri.py <keyword> <location>\n")
        sys.exit(1)

    keyword = sys.argv[1]
    location = sys.argv[2]

    sys.stderr.write(f"Starting Naukri scrape: {keyword} in {location}\n")

    try:
        # Scrape jobs and print the results in JSON format
        jobs = scrape_naukri_jobs(keyword, location)
        print(json.dumps(jobs, ensure_ascii=False, indent=2))
    except Exception as e:
        sys.stderr.write(f"Error: {str(e)}\n")
        sys.exit(1)
