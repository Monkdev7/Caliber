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
    } else if (source === 'foundit') {
      jobs = await pythonExecutor.scrapeFoundit(keyword, location, maxPages);
    } else {
      throw new Error(`Unsupported source: ${source}`);
    }

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

  async scrapeFoundit(req, res, next) {
    try {
      const { keyword, location, maxPages = 1 } = req.body;
      if (!keyword || !location)
        throw new Error('Keyword and location are required');

      console.log(`🔍 Starting Foundit scrape: ${keyword} in ${location}`);
      const saveResults = await this._handleScrapeAndSave(
        'foundit',
        keyword,
        location,
        maxPages,
      );

      res.status(200).json({
        success: true,
        message: 'Foundit sync complete',
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
      const sources = ['linkedin', 'naukri', 'unstop', 'foundit'];

      console.log(`🚀 Multi-source scrape: ${keyword} @ ${location}`);

      const results = await Promise.allSettled(
        sources.map(src =>
          this._handleScrapeAndSave(src, keyword, location, maxPages),
        ),
      );

      // Dynamic
      const responseData = {};
      sources.forEach((source, index) => {
        const res = results[index];
        responseData[source] =
          res.status === 'fulfilled'
            ? res.value
            : { error: res.reason?.message || res.reason };
      });

      res.status(200).json({ success: true, data: responseData });
    } catch (error) {
      next(error);
    }
  }
}

export default new ScrapeController();
