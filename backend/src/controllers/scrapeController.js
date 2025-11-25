import pythonExecutor from '../services/pythonExecutor.js';
import jobService from '../services/jobService.js';

class ScrapeController {
  /**
   * Scrape jobs from LinkedIn
   */
  async scrapeLinkedIn(req, res, next) {
    try {
      const { keyword, location, maxPages = 1 } = req.body;

      // Validation
      if (!keyword || !location) {
        return res.status(400).json({
          success: false,
          error: 'Keyword and location are required',
        });
      }

      if (maxPages < 1 || maxPages > 10) {
        return res.status(400).json({
          success: false,
          error: 'maxPages must be between 1 and 10',
        });
      }

      console.log(`🔍 Starting LinkedIn scrape: ${keyword} in ${location}`);

      // Execute Python scraper
      const jobs = await pythonExecutor.scrapeLinkedIn(
        keyword,
        location,
        maxPages
      );

      // Save to database
      const saveResults = await jobService.saveJobs(jobs, 'linkedin');

      console.log(
        `✅ LinkedIn scrape completed: ${saveResults.inserted} new, ${saveResults.updated} updated`
      );

      res.status(200).json({
        success: true,
        message: 'LinkedIn scraping completed',
        data: {
          keyword,
          location,
          maxPages,
          results: saveResults,
        },
      });
    } catch (error) {
      console.error('❌ LinkedIn scrape error:', error.message);
      next(error);
    }
  }

  /**
   * Scrape jobs from Naukri
   */
  async scrapeNaukri(req, res, next) {
    try {
      const { keyword, location } = req.body;

      // Validation
      if (!keyword || !location) {
        return res.status(400).json({
          success: false,
          error: 'Keyword and location are required',
        });
      }

      console.log(`🔍 Starting Naukri scrape: ${keyword} in ${location}`);

      // Execute Python scraper
      const jobs = await pythonExecutor.scrapeNaukri(keyword, location);

      // Save to database
      const saveResults = await jobService.saveJobs(jobs, 'naukri');

      console.log(
        `✅ Naukri scrape completed: ${saveResults.inserted} new, ${saveResults.updated} updated`
      );

      res.status(200).json({
        success: true,
        message: 'Naukri scraping completed',
        data: {
          keyword,
          location,
          results: saveResults,
        },
      });
    } catch (error) {
      console.error('❌ Naukri scrape error:', error.message);
      next(error);
    }
  }

  /**
   * Scrape from all sources
   */
  async scrapeAll(req, res, next) {
    try {
      const { keyword, location, maxPages = 1 } = req.body;

      if (!keyword || !location) {
        return res.status(400).json({
          success: false,
          error: 'Keyword and location are required',
        });
      }

      console.log(
        `🔍 Starting scrape from all sources: ${keyword} in ${location}`
      );

      const results = {
        linkedin: null,
        naukri: null,
      };

      // Scrape LinkedIn
      try {
        const linkedInJobs = await pythonExecutor.scrapeLinkedIn(
          keyword,
          location,
          maxPages
        );
        results.linkedin = await jobService.saveJobs(linkedInJobs, 'linkedin');
      } catch (error) {
        console.error('LinkedIn scrape failed:', error.message);
        results.linkedin = { error: error.message };
      }

      // Scrape Naukri
      try {
        const naukriJobs = await pythonExecutor.scrapeNaukri(keyword, location);
        results.naukri = await jobService.saveJobs(naukriJobs, 'naukri');
      } catch (error) {
        console.error('Naukri scrape failed:', error.message);
        results.naukri = { error: error.message };
      }

      console.log(`✅ Multi-source scrape completed`);

      res.status(200).json({
        success: true,
        message: 'Multi-source scraping completed',
        data: {
          keyword,
          location,
          results,
        },
      });
    } catch (error) {
      console.error('❌ Multi-source scrape error:', error.message);
      next(error);
    }
  }
}

export default new ScrapeController();
