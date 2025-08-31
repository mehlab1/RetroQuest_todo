import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import soundEffects from '../utils/soundEffects';

const SoundToggle: React.FC = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  useEffect(() => {
    // Initialize with current sound state
    setIsSoundEnabled(soundEffects.isSoundEnabled());
  }, []);

  const toggleSound = () => {
    const newState = soundEffects.toggleSound();
    setIsSoundEnabled(newState);
    
    // Play a sound to confirm the toggle (if sound is being turned on)
    if (newState) {
      soundEffects.playMenuSelect();
    }
  };

  return (
    <button
      onClick={toggleSound}
      className="fixed top-4 right-4 z-50 w-10 h-10 bg-gameboy-medium border-2 border-gameboy-border rounded-full flex items-center justify-center hover:bg-gameboy-light transition-colors duration-200"
      title={isSoundEnabled ? 'Turn sound off' : 'Turn sound on'}
    >
      {isSoundEnabled ? (
        <Volume2 size={16} className="text-gameboy-lightest" />
      ) : (
        <VolumeX size={16} className="text-gameboy-light" />
      )}
    </button>
  );
};

export default SoundToggle;
