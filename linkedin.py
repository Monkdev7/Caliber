import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import random
from concurrent.futures import ThreadPoolExecutor
import json

keyword = 'fullstack'
location = 'Mumbai'
pageNum = 0
linkedin_job_url = f'https://www.linkedin.com/jobs/search?keywords={keyword}&location={location}&pageNum={pageNum}'

response = requests.get(linkedin_job_url)
job_data = response.text
soup = BeautifulSoup(job_data, "lxml")
page_jobs = soup.find_all('div', {'class': 'base-card relative w-full hover:no-underline focus:no-underline base-card--link base-search-card base-search-card--link job-search-card'})


# Job List
job_id_list = []

page_jobs = soup.find_all('div', class_='job-search-card')

for job_card in page_jobs:
    try:
        urn_string = job_card.get("data-entity-urn")

        if urn_string:
            job_id = urn_string.split(":")[-1]
            job_id_list.append(job_id)

    except (AttributeError, IndexError) as e:
        print(f"Skipping a job card due to an error: {e}")
        continue


# Job Scrap
job_list = []

def scrape_job(job_id):
    job_url = f"https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{job_id}"

    try:
        # Use a user-agent to mimic a browser, making the request less likely to be blocked.
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        job_response = requests.get(job_url, headers=headers)
        job_response.raise_for_status()
        job_soup = BeautifulSoup(job_response.text, "lxml")

        # Extraction logic
        job_post = {
        "time_posted": None,
        "company_name": None,
        "job_title": None,
        "num_applicants": None,
        "job_id": job_id
    }

        title_element = job_soup.select_one("h2.topcard__title")
        if title_element:
            job_post["job_title"] = title_element.get_text(strip=True)

        company_element = job_soup.select_one("a.topcard__org-name-link")
        if company_element:
            job_post["company_name"] = company_element.get_text(strip=True)

        time_element = job_soup.select_one("span.posted-time-ago__text")
        if time_element:
            job_post["time_posted"] = time_element.get_text(strip=True)

        applicants_element = job_soup.select_one("figcaption.num-applicants__caption")
        if not applicants_element:
            applicants_element = job_soup.select_one("span.num-applicants__caption")

        if applicants_element:
            applicants_text = applicants_element.get_text(strip=True)
            # Use regular expressions to extract only the numerical value
            import re
            match = re.search(r'\d+', applicants_text)
            if match:
                job_post["num_applicants"] = int(match.group())
            else:
                job_post["num_applicants"] = applicants_text

        print(f"Successfully fetched job posting {job_id}")
        return job_post

    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch job posting {job_id}: {e}")
        return None

    finally:
        # To mimic human behaviour
        time.sleep(random.uniform(2, 5))

with ThreadPoolExecutor(max_workers=5) as executor:
    results = executor.map(scrape_job, job_id_list)
    for result in results:
        if result:
            job_list.append(result)

print("Scraping complete.")

# Job DF
jobs_df = pd.DataFrame(job_list)
print(jobs_df)