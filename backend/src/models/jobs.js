import { Schema, model } from 'mongoose';

const jobSchema = new Schema(
  {
    // Common fields
    jobId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      required: true,
      enum: ['linkedin', 'naukri'],
      index: true,
    },

    // LinkedIn specific
    timePosted: {
      type: String,
    },
    numApplicants: {
      type: Number,
    },

    // Naukri specific
    location: {
      type: String,
      trim: true,
    },
    experienceRequired: {
      type: String,
    },
    description: {
      type: String,
    },
    jobUrl: {
      type: String,
    },

    // Metadata
    scrapedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for uniqueness across source
jobSchema.index({ jobId: 1, source: 1 }, { unique: true });

// Text index for search
jobSchema.index({
  title: 'text',
  company: 'text',
  description: 'text',
});

// Static method to upsert job
jobSchema.statics.upsertJob = async function (jobData) {
  const filter = { jobId: jobData.jobId, source: jobData.source };
  const update = { ...jobData, scrapedAt: new Date() };
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };

  return this.findOneAndUpdate(filter, update, options);
};

export default model('Job', jobSchema);
