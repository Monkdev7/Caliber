import { MapPin, Briefcase, Clock, DollarSign, ExternalLink, Building2 } from 'lucide-react';

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

    // Get job URL - check multiple possible field names
    const jobUrl = job.url || job.job_url || job.link || null;

    // Get salary with fallback
    const salary = job.salary || 'Not disclosed';

    return (
        <div className="card hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 animate-slide-up">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            {/* Job Title */}
                            <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors leading-tight">
                                {job.title || job.job_title || 'Job Title Not Available'}
                            </h3>

                            {/* Company Name */}
                            <div className="flex items-center gap-2 mt-2">
                                <Building2 size={16} className="text-gray-500" />
                                <p className="text-gray-700 font-semibold">
                                    {job.company || job.company_name || 'Company Not Specified'}
                                </p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm">
                                {/* Location - Always show with fallback */}
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin size={16} className="text-blue-500 flex-shrink-0" />
                                    <span className="line-clamp-1">
                                        {job.location || 'Location Not Specified'}
                                    </span>
                                </div>

                                {/* Salary - Always show with fallback */}
                                <div className="flex items-center gap-2 text-gray-600">
                                    <DollarSign size={16} className="text-green-500 flex-shrink-0" />
                                    <span className="line-clamp-1">
                                        {salary}
                                    </span>
                                </div>

                                {/* Experience if available */}
                                {job.experience && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Briefcase size={16} className="text-purple-500 flex-shrink-0" />
                                        <span className="line-clamp-1">{job.experience}</span>
                                    </div>
                                )}

                                {/* Posted Date if available */}
                                {(job.posted_date || job.scraped_at) && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock size={16} className="text-amber-500 flex-shrink-0" />
                                        <span>{formatDate(job.posted_date || job.scraped_at)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {job.description && (
                                <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                                    {job.description}
                                </p>
                            )}

                            {/* Job URL Display */}
                            {jobUrl && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="flex items-start gap-2 text-xs">
                                        <ExternalLink size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                                        <a
                                            href={jobUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 hover:underline break-all line-clamp-2"
                                            title={jobUrl}
                                        >
                                            {jobUrl}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="lg:col-span-1 flex flex-col gap-3 sm:items-start lg:items-end">
                    {/* Source Badge */}
                    <div className="flex items-center gap-2">
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${getSourceColor(job.source)}`}>
                            {job.source || 'Unknown'}
                        </span>
                    </div>

                    {/* Apply Button */}
                    {jobUrl ? (
                        <a
                            href={jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary flex items-center justify-center gap-2 text-sm w-full lg:w-auto px-6 py-2.5"
                        >
                            View Job
                            <ExternalLink size={16} />
                        </a>
                    ) : (
                        <button
                            disabled
                            className="btn-secondary text-sm opacity-50 cursor-not-allowed w-full lg:w-auto px-6 py-2.5"
                            title="Job URL not available"
                        >
                            No Link Available
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
