import json
import sys
import os
import re
import time
from selenium import webdriver
from bs4 import BeautifulSoup

# Selenium Imports
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def setup_driver():
    """Universal setup: Detects Makima's Linux paths, otherwise defaults to Chrome."""
    geckodriver_path = "/home/makima/Desktop/geckodriver-v0.36.0-linux64/geckodriver"
    firefox_binary_path = (
        "/home/makima/Desktop/firefox-131.0a1.en-US.linux-x86_64/firefox/firefox"
    )

    if os.path.exists(geckodriver_path) and os.path.exists(firefox_binary_path):
        from selenium.webdriver.firefox.service import Service
        from selenium.webdriver.firefox.options import Options

        sys.stderr.write("🚀 Launching Makima's Firefox...\n")
        options = Options()
        # options.add_argument("--headless")
        options.binary_location = firefox_binary_path
        options.set_preference(
            "general.useragent.override",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        )
        return webdriver.Firefox(service=Service(geckodriver_path), options=options)
    else:
        from selenium.webdriver.chrome.options import Options as ChromeOptions

        sys.stderr.write("⚠️ Environment mismatch. Launching Default Chrome...\n")
        options = ChromeOptions()
        options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        return webdriver.Chrome(options=options)


def get_job_data_from_page(driver, url=None):
    """Parses the current page source for job cards."""
    if url:
        driver.get(url)
        time.sleep(2)

    soup = BeautifulSoup(driver.page_source, "lxml")
    job_cards = soup.select(".JobCard_jobCardLeftContent__cHcGe")

    results = []
    for card in job_cards:
        try:
            # --- 1. Title & Link ---
            title_tag = card.select_one("[data-test='job-title']")
            if not title_tag:
                continue

            title = title_tag.get_text(strip=True)

            raw_href = title_tag.get("href")
            link = ""
            if isinstance(raw_href, str):
                link = (
                    f"https://www.glassdoor.co.in{raw_href}"
                    if raw_href.startswith("/")
                    else raw_href
                )

            # --- 2. Job ID ---
            raw_id_attr = title_tag.get("id")
            job_id = "gd_unknown"
            if isinstance(raw_id_attr, str):
                # Format: 'job-title-12345678'
                id_match = re.search(r"(\d+)", raw_id_attr)
                job_id = f"gd_{id_match.group(1)}" if id_match else "gd_unknown"

            # --- 3. Company ---
            company_tag = card.select_one(".EmployerProfile_compactEmployerName__9MGcV")
            company = company_tag.get_text(strip=True) if company_tag else "N/A"

            # --- 4. Location ---
            loc_tag = card.select_one("[data-test='emp-location']")
            location = loc_tag.get_text(strip=True) if loc_tag else "India"

            # --- 5. Salary ---
            salary_tag = card.select_one("[data-test='detailSalary']")
            salary = (
                salary_tag.get_text(strip=True).replace("\xa0", " ")
                if salary_tag
                else "Not Disclosed"
            )

            results.append(
                {
                    "job_id": job_id,
                    "job_title": title,
                    "company_name": company,
                    "job_location": location,
                    "salary": salary,
                    "job_link": link,
                    "source": "glassdoor",
                }
            )

        except Exception as e:
            sys.stderr.write(f"⚠️ Error parsing card: {e}\n")
            continue

    return results


def scrape_glassdoor(keyword, location, max_pages=1):
    """Performs search via UI to handle complex location IDs."""
    driver = setup_driver()
    all_jobs = []

    try:
        sys.stderr.write("🌐 Navigating to Glassdoor Index...\n")
        driver.get("https://www.glassdoor.co.in/Job/index.htm")

        # Handle Keyword Input
        kw_input = WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.ID, "searchBar-jobTitle"))
        )
        kw_input.clear()
        kw_input.send_keys(keyword)

        # Handle Location Input
        loc_input = driver.find_element(By.ID, "searchBar-location")
        loc_input.send_keys(Keys.CONTROL + "a")
        loc_input.send_keys(Keys.DELETE)
        loc_input.send_keys(location)
        time.sleep(1)
        loc_input.send_keys(Keys.ENTER)

        # Wait for results to load
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "[data-test='job-title']"))
        )

        base_search_url = driver.current_url
        sys.stderr.write(f"📍 Base URL detected: {base_search_url}\n")

        for page in range(1, max_pages + 1):
            url = (
                base_search_url
                if page == 1
                else base_search_url.replace(".htm", f"_IP{page}.htm")
            )
            sys.stderr.write(f"📄 Scraping Page {page}...\n")

            page_jobs = get_job_data_from_page(driver, url)
            if not page_jobs:
                break

            all_jobs.extend(page_jobs)

            if page < max_pages:
                time.sleep(2)

        return all_jobs
    finally:
        driver.quit()


if __name__ == "__main__":
    keyword_input = "Data Science"
    location_input = "Delhi"
    pages_input = 1

    if len(sys.argv) > 1:
        keyword_input = sys.argv[1]

    if len(sys.argv) > 2:
        location_input = sys.argv[2]

    if len(sys.argv) > 3:
        try:
            pages_input = int(sys.argv[3])
        except ValueError:
            sys.stderr.write("Invalid page count, defaulting to 1\n")

    sys.stderr.write(
        f"Scraping for: {keyword_input} in {location_input} ({pages_input} pages)\n"
    )

    results = scrape_glassdoor(keyword_input, location_input, pages_input)
    print(json.dumps(results, ensure_ascii=False, indent=2))
