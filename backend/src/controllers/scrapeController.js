import pythonExecutor from '../services/pythonExecutor.js';
import jobService from '../services/jobService.js';

class ScrapeController {
  /**
   * Helper to handle the common save logic
   */
  async _handleScrapeAndSave(source, keyword, location, maxPages = 1) {
    // 1. Execute the specific python script
    const jobs =
      source === 'linkedin'
        ? await pythonExecutor.scrapeLinkedIn(keyword, location, maxPages)
        : await pythonExecutor.scrapeNaukri(keyword, location);

    // 2. Save and return results
    return await jobService.saveJobs(jobs, source);
  }

  async scrapeLinkedIn(req, res, next) {
    try {
      const { keyword, location, maxPages = 1 } = req.body;
      if (!keyword || !location)
        throw new Error('Keyword and location are required');

      console.log(`🔍 Starting LinkedIn scrape: ${keyword} in ${location}`);
      const saveResults = await this._handleScrapeAndSave(
        'linkedin',
        keyword,
        location,
        maxPages,
      );

      res
        .status(200)
        .json({
          success: true,
          message: 'LinkedIn sync complete',
          data: saveResults,
        });
    } catch (error) {
      next(error);
    }
  }

  async scrapeNaukri(req, res, next) {
    try {
      const { keyword, location } = req.body;
      if (!keyword || !location)
        throw new Error('Keyword and location are required');

      console.log(`🔍 Starting Naukri scrape: ${keyword} in ${location}`);
      const saveResults = await this._handleScrapeAndSave(
        'naukri',
        keyword,
        location,
      );

      res
        .status(200)
        .json({
          success: true,
          message: 'Naukri sync complete',
          data: saveResults,
        });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Scrape from all sources IN PARALLEL
   */
  async scrapeAll(req, res, next) {
    try {
      const { keyword, location, maxPages = 1 } = req.body;
      if (!keyword || !location) {
        return res
          .status(400)
          .json({ success: false, error: 'Missing parameters' });
      }

      console.log(`🚀 Multi-source scrape started: ${keyword} @ ${location}`);

      // Promise.allSettled runs them at the same time and doesn't crash if one fails
      const results = await Promise.allSettled([
        this._handleScrapeAndSave('linkedin', keyword, location, maxPages),
        this._handleScrapeAndSave('naukri', keyword, location),
      ]);

      const responseData = {
        linkedin:
          results[0].status === 'fulfilled'
            ? results[0].value
            : { error: results[0].reason },
        naukri:
          results[1].status === 'fulfilled'
            ? results[1].value
            : { error: results[1].reason },
      };

      res.status(200).json({
        success: true,
        data: responseData,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ScrapeController();
