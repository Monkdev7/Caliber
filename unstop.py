import json
import sys
from bs4 import BeautifulSoup
import requests
import time
from urllib.parse import quote


def scrape_unstop_jobs(keyword: str, location: str, max_pages: int = 1):
    """
    Scrapes job postings from Unstop API.
    Returns a list of jobs formatted for Node.js consumption.
    """
    job_list = []

    encoded_keyword = quote(keyword)
    encoded_location = quote(location)

    for page_num in range(1, max_pages + 1):
        sys.stderr.write(f"Fetching Unstop API page {page_num}...\n")

        api_url = (
            f"https://unstop.com/api/public/opportunity/search-result"
            f"?opportunity=jobs&page={page_num}&per_page=15"
            f"&searchTerm={encoded_keyword}"
            f"&location_search={encoded_location}"
            f"&quickApply=true&oppstatus=open"
        )

        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json",
                "Referer": "https://unstop.com/job",
            }

            response = requests.get(api_url, headers=headers, timeout=10)
            response.raise_for_status()

            raw_json = response.json()
            jobs_data = raw_json.get("data", {}).get("data", [])

            if not jobs_data:
                sys.stderr.write(f"No more results found at page {page_num}.\n")
                break

            for data in jobs_data:
                loc_list = data.get("locations", [])
                if loc_list and isinstance(loc_list[0], dict):
                    loc_obj = loc_list[0]
                    parts = [
                        loc_obj.get("city"),
                        loc_obj.get("state"),
                        loc_obj.get("country"),
                    ]
                    location_str = ", ".join(filter(None, parts))
                else:
                    # Fallback to the top-level region (e.g., "online")
                    location_str = data.get("region", "Remote").capitalize()

                raw_description = data.get("details") or ""
                clean_description = ""
                if raw_description:
                    soup = BeautifulSoup(raw_description, "lxml")
                    clean_description = soup.get_text(separator="\n", strip=True)

                # Extract salary details
                job_detail = data.get("jobDetail", {})
                if job_detail.get("show_salary") == 1:
                    min_sal = job_detail.get("min_salary", "")
                    max_sal = job_detail.get("max_salary", "")
                    salary_str = f"{min_sal} - {max_sal} ({job_detail.get('pay_in', 'annually')})"
                else:
                    salary_str = "Not Disclosed"

                # Final object
                extracted = {
                    "job_id": data.get("id"),
                    "job_title": data.get("title"),
                    "company_name": data.get("organisation", {}).get("name"),
                    "time_posted": data.get("updated_at"),
                    "num_applicants": data.get("registerCount"),
                    "job_link": data.get("seo_url"),
                    "job_location": location_str,
                    "description": clean_description,
                    "salary": salary_str,
                }
                job_list.append(extracted)

            # API courtesy delay
            time.sleep(1)

        except Exception as e:
            sys.stderr.write(f"Error on page {page_num}: {e}\n")
            break

    sys.stderr.write(f"Scraping complete. Total jobs: {len(job_list)}\n")
    return job_list


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

    results = scrape_unstop_jobs(keyword_input, location_input, pages_input)
    print(json.dumps(results, ensure_ascii=False, indent=2))
