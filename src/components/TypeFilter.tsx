'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { PokemonType, TYPE_COLORS } from '@/types/pokemon';
import { formatPokemonName, isLightColor } from '@/utils/helpers';

interface TypeFilterProps {
  selectedTypes: PokemonType[];
  onTypeChange: (types: PokemonType[]) => void;
  availableTypes?: PokemonType[];
  className?: string;
}

// All Pokemon types
const ALL_POKEMON_TYPES: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

/**
 * TypeFilter component - multi-select filter for Pokemon types
 * Features:
 * - Multi-select with AND logic
 * - Visual type badges with accurate colors
 * - Clear all functionality
 * - Responsive grid layout
 * - Smooth animations
 * - Accessibility features
 */
export const TypeFilter: React.FC<TypeFilterProps> = ({ 
  selectedTypes, 
  onTypeChange, 
  availableTypes = ALL_POKEMON_TYPES,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle type toggle
  const handleTypeToggle = (type: PokemonType) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    onTypeChange(newTypes);
  };

  // Clear all filters
  const handleClearAll = () => {
    onTypeChange([]);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Filter button */}
      <motion.button
        onClick={toggleDropdown}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full
          border-2 transition-all duration-300
          bg-white dark:bg-gray-800
          ${isOpen 
            ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500/20
          text-gray-900 dark:text-white
        `}
        aria-label="Filter by type"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Filter size={18} className={isOpen ? 'text-blue-500' : 'text-gray-500'} />
        <span className="font-medium">
          {selectedTypes.length > 0 
            ? `${selectedTypes.length} type${selectedTypes.length > 1 ? 's' : ''} selected`
            : 'Filter by Type'
          }
        </span>
        
        {/* Dropdown arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>
      </motion.button>

      {/* Selected types preview */}
      <AnimatePresence>
        {selectedTypes.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 mt-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {selectedTypes.map((type) => (
              <motion.div
                key={type}
                className={`
                  px-3 py-1 rounded-full text-xs font-semibold
                  flex items-center gap-1 cursor-pointer
                  transition-all duration-200 hover:scale-105
                  ${isLightColor(type) ? 'text-gray-800' : 'text-white'}
                `}
                style={{ backgroundColor: TYPE_COLORS[type] }}
                onClick={() => handleTypeToggle(type)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={`Remove ${formatPokemonName(type)} filter`}
              >
                {formatPokemonName(type)}
                <X size={12} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown content */}
            <motion.div
              className={`
                absolute top-full left-0 mt-2 z-20
                bg-white dark:bg-gray-800 rounded-xl
                border border-gray-200 dark:border-gray-700
                shadow-2xl p-4
                max-h-96 overflow-y-auto
                min-w-[280px]
              `}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Filter by Type
                </h3>
                {selectedTypes.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Type grid */}
              <div className="grid grid-cols-2 gap-2" role="listbox">
                {availableTypes.map((type) => {
                  const isSelected = selectedTypes.includes(type);
                  const textColor = isLightColor(type) ? 'text-gray-800' : 'text-white';
                  
                  return (
                    <motion.button
                      key={type}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium
                        transition-all duration-200
                        flex items-center justify-center gap-2
                        ${isSelected 
                          ? `${textColor} shadow-lg transform scale-105` 
                          : `${textColor} opacity-70 hover:opacity-100`
                        }
                      `}
                      style={{ 
                        backgroundColor: isSelected ? TYPE_COLORS[type] : `${TYPE_COLORS[type]}20`,
                        border: isSelected ? `2px solid ${TYPE_COLORS[type]}` : '2px solid transparent'
                      }}
                      onClick={() => handleTypeToggle(type)}
                      role="option"
                      aria-selected={isSelected}
                      whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Type indicator dot */}
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: TYPE_COLORS[type] }}
                      />
                      {formatPokemonName(type)}
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer info */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {selectedTypes.length === 0 
                    ? 'Select one or more types to filter'
                    : `Showing Pokémon with ${selectedTypes.length} selected type${selectedTypes.length > 1 ? 's' : ''}`
                  }
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
