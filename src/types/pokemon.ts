// Pokemon types - all the possible types a pokemon can have
export type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

// Stats for each pokemon (HP, Attack, etc.)
export interface PokemonStat {
  name: string;
  value: number;
  max: number; // max is 255 for all stats
}

// Pokemon abilities (like Overgrow, etc.)
export interface PokemonAbility {
  name: string;
  isHidden: boolean;
}

// Main pokemon interface - this is what we use everywhere
export interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: PokemonType[];
  height: number; // height in decimeters (divide by 10 for meters)
  weight: number; // weight in hectograms (divide by 10 for kg)
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  flavorText?: string; // description from the species endpoint
}

// Simplified version for the grid/list view
export interface PokemonListItem {
  id: number;
  name: string;
  imageUrl: string;
  types: PokemonType[];
}

// API response stuff
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

// This is the raw data we get from the API - we need to transform it
export interface RawPokemon {
  id: number;
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: PokemonType;
    };
    slot: number;
  }[];
  height: number;
  weight: number;
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }[];
}

// For getting the flavor text/description
export interface PokemonSpecies {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
  }[];
}

// Color mapping for each pokemon type
export const TYPE_COLORS: Record<PokemonType, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

// Get the color for a pokemon type
export const getTypeColor = (type: PokemonType): string => {
  return TYPE_COLORS[type];
};

// Format pokemon ID like #001, #002, etc.
export const formatPokemonId = (id: number): string => {
  return `#${String(id).padStart(3, '0')}`;
};

// Capitalize first letter - used for names
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
