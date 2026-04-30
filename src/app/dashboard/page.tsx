'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SearchBar } from '@/components/SearchBar';
import { TypeFilter } from '@/components/TypeFilter';
import { PokedexGrid } from '@/components/PokedexGrid';
import { PokemonModal } from '@/components/PokemonModal';
import { usePokemonList, usePokemonDetails } from '@/hooks/use-pokemon';
import { useFavorites } from '@/hooks/use-pokemon';
import { PokemonType } from '@/types/pokemon';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

// Main Pokedex Lite app page
export default function Home() {
  const [selectedPokemon, setSelectedPokemon] = useState<number | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/login'); // better than push
      }
    };

    checkUser();
  }, [router]);
  
  // Get pokemon data and search/filter functions
  const {
    pokemon,
    loading,
    error,
    hasMore,
    searchQuery,
    selectedTypes,
    isSearching,
    loadMorePokemon,
    handleSearch,
    handleTypeFilter,
    retry,
  } = usePokemonList();

  const { getFavoriteIds } = useFavorites();
  
  // Get detailed pokemon data for the modal
  const { pokemon: selectedPokemonDetails } = usePokemonDetails(selectedPokemon);

  // Handle pokemon card click
  const handlePokemonClick = (id: number) => {
    setSelectedPokemon(id);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedPokemon(null);
  };

  //Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Filter pokemon for favorites view
  const displayedPokemon = showFavorites 
    ? pokemon.filter(p => getFavoriteIds().includes(p.id))
    : pokemon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Title */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                Pokédex Lite
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Explore the world of Pokémon
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <SearchBar
                value={searchQuery}
                onChange={handleSearch}
                className="w-full sm:w-80"
              />
              
              <div className="flex gap-2">
                <TypeFilter
                  selectedTypes={selectedTypes}
                  onTypeChange={handleTypeFilter}
                />
                
                {/* Favorites Toggle */}
                <motion.button
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`
                    px-4 py-2 rounded-full font-medium transition-all duration-200
                    ${showFavorites 
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={showFavorites ? 'Show all Pokémon' : 'Show favorites only'}
                >
                  {showFavorites ? 'All' : 'Favorites'}
                </motion.button>

                {/*Logout button*/}
                <motion.button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Active Filters Display */}
          {(searchQuery || selectedTypes.length > 0 || showFavorites) && (
            <motion.div
              className="mt-4 flex flex-wrap items-center gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Active filters:
              </span>
              
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm">
                  Search: "{searchQuery}"
                </span>
              )}
              
              {selectedTypes.map(type => (
                <span key={type} className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-sm">
                  Type: {type}
                </span>
              ))}
              
              {showFavorites && (
                <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-full text-sm">
                  Favorites
                </span>
              )}
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {showFavorites 
              ? `Your Favorite Pokémon (${displayedPokemon.length})`
              : isSearching 
                ? `Search Results (${displayedPokemon.length})`
                : `All Pokémon (${displayedPokemon.length})`
            }
          </h2>
          
          {!showFavorites && !isSearching && (
            <p className="text-gray-600 dark:text-gray-300">
              Browse through the complete Pokédex with infinite scroll
            </p>
          )}
        </motion.div>

        {/* Pokemon Grid */}
        <PokedexGrid
          pokemon={displayedPokemon}
          loading={loading}
          error={error}
          hasMore={hasMore && !showFavorites}
          onLoadMore={loadMorePokemon}
          onPokemonClick={handlePokemonClick}
        />
      </main>

      {/* Pokemon Detail Modal */}
      <PokemonModal
        pokemon={selectedPokemonDetails}
        isOpen={selectedPokemon !== null}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Data sourced from PokéAPI • Not affiliated with Nintendo or The Pokémon Company
          </p>
        </div>
      </footer>
    </div>
  );
}
