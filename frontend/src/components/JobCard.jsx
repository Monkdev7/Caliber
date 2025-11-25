import { MapPin, Briefcase, Clock, DollarSign, ExternalLink } from 'lucide-react';

export default function JobCard({ job }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently Added';
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getSourceColor = (source) => {
    const colors = {
      linkedin: 'bg-blue-100 text-blue-800',
      naukri: 'bg-orange-100 text-orange-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return colors[source?.toLowerCase()] || colors.default;
  };

  return (
    <div className="card hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 animate-slide-up">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Main Content */}
        <div className="sm:col-span-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                {job.title || 'Job Title'}
              </h3>
              <p className="text-gray-600 font-medium mt-1">{job.company || 'Company Name'}</p>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm">
                {job.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} className="text-blue-500" />
                    <span>{job.location}</span>
                  </div>
                )}

                {job.salary && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign size={16} className="text-green-500" />
                    <span>{job.salary}</span>
                  </div>
                )}

                {job.experience && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase size={16} className="text-purple-500" />
                    <span>{job.experience}</span>
                  </div>
                )}

                {job.posted_date && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} className="text-amber-500" />
                    <span>{formatDate(job.posted_date)}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {job.description && (
                <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                  {job.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="sm:col-span-1 flex flex-col gap-2 sm:justify-between">
          {/* Source Badge */}
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getSourceColor(job.source)}`}>
              {job.source || 'Unknown'}
            </span>
          </div>

          {/* Apply Button */}
          {job.url ? (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center justify-center gap-2 text-sm"
            >
              Apply Now
              <ExternalLink size={16} />
            </a>
          ) : (
            <button
              disabled
              className="btn-secondary text-sm opacity-50 cursor-not-allowed"
            >
              No Link
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
