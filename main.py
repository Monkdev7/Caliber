from linkedin import scrape_linkedin_jobs 

JOB_KEYWORD = 'data science'  
JOB_LOCATION = 'Pune'
PAGES_TO_GET = 1

print(f"Starting scrape for '{JOB_KEYWORD}' jobs in '{JOB_LOCATION}'...")

scraped_data_df = scrape_linkedin_jobs(
    keyword=JOB_KEYWORD,
    location=JOB_LOCATION,
    max_pages=PAGES_TO_GET
)

print(scraped_data_df.head())