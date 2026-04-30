import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Pokemon, 
  PokemonListItem, 
  PokemonType 
} from '@/types/pokemon';
import { 
  getPokemonList, 
  getPokemonDetails, 
  searchPokemon, 
  getPokemonByType, 
  retryApiCall,
  PokemonApiError 
} from '@/lib/pokemon-api';

// Hook for managing the pokemon list with search and filters
export const usePokemonList = () => {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([]); // all loaded pokemon for filtering
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonListItem[]>([]); // what we actually show
  
  // Track if we're loading to prevent duplicate calls
  const isLoadingRef = useRef(false);
  
  const limit = 20; // how many pokemon to load at once

  // Filter pokemon based on search and types
  const filterPokemon = useCallback(() => {
    let filtered = allPokemon;

    // Filter by search query first
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query)
      );
    }

    // Then filter by selected types
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(p => 
        selectedTypes.some(type => p.types.includes(type))
      );
    }

    setFilteredPokemon(filtered);
  }, [allPokemon, searchQuery, selectedTypes]);

  // Run filtering whenever search/types change
  useEffect(() => {
    filterPokemon();
  }, [filterPokemon]);

  // Load more pokemon when user clicks "Load More"
  const loadMorePokemon = useCallback(async () => {
    // Don't load if we're already loading or no more pokemon
    if (isLoadingRef.current || loading || !hasMore) return;
    
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      let newPokemon: PokemonListItem[];
      
      if (isSearching && searchQuery) {
        // Search mode - get specific pokemon
        const results = await retryApiCall(() => searchPokemon(searchQuery));
        newPokemon = results;
        setHasMore(false); // search results aren't paginated
      } else if (selectedTypes.length > 0) {
        // Type filter mode - get pokemon by type
        // TODO: implement AND logic for multiple types
        const results = await retryApiCall(() => 
          getPokemonByType(selectedTypes[0], limit, offset)
        );
        newPokemon = results;
        setHasMore(results.length === limit);
      } else {
        // Normal mode - get paginated list
        const response = await retryApiCall(() => getPokemonList(limit, offset));
        newPokemon = response.results;
        setHasMore(response.next !== null);
      }

      // Add new pokemon to our master list
      setAllPokemon(prev => [...prev, ...newPokemon]);
      
      setOffset(prev => prev + limit);
    } catch (err) {
      const message = err instanceof PokemonApiError ? err.message : 'Failed to load Pokemon';
      setError(message);
      console.error('Error loading Pokemon:', err);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [loading, hasMore, offset, searchQuery, selectedTypes, isSearching, limit]);

  // Reset everything and load fresh data
  const resetAndLoad = useCallback(() => {
    // Clear all pokemon when switching search/filters
    setAllPokemon([]);
    setFilteredPokemon([]);
    setOffset(0);
    setHasMore(true);
    setError(null);
    
    // Small delay to make sure state updates first
    setTimeout(() => {
      loadMorePokemon();
    }, 0);
  }, [loadMorePokemon, searchQuery, selectedTypes]);

  // Load data when search or filters change
  useEffect(() => {
    resetAndLoad();
  }, [searchQuery, selectedTypes]);

  // Handle search input changes
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setIsSearching(!!query.trim());
    // Don't clear the list right away - let filtering handle it
    // This way users see results while typing
    setOffset(0);
    setHasMore(true);
    setError(null);
  }, []);

  // Handle type filter changes
  const handleTypeFilter = useCallback((types: PokemonType[]) => {
    setSelectedTypes(types);
    setPokemon([]);
    setOffset(0);
    setHasMore(true);
    setError(null);
    setIsSearching(false);
    setSearchQuery('');
  }, []);

  /**
   * Retry failed request
   */
  const retry = useCallback(() => {
    setError(null);
    loadMorePokemon();
  }, [loadMorePokemon]);

  return {
    pokemon: filteredPokemon,
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
  };
};

// Hook for getting pokemon details for the modal
export const usePokemonDetails = (pokemonId: number | null) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPokemonDetails = useCallback(async (id: number) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);

    try {
      const details = await retryApiCall(() => getPokemonDetails(id));
      setPokemon(details);
    } catch (err) {
      const message = err instanceof PokemonApiError ? err.message : 'Failed to load Pokemon details';
      setError(message);
      console.error('Error loading Pokemon details:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    if (pokemonId) {
      loadPokemonDetails(pokemonId);
    }
  }, [pokemonId, loadPokemonDetails]);

  // Load details when pokemonId changes
  useEffect(() => {
    if (pokemonId) {
      loadPokemonDetails(pokemonId);
    } else {
      setPokemon(null);
      setError(null);
    }
  }, [pokemonId, loadPokemonDetails]);

  return {
    pokemon,
    loading,
    error,
    retry,
  };
};

// Hook for managing favorites with localStorage
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [isClient, setIsClient] = useState(false);

  // Load favorites from localStorage when we're on the client
  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem('pokemon-favorites');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFavorites(new Set(parsed));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage:', error);
      }
    }
  }, []);

  // Toggle favorite status
  const toggleFavorite = useCallback((pokemonId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(pokemonId)) {
        newFavorites.delete(pokemonId);
      } else {
        newFavorites.add(pokemonId);
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('pokemon-favorites', JSON.stringify([...newFavorites]));
      }
      
      return newFavorites;
    });
  }, []);

  // Check if a pokemon is favorited
  const isFavorite = useCallback((pokemonId: number) => {
    return favorites.has(pokemonId);
  }, [favorites]);

  // Get all favorite pokemon IDs
  const getFavoriteIds = useCallback(() => {
    return [...favorites];
  }, [favorites]);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    getFavoriteIds,
    isClient,
  };
};
