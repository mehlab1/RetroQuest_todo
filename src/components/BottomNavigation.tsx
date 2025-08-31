import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, BarChart3, User } from 'lucide-react';
import soundEffects from '../utils/soundEffects';

const BottomNavigation: React.FC = () => {
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/history', icon: BarChart3, label: 'Stats' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const handleNavClick = () => {
    soundEffects.playMenuSelect();
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gameboy-dark border-t-4 border-gameboy-border">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={handleNavClick}
              className={({ isActive }) => `
                flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-gameboy-light text-gameboy-dark' 
                  : 'text-gameboy-lightest hover:bg-gameboy-medium'
                }
              `}
            >
              <div className="w-8 h-8 border-2 border-current rounded flex items-center justify-center">
                <Icon size={16} />
              </div>
              <span className="text-xs font-pixel">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;