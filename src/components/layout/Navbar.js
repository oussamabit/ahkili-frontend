import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Phone, User, Heart, Search as SearchIcon, Settings as SettingsIcon, Shield, Menu, X, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useUserSync } from '../../hooks/useUserSync';
import * as api from '../../services/api';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { backendUser } = useUserSync();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (currentUser?.id) {
      fetchUnreadCount();
      // Poll every 30 seconds
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

  const NavLink = ({ to, icon: Icon, label, special = false }) => (
    <Link 
      to={to}
      onClick={() => setMobileMenuOpen(false)}
      className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
        special 
          ? 'text-red-500 hover:text-red-600 hover:bg-red-50' 
          : 'text-gray-700 hover:text-primary hover:bg-primary/5'
      }`}
    >
      <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
        special ? 'animate-pulse' : ''
      }`} />
      <span className="font-medium">{label}</span>
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 ${
        special ? 'bg-red-500' : 'bg-primary'
      } transition-all duration-300 group-hover:w-3/4`} />
    </Link>
  );

  const BottomNavItem = ({ to, icon: Icon, label, special = false, center = false, showBadge = false, badgeCount = 0 }) => (
    <Link 
      to={to}
      className={`flex flex-col items-center justify-center transition-all duration-300 ${
        center 
          ? 'relative -top-4' 
          : 'flex-1'
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
            : 'w-6 h-6 text-gray-600 hover:text-primary transition-colors'
        } ${special && !center ? 'animate-pulse' : ''}`} />
        {showBadge && badgeCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {badgeCount > 9 ? '9+' : badgeCount}
          </span>
        )}
      </div>
      <span className={`${
        center ? 'hidden' : 'text-xs mt-1 text-gray-600'
      }`}>{label}</span>
    </Link>
  );

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-20">
            {/* Logo with Animation */}
            <Link to="/" className="flex items-center justify-center group">
              <div className="relative">
                <img
                  src="/logo/ahkili-01.png"
                  alt="Ahkili Logo"
                  className="w-24 h-24 object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              <NavLink to="/" icon={Home} label={t('nav.home')} />
              <NavLink to="/communities" icon={Users} label={t('nav.communities')} />
              <NavLink to="/search" icon={SearchIcon} label={t('nav.search')} />
              
              {currentUser && backendUser && (backendUser.role === 'admin' || backendUser.role === 'moderator') && (
                <Link 
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-all duration-300 group"
                >
                  <Shield className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-semibold">Admin</span>
                </Link>
              )}
              
              <NavLink to="/hotlines" icon={Phone} label={t('nav.hotlines')} special={true} />
            </div>

            {/* User Section */}
            <div className="hidden lg:flex items-center gap-3">
              {currentUser ? (
                <>
                  {/* Notifications Bell */}
                  <Link to="/notifications" className="relative p-3 rounded-xl hover:bg-gray-100 transition-all duration-300 group">
                    <Bell className="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform duration-300" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>

                  <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary/5 to-transparent rounded-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-gray-700 font-medium text-sm max-w-[150px] truncate">
                      {currentUser.displayName || currentUser.email}
                    </span>
                  </div>
                  <Link to="/settings">
                    <button className="p-3 rounded-xl hover:bg-gray-100 transition-all duration-300 group">
                      <SettingsIcon className="w-5 h-5 text-gray-700 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                  </Link>
                  <button
                    onClick={logout}
                    className="px-5 py-2.5 text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 font-medium"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <Link 
                  to="/login"
                  className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
                >
                  {t('nav.login')}
                </Link>
              )}
              <Link 
                to="/profile"
                className="p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all duration-300 group"
              >
                <User className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
              </Link>
            </div>

            {/* Mobile - Only Logo visible */}
            <div className="lg:hidden w-10" />
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </nav>

      {/* Mobile Bottom Navigation Bar - TikTok Style */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl z-50 pb-safe">
        <div className="flex items-center justify-around h-20 px-2 relative">
          <BottomNavItem to="/" icon={Home} label={t('nav.home')} />
          <BottomNavItem to="/communities" icon={Users} label={t('nav.communities')} />
          <BottomNavItem to="/hotlines" icon={Phone} label="" center={true} special={true} />
          <BottomNavItem 
            to="/notifications" 
            icon={Bell} 
            label={t('nav.notifications')} 
            showBadge={true}
            badgeCount={unreadCount}
          />
          <button 
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            className="flex flex-col items-center justify-center flex-1"
          >
            <Menu className="w-6 h-6 text-gray-600" />
            <span className="text-xs mt-1 text-gray-600">More</span>
          </button>
        </div>

        {/* More Menu Popup */}
        {moreMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
              onClick={() => setMoreMenuOpen(false)}
            />
            <div className="absolute bottom-full right-0 left-0 mb-2 mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex flex-col">
                <Link 
                  to="/profile"
                  onClick={() => setMoreMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  <User className="w-5 h-5 text-primary" />
                  <span className="font-medium text-gray-700">Profile</span>
                </Link>
                
                <Link 
                  to="/settings"
                  onClick={() => setMoreMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  <SettingsIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Settings</span>
                </Link>

                <Link 
                  to="/notifications"
                  onClick={() => setMoreMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 relative"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute right-6 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {currentUser && backendUser && (backendUser.role === 'admin' || backendUser.role === 'moderator') && (
                  <Link 
                    to="/admin"
                    onClick={() => setMoreMenuOpen(false)}
                    className="flex items-center gap-3 px-6 py-4 hover:bg-purple-50 transition-colors border-b border-gray-100"
                  >
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-purple-600">Admin Panel</span>
                  </Link>
                )}

                {currentUser ? (
                  <>
                    <div className="flex items-center gap-3 px-6 py-3 bg-primary/5 border-b border-gray-100">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-gray-700 font-medium truncate">
                        {currentUser.displayName || currentUser.email}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMoreMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-6 py-4 hover:bg-red-50 transition-colors text-red-600"
                    >
                      <X className="w-5 h-5" />
                      <span className="font-medium">{t('nav.logout')}</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login"
                    onClick={() => setMoreMenuOpen(false)}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary to-primary/80 text-white font-medium"
                  >
                    <User className="w-5 h-5" />
                    <span>{t('nav.login')}</span>
                  </Link>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;