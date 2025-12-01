from linkedin import scrape_linkedin_jobs
from naukri import scrape_naukri_jobs
import pandas as pd
import sys


def main():
    if len(sys.argv) < 3:
        print("Usage: python main.py <keyword> <location>")
        sys.exit(1)

    JOB_KEYWORD = sys.argv[1]
    JOB_LOCATION = sys.argv[2]
    PAGES_TO_GET = 1

    print(f"Starting scrape for '{JOB_KEYWORD}' jobs in '{JOB_LOCATION}'...")

    # Scrape LinkedIn jobs
    linkedin_data = scrape_linkedin_jobs(
        keyword=JOB_KEYWORD, location=JOB_LOCATION, max_pages=PAGES_TO_GET
    )

    # Scrape Naukri jobs
    naukri_data = scrape_naukri_jobs(
        keyword=JOB_KEYWORD, location=JOB_LOCATION, max_pages=PAGES_TO_GET
    )

    # Combine the results from both LinkedIn and Naukri
    combined_data = linkedin_data + naukri_data

    scraped_df = pd.DataFrame(combined_data)

    # (For ML model)
    print(scraped_df)

    return scraped_df.to_dict(orient="records")


if __name__ == "__main__":
    result = main()
    print(result)
