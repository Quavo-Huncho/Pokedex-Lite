'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Weight, Ruler } from 'lucide-react';
import { Pokemon } from '@/types/pokemon';
import { TYPE_COLORS, formatPokemonId } from '@/types/pokemon';
import { 
  formatPokemonName, 
  formatHeight, 
  formatWeight, 
  formatStatName, 
  getStatColor,
  isLightColor 
} from '@/utils/helpers';
import { useFavorites } from '@/hooks/use-pokemon';

interface PokemonModalProps {
  pokemon: Pokemon | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * PokemonModal component - detailed view of a Pokemon
 * Features:
 * - Beautiful modal with smooth animations
 * - Complete Pokemon information display
 * - Stats visualization with progress bars
 * - Favorite functionality
 * - Keyboard navigation (ESC to close)
 * - Click outside to close
 * - Responsive design
 */
export const PokemonModal: React.FC<PokemonModalProps> = ({ 
  pokemon, 
  isOpen, 
  onClose 
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  // Handle keyboard events
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset'; // Restore scroll
    };
  }, [isOpen, onClose]);

  // Handle favorite toggle
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pokemon) {
      toggleFavorite(pokemon.id);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!pokemon) return null;

  // Get background gradient based on primary type
  const backgroundStyle = {
    background: pokemon.types.length === 1 
      ? TYPE_COLORS[pokemon.types[0]] 
      : `linear-gradient(135deg, ${TYPE_COLORS[pokemon.types[0]]} 0%, ${TYPE_COLORS[pokemon.types[1]]} 100%)`,
  };

  const textColor = isLightColor(pokemon.types[0]) ? 'text-gray-800' : 'text-white';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal Content */}
          <motion.div
            className={`
              relative bg-white dark:bg-gray-800 rounded-3xl
              shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col
              ${textColor}
            `}
            style={backgroundStyle}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 pb-0">
              {/* Close button */}
              <motion.button
                onClick={onClose}
                className={`
                  absolute top-4 right-4 p-2 rounded-full
                  backdrop-blur-sm transition-all duration-200
                  ${isLightColor(pokemon.types[0]) 
                    ? 'bg-white/20 text-gray-800 hover:bg-white/30' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                  }
                `}
                aria-label="Close modal"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>

              {/* Favorite button */}
              <motion.button
                onClick={handleFavoriteToggle}
                className={`
                  absolute top-4 right-16 p-2 rounded-full
                  backdrop-blur-sm transition-all duration-200
                  ${isFavorite(pokemon.id) 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : `bg-white/20 ${textColor} hover:bg-white/30`
                  }
                `}
                aria-label={isFavorite(pokemon.id) ? 'Remove from favorites' : 'Add to favorites'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart 
                  size={20} 
                  fill={isFavorite(pokemon.id) ? 'currentColor' : 'none'}
                />
              </motion.button>

              {/* Pokemon Image */}
              <div className="flex flex-col items-center">
                <motion.div
                  className="relative"
                  initial={{ scale: 0.8, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <img
                    src={pokemon.imageUrl}
                    alt={formatPokemonName(pokemon.name)}
                    className="w-48 h-48 object-contain drop-shadow-2xl"
                  />
                </motion.div>

                {/* Pokemon Name and ID */}
                <motion.div
                  className="text-center mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <h2 className="text-3xl font-bold mb-2">
                    {formatPokemonName(pokemon.name)}
                  </h2>
                  <p className="text-lg opacity-90">
                    {formatPokemonId(pokemon.id)}
                  </p>
                </motion.div>

                {/* Type Badges */}
                <motion.div
                  className="flex gap-3 mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  {pokemon.types.map((type, index) => (
                    <div
                      key={type}
                      className={`
                        px-4 py-2 rounded-full text-sm font-semibold
                        backdrop-blur-sm border border-white/20
                        ${isLightColor(type) ? 'text-gray-800' : 'text-white'}
                      `}
                      style={{ 
                        backgroundColor: `${TYPE_COLORS[type]}40`,
                        borderColor: `${TYPE_COLORS[type]}60`
                      }}
                    >
                      {formatPokemonName(type)}
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Details Section */}
            <div className="bg-white dark:bg-gray-800 rounded-t-3xl mt-6 px-6 py-6 text-gray-900 dark:text-white flex-1 overflow-y-auto">
              {/* Basic Info */}
              <motion.div
                className="grid grid-cols-2 gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Ruler className="text-blue-500" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Height</p>
                    <p className="font-semibold">{formatHeight(pokemon.height)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Weight className="text-green-500" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                    <p className="font-semibold">{formatWeight(pokemon.weight)}</p>
                  </div>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <h3 className="text-lg font-bold mb-4">Base Stats</h3>
                <div className="space-y-3">
                  {pokemon.stats.map((stat, index) => (
                    <motion.div
                      key={stat.name}
                      className="space-y-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium w-20">
                          {formatStatName(stat.name)}
                        </span>
                        <span className="text-sm font-bold">{stat.value}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${getStatColor(stat.value)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.8 + index * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Abilities */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.0 }}
              >
                <h3 className="text-lg font-bold mb-4">Abilities</h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((ability, index) => (
                    <motion.div
                      key={ability.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 1.1 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className={`
                        px-3 py-1 rounded-lg text-sm font-medium
                        ${ability.isHidden 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' 
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        }
                      `}>
                        {formatPokemonName(ability.name)}
                        {ability.isHidden && (
                          <span className="ml-1 text-xs opacity-75">(Hidden)</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Flavor Text */}
              {pokemon.flavorText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.2 }}
                >
                  <h3 className="text-lg font-bold mb-4">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
                    "{pokemon.flavorText}"
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
