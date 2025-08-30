import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gameboy-dark flex items-center justify-center">
      <div className="bg-gameboy-medium border-4 border-gameboy-border rounded-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-gameboy-lightest rounded-full animate-pulse">
          <div className="w-full h-full bg-gameboy-light rounded-full animate-bounce">
            <div className="w-6 h-6 bg-gameboy-dark rounded-full mx-auto pt-5"></div>
          </div>
        </div>
        <p className="text-gameboy-lightest font-pixel text-xs">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;