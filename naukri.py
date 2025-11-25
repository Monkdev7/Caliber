from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from time import sleep
import json
import os
import sys
from dotenv import load_dotenv

load_dotenv()

def scrape_naukri_jobs(keyword: str, location: str):
    """
    Scrapes job postings from Naukri.com
    Returns list of job dictionaries
    """
    
    gecko_driver_path = os.environ.get('GECKO_DRIVER_PATH')
    firefox_binary_path = os.environ.get('FIREFOX_BINARY')
    
    if not firefox_binary_path:
        raise ValueError("FIREFOX_BINARY environment variable not set")
    
    # Build URL
    url = f"https://www.naukri.com/{keyword}-jobs-in-{location}?k={keyword}&l={location}&experience=0"
    
    firefox_options = Options()
    firefox_options.binary_location = firefox_binary_path
    # Uncomment for headless mode
    # firefox_options.add_argument('--headless')
    
    service = Service(executable_path=gecko_driver_path)
    driver = webdriver.Firefox(service=service, options=firefox_options)
    
    try:
        driver.get(url)
        sleep(5)
        
        job_links = driver.find_elements(By.CSS_SELECTOR, "a.title")
        
        jobs = []
        
        for link in job_links:
            job_title = link.text.strip()
            job_url = link.get_attribute("href")
            
            if not job_url:
                continue
            
            sys.stderr.write(f"Scraping: {job_title}\n")
            
            driver.get(job_url)
            sleep(3)
            
            job_data = {
                "job_title": job_title,
                "company_name": None,
                "location": None,
                "experience_required": None,
                "job_description": None,
                "job_url": job_url,
                "job_id": job_url.split('/')[-1] if job_url else None
            }
            
            try:
                company_name = driver.find_element(By.CSS_SELECTOR, "a.companyName").text.strip()
                job_data["company_name"] = company_name
            except:
                pass
            
            try:
                location_elem = driver.find_element(By.CSS_SELECTOR, "span.location").text.strip()
                job_data["location"] = location_elem
            except:
                pass
            
            try:
                experience = driver.find_element(By.CSS_SELECTOR, "div.experience span").text.strip()
                job_data["experience_required"] = experience
            except:
                pass
            
            try:
                description = driver.find_element(By.CSS_SELECTOR, "div.jobDescription").text.strip()
                job_data["job_description"] = description
            except:
                pass
            
            jobs.append(job_data)
        
        return jobs
        
    finally:
        driver.quit()

if __name__ == "__main__":
    # Accept command line arguments from Node.js
    if len(sys.argv) < 3:
        sys.stderr.write("Usage: python naukri.py <keyword> <location>\n")
        sys.exit(1)
    
    keyword = sys.argv[1]
    location = sys.argv[2]
    
    sys.stderr.write(f"Starting Naukri scrape: {keyword} in {location}\n")
    
    try:
        jobs = scrape_naukri_jobs(keyword, location)
        
        # Output JSON to stdout for Node.js to capture
        print(json.dumps(jobs, ensure_ascii=False, indent=2))
        
    except Exception as e:
        sys.stderr.write(f"Error: {str(e)}\n")
        sys.exit(1)