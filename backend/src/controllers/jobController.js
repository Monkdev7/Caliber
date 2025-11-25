import jobService from '../services/jobService.js';

class JobController {
  /**
   * Get all jobs with filters and pagination
   */
  async getJobs(req, res, next) {
    try {
      const filters = {
        source: req.query.source,
        company: req.query.company,
        search: req.query.search,
      };

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        sortBy: req.query.sortBy || 'scrapedAt',
        sortOrder: req.query.sortOrder || 'desc',
      };

      const result = await jobService.getJobs(filters, options);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single job by ID
   */
  async getJobById(req, res, next) {
    try {
      const job = await jobService.getJobById(req.params.id);

      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Job not found',
        });
      }

      res.status(200).json({
        success: true,
        data: job,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get job statistics
   */
  async getStats(req, res, next) {
    try {
      const stats = await jobService.getStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete old jobs
   */
  async deleteOldJobs(req, res, next) {
    try {
      const daysOld = parseInt(req.query.daysOld) || 30;
      const deletedCount = await jobService.deleteOldJobs(daysOld);

      res.status(200).json({
        success: true,
        message: `Deleted ${deletedCount} jobs older than ${daysOld} days`,
        data: { deletedCount },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new JobController();
