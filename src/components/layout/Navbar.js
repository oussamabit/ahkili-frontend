import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Users, Phone, User, Heart, Search as SearchIcon } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

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
              <span>Home</span>
            </Link>
            
            <Link 
              to="/communities" 
              className="flex items-center space-x-2 text-gray-700 hover:text-primary transition"
            >
              <Users className="w-5 h-5" />
              <span>Communities</span>
            </Link>

            <Link 
              to="/search" 
              className="flex items-center space-x-2 text-gray-700 hover:text-primary transition"
            >
              <SearchIcon className="w-5 h-5" />
              <span>Search</span>
            </Link>
            
            <Link 
              to="/hotlines" 
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition font-semibold"
            >
              <Phone className="w-5 h-5" />
              <span>Hotlines</span>
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <span className="text-gray-700 hidden md:block">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition"
              >
                Login
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
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/communities" className="flex flex-col items-center text-gray-700">
            <Users className="w-5 h-5" />
            <span className="text-xs mt-1">Communities</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center text-gray-700">
            <SearchIcon className="w-5 h-5" />
            <span className="text-xs mt-1">Search</span>
          </Link>
          <Link to="/hotlines" className="flex flex-col items-center text-red-600">
            <Phone className="w-5 h-5" />
            <span className="text-xs mt-1">Hotlines</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center text-gray-700">
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;