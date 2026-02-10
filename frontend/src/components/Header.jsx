import { useState } from 'react';
import { Zap, Briefcase, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ onScrape, scrapingLinkedIn = false, scrapingNaukri = false }) {
  const [showMenu, setShowMenu] = useState(false);
  const isAnyScraping = scrapingLinkedIn || scrapingNaukri;

  const handleScrape = async source => {
    await onScrape(source);
    setShowMenu(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <Briefcase className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 hidden sm:block">
            Caliber
          </h1>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden sm:flex items-center gap-4">
          <button
            onClick={() => handleScrape('linkedin')}
            disabled={isAnyScraping}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title={scrapingLinkedIn ? 'Scraping LinkedIn...' : isAnyScraping ? 'Another scrape in progress' : 'Scrape LinkedIn jobs'}
          >
            <Zap size={18} className={scrapingLinkedIn ? 'animate-spin' : ''} />
            {scrapingLinkedIn ? 'Scraping...' : 'Scrape LinkedIn'}
          </button>
          <button
            onClick={() => handleScrape('naukri')}
            disabled={isAnyScraping}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title={scrapingNaukri ? 'Scraping Naukri...' : isAnyScraping ? 'Another scrape in progress' : 'Scrape Naukri jobs'}
          >
            <Zap size={18} className={scrapingNaukri ? 'animate-spin' : ''} />
            {scrapingNaukri ? 'Scraping...' : 'Scrape Naukri'}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden p-2"
          onClick={() => setShowMenu(!showMenu)}
          type="button"
          aria-label="Toggle menu"
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
              disabled={isAnyScraping}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              <Zap size={18} className={scrapingLinkedIn ? 'animate-spin' : ''} />
              {scrapingLinkedIn ? 'Scraping...' : 'Scrape LinkedIn'}
            </button>
            <button
              onClick={() => handleScrape('naukri')}
              disabled={isAnyScraping}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              <Zap size={18} className={scrapingNaukri ? 'animate-spin' : ''} />
              {scrapingNaukri ? 'Scraping...' : 'Scrape Naukri'}
            </button>
            <Link
              to="/"
              className="w-full btn-secondary flex items-center justify-center gap-2"
              onClick={() => setShowMenu(false)}
            >
              Back to Home
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
