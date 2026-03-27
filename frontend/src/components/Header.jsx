import { useEffect, useState } from 'react';
import { Zap, Briefcase, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCachedUser, getSession, logout } from '../lib/auth';
import UserProfileBadge from './UserProfileBadge';

export default function Header({
  onScrape,
  scrapingLinkedIn = false,
  scrapingNaukri = false,
  scrapingUnstop = false,
  scrapingFoundit = false,
  showScrapers = true,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => getCachedUser());
  const isAuthenticated = !!user;

  const isAnyScraping =
    scrapingLinkedIn || scrapingNaukri || scrapingUnstop || scrapingFoundit;

  useEffect(() => {
    let isMounted = true;
    const loadUser = async () => {
      try {
        const sessionUser = await getSession();
        if (isMounted) setUser(sessionUser);
      } catch (error) {
        if (isMounted) setUser(null);
      }
    };
    loadUser();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      navigate('/', { replace: true });
      setShowMenu(false);
    }
  };

  const navLinkClass =
    'text-slate-400 hover:text-slate-100 font-medium transition-colors';

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
        <nav className="hidden sm:flex items-center gap-4">
          {/* 1. Dashboard Link (Shown if logged in and NOT already on dashboard) */}
          {isAuthenticated && location.pathname !== '/dashboard' && (
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 ${navLinkClass}`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
          )}

          {/* 2. Scrape Buttons (Only shown if showScrapers is true) */}
          {showScrapers && (
            <div className="flex items-center gap-2 border-r border-slate-800 pr-4 mr-2">
              {/* Foundit button */}
              <button
                onClick={() => onScrape('linkedin')}
                disabled={isAnyScraping}
                className="auth-button px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Zap
                  size={14}
                  className={scrapingLinkedIn ? 'animate-spin' : ''}
                />
                LinkedIn
              </button>
              {/* Naukri button */}
              <button
                onClick={() => onScrape('naukri')}
                disabled={isAnyScraping}
                className="auth-button px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Zap
                  size={14}
                  className={scrapingNaukri ? 'animate-spin' : ''}
                />
                Naukri
              </button>
              {/* Unstop button */}
              <button
                onClick={() => onScrape('unstop')}
                disabled={isAnyScraping}
                className="auth-button px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Zap
                  size={14}
                  className={scrapingNaukri ? 'animate-spin' : ''}
                />
                Unstop
              </button>
              {/* Foundit button */}
              <button
                onClick={() => onScrape('foundit')}
                disabled={isAnyScraping}
                className="auth-button px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Zap
                  size={14}
                  className={scrapingFoundit ? 'animate-spin' : ''}
                />
                Foundit
              </button>
            </div>
          )}

          {/* 3. Auth Section */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/login" className={navLinkClass}>
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <UserProfileBadge user={user} onLogout={handleLogout} />
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="sm:hidden p-2 text-slate-400"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="sm:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-4">
          {isAuthenticated && (
            <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                {user.fullName?.[0] || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-slate-100 font-semibold truncate">
                  {user.fullName}
                </p>
                <p className="text-slate-400 text-xs truncate">{user.email}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="w-full p-3 bg-slate-900 text-slate-100 rounded-lg text-center"
                onClick={() => setShowMenu(false)}
              >
                Go to Dashboard
              </Link>
            )}

            {showScrapers && (
              <>
                <button
                  onClick={() => {
                    onScrape('linkedin');
                    setShowMenu(false);
                  }}
                  className="w-full p-3 bg-accent text-white rounded-lg"
                >
                  Scrape LinkedIn
                </button>
                <button
                  onClick={() => {
                    onScrape('naukri');
                    setShowMenu(false);
                  }}
                  className="w-full p-3 bg-accent text-white rounded-lg"
                >
                  Scrape Naukri
                </button>
              </>
            )}

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="w-full p-3 text-center text-slate-100"
                  onClick={() => setShowMenu(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="w-full p-3 bg-accent text-white rounded-lg text-center"
                  onClick={() => setShowMenu(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full p-3 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center gap-2"
              >
                <LogOut size={18} /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
