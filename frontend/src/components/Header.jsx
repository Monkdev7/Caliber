import { useState } from 'react';
import { Zap, Briefcase, Menu, X, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { mockLogout, getCurrentUser } from '../lib/auth';
import UserProfileBadge from './UserProfileBadge';

export default function Header({
  onScrape,
  scrapingLinkedIn = false,
  scrapingNaukri = false,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const isAnyScraping = scrapingLinkedIn || scrapingNaukri;

  // TEMPORARY: Get mock user data to check if authenticated
  // TODO: Replace with proper auth state management when backend is ready
  const user = getCurrentUser();
  const isAuthenticated = !!user;

  const handleScrape = async source => {
    await onScrape(source);
    setShowMenu(false);
  };

  const handleLogout = () => {
    // TEMPORARY: Mock logout - clear localStorage and redirect
    mockLogout();
    navigate('/', { replace: true });
    setShowMenu(false);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="bg-accent p-2 rounded-lg">
            <Briefcase className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 hidden sm:block">
            Caliber
          </h1>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => handleScrape('linkedin')}
            disabled={isAnyScraping}
            className="auth-button flex items-center justify-center gap-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            title={
              scrapingLinkedIn
                ? 'Scraping LinkedIn...'
                : isAnyScraping
                  ? 'Another scrape in progress'
                  : 'Scrape LinkedIn jobs'
            }
          >
            <Zap size={18} className={scrapingLinkedIn ? 'animate-spin' : ''} />
            <span>{scrapingLinkedIn ? 'Scraping...' : 'Scrape LinkedIn'}</span>
          </button>
          <button
            onClick={() => handleScrape('naukri')}
            disabled={isAnyScraping}
            className="auth-button flex items-center justify-center gap-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            title={
              scrapingNaukri
                ? 'Scraping Naukri...'
                : isAnyScraping
                  ? 'Another scrape in progress'
                  : 'Scrape Naukri jobs'
            }
          >
            <Zap size={18} className={scrapingNaukri ? 'animate-spin' : ''} />
            <span>{scrapingNaukri ? 'Scraping...' : 'Scrape Naukri'}</span>
          </button>

          {/* User Profile Badge - Only show when authenticated */}
          {isAuthenticated && <UserProfileBadge />}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden p-2 text-slate-400 hover:text-slate-100"
          onClick={() => setShowMenu(!showMenu)}
          type="button"
          aria-label="Toggle menu"
        >
          {showMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="sm:hidden border-t border-slate-800 bg-slate-950">
          <div className="px-4 py-4 space-y-3">
            {/* User Info in Mobile Menu */}
            {isAuthenticated && user && (
              <div className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-white text-sm font-semibold">
                    {user.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-100 font-semibold text-sm truncate">
                      {user.name || 'User'}
                    </p>
                    <p className="text-slate-400 text-xs truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => handleScrape('linkedin')}
              disabled={isAnyScraping}
              className="w-full auth-button flex items-center justify-center gap-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              type="button"
            >
              <Zap
                size={18}
                className={scrapingLinkedIn ? 'animate-spin' : ''}
              />
              <span>
                {scrapingLinkedIn ? 'Scraping...' : 'Scrape LinkedIn'}
              </span>
            </button>
            <button
              onClick={() => handleScrape('naukri')}
              disabled={isAnyScraping}
              className="w-full auth-button flex items-center justify-center gap-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              type="button"
            >
              <Zap size={18} className={scrapingNaukri ? 'animate-spin' : ''} />
              <span>{scrapingNaukri ? 'Scraping...' : 'Scrape Naukri'}</span>
            </button>
            <Link
              to="/"
              className="w-full px-6 py-3 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              onClick={() => setShowMenu(false)}
            >
              Back to Home
            </Link>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
