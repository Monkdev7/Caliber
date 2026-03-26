import intelligenceService from '../services/intelligenceService.js';
import jobService from '../services/jobService.js';

class UploadController {
  async uploadPDF(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded or invalid format',
        });
      }

      const { jobs } = await jobService.getJobs(
        {},
        {
          page: 1,
          limit: 500,
          sortBy: 'scrapedAt',
          sortOrder: 'desc',
        },
      );

      const result = await intelligenceService.analyzeResumeAndRecommend({
        filePath: req.file.path,
        userId: req.user?.id,
        jobs,
        topK: 10,
      });

      res.json({
        success: true,
        message: 'Resume analyzed successfully',
        data: {
          filename: req.file.filename,
          parsedResume: result.parsed_resume,
          userProfile: result.user_profile,
          recommendations: result.recommendations,
          totalJobsEvaluated: result.total_jobs_evaluated,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UploadController();
