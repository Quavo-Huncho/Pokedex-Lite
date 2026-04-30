import { PokemonType } from '@/types/pokemon';

// Debounce function - prevents too many API calls when typing
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Convert height from decimeters to feet/inches
export const formatHeight = (decimeters: number): string => {
  const totalInches = Math.round(decimeters * 3.93701); // convert to inches
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  
  if (feet === 0) {
    return `${inches}"`;
  }
  return `${feet}'${inches}"`;
};

// Convert weight from hectograms to pounds
export const formatWeight = (hectograms: number): string => {
  const pounds = Math.round(hectograms * 0.220462); // convert to pounds
  return `${pounds} lbs`;
};

// Format stat names nicely
export const formatStatName = (statName: string): string => {
  const statNames: Record<string, string> = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    'speed': 'Speed',
  };
  
  return statNames[statName] || statName;
};

// Get color for stat bars based on value
export const getStatColor = (value: number, max: number = 255): string => {
  const percentage = (value / max) * 100;
  
  if (percentage >= 80) return 'bg-green-500';
  if (percentage >= 60) return 'bg-blue-500';
  if (percentage >= 40) return 'bg-yellow-500';
  if (percentage >= 20) return 'bg-orange-500';
  return 'bg-red-500';
};

// Get pokemon type icon URL
export const getTypeIconUrl = (type: PokemonType): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${type}.png`;
};

// Check if a color is light or dark (for text contrast)
export const isLightColor = (hexColor: string): boolean => {
  // Remove the # if present
  const color = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5;
};

// Generate gradient background for pokemon cards
export const getTypeGradient = (types: PokemonType[]): string => {
  const { TYPE_COLORS } = require('@/types/pokemon');
  
  if (types.length === 1) {
    return TYPE_COLORS[types[0]];
  }
  
  // Create gradient for dual-type pokemon
  const colors = types.map(type => TYPE_COLORS[type]);
  return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`;
};

// Format pokemon names properly (e.g., "pikachu" -> "Pikachu")
export const formatPokemonName = (name: string): string => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Get fun description based on pokemon types
export const getTypeDescription = (types: PokemonType[]): string => {
  const descriptions: Record<PokemonType, string> = {
    normal: 'A balanced and adaptable type',
    fire: 'Passionate and powerful with burning spirit',
    water: 'Flexible and flowing with deep emotions',
    electric: 'Quick-witted and full of energy',
    grass: 'Natural and connected to the earth',
    ice: 'Cool under pressure with frozen focus',
    fighting: 'Strong-willed and never gives up',
    poison: 'Mysterious with hidden strengths',
    ground: 'Stable and reliable foundation',
    flying: 'Free-spirited and reaches new heights',
    psychic: 'Intuitive with deep understanding',
    bug: 'Small but mighty and adaptable',
    rock: 'Solid and dependable in any situation',
    ghost: 'Ethereal with mysterious qualities',
    dragon: 'Powerful and majestic presence',
    dark: 'Strategic and thinks outside the box',
    steel: 'Resilient and strong under pressure',
    fairy: 'Charming with magical qualities',
  };
  
  if (types.length === 1) {
    return descriptions[types[0]];
  }
  
  // Combine descriptions for dual types
  return `${descriptions[types[0]]} and ${descriptions[types[1]]}`;
};

// Get a random fun pokemon fact
export const getRandomPokemonFact = (): string => {
  const facts = [
    "Pikachu was originally going to be called 'Pikachuu' in English!",
    "Meowth is the only Pokémon that can learn Pay Day naturally.",
    "The first Pokémon ever created was Rhydon.",
    "Magikarp can leap over a mountain using Splash in the anime.",
    "Gyarados was inspired by the myth of the carp that becomes a dragon.",
    "Eevee has the most evolutions of any Pokémon.",
    "Ditto can transform into any object, not just Pokémon.",
    "Slowbro is the only Pokémon that can devolve.",
    "Mewtwo was created from Mew's DNA in a lab.",
    "Charizard is the only starter Pokémon that can learn Fly in the original games.",
  ];
  
  return facts[Math.floor(Math.random() * facts.length)];
};
