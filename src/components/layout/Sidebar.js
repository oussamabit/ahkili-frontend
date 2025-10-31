// components/layout/Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Shield, 
  Settings, 
  LogOut, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Briefcase
} from 'lucide-react';

const Sidebar = ({ currentUser, backendUser, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems = [
    { path: '/', icon: Home, label: 'Home', show: true },
    { 
      path: '/communities', 
      icon: Users, 
      label: 'Communities', 
      show: true 
    },
    { 
      path: '/admin', 
      icon: Shield, 
      label: 'Admin Panel', 
      show: backendUser && (backendUser.role === 'admin' || backendUser.role === 'moderator'),
      badge: 'Admin'
    }
  ];

  const actionItems = [
    { 
      path: '/create-community', 
      icon: Briefcase, 
      label: 'Create Community', 
      show: backendUser && (backendUser.role === 'doctor' || backendUser.role === 'admin'),
      special: true
    },
    { 
      path: '/create-post', 
      icon: Plus, 
      label: 'Create Post', 
      show: true,
      special: true
    }
  ];

  const bottomItems = [
    { path: '/settings', icon: Settings, label: 'Settings', show: true }
  ];

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    
    return (
      <Link
        to={item.path}
        className={`
          group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
          ${item.special 
            ? 'bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary' 
            : 'hover:bg-gray-100 text-gray-700'
          }
          ${collapsed ? 'justify-center' : ''}
        `}
      >
        <Icon className={`
          w-5 h-5 transition-transform duration-300 group-hover:scale-110
          ${item.special ? 'text-primary' : ''}
        `} />
        {!collapsed && (
          <>
            <span className="font-medium flex-1">{item.label}</span>
            {item.badge && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs font-semibold rounded-full">
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );
  };

  return (
    <aside className={`
      hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 h-screen sticky top-0
      ${collapsed ? 'w-20' : 'w-64'}
    `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logo/ahkili-01.png"
                alt="Ahkili"
                className="w-10 h-10 object-contain"
              />
              <span className="font-bold text-xl text-gray-800">Ahkili</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!collapsed && currentUser && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">
                {currentUser.displayName?.[0]?.toUpperCase() || currentUser.email[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {currentUser.displayName || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {backendUser?.role || 'Member'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="space-y-1">
          {navigationItems.filter(item => item.show).map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200" />

        {/* Action Items */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </p>
          )}
          {actionItems.filter(item => item.show).map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </div>
      </nav>

      {/* Bottom Items */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        {bottomItems.filter(item => item.show).map((item, index) => (
          <NavItem key={index} item={item} />
        ))}
        
        <button
          onClick={onLogout}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
            text-red-600 hover:bg-red-50
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;