import { useState, useEffect } from 'react';
import { Search, Briefcase, Zap, Filter, Download, X, ArrowUpDown, CheckCircle } from 'lucide-react';
import axios from 'axios';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import FilterPanel from '../components/FilterPanel';
import '../App.css';

function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [scrapingLinkedIn, setScrapingLinkedIn] = useState(false);
    const [scrapingNaukri, setScrapingNaukri] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('date'); // 'date', 'title', 'company', 'location'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
    const [filters, setFilters] = useState({
        title: '',
        company: '',
        location: '',
        source: '',
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
    }, [searchTerm, filters, jobs, sortBy, sortOrder]);

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
                setError('Invalid data structure received.');
            }
        } catch (err) {
            setError('Failed to fetch jobs. Please try again later.');
            console.error('Error fetching jobs:', err);
        } finally {
            setLoading(false);
        }
    };

    const triggerScrape = async source => {
        try {
            // Set scraping state for specific source only
            if (source === 'linkedin') {
                setScrapingLinkedIn(true);
            } else if (source === 'naukri') {
                setScrapingNaukri(true);
            }

            setError(null);
            setSuccess(null);

            // Use search term or default values
            const keyword = searchTerm || 'Software Engineer';
            const location = 'Remote';

            let response;

            if (source === 'linkedin') {
                response = await axios.post(`/api/scrape/linkedin`, {
                    keyword,
                    location,
                });
            } else if (source === 'naukri') {
                response = await axios.post(`/api/scrape/naukri`, {
                    keyword,
                    location,
                });
            }

            if (response.data.success) {
                // Clear all filters and search
                setSearchTerm('');
                setFilters({
                    title: '',
                    company: '',
                    location: '',
                    source: '',
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
            if (source === 'linkedin') {
                setScrapingLinkedIn(false);
            } else if (source === 'naukri') {
                setScrapingNaukri(false);
            }
        }
    };

    const applyFiltersAndSort = () => {
        let filtered = [...jobs];

        // Global search filter (searches title, company, and location)
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(
                job => {
                    const title = (job.title || job.job_title || '').toLowerCase();
                    const company = (job.company || job.company_name || '').toLowerCase();
                    const location = (job.location || '').toLowerCase();

                    return title.includes(searchLower) ||
                        company.includes(searchLower) ||
                        location.includes(searchLower);
                }
            );
        }

        // Title filter
        if (filters.title) {
            const filterLower = filters.title.toLowerCase();
            filtered = filtered.filter(job => {
                const title = (job.title || job.job_title || '').toLowerCase();
                return title.includes(filterLower);
            });
        }

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
                    compareA = new Date(a.scraped_at || a.posted_date || 0);
                    compareB = new Date(b.scraped_at || b.posted_date || 0);
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
        setSearchTerm('');
        setFilters({
            title: '',
            company: '',
            location: '',
            source: '',
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
        return searchTerm || filters.title || filters.company || filters.location || filters.source;
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
                const jobUrl = job.url || job.job_url || job.link || 'N/A';

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

    const isAnyScraping = scrapingLinkedIn || scrapingNaukri;

    return (
        <div className="min-h-screen bg-slate-950">
            <Header
                onScrape={triggerScrape}
                scrapingLinkedIn={scrapingLinkedIn}
                scrapingNaukri={scrapingNaukri}
            />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
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
                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <Search
                                className="absolute left-3 top-3 text-slate-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Search by job title, company, or location..."
                                className="auth-input pl-10 pr-10"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-100"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-');
                                setSortBy(field);
                                setSortOrder(order);
                            }}
                            className="auth-input"
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
                            className={`auth-button flex items-center gap-2 ${showFilters ? 'bg-accent/90' : ''}`}
                        >
                            <Filter size={18} />
                            Filters
                            {hasActiveFilters() && !searchTerm && (
                                <span className="bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    !
                                </span>
                            )}
                        </button>

                        {/* Clear Filters */}
                        {hasActiveFilters() && (
                            <button
                                onClick={clearAllFilters}
                                className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
                                title="Clear all filters"
                            >
                                <X size={18} />
                                Clear
                            </button>
                        )}

                        {/* Export Button */}
                        <button
                            onClick={exportToCSV}
                            disabled={filteredJobs.length === 0}
                            className="auth-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download size={18} />
                            Export
                        </button>
                    </div>

                    {/* Active Filters Indicator */}
                    {hasActiveFilters() && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {searchTerm && (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-full text-sm">
                                    Search: "{searchTerm}"
                                    <button onClick={() => setSearchTerm('')}>
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                            {filters.title && (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-full text-sm">
                                    Title: "{filters.title}"
                                </span>
                            )}
                            {filters.company && (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-full text-sm">
                                    Company: "{filters.company}"
                                </span>
                            )}
                            {filters.location && (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-full text-sm">
                                    Location: "{filters.location}"
                                </span>
                            )}
                            {filters.source && (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-full text-sm">
                                    Source: {filters.source}
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
                                {scrapingLinkedIn && 'Scraping LinkedIn jobs...'}
                                {scrapingNaukri && 'Scraping Naukri jobs...'}
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
                            Get started by scraping jobs from LinkedIn or Naukri
                        </p>
                        <div className="flex justify-center gap-4">
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
            <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
                    <p>&copy; 2026 Caliber Job Scraper. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Dashboard;
