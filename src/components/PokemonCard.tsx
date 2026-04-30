'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Search } from 'lucide-react';
import { PokemonListItem } from '@/types/pokemon';
import { TYPE_COLORS, formatPokemonId } from '@/types/pokemon';
import { formatPokemonName, isLightColor } from '@/utils/helpers';
import { useFavorites } from '@/hooks/use-pokemon';

interface PokemonCardProps {
  pokemon: PokemonListItem;
  onClick: (id: number) => void;
  className?: string;
}

// Pokemon card component - shows pokemon image, name, types, and favorite button
export const PokemonCard: React.FC<PokemonCardProps> = ({ 
  pokemon, 
  onClick, 
  className = '' 
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  // Handle favorite toggle
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // don't trigger card click
    toggleFavorite(pokemon.id);
  };

  // Handle card click
  const handleCardClick = () => {
    onClick(pokemon.id);
  };

  // Handle keyboard interaction
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(pokemon.id);
    }
  };

  // Get background gradient based on primary type
  const backgroundStyle = {
    background: pokemon.types.length === 1 
      ? TYPE_COLORS[pokemon.types[0]] 
      : `linear-gradient(135deg, ${TYPE_COLORS[pokemon.types[0]]} 0%, ${TYPE_COLORS[pokemon.types[1]]} 100%)`,
  };

  // Determine text color based on background
  const textColor = isLightColor(pokemon.types[0]) ? 'text-gray-800' : 'text-white';

  return (
    <motion.div
      className={`
        relative group cursor-pointer rounded-2xl overflow-hidden
        shadow-lg hover:shadow-2xl transition-all duration-300
        transform hover:-translate-y-1
        ${className}
      `}
      style={backgroundStyle}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${formatPokemonName(pokemon.name)}`}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Favorite Button */}
      <motion.button
        className={`
          absolute top-3 right-3 z-10 p-2 rounded-full
          backdrop-blur-sm transition-all duration-200
          ${isFavorite(pokemon.id) 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-white/20 text-white hover:bg-white/30'
          }
        `}
        onClick={handleFavoriteToggle}
        aria-label={isFavorite(pokemon.id) ? 'Remove from favorites' : 'Add to favorites'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart 
          size={20} 
          fill={isFavorite(pokemon.id) ? 'currentColor' : 'none'}
          className="transition-all duration-200"
        />
      </motion.button>

      {/* Pokemon Image Container */}
      <div className="relative h-48 flex items-center justify-center p-4">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        </div>
        
        {/* Pokemon Image */}
        <motion.div
          className="relative z-10"
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={pokemon.imageUrl}
            alt={formatPokemonName(pokemon.name)}
            className="w-32 h-32 object-contain drop-shadow-lg"
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* Pokemon Info */}
      <div className={`p-4 ${textColor}`}>
        {/* Pokemon ID and Name */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium opacity-80">
            {formatPokemonId(pokemon.id)}
          </span>
          <div className="flex items-center gap-1 opacity-80">
            <Search size={14} />
            <span className="text-xs">Details</span>
          </div>
        </div>

        {/* Pokemon Name */}
        <h3 className="text-xl font-bold mb-3 leading-tight">
          {formatPokemonName(pokemon.name)}
        </h3>

        {/* Type Badges */}
        <div className="flex gap-2 flex-wrap">
          {pokemon.types.map((type, index) => (
            <motion.div
              key={type}
              className={`
                px-3 py-1 rounded-full text-xs font-semibold
                backdrop-blur-sm border border-white/20
                ${isLightColor(type) ? 'text-gray-800' : 'text-white'}
              `}
              style={{ 
                backgroundColor: `${TYPE_COLORS[type]}40`,
                borderColor: `${TYPE_COLORS[type]}60`
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              {formatPokemonName(type)}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};
