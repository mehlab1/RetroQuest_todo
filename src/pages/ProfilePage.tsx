import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersApi, pokemonApi } from '../services/api';
import { Star, Award, Zap, Trophy } from 'lucide-react';

interface PokemonPet {
  petId: number;
  name: string;
  spriteStage1: string;
  spriteStage2: string;
  spriteStage3: string;
  levelRequired: number;
}

const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [pokemonPets, setPokemonPets] = useState<PokemonPet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const pokemonResponse = await pokemonApi.getAllPokemon();
      setPokemonPets(pokemonResponse.data);
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const changePokemon = async (petId: number) => {
    try {
      await usersApi.updateProfile({ pokemonPetId: petId });
      await refreshUser();
    } catch (error) {
      console.error('Failed to change Pokémon:', error);
    }
  };

  const getCurrentSprite = () => {
    if (!user?.pokemonPet) return '🎮';
    
    const level = user.level;
    if (level >= 15) return user.pokemonPet.spriteStage3;
    if (level >= 8) return user.pokemonPet.spriteStage2;
    return user.pokemonPet.spriteStage1;
  };

  const getEvolutionStage = () => {
    if (!user) return 1;
    const level = user.level;
    if (level >= 15) return 3;
    if (level >= 8) return 2;
    return 1;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 animate-pulse">👤</div>
          <p className="font-pixel text-xs text-gameboy-light">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trainer Card */}
      <div className="bg-gameboy-dark border-4 border-gameboy-border rounded-lg p-4">
        <h1 className="font-pixel text-sm text-gameboy-lightest mb-4">Trainer Card</h1>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gameboy-light border-4 border-gameboy-lightest rounded-lg flex items-center justify-center text-3xl animate-float">
            {getCurrentSprite()}
          </div>
          <div className="flex-1">
            <h2 className="font-pixel text-sm text-gameboy-lightest mb-2">
              {user?.username}
            </h2>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Zap size={12} className="text-gameboy-light" />
                <span className="font-pixel text-xs text-gameboy-lightest">
                  Level {user?.level} • {user?.points} points
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy size={12} className="text-yellow-400" />
                <span className="font-pixel text-xs text-gameboy-light">
                  {user?.gamification?.badges?.length || 0} badges
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pokemon Evolution */}
        <div className="bg-gameboy-medium border-2 border-gameboy-border rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-pixel text-xs text-gameboy-lightest">
              {user?.pokemonPet?.name} Evolution
            </span>
            <span className="font-pixel text-xs text-gameboy-light">
              Stage {getEvolutionStage()}/3
            </span>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            {user?.pokemonPet && (
              <>
                <div className={`text-2xl p-2 border-2 rounded ${
                  getEvolutionStage() >= 1 ? 'border-gameboy-light bg-gameboy-light' : 'border-gameboy-border opacity-50'
                }`}>
                  {user.pokemonPet.spriteStage1}
                </div>
                <span className="text-gameboy-light">→</span>
                <div className={`text-2xl p-2 border-2 rounded ${
                  getEvolutionStage() >= 2 ? 'border-gameboy-light bg-gameboy-light' : 'border-gameboy-border opacity-50'
                }`}>
                  {user.pokemonPet.spriteStage2}
                </div>
                <span className="text-gameboy-light">→</span>
                <div className={`text-2xl p-2 border-2 rounded ${
                  getEvolutionStage() >= 3 ? 'border-gameboy-light bg-gameboy-light' : 'border-gameboy-border opacity-50'
                }`}>
                  {user.pokemonPet.spriteStage3}
                </div>
              </>
            )}
          </div>
          
          <div className="mt-3 text-center">
            <p className="font-pixel text-xs text-gameboy-light">
              {getEvolutionStage() < 3 
                ? `Level ${getEvolutionStage() === 1 ? '8' : '15'} for next evolution`
                : 'Fully evolved!'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-gameboy-dark border-4 border-gameboy-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Award size={14} className="text-yellow-400" />
          <h2 className="font-pixel text-sm text-gameboy-lightest">Badge Collection</h2>
        </div>

        {user?.gamification?.badges && user.gamification.badges.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {user.gamification.badges.map((badge, index) => (
              <div key={index} className="bg-gameboy-medium border-2 border-gameboy-border rounded p-3 text-center hover:border-gameboy-light transition-colors">
                <div className="w-8 h-8 mx-auto mb-2 text-yellow-400">
                  <Trophy size={16} className="mx-auto" />
                </div>
                <p className="font-pixel text-xs text-gameboy-lightest">{badge}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 opacity-50">🏆</div>
            <p className="font-pixel text-xs text-gameboy-light">No badges yet</p>
            <p className="font-pixel text-xs text-gameboy-light mt-1">Complete tasks to earn badges!</p>
          </div>
        )}
      </div>

      {/* Pokemon Selection */}
      <div className="bg-gameboy-dark border-4 border-gameboy-border rounded-lg p-4">
        <h2 className="font-pixel text-sm text-gameboy-lightest mb-4">Choose Companion</h2>
        
        <div className="grid grid-cols-2 gap-3">
          {pokemonPets.map((pokemon) => {
            const isSelected = user?.pokemonPetId === pokemon.petId;
            const isUnlocked = (user?.level || 1) >= pokemon.levelRequired;
            
            return (
              <button
                key={pokemon.petId}
                onClick={() => isUnlocked && changePokemon(pokemon.petId)}
                disabled={!isUnlocked}
                className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                  isSelected
                    ? 'bg-gameboy-light border-gameboy-lightest text-gameboy-dark'
                    : isUnlocked
                      ? 'bg-gameboy-medium border-gameboy-border hover:border-gameboy-light text-gameboy-lightest'
                      : 'bg-gameboy-medium border-gameboy-border opacity-50 text-gameboy-light cursor-not-allowed'
                }`}
              >
                <div className="text-2xl mb-2">{pokemon.spriteStage1}</div>
                <p className="font-pixel text-xs mb-1">{pokemon.name}</p>
                {!isUnlocked && (
                  <p className="font-pixel text-xs text-red-400">Lv.{pokemon.levelRequired}</p>
                )}
                {isSelected && (
                  <div className="flex justify-center mt-2">
                    <Star size={12} className="text-yellow-400" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-gameboy-dark border-4 border-gameboy-border rounded-lg p-4">
        <h2 className="font-pixel text-sm text-gameboy-lightest mb-4">Trainer Stats</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-pixel text-xs text-gameboy-light">Current Streak:</span>
            <span className="font-pixel text-xs text-gameboy-lightest">
              {user?.gamification?.streakCount || 0} days
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-pixel text-xs text-gameboy-light">Total Points:</span>
            <span className="font-pixel text-xs text-gameboy-lightest">{user?.points || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-pixel text-xs text-gameboy-light">Current Level:</span>
            <span className="font-pixel text-xs text-gameboy-lightest">{user?.level || 1}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-pixel text-xs text-gameboy-light">Next Level:</span>
            <span className="font-pixel text-xs text-gameboy-lightest">
              {100 - ((user?.points || 0) % 100)} points
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;