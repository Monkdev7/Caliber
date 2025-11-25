import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import random
from concurrent.futures import ThreadPoolExecutor
import re
import json
import sys

def scrape_linkedin_jobs(keyword: str, location: str, max_pages: int = 1):
    """
    Scrapes job postings from LinkedIn based on keyword and location.
    Returns JSON string for Node.js consumption.
    """
    
    all_job_ids = []
    
    # Loop through pages
    for page_num in range(max_pages):
        start_param = page_num * 25 
        
        linkedin_job_url = f'https://www.linkedin.com/jobs/search?keywords={keyword}&location={location}&start={start_param}'

        sys.stderr.write(f"Fetching job listings for page {page_num + 1}...\n")
        
        try:
            response = requests.get(linkedin_job_url)
            response.raise_for_status()
            job_data = response.text
            soup = BeautifulSoup(job_data, "lxml")
        except requests.exceptions.RequestException as e:
            sys.stderr.write(f"Failed to fetch job list page {page_num + 1}: {e}\n")
            break

        page_jobs = soup.find_all('div', class_='job-search-card')
        
        if not page_jobs:
            sys.stderr.write(f"No jobs found on page {page_num + 1}. Stopping pagination.\n")
            break
            
        for job_card in page_jobs:
            try:
                urn_string = job_card.get("data-entity-urn")
                if urn_string:
                    job_id = str(urn_string).split(":")[-1]
                    all_job_ids.append(job_id)
            except Exception as e:
                sys.stderr.write(f"Skipping a job card due to error: {e}\n")
                continue
        
        time.sleep(random.uniform(1, 3))

    sys.stderr.write(f"Total job IDs collected: {len(all_job_ids)}\n")
    
    job_list = []

    def scrape_job(job_id):
        job_url = f"https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{job_id}"
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
            }
            job_response = requests.get(job_url, headers=headers)
            job_response.raise_for_status()
            job_soup = BeautifulSoup(job_response.text, "lxml")

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

            applicants_element = job_soup.select_one("figcaption.num-applicants__caption") or job_soup.select_one("span.num-applicants__caption")

            if applicants_element:
                applicants_text = applicants_element.get_text(strip=True)
                match = re.search(r'\d+', applicants_text)
                if match:
                    job_post["num_applicants"] = int(match.group())
                else:
                    job_post["num_applicants"] = 0

            sys.stderr.write(f"Successfully fetched job posting {job_id}\n")
            return job_post

        except Exception as e:
            sys.stderr.write(f"Failed to fetch job posting {job_id}: {e}\n")
            return None
        finally:
            time.sleep(random.uniform(2, 5))

    # Scraping with ThreadPoolExecutor
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = [result for result in executor.map(scrape_job, all_job_ids) if result is not None]
        job_list.extend(results)

    sys.stderr.write("Scraping complete.\n")
    
    return job_list

if __name__ == "__main__":
    # Accept command line arguments from Node.js
    if len(sys.argv) < 3:
        sys.stderr.write("Usage: python linkedin.py <keyword> <location> [max_pages]\n")
        sys.exit(1)
    
    keyword = sys.argv[1]
    location = sys.argv[2]
    max_pages = int(sys.argv[3]) if len(sys.argv) > 3 else 1
    
    sys.stderr.write(f"Starting LinkedIn scrape: {keyword} in {location}\n")
    
    jobs = scrape_linkedin_jobs(keyword, location, max_pages)
    
    # Output JSON to stdout for Node.js to capture
    print(json.dumps(jobs, ensure_ascii=False, indent=2))