import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAchievement } from '../contexts/AchievementContext';
import { authApi, pokemonApi } from '../services/api';
import soundEffects from '../utils/soundEffects';
import { X, Star, Zap, Shield, Crown, Check } from 'lucide-react';
import { CatchablePokemon } from '../data/catchablePokemon';

interface MyPokemonsProps {
  onClose: () => void;
}

const MyPokemons: React.FC<MyPokemonsProps> = ({ onClose }) => {
  const { user, refreshUser } = useAuth();
  const { showAchievement } = useAchievement();
  const [caughtPokemon, setCaughtPokemon] = useState<CatchablePokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<CatchablePokemon | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCaughtPokemon();
  }, [user]);

  const loadCaughtPokemon = async () => {
    setIsLoading(true);
    try {
      // Load caught Pokemon from database
      const response = await pokemonApi.getCaughtPokemon();
      let pokemonList = response.data.data || [];
      
      console.log(`✅ Loaded ${pokemonList.length} caught Pokemon from database`);
      
      // Mark the current companion Pokemon
      const pokemonWithCompanionStatus = pokemonList.map((pokemon: any) => ({
        ...pokemon,
        // Support both database and localStorage structure
        name: pokemon.pokemonName || pokemon.name,
        sprite: pokemon.pokemonSprite || pokemon.sprite,
        type: pokemon.pokemonType || pokemon.type,
        isCompanion: user?.pokemonPet?.name === (pokemon.pokemonName || pokemon.name)
      }));
      
      setCaughtPokemon(pokemonWithCompanionStatus);
      console.log(`Total Pokemon in collection: ${pokemonWithCompanionStatus.length}`);
    } catch (error) {
      console.error('Failed to load caught Pokemon from database:', error);
      soundEffects.playError();
      
      // Fallback to localStorage for migration
      try {
        const stored = localStorage.getItem(`caughtPokemon_${user?.userId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          console.log(`📦 Fallback: Loaded ${parsed.length} Pokemon from localStorage`);
          setCaughtPokemon(parsed.map((pokemon: any) => ({
            ...pokemon,
            isCompanion: user?.pokemonPet?.name === pokemon.name
          })));
        } else {
          setCaughtPokemon([]);
        }
      } catch (localError) {
        console.error('LocalStorage fallback failed:', localError);
        setCaughtPokemon([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchCompanion = async (pokemon: CatchablePokemon) => {
    setIsSwitching(true);
    soundEffects.playMenuSelect();
    
    try {
      // Simulate API call to switch companion Pokemon
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the user's companion Pokemon
      await authApi.updateProfile({ 
        pokemonPet: {
          name: pokemon.name,
          spriteStage1: pokemon.sprite,
          spriteStage2: pokemon.sprite,
          spriteStage3: pokemon.sprite,
          evolutionLevels: { stage2: 16, stage3: 32 }
        }
      });
      
      await refreshUser();
      
      // Update local state
      setCaughtPokemon(prev => prev.map(p => ({
        ...p,
        isCompanion: p.name === pokemon.name
      })));
      
      showAchievement(`${pokemon.name} is now your companion!`, 'pokemon');
      soundEffects.playVictory();
      
      setSelectedPokemon(null);
    } catch (error) {
      console.error('Failed to switch companion Pokemon:', error);
      soundEffects.playError();
    } finally {
      setIsSwitching(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'starter': return 'text-green-400';
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'starter': return <Star size={12} />;
      case 'common': return <Zap size={12} />;
      case 'uncommon': return <Shield size={12} />;
      case 'rare': return <Star size={12} />;
      case 'legendary': return <Crown size={12} />;
      default: return <Zap size={12} />;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="nes-container with-title is-rounded">
          <p className="title">Loading My Pokemons...</p>
          <div className="flex justify-center p-4">
            <div className="spinner-gameboy"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mobile-p-2 sm:mobile-p-4">
      <div className="nes-container with-title is-rounded w-full max-w-2xl max-h-[90vh] overflow-y-auto mobile-modal">
        <p className="title">My Pokemons</p>
        <div className="mobile-p-3 sm:mobile-p-6">
          <div className="flex justify-end mb-4 sm:mb-6">
            <button
              onClick={onClose}
              className="nes-btn is-error touch-button w-8 h-8 sm:w-10 sm:h-10"
              title="Close"
            >
              <X size={16} className="text-gameboy-lightest" />
            </button>
          </div>

          {/* Current Companion */}
          <div className="mb-4 sm:mb-6">
            <h3 className="font-pixel text-sm text-gameboy-lightest mb-3 sm:mb-4">Current Companion</h3>
            {user?.pokemonPet ? (
              <div className="nes-container with-title is-rounded">
                <p className="title">Active Companion</p>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="nes-avatar is-large is-rounded">
                    <img
                      src={user.pokemonPet.spriteStage1}
                      alt={user.pokemonPet.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '🎮';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-pixel text-xs sm:text-sm text-gameboy-dark font-bold truncate">{user.pokemonPet.name}</h4>
                    <p className="font-pixel text-xs text-gameboy-dark">Level {user.level || 1}</p>
                    <p className="font-pixel text-xs text-gameboy-dark">Your faithful companion</p>
                  </div>
                  <div className="flex items-center flex-shrink-0">
                    <Check size={16} className="text-green-600 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="nes-container is-rounded text-center p-4">
                <p className="font-pixel text-xs text-gameboy-light">No companion Pokemon selected</p>
              </div>
            )}
          </div>

          {/* Caught Pokemon */}
          <div className="mb-4 sm:mb-6">
            <h3 className="font-pixel text-sm text-gameboy-lightest mb-3 sm:mb-4">
              Pokemon Collection ({caughtPokemon.length})
            </h3>
            {caughtPokemon.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {caughtPokemon.map((pokemon) => (
                  <div
                    key={pokemon.id}
                    className={`pokemon-card nes-container is-rounded cursor-pointer touch-button ${
                      pokemon.isCompanion ? 'is-selected' : ''
                    }`}
                    onClick={() => setSelectedPokemon(pokemon)}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="nes-avatar is-medium is-rounded">
                        <img
                          src={pokemon.sprite}
                          alt={pokemon.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '🎮';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                          <span className={`font-pixel text-xs ${pokemon.isCompanion ? 'text-gameboy-dark' : 'text-gameboy-lightest'} truncate`}>
                            {pokemon.name}
                          </span>
                          <span className={`${getRarityColor(pokemon.rarity)} flex-shrink-0`}>
                            {getRarityIcon(pokemon.rarity)}
                          </span>
                          {pokemon.isCompanion && (
                            <span className="text-green-600 flex-shrink-0">
                              <Check size={10} className="sm:w-3 sm:h-3" />
                            </span>
                          )}
                        </div>
                        <p className={`font-pixel text-xs ${pokemon.isCompanion ? 'text-gameboy-dark' : 'text-gameboy-light'} truncate`}>
                          {pokemon.type}
                        </p>
                        <p className={`font-pixel text-xs ${pokemon.isCompanion ? 'text-gameboy-dark' : 'text-gameboy-light'} truncate`}>
                          {pokemon.rarity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="nes-avatar is-large mx-auto mb-3 sm:mb-4 opacity-50">🎮</div>
                <p className="font-pixel text-xs text-gameboy-light">No Pokemon caught yet</p>
                <p className="font-pixel text-xs text-gameboy-light mt-1">Complete tasks to catch Pokemon!</p>
                <p className="font-pixel text-xs text-gameboy-light mt-2">Click the 🎮 button to see available Pokemon</p>
              </div>
            )}
          </div>

          {/* Selected Pokemon Details */}
          {selectedPokemon && (
            <div className="nes-container with-title is-rounded mb-4 sm:mb-6">
              <p className="title">{selectedPokemon.name}</p>
              <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="nes-avatar is-large is-rounded mx-auto sm:mx-0">
                  <img
                    src={selectedPokemon.sprite}
                    alt={selectedPokemon.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '🎮';
                    }}
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
                    <span className={`text-sm ${getRarityColor(selectedPokemon.rarity)}`}>
                      {getRarityIcon(selectedPokemon.rarity)} {selectedPokemon.rarity}
                    </span>
                  </div>
                  <p className="font-pixel text-xs text-gameboy-light mb-2">{selectedPokemon.type}</p>
                  <p className="font-pixel text-xs text-gameboy-light mb-3">{selectedPokemon.description}</p>
                  <p className="font-pixel text-xs text-gameboy-lightest mb-4">
                    {selectedPokemon.isCompanion 
                      ? "This is your current companion Pokemon!" 
                      : "This Pokemon is available to become your companion."
                    }
                  </p>
                  {!selectedPokemon.isCompanion && (
                    <button
                      onClick={() => switchCompanion(selectedPokemon)}
                      disabled={isSwitching}
                      className="nes-btn is-success is-animated w-full sm:w-auto touch-button"
                    >
                      {isSwitching ? 'Switching...' : 'Make Companion'}
                    </button>
                  )}
                  {selectedPokemon.isCompanion && (
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <Check size={16} className="text-green-600" />
                      <span className="font-pixel text-xs text-green-600">Current Companion</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPokemons;
