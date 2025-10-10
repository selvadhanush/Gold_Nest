import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, BarChart3, History, User } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/trade', icon: TrendingUp, label: 'Trade' },
    { path: '/charts', icon: BarChart3, label: 'Charts' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-500'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs mt-1">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;