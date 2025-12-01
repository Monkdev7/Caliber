from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

firefox_options = Options()
firefox_options.add_argument("--headless")
firefox_options.add_argument("--disable-gpu")
firefox_options.add_argument("--no-sandbox")

geckodriver_path = (
    "/home/makima/Desktop/Salenium Driver/geckodriver-v0.36.0-linux64/geckodriver"
)
firefox_binary_path = (
    "/home/makima/Desktop/firefox-131.0a1.en-US.linux-x86_64/firefox/firefox"
)

firefox_options.binary_location = firefox_binary_path

service = Service(geckodriver_path)
driver = webdriver.Firefox(service=service, options=firefox_options)

base_url = "https://www.naukri.com/fullstack-jobs-in-pune?k=fullstack&l=pune"

driver.get(base_url)

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

print(f"Found {len(job_links)} job URLs:")
for job_url in job_links:
    print(job_url)

job_data = []
for job_url in job_links:
    driver.get(job_url)

    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "section#job_header"))
    )

    page_html = driver.page_source
    soup = BeautifulSoup(page_html, "lxml")

    job_title = soup.select_one("h1.styles_jd-header-title__rZwM1")
    company_name = soup.select_one("div.styles_jd-header-comp-name__MvqAI > a")
    job_location = soup.select_one(
        "div.styles_jhc__loc___Du2H span.styles_jhc__location__W_pVs"
    )
    job_experience = soup.select_one(
        "div.styles_jhc__exp-salary-container__NXsVd div.styles_jhc__exp__k_giM span"
    )
    salary = soup.select_one(
        "div.styles_jhc__exp-salary-container__NXsVd div.styles_jhc__salary__jdfEC span"
    )
    wfh_mode = soup.select_one("div.styles_jhc__wfhmode__iQwF4 span")

    job_title = job_title.get_text(strip=True) if job_title else "No Title"
    company_name = company_name.get_text(strip=True) if company_name else "No Company"
    job_location = job_location.get_text(strip=True) if job_location else "No Location"
    job_experience = (
        job_experience.get_text(strip=True) if job_experience else "No Experience"
    )
    salary = salary.get_text(strip=True) if salary else "Not Disclosed"
    wfh_mode = wfh_mode.get_text(strip=True) if wfh_mode else "No Work From Home Info"

    job_data.append(
        {
            "job_url": job_url,
            "job_title": job_title,
            "company_name": company_name,
            "job_location": job_location,
            "job_experience": job_experience,
            "salary": salary,
            "wfh_mode": wfh_mode,
        }
    )

print("\nScraped Job Data:")
for job in job_data:
    print(f"Job URL: {job['job_url']}")
    print(f"Job Title: {job['job_title']}")
    print(f"Company Name: {job['company_name']}")
    print(f"Location: {job['job_location']}")
    print(f"Experience: {job['job_experience']}")
    print(f"Salary: {job['salary']}")
    print(f"Work From Home: {job['wfh_mode']}")
    print("-" * 40)

driver.quit()
