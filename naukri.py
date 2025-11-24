from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from time import sleep
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

gecko_driver_path = os.environ.get('GECKO_DRIVER_PATH')
firefox_binary_path = os.environ.get('FIREFOX_BINARY')
url = "https://www.naukri.com/python-jobs-in-pune?k=python&l=pune&experience=0"

if firefox_binary_path is None:
    raise ValueError("The 'FIREFOX_BINARY' environment variable is not set. Please check your .env file or environment.")

firefox_options = Options()
firefox_options.binary_location = firefox_binary_path
service = Service(executable_path=gecko_driver_path)

driver = webdriver.Firefox(service=service, options=firefox_options)

driver.get(url)

# Wait for the page to load
sleep(5)

job_links = driver.find_elements(By.CSS_SELECTOR, "a.title")

job_titles = []
company_names = []
locations = []
experience_required = []
job_descriptions = []
job_urls = []

for link in job_links:
    job_title = link.text.strip()
    job_url = link.get_attribute("href")

    if job_url: 
        driver.get(job_url)
        sleep(3)
    else:
        continue
    
    try:
        company_name = driver.find_element(By.CSS_SELECTOR, "a.companyName").text.strip()
    except:
        company_name = None
    
    try:
        location = driver.find_element(By.CSS_SELECTOR, "span.location").text.strip()
    except:
        location = None
    
    try:
        experience = driver.find_element(By.CSS_SELECTOR, "div.experience span").text.strip()
    except:
        experience = None
    
    try:
        description = driver.find_element(By.CSS_SELECTOR, "div.jobDescription").text.strip()
    except:
        description = None
   
    job_titles.append(job_title)
    company_names.append(company_name)
    locations.append(location)
    experience_required.append(experience)
    job_descriptions.append(description)
    job_urls.append(job_url)

jobs_df = pd.DataFrame({
    'Job Title': job_titles,
    'Company Name': company_names,
    'Location': locations,
    'Experience Required': experience_required,
    'Job Description': job_descriptions,
    'Job URL': job_urls
})

print(jobs_df)

# Close the driver
driver.quit()
