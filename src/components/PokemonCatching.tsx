import React, { useState, useEffect } from 'react';
import { catchablePokemon, CatchablePokemon } from '../data/catchablePokemon';
import { useAuth } from '../contexts/AuthContext';
import { useAchievement } from '../contexts/AchievementContext';
import { tasksApi, pokemonApi } from '../services/api';
import soundEffects from '../utils/soundEffects';

interface PokemonCatchingProps {
  onClose: () => void;
}

const PokemonCatching: React.FC<PokemonCatchingProps> = ({ onClose }) => {
  const { user, refreshUser } = useAuth();
  const { showAchievement } = useAchievement();
  const [availablePokemon, setAvailablePokemon] = useState<CatchablePokemon[]>([]);
  const [caughtPokemon, setCaughtPokemon] = useState<CatchablePokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<CatchablePokemon | null>(null);
  const [isCatching, setIsCatching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializePokemonData();
  }, [user]);

  const loadCaughtPokemon = async () => {
    try {
      // Load from database instead of localStorage
      const response = await pokemonApi.getCaughtPokemon();
      const caughtList = response.data.data || [];
      setCaughtPokemon(caughtList);
      console.log(`✅ Loaded ${caughtList.length} caught Pokemon from database`);
      return caughtList;
    } catch (error) {
      console.error('Failed to load caught Pokemon:', error);
      // Fallback to localStorage for migration
      try {
        const stored = localStorage.getItem(`caughtPokemon_${user?.userId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          console.log(`📦 Loaded ${parsed.length} Pokemon from localStorage (migration needed)`);
          return parsed;
        }
      } catch (localError) {
        console.error('LocalStorage fallback failed:', localError);
      }
      return [];
    }
  };

  const initializePokemonData = async () => {
    setIsLoading(true);
    try {
      // First load caught Pokemon (now async)
      const caught = await loadCaughtPokemon();
      
      // Then check available Pokemon
      await checkAvailablePokemon(caught);
    } catch (error) {
      console.error('Failed to initialize Pokemon data:', error);
      soundEffects.playError();
    } finally {
      setIsLoading(false);
    }
  };

  const checkAvailablePokemon = async (caughtPokemonList: CatchablePokemon[] = []) => {
    try {
      // Get user's task statistics
      const tasksResponse = await tasksApi.getTasks();
      const allTasks = tasksResponse.data;
      const completedTasks = allTasks.filter((task: any) => task.isDone);
      
      // Calculate user stats
      const totalTasks = allTasks.length;
      const completedToday = allTasks.filter((task: any) => {
        const today = new Date().toDateString();
        const taskDate = new Date(task.updatedAt).toDateString();
        return task.isDone && taskDate === today;
      }).length;
      
      const highPriorityTasks = completedTasks.filter((task: any) => task.priority === 'High').length;
      const streakCount = user?.gamification?.streakCount || 0;
      const userLevel = user?.level || 1;

      // Check which Pokemon are available based on achievements
      const available = catchablePokemon.filter(pokemon => {
        // Don't show Pokemon that are already caught
        const alreadyCaught = caughtPokemonList.some(caught => 
          (caught.pokemonId || caught.id) === pokemon.id || 
          (caught.pokemonName || caught.name) === pokemon.name
        );
        if (alreadyCaught) {
          console.log(`Filtering out ${pokemon.name} - already caught`);
          return false;
        }

        switch (pokemon.name) {
          case 'Caterpie':
            return completedTasks.length >= 1;
          case 'Rattata':
            return completedToday >= 3;
          case 'Pidgey':
            return streakCount >= 2;
          case 'Psyduck':
            return totalTasks >= 10;
          case 'Pikachu':
            return highPriorityTasks >= 5;
          case 'Ekans':
            return streakCount >= 5;
          case 'Charizard':
            return completedTasks.length >= 20;
          case 'Blastoise':
            return streakCount >= 10;
          case 'Mewtwo':
            return totalTasks >= 50;
          case 'Mew':
            return totalTasks >= 100 && streakCount >= 30;
          case 'Lugia':
            return streakCount >= 7; // Simplified for demo
          case 'Rayquaza':
            return userLevel >= 50 && totalTasks >= 200;
          default:
            return false;
        }
      });

      console.log(`Available Pokemon: ${available.length}, Caught Pokemon: ${caughtPokemonList.length}`);
      setAvailablePokemon(available);
    } catch (error) {
      console.error('Failed to check available Pokemon:', error);
    }
  };

  const catchPokemon = async (pokemon: CatchablePokemon) => {
    setIsCatching(true);
    
    // 🎮 Enhanced Nintendo-style catch sequence
    soundEffects.playPokemonCatch();
    
    // Reduced catching time for better UX (800ms instead of 2000ms)
    setTimeout(async () => {
      try {
        // 📱 Save to database instead of localStorage
        const pokemonData = {
          pokemonId: pokemon.id,
          pokemonName: pokemon.name,
          pokemonSprite: pokemon.sprite,
          pokemonType: pokemon.type,
          rarity: pokemon.rarity,
          difficulty: pokemon.difficulty,
          description: pokemon.description,
          pointsReward: pokemon.pointsReward
        };

        const response = await pokemonApi.catchPokemon(pokemonData);
        
        if (response.data.success) {
          // 🎵 Success sound effect
          soundEffects.playPokemonSuccess();
          
          // Update local state
          const newCaughtPokemon = [...caughtPokemon, response.data.data];
          setCaughtPokemon(newCaughtPokemon);
          
          // Remove from available Pokemon immediately
          setAvailablePokemon(prev => prev.filter(p => p.id !== pokemon.id));
          
          // Clear selected Pokemon
          setSelectedPokemon(null);
          
          // Refresh user data to update points
          await refreshUser();
          
          // Show achievement with enhanced message
          showAchievement(
            `🎉 Caught ${pokemon.name}! +${pokemon.pointsReward} points`, 
            'pokemon'
          );
          
          console.log(`✅ Successfully caught ${pokemon.name} and saved to database!`);
        }
        
        setIsCatching(false);
      } catch (error) {
        console.error('Failed to catch Pokemon:', error);
        soundEffects.playError();
        setIsCatching(false);
        
        // Show error message
        showAchievement(
          `❌ Failed to catch ${pokemon.name}. Try again!`, 
          'error'
        );
      }
    }, 800); // Faster catching for better UX
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return '⚪';
      case 'uncommon': return '🟢';
      case 'rare': return '🔵';
      case 'legendary': return '⭐';
      default: return '⚪';
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="nes-container with-title is-rounded">
          <p className="title">Loading Pokemon...</p>
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
        <p className="title">Pokemon Catching</p>
        <div className="mobile-p-3 sm:mobile-p-6">
          <div className="flex justify-end mb-4 sm:mb-6">
            <button
              onClick={() => {
                soundEffects.playMenuCancel();
                onClose();
              }}
              className="nes-btn is-error touch-button w-8 h-8 sm:w-10 sm:h-10"
              title="Close"
            >
              <span className="font-pixel text-xs text-gameboy-lightest">✕</span>
            </button>
          </div>

          {/* Available Pokemon */}
          <div className="mb-4 sm:mb-6">
            <h3 className="font-pixel text-sm text-gameboy-lightest mb-3 sm:mb-4">
              Available Pokemon ({availablePokemon.length})
            </h3>
            {availablePokemon.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {availablePokemon.map((pokemon) => (
                  <div
                    key={pokemon.id}
                    className="pokemon-card nes-container is-rounded cursor-pointer touch-button"
                    onClick={() => {
                      soundEffects.playPokemonSelect();
                      setSelectedPokemon(pokemon);
                    }}
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
                          <span className="font-pixel text-xs text-gameboy-lightest truncate">{pokemon.name}</span>
                          <span className={`text-xs ${getRarityColor(pokemon.rarity)} flex-shrink-0`}>
                            {getRarityIcon(pokemon.rarity)}
                          </span>
                        </div>
                        <p className="font-pixel text-xs text-gameboy-light truncate">{pokemon.type}</p>
                        <p className="font-pixel text-xs text-gameboy-light">+{pokemon.pointsReward} pts</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="nes-avatar is-large mx-auto mb-3 sm:mb-4 opacity-50">🎮</div>
                <p className="font-pixel text-xs text-gameboy-light">No Pokemon available</p>
                <p className="font-pixel text-xs text-gameboy-light mt-1">Complete more tasks to unlock Pokemon!</p>
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
                  <p className="font-pixel text-xs text-gameboy-lightest mb-3">
                    <strong>Requirement:</strong> {selectedPokemon.catchRequirement}
                  </p>
                  <p className="font-pixel text-xs text-gameboy-lightest mb-4">
                    <strong>Reward:</strong> +{selectedPokemon.pointsReward} points
                  </p>
                  <button
                    onClick={() => catchPokemon(selectedPokemon)}
                    disabled={isCatching}
                    className="nes-btn is-primary is-animated w-full sm:w-auto touch-button"
                  >
                    {isCatching ? 'Catching...' : 'Catch Pokemon!'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Caught Pokemon */}
          {caughtPokemon.length > 0 && (
            <div>
              <h3 className="font-pixel text-sm text-gameboy-lightest mb-3 sm:mb-4">
                Caught Pokemon ({caughtPokemon.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {caughtPokemon.map((pokemon) => (
                  <div key={pokemon.id} className="nes-container is-rounded text-center mobile-p-2 sm:mobile-p-3">
                    <div className="nes-avatar is-small is-rounded mx-auto mb-1 sm:mb-2">
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
                    <p className="font-pixel text-xs text-gameboy-dark truncate">{pokemon.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonCatching;
