import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useTranslation } from 'react-i18next';
import { Globe, LogOut, User, LayoutDashboard, Map, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const langRef = useRef(null);

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate(user ? '/dashboard' : '/', { replace: true });
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleLang = () => setIsLangOpen(!isLangOpen);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
    localStorage.setItem('i18nextLng', lng);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'gu', name: 'Gujarati' },
  ];

  const isHome = location.pathname === '/';
  const isDarkHeader = isHome && !isScrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 m-4 rounded-2xl flex items-center justify-between transition-all duration-300 ${
        isDarkHeader
          ? 'bg-black/25 backdrop-blur-md border border-white/15 shadow-2xl text-white'
          : 'bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-lg shadow-black/5 text-slate-800'
      }`}
    >
      <div className="flex items-center">
        <Link to={user ? '/dashboard' : '/'} onClick={handleLogoClick} className="flex items-center gap-2.5 group">
          <img src="/logo.png" alt="Trip Planner" className="h-9 w-auto" />
          <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent hidden sm:block tracking-tight italic">
            TRIP AI
          </span>
        </Link>
      </div>

      <div className="flex items-center space-x-2 md:space-x-6">
        {/* Language Multi-selector */}
        <div className="relative" ref={langRef}>
          <button
            onClick={toggleLang}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl transition-colors text-sm font-medium ${
              isDarkHeader ? 'text-white/90 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Globe size={18} className={isDarkHeader ? "text-blue-400" : "text-blue-600"} />
            <span className="uppercase">{i18n.language.split('-')[0]}</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-40 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl py-2 z-50 border border-slate-200/80 text-slate-800"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors hover:bg-blue-50 ${
                      i18n.language === lang.code ? 'text-blue-600 font-bold' : 'text-gray-700'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {user ? (
          <>
            <Link
              to="/my-trips"
              className={`hidden md:block transition-colors font-semibold text-sm ${
                isDarkHeader ? 'text-white/85 hover:text-white' : 'text-slate-700 hover:text-blue-600'
              }`}
            >
              {t('my_trips')}
            </Link>
            <Link
              to="/explore"
              className={`hidden md:block transition-colors font-semibold text-sm ${
                isDarkHeader ? 'text-white/85 hover:text-white' : 'text-slate-700 hover:text-blue-600'
              }`}
            >
              Explore
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className={`flex items-center p-0.5 rounded-full border-2 transition-all focus:outline-none ${
                  isDarkHeader ? 'border-white/40 hover:border-white' : 'border-slate-300 hover:border-blue-500'
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  {user.picture ? (
                    <img src={user.picture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                      {user.fullname?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden py-2 z-50 border border-slate-200/80 text-slate-800"
                  >
                    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 mb-1">
                      <p className="font-bold text-gray-900 truncate">{user.fullname || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email || 'No email'}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                    >
                      <LayoutDashboard size={16} className="text-blue-600" /> {t('home')}
                    </Link>

                    <Link
                      to="/my-trips"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex md:hidden items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                    >
                      <Map size={16} className="text-blue-600" /> {t('my_trips')}
                    </Link>

                    <Link
                      to="/account"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                    >
                      <User size={16} className="text-blue-600" /> Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1 cursor-pointer"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className={`px-4 py-2 text-sm font-semibold transition-colors ${
                isDarkHeader ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-blue-600'
              }`}
            >
              {t('login')}
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-600/25 transition-all text-sm font-bold"
            >
              {t('signup')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
