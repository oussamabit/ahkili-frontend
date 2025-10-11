import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Phone, User, Heart, Search as SearchIcon, Settings as SettingsIcon, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useUserSync } from '../../hooks/useUserSync';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { backendUser } = useUserSync();
  const { t } = useTranslation();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-gray-800">Ahkili</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-700 hover:text-primary transition"
            >
              <Home className="w-5 h-5" />
              <span>{t('nav.home')}</span>
            </Link>
            
            <Link 
              to="/communities" 
              className="flex items-center space-x-2 text-gray-700 hover:text-primary transition"
            >
              <Users className="w-5 h-5" />
              <span>{t('nav.communities')}</span>
            </Link>

            <Link 
              to="/search" 
              className="flex items-center space-x-2 text-gray-700 hover:text-primary transition"
            >
              <SearchIcon className="w-5 h-5" />
              <span>{t('nav.search')}</span>
            </Link>
            
            {/* Admin Link for Admin/Moderator Users */}
            {currentUser && backendUser && (backendUser.role === 'admin' || backendUser.role === 'moderator') && (
              <Link 
                to="/admin" 
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition font-semibold"
              >
                <Shield className="w-5 h-5" />
                <span>Admin</span>
              </Link>
            )}
            
            <Link 
              to="/hotlines" 
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition font-semibold"
            >
              <Phone className="w-5 h-5" />
              <span>{t('nav.hotlines')}</span>
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <span className="text-gray-700 hidden md:block">
                  {currentUser.displayName || currentUser.email}
                </span>
                <Link to="/settings">
                  <button className="p-2 rounded-full hover:bg-gray-100 transition">
                    <SettingsIcon className="w-5 h-5 text-gray-700" />
                  </button>
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition"
              >
                {t('nav.login')}
              </Link>
            )}
            <Link 
              to="/profile" 
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <User className="w-6 h-6 text-gray-700" />
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-around py-3 border-t">
          <Link to="/" className="flex flex-col items-center text-gray-700">
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">{t('nav.home')}</span>
          </Link>
          <Link to="/communities" className="flex flex-col items-center text-gray-700">
            <Users className="w-5 h-5" />
            <span className="text-xs mt-1">{t('nav.communities')}</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center text-gray-700">
            <SearchIcon className="w-5 h-5" />
            <span className="text-xs mt-1">{t('nav.search')}</span>
          </Link>
          {/* Admin Link for Mobile */}
          {currentUser && backendUser && (backendUser.role === 'admin' || backendUser.role === 'moderator') && (
            <Link to="/admin" className="flex flex-col items-center text-purple-600">
              <Shield className="w-5 h-5" />
              <span className="text-xs mt-1">Admin</span>
            </Link>
          )}
          <Link to="/hotlines" className="flex flex-col items-center text-red-600">
            <Phone className="w-5 h-5" />
            <span className="text-xs mt-1">{t('nav.hotlines')}</span>
          </Link>
          <Link to="/settings" className="flex flex-col items-center text-gray-700">
            <SettingsIcon className="w-5 h-5" />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;