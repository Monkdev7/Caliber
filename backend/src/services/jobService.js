import Job from '../models/jobs.js';

class JobService {
  /**
   * Main entry point for saving scraped data.
   * Uses BulkWrite for high performance.
   */
  async saveJobs(jobs, source) {
    const results = {
      total: jobs.length,
      inserted: 0,
      updated: 0,
      failed: 0,
    };

    if (!jobs || jobs.length === 0) return results;

    const bulkOps = jobs.map(jobData => {
      const mapped = this.mapJobData(jobData, source);
      return {
        updateOne: {
          // Unique identifier: Combination of ID and Source
          filter: { jobId: mapped.jobId, source: mapped.source },
          update: {
            $set: {
              ...mapped,
              isActive: true,
              scrapedAt: new Date(),
            },
          },
          upsert: true,
        },
      };
    });

    try {
      const outcome = await Job.bulkWrite(bulkOps);
      results.inserted = outcome.upsertedCount;
      results.updated = outcome.modifiedCount;
    } catch (error) {
      console.error(`❌ BulkWrite Error for ${source}:`, error.message);
      results.failed = jobs.length;
    }

    return results;
  }

  /**
   * Maps Python snake_case keys to MongoDB camelCase keys.
   * Matches your Python dict exactly.
   */
  mapJobData(jobData, source) {
    return {
      jobId: String(jobData.job_id),
      title: jobData.job_title || 'No Title',
      company: jobData.company_name || 'No Company',
      timePosted: jobData.time_posted || 'Recently',
      numApplicants: parseInt(jobData.num_applicants) || 0,
      jobUrl: jobData.job_link,
      location: jobData.job_location || 'Remote/Not Specified',
      salary: jobData.salary || 'Not Disclosed',
      description: jobData.description || '',
      source: source,
    };
  }

  /**
   * Advanced query for the frontend
   */
  async getJobs(filters = {}, options = {}) {
    const {
      page = 1,
      limit = 60,
      sortBy = 'scrapedAt',
      sortOrder = 'desc',
    } = options;
    const query = { isActive: true };

    if (filters.source) query.source = filters.source;

    // Smart search across Title, Company, and Location
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { location: searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Job.countDocuments(query),
    ]);

    return {
      jobs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getStats() {
    const stats = await Job.aggregate([
      { $match: { isActive: true } },
      {
        $facet: {
          counts: [{ $group: { _id: '$source', count: { $sum: 1 } } }],
          recent: [
            {
              $match: {
                scrapedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
              },
            },
            { $count: 'count' },
          ],
        },
      },
    ]);

    return {
      bySource: stats[0].counts.reduce(
        (acc, c) => ({ ...acc, [c._id]: c.count }),
        {},
      ),
      newInLast24h: stats[0].recent[0]?.count || 0,
    };
  }

  async deleteOldJobs(daysOld = 30) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysOld);
    const result = await Job.deleteMany({ scrapedAt: { $lt: cutoff } });
    return result.deletedCount;
  }
}

export default new JobService();
