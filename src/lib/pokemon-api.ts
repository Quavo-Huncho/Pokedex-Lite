import axios, { AxiosError } from 'axios';
import { 
  Pokemon, 
  PokemonListItem, 
  PokemonListResponse, 
  RawPokemon, 
  PokemonSpecies,
  PokemonType 
} from '@/types/pokemon';

// PokeAPI base URL
const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

// Set up axios with some defaults
const api = axios.create({
  baseURL: POKEAPI_BASE_URL,
  timeout: 10000, // 10 seconds should be enough
  headers: {
    'Content-Type': 'application/json',
  },
});

// Custom error for when API calls fail
export class PokemonApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'PokemonApiError';
  }
}

// Convert the raw API data to our cleaner Pokemon interface
const transformPokemonData = (raw: RawPokemon): Pokemon => {
  return {
    id: raw.id,
    name: raw.name,
    imageUrl: raw.sprites.other['official-artwork'].front_default,
    types: raw.types
      .sort((a, b) => a.slot - b.slot) // sort by slot so primary type comes first
      .map(t => t.type.name),
    height: raw.height,
    weight: raw.weight,
    stats: raw.stats.map(stat => ({
      name: stat.stat.name,
      value: stat.base_stat,
      max: 255, // all stats max out at 255
    })),
    abilities: raw.abilities.map(ability => ({
      name: ability.ability.name,
      isHidden: ability.is_hidden,
    })),
  };
};

// Get a list of pokemon with pagination
export const getPokemonList = async (
  limit: number = 20,
  offset: number = 0
): Promise<{ results: PokemonListItem[]; count: number; next: string | null }> => {
  try {
    // First get the basic list
    const response = await api.get<PokemonListResponse>('/pokemon', {
      params: { limit, offset }
    });

    // Now get detailed data for each pokemon in the list
    const detailedPokemon = await Promise.all(
      response.data.results.map(async (pokemon) => {
        const detailResponse = await api.get<RawPokemon>(pokemon.url);
        const transformed = transformPokemonData(detailResponse.data);
        
        return {
          id: transformed.id,
          name: transformed.name,
          imageUrl: transformed.imageUrl,
          types: transformed.types,
        } as PokemonListItem;
      })
    );

    return {
      results: detailedPokemon,
      count: response.data.count,
      next: response.data.next,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new PokemonApiError(
        `Failed to fetch Pokemon list: ${error.message}`,
        error.response?.status,
        error
      );
    }
    throw new PokemonApiError('Unknown error occurred while fetching Pokemon list');
  }
};

// Get detailed info about a specific pokemon
export const getPokemonDetails = async (id: number): Promise<Pokemon> => {
  try {
    // Get both pokemon data and species data at the same time
    const [pokemonResponse, speciesResponse] = await Promise.all([
      api.get<RawPokemon>(`/pokemon/${id}`),
      api.get<PokemonSpecies>(`/pokemon-species/${id}`)
    ]);

    const pokemon = transformPokemonData(pokemonResponse.data);
    
    // Get the English description (clean up line breaks)
    const englishFlavorTexts = speciesResponse.data.flavor_text_entries
      .filter(entry => entry.language.name === 'en')
      .map(entry => entry.flavor_text.replace(/[\n\f]/g, ' '));
    
    pokemon.flavorText = englishFlavorTexts[0] || 'No description available.';

    return pokemon;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new PokemonApiError(
        `Failed to fetch Pokemon details: ${error.message}`,
        error.response?.status,
        error
      );
    }
    throw new PokemonApiError('Unknown error occurred while fetching Pokemon details');
  }
};

// Search for pokemon by name
export const searchPokemon = async (query: string): Promise<PokemonListItem[]> => {
  try {
    if (!query.trim()) {
      return [];
    }

    const response = await api.get<RawPokemon>(`/pokemon/${query.toLowerCase()}`);
    const pokemon = transformPokemonData(response.data);
    
    return [{
      id: pokemon.id,
      name: pokemon.name,
      imageUrl: pokemon.imageUrl,
      types: pokemon.types,
    }];
  } catch (error) {
    // If it's a 404, just return empty array (pokemon not found)
    if (error instanceof AxiosError && error.response?.status === 404) {
      return [];
    }
    
    if (error instanceof AxiosError) {
      throw new PokemonApiError(
        `Failed to search Pokemon: ${error.message}`,
        error.response?.status,
        error
      );
    }
    
    throw new PokemonApiError('Unknown error occurred while searching Pokemon');
  }
};

// Get all available pokemon types
export const getPokemonTypes = async (): Promise<PokemonType[]> => {
  try {
    const response = await api.get<{ results: { name: PokemonType }[] }>('/type');
    return response.data.results.map(type => type.name);
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new PokemonApiError(
        `Failed to fetch Pokemon types: ${error.message}`,
        error.response?.status,
        error
      );
    }
    throw new PokemonApiError('Unknown error occurred while fetching Pokemon types');
  }
};

// Get pokemon by type with pagination
export const getPokemonByType = async (
  type: PokemonType,
  limit: number = 20,
  offset: number = 0
): Promise<PokemonListItem[]> => {
  try {
    const response = await api.get(`/type/${type}`);
    
    // Get the pokemon URLs we need and fetch their details
    const pokemonUrls = response.data.pokemon
      .slice(offset, offset + limit)
      .map((p: { pokemon: { url: string } }) => p.pokemon.url);

    const detailedPokemon = await Promise.all(
      pokemonUrls.map(async (url: string) => {
        const detailResponse = await api.get<RawPokemon>(url);
        const transformed = transformPokemonData(detailResponse.data);
        
        return {
          id: transformed.id,
          name: transformed.name,
          imageUrl: transformed.imageUrl,
          types: transformed.types,
        } as PokemonListItem;
      })
    );

    return detailedPokemon;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new PokemonApiError(
        `Failed to fetch Pokemon by type: ${error.message}`,
        error.response?.status,
        error
      );
    }
    throw new PokemonApiError('Unknown error occurred while fetching Pokemon by type');
  }
};

// Retry function for API calls - exponential backoff
export const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        break; // no more retries
      }
      
      // Wait longer each time (exponential backoff)
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError!;
};
