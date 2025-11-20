import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import random
from concurrent.futures import ThreadPoolExecutor
import re # Make sure 're' is imported at the top for clarity

# --- 1. Wrap the entire scraping logic in a function ---
def scrape_linkedin_jobs(keyword: str, location: str, max_pages: int = 1):
    """
    Scrapes job postings from LinkedIn based on keyword and location.

    Args:
        keyword (str): The job keyword (e.g., 'fullstack').
        location (str): The job location (e.g., 'Mumbai').
        max_pages (int): The maximum number of pages to scrape (default is 1).

    Returns:
        pd.DataFrame: A DataFrame containing the scraped job data.
    """
    
    all_job_ids = []
    
    # --- Loop through pages ---
    for page_num in range(max_pages):
        start_param = page_num * 25 
        
        linkedin_job_url = f'https://www.linkedin.com/jobs/search?keywords={keyword}&location={location}&start={start_param}'

        print(f"Fetching job listings for page {page_num + 1}...")
        
        try:
            response = requests.get(linkedin_job_url)
            response.raise_for_status()
            job_data = response.text
            soup = BeautifulSoup(job_data, "lxml")
        except requests.exceptions.RequestException as e:
            print(f"Failed to fetch job list page {page_num + 1}: {e}")
            break

        # Job cards on the current page
        page_jobs = soup.find_all('div', class_='job-search-card')
        
        if not page_jobs:
            print(f"No jobs found on page {page_num + 1}. Stopping pagination.")
            break
            
        for job_card in page_jobs:
            try:
                urn_string = job_card.get("data-entity-urn")
                if urn_string:
                    job_id = str(urn_string).split(":")[-1]
                    all_job_ids.append(job_id)
            except Exception as e:
                print(f"Skipping a job card due to error: {e}")
                continue
        
        # Add a small delay between page requests
        time.sleep(random.uniform(1, 3))

    print(f"Total job IDs collected across {max_pages} page(s): {len(all_job_ids)}")
    
    job_list = []

    def scrape_job(job_id):
        job_url = f"https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{job_id}"
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
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
                    job_post["num_applicants"] = applicants_text

            print(f"Successfully fetched job posting {job_id}")
            return job_post

        except requests.exceptions.RequestException as e:
            print(f"Failed to fetch job posting {job_id}: {e}")
            return None
        except Exception as e:
            print(f"An unexpected error occurred for job {job_id}: {e}")
            return None
        finally:
            # To mimic human behaviour
            time.sleep(random.uniform(2, 5))

    # --- Scraping with ThreadPoolExecutor ---
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = [result for result in executor.map(scrape_job, all_job_ids) if result is not None]
        job_list.extend(results)

    print("Scraping complete.")

    return pd.DataFrame(job_list)

if __name__ == "__main__":
    TEST_KEYWORD = 'fullstack'  
    TEST_LOCATION = 'Mumbai'   
    PAGES_TO_SCRAPE = 1

    print(f"Starting test scrape for {TEST_KEYWORD} in {TEST_LOCATION}...")
    
    final_df = scrape_linkedin_jobs(
        keyword=TEST_KEYWORD, 
        location=TEST_LOCATION, 
        max_pages=PAGES_TO_SCRAPE
    )
    
    print(final_df)