import React, { useState, useEffect } from 'react';
import { Music, VolumeX } from 'lucide-react';
import backgroundMusic from '../utils/backgroundMusic';
import soundEffects from '../utils/soundEffects';

const MusicToggle: React.FC = () => {
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);

  useEffect(() => {
    setIsMusicEnabled(backgroundMusic.isMusicEnabled());
    // Start playing music when component mounts
    backgroundMusic.play();
  }, []);

  const toggleMusic = () => {
    const newState = backgroundMusic.toggle();
    setIsMusicEnabled(newState);
    
    // Play a sound effect when toggling
    if (newState) {
      soundEffects.playMenuSelect();
    } else {
      soundEffects.playMenuCancel();
    }
  };

  return (
    <button
      onClick={toggleMusic}
      className="fixed top-4 left-4 z-50 nes-btn touch-button w-10 h-10 sm:w-12 sm:h-12"
      title={isMusicEnabled ? 'Turn music off' : 'Turn music on'}
    >
      {isMusicEnabled ? (
        <Music size={16} className="text-gameboy-lightest sm:w-4 sm:h-4" />
      ) : (
        <VolumeX size={16} className="text-gameboy-light sm:w-4 sm:h-4" />
      )}
    </button>
  );
};

export default MusicToggle;
