import React, { useState } from 'react';
import { pokemonApi } from '../services/api';

interface PokemonSpriteProps {
  id: number;
  name: string;
  type: 'pet' | 'catchable';
  stage?: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showGifOnHover?: boolean;
}

const PokemonSprite: React.FC<PokemonSpriteProps> = ({
  id,
  name,
  type,
  stage = 1,
  size = 'medium',
  className = '',
  showGifOnHover = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getSpriteUrl = () => {
    if (type === 'pet') {
      return pokemonApi.getPetSprite(id, stage);
    } else {
      return pokemonApi.getCatchableSprite(id);
    }
  };

  const getGifUrl = () => {
    return pokemonApi.getPokemonGif(id);
  };

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const hoverClasses = isHovered ? 'animate-bounce scale-110 transition-all duration-300' : '';

  return (
    <div
      className={`relative inline-block ${sizeClasses[size]} ${hoverClasses} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={name}
    >
      <img
        src={isHovered && showGifOnHover ? getGifUrl() : getSpriteUrl()}
        alt={name}
        className="w-full h-full object-contain filter drop-shadow-lg pokemon-sprite"
        onError={() => setImageError(true)}
        style={{
          imageRendering: 'pixelated',
          imageRendering: '-moz-crisp-edges' as any,
          imageRendering: 'crisp-edges'
        }}
      />
      {isHovered && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
          {name}
        </div>
      )}
    </div>
  );
};

export default PokemonSprite;
