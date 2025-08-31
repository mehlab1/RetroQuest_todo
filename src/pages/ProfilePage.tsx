import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Trophy, Heart, Target } from 'lucide-react';
import soundEffects from '../utils/soundEffects';

const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const getCurrentSprite = () => {
    if (!user?.pokemonPet) return '🎮';
    
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

  const getEvolutionStage = () => {
    if (!user?.pokemonPet) return { stage: 1, total: 1, nextLevel: 0 };
    
    const { level } = user;
    const evolutionLevels = user.pokemonPet.evolutionLevels || { stage2: 16, stage3: 32 };
    
    if (level >= evolutionLevels.stage3) {
      return { stage: 3, total: 3, nextLevel: 0 };
    } else if (level >= evolutionLevels.stage2) {
      return { stage: 2, total: 3, nextLevel: evolutionLevels.stage3 };
    } else {
      return { stage: 1, total: 3, nextLevel: evolutionLevels.stage2 };
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gameboy-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 animate-pulse">🎮</div>
          <p className="font-pixel text-sm text-gameboy-lightest">Loading Trainer Card...</p>
        </div>
      </div>
    );
  }

  const evolution = getEvolutionStage();

  return (
    <div className="space-y-6">
      {/* Trainer Card */}
      <div className="bg-gameboy-dark border-4 border-gameboy-border rounded-lg p-4">
        <h1 className="font-pixel text-sm text-gameboy-lightest mb-4">Trainer Card</h1>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gameboy-light border-4 border-gameboy-lightest rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src={getCurrentSprite()}
              alt={user?.pokemonPet?.name || 'Pokemon'}
              className="w-16 h-16 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '🎮'; // Fallback emoji
              }}
            />
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
          <h3 className="font-pixel text-xs text-gameboy-lightest mb-3">Pokemon Evolution</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-pixel text-xs text-gameboy-light">Pokemon:</span>
              <span className="font-pixel text-xs text-gameboy-lightest">{user?.pokemonPet?.name || 'None'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-pixel text-xs text-gameboy-light">Evolution:</span>
              <span className="font-pixel text-xs text-gameboy-lightest">Stage {evolution.stage}/{evolution.total}</span>
            </div>
            {evolution.nextLevel > 0 && (
              <div className="flex justify-between items-center">
                <span className="font-pixel text-xs text-gameboy-light">Next Evolution:</span>
                <span className="font-pixel text-xs text-gameboy-lightest">Level {evolution.nextLevel}</span>
              </div>
            )}
          </div>
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

      {/* Badge Collection */}
      <div className="bg-gameboy-dark border-4 border-gameboy-border rounded-lg p-4">
        <h2 className="font-pixel text-sm text-gameboy-lightest mb-4">Badge Collection</h2>
        
        {user?.gamification?.badges && user.gamification.badges.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {user.gamification.badges.map((badge, index) => (
              <div key={index} className="bg-gameboy-medium border-2 border-gameboy-border rounded p-2 text-center">
                <Trophy size={16} className="text-yellow-400 mx-auto mb-1" />
                <span className="font-pixel text-xs text-gameboy-lightest">{badge}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy size={32} className="text-gameboy-light mx-auto mb-2 opacity-50" />
            <p className="font-pixel text-xs text-gameboy-light">No badges earned yet</p>
            <p className="font-pixel text-xs text-gameboy-light mt-1">Complete tasks to earn badges!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;