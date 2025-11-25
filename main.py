from linkedin import scrape_linkedin_jobs
from naukri import scrape_naukri_jobs
import pandas as pd

JOB_KEYWORD = "data science"
JOB_LOCATION = "Pune"
PAGES_TO_GET = 1

print(f"Starting scrape for '{JOB_KEYWORD}' jobs in '{JOB_LOCATION}'...")

scraped_list = scrape_linkedin_jobs(
    keyword=JOB_KEYWORD, location=JOB_LOCATION, max_pages=PAGES_TO_GET
)

scraped_list.append(scrape_naukri_jobs(keyword=JOB_KEYWORD, location=JOB_LOCATION))

scraped_df = pd.DataFrame(scraped_list)

print(scraped_df.head())
