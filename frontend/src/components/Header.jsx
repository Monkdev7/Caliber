import { useState } from 'react';
import { Zap, Briefcase, Menu, X } from 'lucide-react';

export default function Header({ onScrape }) {
    const [showMenu, setShowMenu] = useState(false);
    const [isScaping, setIsScaping] = useState(false);

    const handleScrape = async (source) => {
        setIsScaping(true);
        await onScrape(source);
        setIsScaping(false);
        setShowMenu(false);
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                        <Briefcase className="text-white" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 hidden sm:block">Caliber</h1>
                </div>

                {/* Desktop Menu */}
                <nav className="hidden sm:flex items-center gap-4">
                    <button
                        onClick={() => handleScrape('linkedin')}
                        disabled={isScaping}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                        <Zap size={18} />
                        Scrape LinkedIn
                    </button>
                    <button
                        onClick={() => handleScrape('naukri')}
                        disabled={isScaping}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                        <Zap size={18} />
                        Scrape Naukri
                    </button>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="sm:hidden p-2"
                    onClick={() => setShowMenu(!showMenu)}
                    type="button"
                >
                    {showMenu ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {showMenu && (
                <div className="sm:hidden border-t border-gray-200 bg-gray-50">
                    <div className="px-4 py-4 space-y-3">
                        <button
                            onClick={() => handleScrape('linkedin')}
                            disabled={isScaping}
                            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                            type="button"
                        >
                            <Zap size={18} />
                            Scrape LinkedIn
                        </button>
                        <button
                            onClick={() => handleScrape('naukri')}
                            disabled={isScaping}
                            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                            type="button"
                        >
                            <Zap size={18} />
                            Scrape Naukri
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
