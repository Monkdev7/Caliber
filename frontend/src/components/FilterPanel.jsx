import { X } from 'lucide-react';

export default function FilterPanel({ filters, onFilterChange }) {
    const handleChange = (field, value) => {
        onFilterChange({
            ...filters,
            [field]: value
        });
    };

    const hasActiveFilters = filters.company || filters.location || (filters.source && filters.source !== 'all');

    const clearAllFilters = () => {
        onFilterChange({
            company: '',
            location: '',
            source: 'all',
        });
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-md p-5 mb-6 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Source Filter */}
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Source
                    </label>
                    <select
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        value={filters.source || 'all'}
                        onChange={(e) => handleChange('source', e.target.value)}
                    >
                        <option value="all">All Sources</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="naukri">Naukri</option>
                    </select>
                </div>

                {/* Company Filter */}
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Company
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Google, Microsoft..."
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        value={filters.company || ''}
                        onChange={(e) => handleChange('company', e.target.value)}
                    />
                </div>

                {/* Location Filter */}
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Location
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Remote, Bangalore..."
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        value={filters.location || ''}
                        onChange={(e) => handleChange('location', e.target.value)}
                    />
                </div>
            </div>

            {/* Clear All Filters Button */}
            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                    <button
                        onClick={clearAllFilters}
                        className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm"
                    >
                        <X size={16} />
                        Reset All Filters
                    </button>
                </div>
            )}
        </div>
    );
}
