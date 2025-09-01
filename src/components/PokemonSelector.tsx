import React, { useState, useEffect } from 'react';
import { pokemonApi } from '../services/api';
import soundEffects from '../utils/soundEffects';

interface Pokemon {
  petId: number;
  name: string;
  spriteStage1: string;
  spriteStage2: string;
  spriteStage3: string;
  type: string;
  description: string;
  evolutionLevels: {
    stage2: number;
    stage3: number;
  };
}

interface PokemonSelectorProps {
  onSelect: (pokemon: Pokemon) => void;
  selectedPokemon?: Pokemon;
}

const PokemonSelector: React.FC<PokemonSelectorProps> = ({ onSelect, selectedPokemon }) => {
  const [hoveredPokemon, setHoveredPokemon] = useState<Pokemon | null>(null);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const response = await pokemonApi.getPokemonPets();
        setPokemonList(response.data?.value || response.data || []);
      } catch (err) {
        console.error('Failed to fetch Pokemon:', err);
        setError('Failed to load Pokemon data');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const handlePokemonSelect = (pokemon: Pokemon) => {
    soundEffects.playItemPickup();
    onSelect(pokemon);
  };

  const handlePokemonHover = (pokemon: Pokemon | null) => {
    setHoveredPokemon(pokemon);
    if (pokemon) {
      soundEffects.playNavigate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-pixel text-sm text-gameboy-lightest mb-2">Choose Your Starter Pokémon!</h3>
        <p className="font-pixel text-xs text-gameboy-light">Select your companion for this adventure</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="font-pixel text-sm text-gameboy-lightest">Loading Pokemon...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <div className="font-pixel text-sm text-gameboy-lightest text-red-400">{error}</div>
        </div>
      )}

      {/* Pokemon Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto">
          {pokemonList.map((pokemon) => (
            <div
              key={pokemon.petId}
              className={`relative cursor-pointer transition-all duration-200 ${
                selectedPokemon?.petId === pokemon.petId
                  ? 'scale-110 border-2 border-gameboy-light bg-gameboy-light'
                  : 'border-2 border-gameboy-border bg-gameboy-medium hover:border-gameboy-light hover:scale-105'
              } rounded-lg p-3`}
              onClick={() => handlePokemonSelect(pokemon)}
              onMouseEnter={() => handlePokemonHover(pokemon)}
              onMouseLeave={() => handlePokemonHover(null)}
            >
              {/* Pokemon Sprite */}
              <div className="flex justify-center mb-2">
                <img
                  src={pokemon.spriteStage1}
                  alt={pokemon.name}
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '🕹️'; // Fallback emoji
                  }}
                />
              </div>

              {/* Pokemon Name */}
              <div className="text-center">
                <p className="font-pixel text-xs text-gameboy-lightest mb-1">{pokemon.name}</p>
                
                {/* Type Badge */}
                <div className="flex justify-center">
                  <span className="bg-blue-500 text-white font-pixel text-xs px-2 py-1 rounded">
                    {pokemon.type}
                  </span>
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedPokemon?.petId === pokemon.petId && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gameboy-light border-2 border-gameboy-lightest rounded-full flex items-center justify-center">
                  <span className="font-pixel text-xs text-gameboy-dark">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pokemon Details */}
      {(hoveredPokemon || selectedPokemon) && (
        <div className="bg-gameboy-dark border-2 border-gameboy-border rounded-lg p-4">
          <div className="flex items-start space-x-4">
            {/* Pokemon Sprite */}
            <div className="flex-shrink-0">
              <img
                src={(hoveredPokemon || selectedPokemon)?.spriteStage1}
                alt={(hoveredPokemon || selectedPokemon)?.name}
                className="w-20 h-20 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '🕹️'; // Fallback emoji
                }}
              />
            </div>

            {/* Pokemon Info */}
            <div className="flex-1">
              <h4 className="font-pixel text-sm text-gameboy-lightest mb-2">
                {(hoveredPokemon || selectedPokemon)?.name}
              </h4>
              
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-blue-500 text-white font-pixel text-xs px-2 py-1 rounded">
                  {(hoveredPokemon || selectedPokemon)?.type}
                </span>
              </div>

              <p className="font-pixel text-xs text-gameboy-light leading-relaxed">
                {(hoveredPokemon || selectedPokemon)?.description}
              </p>

              {/* Evolution Info */}
              <div className="mt-3 pt-3 border-t border-gameboy-border">
                <p className="font-pixel text-xs text-gameboy-light">
                  This Pokemon has multiple evolution stages and will become stronger as you level up!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selection Confirmation */}
      {selectedPokemon && (
        <div className="text-center">
          <p className="font-pixel text-xs text-gameboy-lightest">
            You chose <span className="text-gameboy-light">{selectedPokemon.name}</span>!
          </p>
          <p className="font-pixel text-xs text-gameboy-light mt-1">
            Your adventure begins now!
          </p>
        </div>
      )}
    </div>
  );
};

export default PokemonSelector;
