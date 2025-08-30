import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Power } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const getCurrentSprite = () => {
    if (!user?.pokemonPet) return '🎮';
    
    const level = user.level;
    if (level >= 15) return user.pokemonPet.spriteStage3;
    if (level >= 8) return user.pokemonPet.spriteStage2;
    return user.pokemonPet.spriteStage1;
  };

  return (
    <header className="bg-gameboy-dark border-b-4 border-gameboy-border">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gameboy-light border-2 border-gameboy-lightest rounded flex items-center justify-center text-lg">
              {getCurrentSprite()}
            </div>
            <div>
              <p className="font-pixel text-xs text-gameboy-lightest">
                {user?.username || 'Trainer'}
              </p>
              <p className="font-pixel text-xs text-gameboy-light">
                Lv.{user?.level || 1} • {user?.points || 0}pts
              </p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="w-8 h-8 bg-gameboy-medium border-2 border-gameboy-border rounded flex items-center justify-center hover:bg-gameboy-light transition-colors duration-200"
          >
            <Power size={12} className="text-gameboy-lightest" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;