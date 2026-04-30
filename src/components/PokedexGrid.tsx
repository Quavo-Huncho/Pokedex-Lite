'use client';

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PokemonCard } from './PokemonCard';
import { SkeletonCard } from './SkeletonCard';
import { ErrorDisplay } from './ErrorDisplay';
import { PokemonListItem } from '@/types/pokemon';

interface PokedexGridProps {
  pokemon: PokemonListItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
  onPokemonClick: (id: number) => void;
  className?: string;
}

/**
 * PokedexGrid component - responsive grid of Pokemon cards
 * Features:
 * - Responsive grid layout (1-4 columns)
 * - Infinite scroll with intersection observer
 * - Loading skeleton cards
 * - Error handling with retry
 * - Smooth animations
 * - Accessibility features
 */
export const PokedexGrid: React.FC<PokedexGridProps> = ({
  pokemon,
  loading,
  error,
  hasMore,
  onLoadMore,
  onPokemonClick,
  className = ''
}) => {
  
  // Handle Pokemon card click
  const handlePokemonClick = useCallback((id: number) => {
    onPokemonClick(id);
  }, [onPokemonClick]);

  // Show error state
  if (error && pokemon.length === 0) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <ErrorDisplay 
          message={error} 
          onRetry={onLoadMore}
        />
      </div>
    );
  }

  // Show empty state
  if (!loading && pokemon.length === 0 && !error) {
    return (
      <motion.div
        className={`flex flex-col items-center justify-center min-h-[400px] text-center ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Pokémon found
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Try adjusting your search or filters to find what you're looking for!
        </p>
      </motion.div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Pokemon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {pokemon.map((poke, index) => (
            <motion.div
              key={poke.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05, // Stagger animation
                ease: "easeOut"
              }}
            >
              <PokemonCard
                pokemon={poke}
                onClick={handlePokemonClick}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading skeleton cards */}
        {loading && (
          <>
            {[...Array(Math.min(hasMore ? 4 : 1, 4))].map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))}
          </>
        )}
      </div>

      {/* Load More Button - Always show after loading 20 Pokemon */}
      <div className="flex justify-center mt-8">
        {(pokemon.length >= 20 || hasMore) && !loading && !error && (
          <motion.button
            onClick={onLoadMore}
            className="
              px-6 py-3 bg-blue-500 hover:bg-blue-600
              text-white font-medium rounded-full
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500/20
              flex items-center gap-2
              shadow-lg hover:shadow-xl
            "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Load more Pokémon"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Load More Pokémon
          </motion.button>
        )}
      </div>

      {/* Error display (when we have some data but encounter an error) */}
      {error && pokemon.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ErrorDisplay 
            message={error} 
            onRetry={onLoadMore}
            className="py-4"
          />
        </motion.div>
      )}

      {/* End of results message */}
      {!hasMore && !loading && pokemon.length > 0 && (
        <motion.p
          className="text-center text-gray-500 dark:text-gray-400 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          You've reached the end! That's all the Pokémon we have for now.
        </motion.p>
      )}
    </div>
  );
};

