import pythonExecutor from '../services/pythonExecutor.js';
import jobService from '../services/jobService.js';

class ScrapeController {
  async _handleScrapeAndSave(source, keyword, location, maxPages = 1) {
    let jobs = [];

    if (source === 'linkedin') {
      jobs = await pythonExecutor.scrapeLinkedIn(keyword, location, maxPages);
    } else if (source === 'naukri') {
      jobs = await pythonExecutor.scrapeNaukri(keyword, location);
    } else if (source === 'unstop') {
      jobs = await pythonExecutor.scrapeUnstop(keyword, location, maxPages);
    } else {
      throw new Error(`Unsupported source: ${source}`);
    }

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

      res.status(200).json({
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

      res.status(200).json({
        success: true,
        message: 'Naukri sync complete',
        data: saveResults,
      });
    } catch (error) {
      next(error);
    }
  }

  async scrapeUnstop(req, res, next) {
    try {
      const { keyword, location, maxPages = 1 } = req.body;
      if (!keyword || !location)
        throw new Error('Keyword and location are required');

      console.log(`🔍 Starting Unstop scrape: ${keyword} in ${location}`);
      const saveResults = await this._handleScrapeAndSave(
        'unstop',
        keyword,
        location,
        maxPages,
      );

      res.status(200).json({
        success: true,
        message: 'Unstop sync complete',
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

      // All three running at once
      const results = await Promise.allSettled([
        this._handleScrapeAndSave('linkedin', keyword, location, maxPages),
        this._handleScrapeAndSave('naukri', keyword, location),
        this._handleScrapeAndSave('unstop', keyword, location, maxPages),
      ]);

      const responseData = {
        linkedin:
          results[0].status === 'fulfilled'
            ? results[0].value
            : { error: results[0].reason?.message || results[0].reason },
        naukri:
          results[1].status === 'fulfilled'
            ? results[1].value
            : { error: results[1].reason?.message || results[1].reason },
        unstop:
          results[2].status === 'fulfilled'
            ? results[2].value
            : { error: results[2].reason?.message || results[2].reason },
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
