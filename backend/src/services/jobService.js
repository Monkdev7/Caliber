import Job from '../models/jobs.js';

class JobService {
  /**
   * Save multiple jobs to database
   * @param {Array} jobs - Array of job objects
   * @param {string} source - Job source (linkedin/naukri)
   * @returns {Promise<Object>} Statistics about saved jobs
   */
  async saveJobs(jobs, source) {
    const results = {
      total: jobs.length,
      inserted: 0,
      updated: 0,
      failed: 0,
      errors: [],
    };

    for (const jobData of jobs) {
      try {
        const mappedJob = this.mapJobData(jobData, source);

        // Check if job exists first
        const existingJob = await Job.findOne({
          jobId: mappedJob.jobId,
          source: mappedJob.source,
        });

        await Job.upsertJob(mappedJob);

        if (existingJob) {
          results.updated++;
        } else {
          results.inserted++;
        }
      } catch (error) {
        results.failed++;
        results.errors.push({
          jobId: jobData.job_id || jobData.jobId,
          error: error.message,
        });
      }
    }

    return results;
  }
  /**
   * Map Python job data to database schema
   * @param {Object} jobData - Raw job data from Python
   * @param {string} source - Job source
   * @returns {Object} Mapped job data
   */
  mapJobData(jobData, source) {
    if (source === 'linkedin') {
      return {
        jobId: jobData.job_id,
        title: jobData.job_title,
        company: jobData.company_name,
        source: 'linkedin',
        timePosted: jobData.time_posted,
        numApplicants: jobData.num_applicants,
      };
    } else if (source === 'naukri') {
      return {
        jobId:
          jobData.job_id ||
          `naukri_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: jobData.job_title,
        company: jobData.company_name,
        source: 'naukri',
        location: jobData.location,
        experienceRequired: jobData.experience_required,
        description: jobData.job_description,
        jobUrl: jobData.job_url,
      };
    }

    throw new Error(`Unknown source: ${source}`);
  }

  /**
   * Get jobs with filters and pagination
   * @param {Object} filters - Filter criteria
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Jobs and pagination info
   */
  async getJobs(filters = {}, options = {}) {
    const {
      page = 1,
      limit = 60,
      sortBy = 'scrapedAt',
      sortOrder = 'desc',
    } = options;

    const query = { isActive: true };

    // Apply filters
    if (filters.source) query.source = filters.source;
    if (filters.company) query.company = new RegExp(filters.company, 'i');
    if (filters.search) {
      query.$text = { $search: filters.search }; // Full-text search
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    try {
      const [jobs, total] = await Promise.all([
        Job.find(query).sort(sort).skip(skip).limit(limit).lean(),
        Job.countDocuments(query),
      ]);

      return {
        jobs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      throw new Error('Error fetching jobs from database');
    }
  }

  /**
   * Get job by ID
   * @param {string} id - Job ID
   * @returns {Promise<Object>} Job object
   */
  async getJobById(id) {
    return Job.findById(id).lean();
  }

  /**
   * Delete old jobs
   * @param {number} daysOld - Number of days old
   * @returns {Promise<number>} Number of deleted jobs
   */
  async deleteOldJobs(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await Job.deleteMany({
      scrapedAt: { $lt: cutoffDate },
    });

    return result.deletedCount;
  }

  /**
   * Get statistics
   * @returns {Promise<Object>} Job statistics
   */
  async getStats() {
    const [total, bySource, recent] = await Promise.all([
      Job.countDocuments({ isActive: true }),
      Job.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Job.countDocuments({
        isActive: true,
        scrapedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
    ]);

    return {
      total,
      bySource: bySource.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      last24Hours: recent,
    };
  }
}

export default new JobService();
