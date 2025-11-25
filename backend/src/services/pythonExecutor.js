import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class PythonExecutor {
  constructor() {
    this.pythonPath = process.env.PYTHON_PATH || 'python3';
    this.scriptsDir = join(__dirname, '../../../'); // Root directory
  }

  /**
   * Execute LinkedIn scraper
   * @param {string} keyword - Job keyword
   * @param {string} location - Job location
   * @param {number} maxPages - Number of pages to scrape
   * @returns {Promise<Array>} Array of job objects
   */
  async scrapeLinkedIn(keyword, location, maxPages = 1) {
    const scriptPath = join(this.scriptsDir, 'linkedin.py');

    return new Promise((resolve, reject) => {
      const args = [scriptPath, keyword, location, maxPages.toString()];
      const python = spawn(this.pythonPath, args);

      let dataString = '';
      let errorString = '';

      python.stdout.on('data', data => {
        dataString += data.toString();
      });

      python.stderr.on('data', data => {
        errorString += data.toString();
        console.error(`Python stderr: ${data}`);
      });

      python.on('close', code => {
        if (code !== 0) {
          reject(
            new Error(`Python script exited with code ${code}: ${errorString}`)
          );
          return;
        }

        try {
          // Parse JSON output from Python
          const jobs = JSON.parse(dataString);
          resolve(jobs);
        } catch (error) {
          reject(new Error(`Failed to parse Python output: ${error.message}`));
        }
      });

      python.on('error', error => {
        reject(new Error(`Failed to start Python process: ${error.message}`));
      });
    });
  }

  /**
   * Execute Naukri scraper
   * @param {string} keyword - Job keyword
   * @param {string} location - Job location
   * @returns {Promise<Array>} Array of job objects
   */
  async scrapeNaukri(keyword, location) {
    const scriptPath = join(this.scriptsDir, 'naukri.py');

    return new Promise((resolve, reject) => {
      const args = [scriptPath, keyword, location];
      const python = spawn(this.pythonPath, args);

      let dataString = '';
      let errorString = '';

      python.stdout.on('data', data => {
        dataString += data.toString();
      });

      python.stderr.on('data', data => {
        errorString += data.toString();
        console.error(`Python stderr: ${data}`);
      });

      python.on('close', code => {
        if (code !== 0) {
          reject(
            new Error(`Python script exited with code ${code}: ${errorString}`)
          );
          return;
        }

        try {
          const jobs = JSON.parse(dataString);
          resolve(jobs);
        } catch (error) {
          reject(new Error(`Failed to parse Python output: ${error.message}`));
        }
      });

      python.on('error', error => {
        reject(new Error(`Failed to start Python process: ${error.message}`));
      });
    });
  }
}

export default new PythonExecutor();
