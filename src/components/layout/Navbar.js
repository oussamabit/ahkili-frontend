import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Phone, Search, Bell, User, MoreHorizontal, Users, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useUserSync } from '../../hooks/useUserSync';
import * as api from '../../services/api';
import SearchDropdown from '../search/SearchDropdown';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { backendUser } = useUserSync();
  const { t } = useTranslation();
  const location = useLocation();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (currentUser?.id) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const fetchUnreadCount = async () => {
    try {
      const data = await api.getUnreadNotificationsCount(currentUser.id);
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const NavLink = ({ to, icon: Icon, label, special = false }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link 
        to={to}
        className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
          special 
            ? 'text-red-500 hover:text-red-600 hover:bg-red-50' 
            : isActive
            ? 'text-primary bg-primary/10'
            : 'text-gray-700 hover:text-primary hover:bg-primary/5'
        }`}
      >
        <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
          special ? 'animate-pulse' : ''
        }`} />
        <span className="font-medium">{label}</span>
        {isActive && !special && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-primary" />
        )}
        {!isActive && (
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 ${
            special ? 'bg-red-500' : 'bg-primary'
          } transition-all duration-300 group-hover:w-3/4`} />
        )}
      </Link>
    );
  };

  const BottomNavItem = ({ to, icon: Icon, label, center = false }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link 
        to={to}
        className={`flex flex-col items-center justify-center transition-all duration-300 ${
          center ? 'relative -top-4' : 'flex-1'
        }`}
      >
        <div className={`relative ${
          center 
            ? 'w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-xl shadow-red-500/50 flex items-center justify-center transform hover:scale-110 transition-transform duration-300' 
            : 'p-2'
        }`}>
          <Icon className={`${
            center 
              ? 'w-8 h-8 text-white' 
              : isActive
              ? 'w-6 h-6 text-primary'
              : 'w-6 h-6 text-gray-600 hover:text-primary transition-colors'
          }`} />
        </div>
        <span className={`${center ? 'hidden' : isActive ? 'text-xs mt-1 text-primary font-semibold' : 'text-xs mt-1 text-gray-600'}`}>{label}</span>
      </Link>
    );
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo - Mobile Only */}
            <Link to="/" className="flex items-center justify-center group lg:hidden">
              <div className="relative">
                <img
                  src="/logo/ahkili-01.png"
                  alt="Ahkili"
                  className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>

            {/* Desktop Navigation - LEFT SIDE */}
            <div className="hidden lg:flex items-center gap-2">
              <NavLink to="/" icon={Home} label={t('nav.home')} />
              <NavLink to="/hotlines" icon={Phone} label={t('nav.hotlines')} special={true} />
            </div>

            {/* Desktop Search Bar - CENTER */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-4">
              <SearchDropdown />
            </div>

            {/* Right Section - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/notifications" className="relative p-3 rounded-xl hover:bg-gray-100 transition-all duration-300 group">
                <Bell className="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform duration-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              <Link 
                to="/profile"
                className="p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all duration-300 group"
              >
                <User className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
              </Link>
            </div>

            {/* Mobile - More Menu with Dropdown */}
            <div className="lg:hidden relative">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className="relative p-3 rounded-xl hover:bg-gray-100 transition-all duration-300"
              >
                <MoreHorizontal className="w-6 h-6 text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {/* Dropdown Menu */}
              {moreMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setMoreMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50">
                    <Link
                      to="/notifications"
                      onClick={() => setMoreMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="relative">
                        <Bell className="w-5 h-5 text-gray-700" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-gray-700">Notifications</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setMoreMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-5 h-5 text-gray-700" />
                      <span className="font-medium text-gray-700">Settings</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl z-50 pb-safe">
        <div className="flex items-center justify-around h-20 px-2 relative">
          <BottomNavItem to="/" icon={Home} label={t('nav.home')} />
          <BottomNavItem to="/search" icon={Search} label={t('nav.search')} />
          <BottomNavItem to="/hotlines" icon={Phone} label="" center={true} />
          <BottomNavItem to="/communities" icon={Users} label={t('nav.communities')} />
          <BottomNavItem to="/profile" icon={User} label={t('nav.profile')} />
        </div>
      </div>
    </>
  );
};

export default Navbar;