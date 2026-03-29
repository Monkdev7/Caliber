import { useState, useEffect } from 'react';
import { Search, Briefcase, Zap, Filter, Download, X, ArrowUpDown, CheckCircle } from 'lucide-react';
import axios from 'axios';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import FilterPanel from '../components/FilterPanel';
import '../App.css';

// Utility function to parse relative time strings like "2 days ago" into timestamps
const parseTimePosted = (timePosted) => {
    if (!timePosted) return 0;

    // If it's already a valid date string, parse it
    const directDate = new Date(timePosted);
    if (!isNaN(directDate.getTime())) {
        return directDate.getTime();
    }

    // Parse relative time strings like "2 days ago", "1 week ago", etc.
    const now = Date.now();
    const timeString = timePosted.toLowerCase().trim();

    // Match patterns like "X hours/days/weeks/months ago"
    const match = timeString.match(/(\d+)\s*(minute|hour|day|week|month|year)s?\s*ago/);

    if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2];

        const milliseconds = {
            minute: 60 * 1000,
            hour: 60 * 60 * 1000,
            day: 24 * 60 * 60 * 1000,
            week: 7 * 24 * 60 * 60 * 1000,
            month: 30 * 24 * 60 * 60 * 1000,
            year: 365 * 24 * 60 * 60 * 1000,
        };

        return now - (value * (milliseconds[unit] || 0));
    }

    // Handle "Just now" or "Today"
    if (timeString.includes('just now') || timeString.includes('today')) {
        return now;
    }

    // Handle "Yesterday"
    if (timeString.includes('yesterday')) {
        return now - (24 * 60 * 60 * 1000);
    }

    // Default to 0 if unparseable
    return 0;
};

function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [scrapingLinkedIn, setScrapingLinkedIn] = useState(false);
    const [scrapingNaukri, setScrapingNaukri] = useState(false);
    const [scrapingUnstop, setScrapingUnstop] = useState(false);
    const [scrapingFoundit, setScrapingFoundit] = useState(false);
    const [scrapingFromSearch, setScrapingFromSearch] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('date'); // 'date', 'title', 'company', 'location'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
    const [filters, setFilters] = useState({
        company: '',
        location: '',
        source: 'all',
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 60,
        total: 0,
        pages: 0,
    });

    // Fetch jobs on mount
    useEffect(() => {
        fetchJobs();
    }, []);

    // Filter and sort jobs when dependencies change
    useEffect(() => {
        applyFiltersAndSort();
    }, [filters, jobs, sortBy, sortOrder]);

    // Auto-dismiss success message
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('/api/jobs', {
                params: {
                    page: 1,
                    limit: 1000, // Fetch more jobs for better filtering
                    sortBy: 'scrapedAt',
                    sortOrder: 'desc',
                },
            });

            const { jobs, pagination } = response.data.data;

            if (response.data.success && Array.isArray(response.data.data.jobs)) {
                setJobs(jobs);
                setPagination(pagination);
            } else {
                setJobs([]);
                setPagination({ page: 1, limit: 60, total: 0, pages: 0 });
            }
        } catch (err) {
            // For first-time users with no jobs yet (or transient API issues),
            // keep the dashboard usable and show the empty state instead of a hard error.
            setJobs([]);
            setPagination({ page: 1, limit: 60, total: 0, pages: 0 });
            console.warn('Jobs fetch failed, showing empty dashboard state:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = async (e) => {
        e?.preventDefault();

        if (!searchTerm.trim()) {
            setError('Please enter a search query');
            setTimeout(() => setError(null), 3000);
            return;
        }

        try {
            setScrapingFromSearch(true);
            setError(null);
            setSuccess(null);

            // Parse search input: use comma to separate job title and location
            // Examples: "frontend" -> only title, "frontend, delhi" -> title + location
            const parts = searchTerm.trim().split(',').map(part => part.trim());
            const keyword = parts[0]; // First part is the job title
            const location = parts[1] || ''; // Second part is location (if provided)

            console.log(`🔍 Triggering scrape for: "${keyword}"${location ? ` in "${location}"` : ' (all locations)'}`);

            // Call the scrape all endpoint to scrape all configured sources
            const response = await axios.post('/api/scrape/all', {
                keyword,
                location: location || undefined, // Send undefined if no location to let backend handle it
                maxPages: 1,
            });

            if (response.data.success) {
                // Clear filters
                setFilters({
                    company: '',
                    location: '',
                    source: 'all',
                });
                setShowFilters(false);

                // Fetch updated jobs
                await fetchJobs();

                // Show success message
                const linkedInCount = response.data.data?.linkedin?.saved || 0;
                const naukriCount = response.data.data?.naukri?.saved || 0;
                const unstopCount = response.data.data?.unstop?.saved || 0;
                const founditCount = response.data.data?.foundit?.saved || 0;
                const totalCount = linkedInCount + naukriCount + unstopCount + founditCount;

                setSuccess(`Successfully scraped ${totalCount} jobs (LinkedIn: ${linkedInCount}, Naukri: ${naukriCount}, Unstop: ${unstopCount}, Foundit: ${founditCount})`);
            } else {
                setError('Scraping failed — please try again.');
            }
        } catch (err) {
            setError(`Failed to scrape jobs. ${err.response?.data?.message || err.message || ''}`);
            console.error('Scraping error:', err);
        } finally {
            setScrapingFromSearch(false);
        }
    };

    const triggerScrape = async source => {
        try {
            // Set scraping state for specific source only
            if (source === 'linkedin') setScrapingLinkedIn(true);
            else if (source === 'naukri') setScrapingNaukri(true);
            else if (source === 'unstop') setScrapingUnstop(true);
            else if (source === 'foundit') setScrapingFoundit(true);

            setError(null);
            setSuccess(null);

            // Use search term or default values
            const keyword = searchTerm || 'Software Engineer';
            const location = 'Remote';

            const supportedSources = ['linkedin', 'naukri', 'unstop', 'foundit'];
            if (!supportedSources.includes(source)) {
                throw new Error(`Unsupported source: ${source}`);
            }

            const response = await axios.post(`/api/scrape/${source}`, {
                keyword,
                location,
                maxPages: 1,
            });

            if (response.data.success) {
                // Clear all filters and search
                setSearchTerm('');
                setFilters({
                    company: '',
                    location: '',
                    source: 'all',
                });
                setShowFilters(false);

                // Refetch jobs to show new data
                await fetchJobs();

                // Show success message
                const jobCount = response.data.count || response.data.data?.length || 'New';
                setSuccess(`Successfully scraped ${jobCount} jobs from ${source.charAt(0).toUpperCase() + source.slice(1)}!`);
            } else {
                setError('Scraping failed — server did not return success.');
            }
        } catch (err) {
            setError(`Failed to scrape ${source} jobs. ${err.response?.data?.message || ''}`);
            console.error(err);
        } finally {
            // Clear scraping state for specific source
            if (source === 'linkedin') setScrapingLinkedIn(false);
            else if (source === 'naukri') setScrapingNaukri(false);
            else if (source === 'unstop') setScrapingUnstop(false);
            else if (source === 'foundit') setScrapingFoundit(false);
        }
    };

    const applyFiltersAndSort = () => {
        let filtered = [...jobs];

        // Company filter
        if (filters.company) {
            const filterLower = filters.company.toLowerCase();
            filtered = filtered.filter(job => {
                const company = (job.company || job.company_name || '').toLowerCase();
                return company.includes(filterLower);
            });
        }

        // Location filter
        if (filters.location) {
            filtered = filtered.filter(job =>
                job.location?.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Source filter
        if (filters.source && filters.source !== 'all') {
            filtered = filtered.filter(job => job.source?.toLowerCase() === filters.source.toLowerCase());
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let compareA, compareB;

            switch (sortBy) {
                case 'title':
                    compareA = (a.title || a.job_title || '').toLowerCase();
                    compareB = (b.title || b.job_title || '').toLowerCase();
                    break;
                case 'company':
                    compareA = (a.company || a.company_name || '').toLowerCase();
                    compareB = (b.company || b.company_name || '').toLowerCase();
                    break;
                case 'location':
                    compareA = (a.location || '').toLowerCase();
                    compareB = (b.location || '').toLowerCase();
                    break;
                case 'date':
                default:
                    // Use ONLY timePosted field for date sorting
                    compareA = parseTimePosted(a.timePosted);
                    compareB = parseTimePosted(b.timePosted);
                    break;
            }

            if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
            if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredJobs(filtered);
    };

    const handleFilterChange = newFilters => {
        setFilters(newFilters);
    };

    const clearAllFilters = () => {
        setFilters({
            company: '',
            location: '',
            source: 'all',
        });
        setShowFilters(false);
    };

    const toggleSort = (field) => {
        if (sortBy === field) {
            // Toggle sort order if same field
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new field with default desc order
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const hasActiveFilters = () => {
        return filters.company || filters.location || (filters.source && filters.source !== 'all');
    };

    const exportToCSV = () => {
        if (filteredJobs.length === 0) {
            setError('No jobs to export');
            setTimeout(() => setError(null), 3000);
            return;
        }

        const headers = ['Title', 'Company', 'Location', 'Salary', 'Source', 'URL'];
        const csvContent = [
            headers.join(','),
            ...filteredJobs.map(job => {
                // Handle field name variations
                const title = job.title || job.job_title || 'N/A';
                const company = job.company || job.company_name || 'N/A';
                const location = job.location || 'N/A';
                const salary = job.salary || 'Not disclosed';
                const source = job.source || 'Unknown';
                // Use correct backend field name: jobUrl (camelCase)
                const jobUrl = job.jobUrl || job.url || job.job_url || job.link || 'N/A';

                return [
                    `"${title.replace(/"/g, '""')}"`,
                    `"${company.replace(/"/g, '""')}"`,
                    `"${location.replace(/"/g, '""')}"`,
                    `"${salary.replace(/"/g, '""')}"`,
                    `"${source.replace(/"/g, '""')}"`,
                    `"${jobUrl.replace(/"/g, '""')}"`,
                ].join(',');
            }),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `caliber-jobs-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        setSuccess(`Exported ${filteredJobs.length} jobs to CSV!`);
    };

    const isAnyScraping = scrapingLinkedIn || scrapingNaukri || scrapingUnstop || scrapingFoundit || scrapingFromSearch;

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Header
                onScrape={triggerScrape}
                scrapingLinkedIn={scrapingLinkedIn}
                scrapingNaukri={scrapingNaukri}
                scrapingUnstop={scrapingUnstop}
                scrapingFoundit={scrapingFoundit}
            />

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
                {/* Success Alert */}
                {success && (
                    <div className="mb-6 p-4 bg-slate-900 border border-slate-800 text-slate-100 rounded-lg animate-fade-in flex items-center gap-3">
                        <CheckCircle size={20} className="flex-shrink-0 text-accent" />
                        <span>{success}</span>
                        <button
                            onClick={() => setSuccess(null)}
                            className="ml-auto text-slate-400 hover:text-slate-100"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-slate-900 border border-slate-800 text-rose-500 rounded-lg animate-fade-in flex items-center gap-3">
                        <span className="flex-1">{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="text-slate-400 hover:text-slate-100"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Search and Actions */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        {/* Search Bar with Submit Button */}
                        <form
                            onSubmit={handleSearchSubmit}
                            className="flex gap-2 flex-[2]"
                        >
                            <div className="flex-1 relative">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder="e.g., 'frontend' or 'frontend, delhi' to scrape jobs..."
                                    className="w-full px-4 pl-10 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    disabled={scrapingFromSearch}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearchSubmit(e);
                                        }
                                    }}
                                />
                                {searchTerm && !scrapingFromSearch && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={!searchTerm.trim() || scrapingFromSearch}
                                className="px-4 py-2.5 bg-accent hover:bg-accent/90 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap text-sm"
                            >
                                {scrapingFromSearch ? (
                                    <>
                                        <Zap size={16} className="animate-spin" />
                                        Scraping...
                                    </>
                                ) : (
                                    <>
                                        <Zap size={16} />
                                        Search
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Sort Dropdown */}
                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-');
                                setSortBy(field);
                                setSortOrder(order);
                            }}
                            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm min-w-[160px]"
                        >
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="title-asc">Title A-Z</option>
                            <option value="title-desc">Title Z-A</option>
                            <option value="company-asc">Company A-Z</option>
                            <option value="company-desc">Company Z-A</option>
                            <option value="location-asc">Location A-Z</option>
                            <option value="location-desc">Location Z-A</option>
                        </select>

                        {/* Filters Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-2.5 font-medium rounded-lg transition-all flex items-center gap-2 text-sm ${showFilters
                                ? 'bg-accent text-white'
                                : 'bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800'
                                }`}
                        >
                            <Filter size={16} />
                            Filters
                            {hasActiveFilters() && (
                                <span className="bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                                    {[filters.company, filters.location, filters.source !== 'all' ? filters.source : null].filter(Boolean).length}
                                </span>
                            )}
                        </button>

                        {/* Clear Filters */}
                        {hasActiveFilters() && (
                            <button
                                onClick={clearAllFilters}
                                className="px-4 py-2.5 bg-slate-900 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm"
                                title="Clear all filters"
                            >
                                <X size={16} />
                                Reset
                            </button>
                        )}

                        {/* Export Button */}
                        <button
                            onClick={exportToCSV}
                            disabled={filteredJobs.length === 0}
                            className="px-4 py-2.5 bg-slate-900 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
                        >
                            <Download size={16} />
                            Export
                        </button>
                    </div>

                    {/* Active Filters Indicator */}
                    {hasActiveFilters() && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {filters.company && (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 text-slate-300 rounded-lg text-sm">
                                    <span className="text-slate-500">Company:</span> {filters.company}
                                    <button
                                        onClick={() => setFilters({ ...filters, company: '' })}
                                        className="text-slate-400 hover:text-slate-100 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                            {filters.location && (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 text-slate-300 rounded-lg text-sm">
                                    <span className="text-slate-500">Location:</span> {filters.location}
                                    <button
                                        onClick={() => setFilters({ ...filters, location: '' })}
                                        className="text-slate-400 hover:text-slate-100 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                            {filters.source && filters.source !== 'all' && (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 text-slate-300 rounded-lg text-sm">
                                    <span className="text-slate-500">Source:</span> {filters.source.charAt(0).toUpperCase() + filters.source.slice(1)}
                                    <button
                                        onClick={() => setFilters({ ...filters, source: 'all' })}
                                        className="text-slate-400 hover:text-slate-100 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}

                    {/* Filter Panel */}
                    {showFilters && (
                        <FilterPanel
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-md p-4 text-center">
                        <div className="text-3xl font-bold text-accent">
                            {filteredJobs.length}
                        </div>
                        <div className="text-slate-400 mt-1 text-sm">
                            {hasActiveFilters() ? 'Filtered Jobs' : 'Total Jobs'}
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-md p-4 text-center">
                        <div className="text-3xl font-bold text-accent">
                            {jobs.length}
                        </div>
                        <div className="text-slate-400 mt-1 text-sm">All Jobs</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-md p-4 text-center">
                        <div className="text-3xl font-bold text-accent">
                            {new Set(jobs.map(j => j.company).filter(Boolean)).size}
                        </div>
                        <div className="text-slate-400 mt-1 text-sm">Companies</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-md p-4 text-center">
                        <div className="text-3xl font-bold text-accent">
                            {new Set(jobs.map(j => j.source).filter(Boolean)).size}
                        </div>
                        <div className="text-slate-400 mt-1 text-sm">Sources</div>
                    </div>
                </div>

                {/* Scraping State */}
                {isAnyScraping && (
                    <div className="mb-6 p-6 bg-slate-900 border border-slate-800 rounded-lg animate-fade-in">
                        <div className="flex items-center justify-center gap-3">
                            <Zap className="animate-spin text-accent" size={24} />
                            <span className="text-slate-300 font-medium">
                                {scrapingFromSearch && 'Fetching latest jobs from LinkedIn, Naukri, Unstop, and Foundit...'}
                                {scrapingLinkedIn && 'Scraping LinkedIn jobs...'}
                                {scrapingNaukri && 'Scraping Naukri jobs...'}
                                {scrapingUnstop && 'Scraping Unstop jobs...'}
                                {scrapingFoundit && 'Scraping Foundit jobs...'}
                                {' This may take a moment.'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && !isAnyScraping && (
                    <div className="text-center py-16">
                        <Zap className="animate-spin mx-auto text-accent mb-4" size={48} />
                        <p className="text-slate-100 text-lg font-medium">Loading jobs...</p>
                        <p className="text-slate-400 text-sm mt-2">Please wait while we fetch the latest listings</p>
                    </div>
                )}

                {/* Empty State - No Jobs at All */}
                {!loading && !isAnyScraping && jobs.length === 0 && (
                    <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-lg shadow-md">
                        <Briefcase className="mx-auto text-slate-700 mb-4" size={64} />
                        <h3 className="text-xl font-semibold text-slate-100 mb-2">No Jobs Found</h3>
                        <p className="text-slate-400 mb-6">
                            Get started by scraping jobs from LinkedIn, Naukri, Unstop, or Foundit
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            <button
                                onClick={() => triggerScrape('linkedin')}
                                disabled={isAnyScraping}
                                className="auth-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Zap size={18} className={scrapingLinkedIn ? 'animate-spin' : ''} />
                                {scrapingLinkedIn ? 'Scraping...' : 'Scrape LinkedIn'}
                            </button>
                            <button
                                onClick={() => triggerScrape('naukri')}
                                disabled={isAnyScraping}
                                className="auth-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Zap size={18} className={scrapingNaukri ? 'animate-spin' : ''} />
                                {scrapingNaukri ? 'Scraping...' : 'Scrape Naukri'}
                            </button>
                            <button
                                onClick={() => triggerScrape('unstop')}
                                disabled={isAnyScraping}
                                className="auth-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Zap size={18} className={scrapingUnstop ? 'animate-spin' : ''} />
                                {scrapingUnstop ? 'Scraping...' : 'Scrape Unstop'}
                            </button>
                            <button
                                onClick={() => triggerScrape('foundit')}
                                disabled={isAnyScraping}
                                className="auth-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Zap size={18} className={scrapingFoundit ? 'animate-spin' : ''} />
                                {scrapingFoundit ? 'Scraping...' : 'Scrape Foundit'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State - No Filtered Results */}
                {!loading && !isAnyScraping && jobs.length > 0 && filteredJobs.length === 0 && (
                    <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-lg shadow-md">
                        <Search className="mx-auto text-slate-700 mb-4" size={64} />
                        <h3 className="text-xl font-semibold text-slate-100 mb-2">No Matching Jobs</h3>
                        <p className="text-slate-400 mb-4">
                            We couldn't find any jobs matching your search criteria
                        </p>
                        <button
                            onClick={clearAllFilters}
                            className="auth-button flex items-center gap-2 mx-auto"
                        >
                            <X size={18} />
                            Clear All Filters
                        </button>
                    </div>
                )}

                {/* Jobs Grid */}
                {!loading && !isAnyScraping && filteredJobs.length > 0 && (
                    <>
                        <div className="mb-4 text-sm text-slate-400">
                            Showing {filteredJobs.length} of {jobs.length} jobs
                            {sortBy !== 'date' && (
                                <span className="ml-2">
                                    • Sorted by {sortBy} ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-1 gap-4 animate-slide-up">
                            {filteredJobs.map(job => (
                                <JobCard key={job._id || job.id || Math.random()} job={job} />
                            ))}
                        </div>
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
                    <p>&copy; 2026 Caliber Job Scraper. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Dashboard;