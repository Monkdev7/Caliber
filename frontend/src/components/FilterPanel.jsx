import { X } from 'lucide-react';

export default function FilterPanel({ filters, onFilterChange }) {
    const handleChange = (field, value) => {
        onFilterChange({
            ...filters,
            [field]: value
        });
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-md p-4 mb-6 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Job Title
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Developer"
                        className="auth-input"
                        value={filters.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Company
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Google"
                        className="auth-input"
                        value={filters.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Location
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., New York"
                        className="auth-input"
                        value={filters.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Source
                    </label>
                    <select
                        className="auth-input"
                        value={filters.source}
                        onChange={(e) => handleChange('source', e.target.value)}
                    >
                        <option value="all">All Sources</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="naukri">Naukri</option>
                    </select>
                </div>
            </div>

            {/* Clear Filters Button */}
            {(filters.title || filters.company || filters.location || filters.source !== 'all') && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                    <button
                        onClick={() => onFilterChange({
                            title: '',
                            company: '',
                            location: '',
                            source: 'all'
                        })}
                        className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm"
                    >
                        <X size={16} />
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}
