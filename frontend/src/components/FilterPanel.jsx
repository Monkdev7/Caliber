import { X } from 'lucide-react';

export default function FilterPanel({ filters, onFilterChange }) {
    const handleChange = (field, value) => {
        onFilterChange({
            ...filters,
            [field]: value
        });
    };

    return (
        <div className="card mb-6 border-t-4 border-blue-500 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Job Title
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Developer"
                        className="input-field"
                        value={filters.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Google"
                        className="input-field"
                        value={filters.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., New York"
                        className="input-field"
                        value={filters.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Source
                    </label>
                    <select
                        className="input-field"
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
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => onFilterChange({
                            title: '',
                            company: '',
                            location: '',
                            source: 'all'
                        })}
                        className="btn-secondary flex items-center gap-2 text-sm"
                    >
                        <X size={16} />
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}
