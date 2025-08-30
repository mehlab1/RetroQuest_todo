import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gameboy-dark flex flex-col">
      <Header />
      <main className="flex-1 pb-20">
        <div className="max-w-md mx-auto bg-gameboy-medium min-h-screen border-l-4 border-r-4 border-gameboy-border">
          <div className="p-4">
            {children}
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;