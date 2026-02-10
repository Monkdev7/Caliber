import { useState, useEffect } from 'react';
import { Search, Briefcase, Zap, Filter, Download } from 'lucide-react';
import axios from 'axios';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import FilterPanel from '../components/FilterPanel';
import '../App.css';

function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
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

    // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // Fetch jobs on mount
    useEffect(() => {
        fetchJobs();
    }, []);

    // Filter jobs when search term or filters change
    useEffect(() => {
        applyFilters();
    }, [searchTerm, filters, jobs]);

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('/api/jobs', {
                params: {
                    page: 1, // Example page number
                    limit: 60, // Example limit
                    search: searchTerm,
                    source: filters.source,
                    company: filters.company,
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
            setLoading(true);
            setError(null);

            // default fallback values
            const keyword = searchTerm || 'Software Engineer';
            const location = filters.location || 'Remote';

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
                fetchJobs();
            } else {
                setError('Scraping failed — server did not return success.');
            }
        } catch (err) {
            setError(`Failed to scrape ${source} jobs.`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = jobs;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                job =>
                    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.company?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Title filter
        if (filters.title) {
            filtered = filtered.filter(job =>
                job.title?.toLowerCase().includes(filters.title.toLowerCase())
            );
        }

        // Company filter
        if (filters.company) {
            filtered = filtered.filter(job =>
                job.company?.toLowerCase().includes(filters.company.toLowerCase())
            );
        }

        // Location filter
        if (filters.location) {
            filtered = filtered.filter(job =>
                job.location?.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Source filter
        if (filters.source !== 'all') {
            filtered = filtered.filter(job => job.source === filters.source);
        }

        setFilteredJobs(filtered);
    };

    const handleFilterChange = newFilters => {
        setFilters(newFilters);
    };

    const exportToCSV = () => {
        if (filteredJobs.length === 0) {
            alert('No jobs to export');
            return;
        }

        const headers = ['Title', 'Company', 'Location', 'Salary', 'Source', 'URL'];
        const csvContent = [
            headers.join(','),
            ...filteredJobs.map(job =>
                [
                    `"${job.title || ''}"`,
                    `"${job.company || ''}"`,
                    `"${job.location || ''}"`,
                    `"${job.salary || ''}"`,
                    `"${job.source || ''}"`,
                    `"${job.url || ''}"`,
                ].join(',')
            ),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jobs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <Header onScrape={triggerScrape} />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg animate-fade-in">
                        {error}
                    </div>
                )}

                {/* Search and Actions */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search
                                className="absolute left-3 top-3 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Search jobs by title or company..."
                                className="input-field pl-10"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Filter size={18} />
                            Filters
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Download size={18} />
                            Export
                        </button>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <FilterPanel
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="card text-center">
                        <div className="text-3xl font-bold text-blue-600">
                            {filteredJobs.length}
                        </div>
                        <div className="text-gray-600 mt-1">Jobs Found</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-3xl font-bold text-purple-600">
                            {new Set(jobs.map(j => j.source)).size}
                        </div>
                        <div className="text-gray-600 mt-1">Sources</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-3xl font-bold text-green-600">
                            {new Set(jobs.map(j => j.company)).size}
                        </div>
                        <div className="text-gray-600 mt-1">Companies</div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <Zap className="animate-spin mx-auto text-blue-600" size={32} />
                        <p className="text-gray-600 mt-4">Loading jobs...</p>
                    </div>
                )}

                {/* Jobs Grid */}
                {!loading && filteredJobs.length === 0 && (
                    <div className="text-center py-12">
                        <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-500 text-lg">
                            {jobs.length === 0
                                ? 'No jobs scraped yet. Click "Scrape" to get started!'
                                : 'No jobs match your filters.'}
                        </p>
                    </div>
                )}

                {!loading && filteredJobs.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 animate-slide-up">
                        {filteredJobs.map(job => (
                            <JobCard key={job._id || job.id} job={job} />
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-6 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
                    <p>&copy; 2024 Caliber Job Scraper. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Dashboard;
