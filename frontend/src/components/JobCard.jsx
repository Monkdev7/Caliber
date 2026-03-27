import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  ExternalLink,
  Building2,
  Users,
  RefreshCw,
} from 'lucide-react';

export default function JobCard({ job }) {
  const formatDate = dateString => {
    if (!dateString) return 'Recently Added';
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString();
  };

  const formatApplicants = num => {
    if (!num || num === 0) return 'N/A';
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const getSourceColor = source => {
    const colors = {
      linkedin: 'bg-accent/20 text-accent border-accent/30',
      naukri: 'bg-accent/20 text-accent border-accent/30',
      unstop: 'bg-accent/20 text-accent border-accent/30',
      foundit: 'bg-accent/20 text-accent border-accent/30',
      default: 'bg-slate-800 text-slate-300 border-slate-700',
    };
    return colors[source?.toLowerCase()] || colors.default;
  };

  // Get job URL from backend field
  const jobUrl = job.jobUrl || null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 animate-slide-up">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Job Title */}
              <h3 className="text-xl font-bold text-slate-100 hover:text-accent transition-colors leading-tight">
                {job.title || job.job_title || 'Job Title Not Available'}
              </h3>

              {/* Company Name */}
              <div className="flex items-center gap-2 mt-2">
                <Building2 size={16} className="text-slate-500" />
                <p className="text-slate-300 font-semibold">
                  {job.company || job.company_name || 'Company Not Specified'}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm">
                {/* Location - Always show with fallback */}
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin size={16} className="text-accent flex-shrink-0" />
                  <span className="line-clamp-1">
                    {job.location || 'Location Not Specified'}
                  </span>
                </div>

                {/* Salary - Always show with fallback */}
                <div className="flex items-center gap-2 text-slate-400">
                  <DollarSign size={16} className="text-accent flex-shrink-0" />
                  <span className="line-clamp-1">
                    {job.salary || 'Not disclosed'}
                  </span>
                </div>

                {/* Number of Applicants - Show for LinkedIn jobs */}
                {job.numApplicants !== undefined &&
                  job.numApplicants !== null && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users size={16} className="text-accent flex-shrink-0" />
                      <span className="line-clamp-1">
                        {formatApplicants(job.numApplicants)} applicants
                      </span>
                    </div>
                  )}

                {/* Time Posted - Backend field */}
                {job.timePosted && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={16} className="text-accent flex-shrink-0" />
                    <span className="line-clamp-1">{job.timePosted}</span>
                  </div>
                )}

                {/* Experience if available */}
                {job.experienceRequired && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Briefcase
                      size={16}
                      className="text-accent flex-shrink-0"
                    />
                    <span className="line-clamp-1">
                      {job.experienceRequired}
                    </span>
                  </div>
                )}

                {/* Last Updated */}
                {job.updatedAt && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <RefreshCw
                      size={16}
                      className="text-accent flex-shrink-0"
                    />
                    <span className="line-clamp-1">
                      Updated {formatDate(job.updatedAt)}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {job.description && (
                <p className="text-slate-400 text-sm mt-3 line-clamp-2">
                  {job.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="lg:col-span-1 flex flex-col gap-3 sm:items-start lg:items-end">
          {/* Source Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${getSourceColor(job.source)}`}
            >
              {job.source || 'Unknown'}
            </span>
          </div>

          {/* Apply Button */}
          {jobUrl ? (
            <a
              href={jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="auth-button flex items-center justify-center gap-2 text-sm w-full lg:w-auto px-6 py-3"
            >
              Apply Now
              <ExternalLink size={16} />
            </a>
          ) : (
            <button
              disabled
              className="px-6 py-3 bg-slate-800 border border-slate-700 text-slate-500 rounded-lg text-sm opacity-50 cursor-not-allowed w-full lg:w-auto"
              title="Job URL not available"
            >
              Link N/A
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
