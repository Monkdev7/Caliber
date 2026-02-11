import { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogOut, Mail } from 'lucide-react';

export default function UserProfileBadge({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
    setIsOpen(false);
  };

  // Get user initials for avatar
  const getInitials = fullName => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Badge Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        {/* Avatar Circle */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm font-semibold">
          {getInitials(user.fullName)}
        </div>

        {/* User Name (Desktop only) */}
        <span className="hidden md:block text-slate-100 text-sm font-medium max-w-[120px] truncate">
          {user.fullName || 'User'}
        </span>

        {/* Dropdown Arrow */}
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-lg shadow-lg overflow-hidden z-50">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-white text-base font-semibold">
                {getInitials(user.fullName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-100 font-semibold text-sm truncate">
                  {user.fullName || 'User'}
                </p>
                <p className="text-slate-400 text-xs truncate flex items-center gap-1">
                  <Mail size={12} />
                  {user.email}
                </p>
              </div>
            </div>

            {user.id && (
              <p className="text-slate-500 text-xs mt-1">ID: {user.id}</p>
            )}
          </div>

          {/* Action Section */}
          <div className="py-2">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-3 text-sm"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
