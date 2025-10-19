import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Phone, User, Heart, Search as SearchIcon, Settings as SettingsIcon, Shield, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useUserSync } from '../../hooks/useUserSync';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { backendUser } = useUserSync();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-screen opacity-100 pb-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
            <NavLink to="/" icon={Home} label={t('nav.home')} />
            <NavLink to="/communities" icon={Users} label={t('nav.communities')} />
            <NavLink to="/search" icon={SearchIcon} label={t('nav.search')} />
            
            {currentUser && backendUser && (backendUser.role === 'admin' || backendUser.role === 'moderator') && (
              <Link 
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-purple-600 hover:bg-purple-50 transition-all"
              >
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Admin</span>
              </Link>
            )}
            
            <NavLink to="/hotlines" icon={Phone} label={t('nav.hotlines')} special={true} />
            <NavLink to="/settings" icon={SettingsIcon} label="Settings" />
            <NavLink to="/profile" icon={User} label="Profile" />

            {currentUser ? (
              <div className="mt-2 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 px-4 py-2 mb-2 bg-primary/5 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-700 font-medium">
                    {currentUser.displayName || currentUser.email}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-600 hover:text-white transition-all font-medium"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 px-4 py-3 bg-gradient-to-r from-primary to-primary/80 text-white text-center rounded-xl hover:shadow-lg transition-all font-medium"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </nav>
  );
};

export default Navbar;