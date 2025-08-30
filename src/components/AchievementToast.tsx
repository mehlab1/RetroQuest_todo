import React, { useEffect, useState } from 'react';
import { Trophy, X } from 'lucide-react';

interface AchievementToastProps {
  message: string;
  type: 'badge' | 'level' | 'streak';
  onClose: () => void;
  duration?: number;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ 
  message, 
  type, 
  onClose, 
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show toast after a short delay
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Hide toast after duration
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'badge':
        return 'bg-yellow-600 border-yellow-400 text-yellow-100';
      case 'level':
        return 'bg-blue-600 border-blue-400 text-blue-100';
      case 'streak':
        return 'bg-green-600 border-green-400 text-green-100';
      default:
        return 'bg-gameboy-light border-gameboy-lightest text-gameboy-dark';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'badge':
        return '🏆';
      case 'level':
        return '⭐';
      case 'streak':
        return '🔥';
      default:
        return '🎉';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`${getTypeStyles()} border-2 rounded-lg p-4 shadow-lg max-w-sm`}>
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getIcon()}</div>
          <div className="flex-1">
            <h3 className="font-pixel text-sm font-bold mb-1">Achievement Unlocked!</h3>
            <p className="font-pixel text-xs">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-current hover:opacity-70 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementToast;
