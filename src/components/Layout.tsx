import React from 'react';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gameboy-dark flex flex-col">
      <div className="container-mobile mx-auto flex-1 mobile-p-3 sm:mobile-p-4">
        {children}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Layout;