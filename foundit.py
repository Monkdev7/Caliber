import json
import sys
from bs4 import BeautifulSoup
import requests
import time
from urllib.parse import quote
from datetime import datetime


def clean_html(raw_html):
    """
    Removes HTML tags and returns clean, formatted text.
    """
    if not raw_html:
        return ""
    soup = BeautifulSoup(raw_html, "lxml")
    return soup.get_text(separator="\n", strip=True)


def scrape_foundit_jobs(keyword: str, location: str, max_pages: int = 1):
    """
    Scrapes job postings from Foundit (formerly Monster) API.
    Returns a list of jobs formatted for Node.js consumption.
    """
    job_list = []

    limit = 20

    for i in range(max_pages):
        start = i * limit
        sys.stderr.write(
            f"Fetching Foundit API results {start} to {start + limit}...\n"
        )

        encoded_keyword = quote(keyword)
        encoded_location = quote(location)

        api_url = (
            f"https://www.foundit.in/home/api/searchResultsPage?"
            f"start={start}&limit={limit}&query={encoded_keyword}"
            f"&locations={encoded_location}&countries=India"
        )

        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json",
                "Referer": "https://www.foundit.in/",
            }

            response = requests.get(api_url, headers=headers, timeout=10)
            response.raise_for_status()

            raw_json = response.json()

            jobs_data = raw_json.get("data", [])

            # If the above fails, it might be nested under jobList in API
            if isinstance(jobs_data, dict):
                jobs_data = jobs_data.get("jobList", [])

            if not jobs_data:
                sys.stderr.write(f"No results found at offset {start}.\n")
                break

            for data in jobs_data:
                # Locations is a list of dicts: 0: {city: "Mumbai", ...}
                locations = data.get("locations", [])
                location_str = "India"
                if locations and isinstance(locations[0], dict):
                    loc_obj = locations[0]
                    location_str = (
                        f"{loc_obj.get('city', '')}, {loc_obj.get('state', '')}".strip(
                            ", "
                        )
                    )

                # Salary logic
                min_val = data.get("minimumSalary", {}).get("absoluteValue", 0)
                max_val = data.get("maximumSalary", {}).get("absoluteValue", 0)

                salary_str = "Confidential"
                if max_val > 0:
                    salary_str = f"{min_val} - {max_val} INR"

                # Date: freshness is a millisecond timestamp
                ts = data.get("freshness") or data.get("postedAt")
                time_posted = (
                    datetime.fromtimestamp(ts / 1000).strftime("%Y-%m-%d")
                    if ts
                    else "Recent"
                )

                raw_desc = data.get("description", "")
                clean_description = clean_html(raw_desc)

                extracted = {
                    "job_id": data.get("jobId"),
                    "job_title": data.get("title"),
                    "company_name": data.get("companyName")
                    or data.get("company", {}).get("name"),
                    "time_posted": time_posted,
                    "num_applicants": data.get("totalApplicants", 0),
                    "job_link": data.get("redirectUrl")
                    or f"https://www.foundit.in/job/{data.get('jobId')}",
                    "job_location": location_str,
                    "description": clean_description,
                    "salary": salary_str,
                }
                job_list.append(extracted)

            time.sleep(1.5)

        except Exception as e:
            sys.stderr.write(f"Error at offset {start}: {e}\n")
            break

    sys.stderr.write(f"Scraping complete. Total jobs: {len(job_list)}\n")
    return job_list


if __name__ == "__main__":
    keyword_input = "Data Science"
    location_input = "Mumbai"
    pages_to_scrape = 1

    if len(sys.argv) > 1:
        keyword_input = sys.argv[1]
    if len(sys.argv) > 2:
        location_input = sys.argv[2]
    if len(sys.argv) > 3:
        pages_to_scrape = int(sys.argv[3])

    results = scrape_foundit_jobs(keyword_input, location_input, pages_to_scrape)
    print(json.dumps(results, ensure_ascii=False, indent=2))
