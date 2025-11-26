import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Helper: Run a Python script via `uv run`
 * Guaranteed to work with your uv environment.
 */
function runPython(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    const python = spawn('uv', ['run', scriptPath, ...args]);

    let stdout = '';
    let stderr = '';

    python.stdout.on('data', data => {
      stdout += data.toString();
    });

    python.stderr.on('data', data => {
      stderr += data.toString();
      console.error(`🐍 Python stderr: ${data}`);
    });

    python.on('close', code => {
      if (code !== 0) {
        return reject(
          new Error(
            `Python script failed with exit code ${code}\n${
              stderr || 'No stderr'
            }`
          )
        );
      }

      try {
        const parsed = JSON.parse(stdout);
        resolve(parsed);
      } catch (err) {
        reject(
          new Error(
            `Failed to parse Python JSON output:\n${err.message}\nOUTPUT:\n${stdout}`
          )
        );
      }
    });

    python.on('error', err => {
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });
  });
}

class PythonExecutor {
  constructor() {
    this.scriptsDir = join(__dirname, '../../../'); // Root project folder
  }

  /**
   * Run LinkedIn scraper
   */
  async scrapeLinkedIn(keyword, location, maxPages = 1) {
    const scriptPath = join(this.scriptsDir, 'linkedin.py');
    console.log(`🚀 Running LinkedIn scraper using uv…`);

    return runPython(scriptPath, [keyword, location, maxPages.toString()]);
  }

  /**
   * Run Naukri scraper
   */
  async scrapeNaukri(keyword, location) {
    const scriptPath = join(this.scriptsDir, 'naukri.py');
    console.log(`🚀 Running Naukri scraper using uv…`);

    return runPython(scriptPath, [keyword, location]);
  }
}

export default new PythonExecutor();
