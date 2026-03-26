import { spawn } from 'child_process';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '../../../.env') });
const projectRoot = join(__dirname, '../../..');
const intelligenceDir = join(projectRoot, 'caliber_intelligence');
const bridgePath = join(intelligenceDir, 'bridge.py');
const pythonBin = process.env.CALIBER_PYTHON_BIN || 'python3';

const INSTALL_HINT =
  'Install the Caliber Intelligence Python dependencies with `pip install -r caliber_intelligence/requirements.txt` or point `CALIBER_PYTHON_BIN` to an interpreter that already has them.';

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeText = value => (value || '').toLowerCase();

const inferRemoteType = (location, description) => {
  const text = normalizeText(`${location} ${description}`);

  if (text.includes('hybrid')) return 'hybrid';
  if (text.includes('remote') || text.includes('work from home'))
    return 'remote';
  if (
    text.includes('onsite') ||
    text.includes('on-site') ||
    text.includes('in office')
  ) {
    return 'onsite';
  }

  return 'unknown';
};

const inferEmploymentType = (title, description) => {
  const text = normalizeText(`${title} ${description}`);

  if (text.includes('intern')) return 'internship';
  if (text.includes('part time') || text.includes('part-time'))
    return 'part_time';
  if (text.includes('contract')) return 'contract';
  if (text.includes('full time') || text.includes('full-time'))
    return 'full_time';

  return 'unknown';
};

const inferSeniority = (title, description) => {
  const text = normalizeText(`${title} ${description}`);

  if (text.includes('intern')) return 'internship';
  if (text.includes('entry') || text.includes('fresher')) return 'entry';
  if (text.includes('junior') || text.includes('associate')) return 'junior';
  if (
    text.includes('senior') ||
    text.includes('lead') ||
    text.includes('staff')
  )
    return 'senior';
  if (/\bmid\b/.test(text) || /\bii\b/.test(text) || /\blevel 2\b/.test(text))
    return 'mid';

  return 'unknown';
};

const inferRoleFamily = (title, description) => {
  const text = normalizeText(`${title} ${description}`);

  if (
    text.includes('frontend') ||
    text.includes('front-end') ||
    text.includes('react') ||
    text.includes('angular') ||
    text.includes('vue')
  ) {
    return 'Frontend';
  }

  if (
    text.includes('backend') ||
    text.includes('back-end') ||
    text.includes('api') ||
    text.includes('server')
  ) {
    return 'Backend';
  }

  if (text.includes('full stack') || text.includes('fullstack')) {
    return 'Full Stack';
  }

  if (
    text.includes('machine learning') ||
    text.includes('artificial intelligence') ||
    text.includes('nlp') ||
    text.includes('llm')
  ) {
    return 'Machine Learning / AI';
  }

  if (
    text.includes('data scientist') ||
    text.includes('data engineer') ||
    text.includes('data analyst') ||
    text.includes('analytics') ||
    text.includes('business intelligence')
  ) {
    return 'Data';
  }

  if (
    text.includes('devops') ||
    text.includes('cloud') ||
    text.includes('platform') ||
    text.includes('sre')
  ) {
    return 'DevOps / Cloud';
  }

  if (
    text.includes('mobile') ||
    text.includes('android') ||
    text.includes('ios') ||
    text.includes('react native') ||
    text.includes('flutter')
  ) {
    return 'Mobile';
  }

  if (text.includes('engineer') || text.includes('developer')) {
    return 'Software Engineering';
  }

  return 'Unknown';
};

const extractMatchedSkills = (title, description, userSkills = []) => {
  const text = normalizeText(`${title} ${description}`);

  return userSkills.filter(skill => {
    const pattern = new RegExp(
      `(^|[^a-z0-9+#])${escapeRegex(skill.toLowerCase())}([^a-z0-9+#]|$)`,
    );
    return pattern.test(text);
  });
};

const splitLocation = location => {
  if (!location) {
    return { city: null, country: null };
  }

  const parts = location
    .split(',')
    .map(part => part.trim())
    .filter(Boolean);

  return {
    city: parts[0] || null,
    country: parts.length > 1 ? parts[parts.length - 1] : null,
  };
};

const createJobLookup = jobs => {
  const lookup = new Map();

  for (const job of jobs) {
    const keys = [job?.jobId, job?._id].filter(Boolean).map(String);

    for (const key of keys) {
      lookup.set(key, job);
    }
  }

  return lookup;
};

const normalizeJob = (job, userProfile) => {
  const title = job?.job_title || job?.title || 'Untitled role';
  const description = job?.description || '';
  const company = job?.company_name || job?.company || 'Unknown company';
  const jobId = job?.job_id || job?._id;
  const location = job?.location || '';
  const { city, country } = splitLocation(location);

  return {
    job_id: String(jobId),
    canonical_job_id: String(jobId),
    title,
    role_family: inferRoleFamily(title, description),
    company,
    location_city: city,
    location_country: country,
    remote_type: inferRemoteType(location, description),
    employment_type: inferEmploymentType(title, description),
    seniority: inferSeniority(title, description),
    skills: extractMatchedSkills(title, description, userProfile?.skills || []),
    description,
    posted_at: job?.scrapedAt || job?.createdAt || null,
    source: job?.source || 'unknown',
    is_active: job?.isActive !== false,
  };
};

const enrichRecommendation = (item, jobLookup) => {
  const sourceJob =
    jobLookup.get(item?.job?.job_id) ||
    jobLookup.get(item?.job?.canonical_job_id) ||
    null;

  const formattedLocation =
    sourceJob?.location ||
    [item?.job?.location_city, item?.job?.location_country]
      .filter(Boolean)
      .join(', ') ||
    'Not specified';

  return {
    ...item,
    job: {
      ...item.job,
      location: formattedLocation,
      job_url: sourceJob?.jobUrl || null,
      time_posted: sourceJob?.timePosted || null,
      salary: sourceJob?.salary || null,
    },
  };
};

const runBridge = (action, payload) =>
  new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(pythonBin, [bridgePath, action], {
      cwd: intelligenceDir,
      env: {
        ...process.env,
        PYTHONUTF8: '1',
      },
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', chunk => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', chunk => {
      stderr += chunk.toString();
    });

    child.on('error', error => {
      if (error.code === 'ENOENT') {
        rejectPromise(
          new Error(
            `Python interpreter "${pythonBin}" was not found. Set CALIBER_PYTHON_BIN to a valid interpreter. ${INSTALL_HINT}`,
          ),
        );
        return;
      }

      rejectPromise(
        new Error(
          `Failed to start Caliber Intelligence bridge: ${error.message}`,
        ),
      );
    });

    child.on('close', code => {
      if (code !== 0) {
        rejectPromise(
          new Error(
            `Caliber Intelligence failed during "${action}". ${
              stderr.trim() || stdout.trim() || 'No error output received.'
            }\n${INSTALL_HINT}`,
          ),
        );
        return;
      }

      try {
        resolvePromise(JSON.parse(stdout));
      } catch (error) {
        rejectPromise(
          new Error(
            `Caliber Intelligence returned invalid JSON for "${action}": ${error.message}`,
          ),
        );
      }
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });

class IntelligenceService {
  async analyzeResumeAndRecommend({ filePath, userId, jobs = [], topK = 10 }) {
    const parsedResume = await runBridge('analyze_resume', {
      file_path: resolve(filePath),
      user_id: userId || 'anonymous',
    });

    if (!jobs.length) {
      return {
        ...parsedResume,
        recommendations: [],
        total_jobs_evaluated: 0,
      };
    }

    const normalizedJobs = jobs.map(job =>
      normalizeJob(job, parsedResume.user_profile),
    );

    const recommendationResponse = await runBridge('recommend', {
      user_profile: parsedResume.user_profile,
      jobs: normalizedJobs,
      top_k: Math.min(topK, normalizedJobs.length),
    });

    const jobLookup = createJobLookup(jobs);

    return {
      ...parsedResume,
      recommendations: recommendationResponse.recommendations.map(item =>
        enrichRecommendation(item, jobLookup),
      ),
      total_jobs_evaluated: normalizedJobs.length,
    };
  }
}

export default new IntelligenceService();
