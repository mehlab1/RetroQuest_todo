import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Power } from 'lucide-react';
import soundEffects from '../utils/soundEffects';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const getCurrentSprite = () => {
    if (!user?.pokemonPet) return '🕹️';
    
    const { level } = user;
    const evolutionLevels = user.pokemonPet.evolutionLevels || { stage2: 16, stage3: 32 };
    
    if (level >= evolutionLevels.stage3) {
      return user.pokemonPet.spriteStage3;
    } else if (level >= evolutionLevels.stage2) {
      return user.pokemonPet.spriteStage2;
    } else {
      return user.pokemonPet.spriteStage1;
    }
  };

  const handleLogout = () => {
    soundEffects.playMenuCancel();
    logout();
  };

  return (
    <header className="bg-gameboy-dark border-b-4 border-gameboy-border">
      <div className="container-mobile mx-auto">
        <div className="flex items-center justify-between mobile-p-3 sm:mobile-p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="nes-avatar is-medium is-rounded">
              <img
                src={getCurrentSprite()}
                alt={user?.pokemonPet?.name || 'Pokemon'}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '🕹️'; // Fallback emoji
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-pixel text-xs sm:text-sm text-gameboy-lightest truncate">
                {user?.username || 'Trainer'}
              </p>
              <p className="font-pixel text-xs text-gameboy-light truncate">
                Lv.{user?.level || 1} • {user?.points || 0}pts
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="nes-btn is-error touch-button w-8 h-8 sm:w-10 sm:h-10"
            title="Logout"
          >
            <Power size={12} className="text-gameboy-lightest sm:w-3 sm:h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;