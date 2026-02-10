import json
import sys
import time
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup


# ---------------- DRIVER SETUP ---------------- #

def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")

    return webdriver.Chrome(options=chrome_options)


# ---------------- GET JOB LINKS ---------------- #

def get_job_links(driver, url):
    driver.get(url)

    WebDriverWait(driver, 20).until(
        EC.any_of(
            EC.presence_of_element_located((By.CSS_SELECTOR, "a.title")),
            EC.presence_of_element_located((By.CSS_SELECTOR, "div.listingCard"))
        )
    )

    # Scroll to load jobs
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(2)

    soup = BeautifulSoup(driver.page_source, "lxml")

    job_links = []
    for a in soup.select("a.title"):
        href = a.get("href")
        if href and href.startswith("http"):
            job_links.append(href)

    return list(set(job_links))


# ---------------- SCRAPE JOB DETAILS ---------------- #

def scrape_job_details(driver, job_url):
    driver.get(job_url)

    WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "h1"))
    )

    soup = BeautifulSoup(driver.page_source, "lxml")

    def text_or_default(selector, default="Not Available"):
        el = soup.select_one(selector)
        return el.get_text(strip=True) if el else default

    job_id_match = re.search(r"(\d{10,})", job_url)
    job_id = job_id_match.group(1) if job_id_match else job_url[-12:]

    return {
        "job_id": job_id,
        "job_title": text_or_default("h1"),
        "company": text_or_default("a.comp-name"),
        "location": text_or_default("span.locWdth"),
        "salary": text_or_default("span.sal"),
        "experience": text_or_default("span.expwdth"),
        "source": "naukri",
        "job_url": job_url
    }


# ---------------- MAIN SCRAPER ---------------- #

def scrape_naukri(keyword, location, max_pages=1):
    driver = setup_driver()
    all_jobs = []

    try:
        base_url = f"https://www.naukri.com/{keyword}-jobs-in-{location}"

        for page in range(1, max_pages + 1):
            url = base_url if page == 1 else f"{base_url}-{page}"
            sys.stderr.write(f"🔍 Fetching page {page}: {url}\n")

            job_links = get_job_links(driver, url)

            for link in job_links:
                try:
                    job = scrape_job_details(driver, link)
                    all_jobs.append(job)
                except Exception as e:
                    sys.stderr.write(f"⚠ Failed job: {link}\n")
                    continue

    finally:
        driver.quit()

    return all_jobs


# ---------------- ENTRY POINT ---------------- #

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python naukri.py <keyword> <location> [pages]")
        sys.exit(1)

    keyword = sys.argv[1].lower()
    location = sys.argv[2].lower()
    pages = int(sys.argv[3]) if len(sys.argv) > 3 else 1

    sys.stderr.write(f"🚀 Starting Naukri scrape: {keyword} in {location}\n")

    jobs = scrape_naukri(keyword, location, pages)

    print(json.dumps(jobs, indent=2, ensure_ascii=False))
