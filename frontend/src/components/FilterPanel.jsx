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
            <div className="max-w-xs">
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Filter by Source
                    </label>
                    <select
                        className="auth-input w-full"
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
            {filters.source !== 'all' && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                    <button
                        onClick={() => onFilterChange({
                            ...filters,
                            source: 'all'
                        })}
                        className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm"
                    >
                        <X size={16} />
                        Clear Source Filter
                    </button>
                </div>
            )}
        </div>
    );
}
