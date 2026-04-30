'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { debounce } from '@/utils/helpers';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * SearchBar component - real-time search with debouncing
 * Features:
 * - Debounced search to prevent excessive API calls
 * - Clear button for easy reset
 * - Smooth animations and transitions
 * - Accessibility features
 * - Visual feedback for loading states
 */
export const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = 'Search Pokémon...',
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  // Debounced onChange function (300ms delay)
  const debouncedOnChange = useCallback(
    debounce((searchValue: string) => {
      onChange(searchValue);
    }, 300),
    [onChange]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  // Handle clear button
  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
      e.currentTarget.blur();
    }
  };

  // Sync with external value changes
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <motion.div
      className={`
        relative w-full max-w-md
        ${className}
      `}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Search icon */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
        <motion.div
          animate={{ 
            scale: isFocused ? 1.1 : 1,
            rotate: localValue ? [0, -10, 10, 0] : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <Search 
            size={20} 
            className={`
              transition-colors duration-200
              ${isFocused ? 'text-blue-500' : 'text-gray-400'}
            `}
          />
        </motion.div>
      </div>

      {/* Input field */}
      <motion.input
        type="text"
        value={localValue}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`
          w-full pl-12 pr-12 py-3 rounded-full
          border-2 transition-all duration-300
          bg-white dark:bg-gray-800
          ${isFocused 
            ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500/20
          text-gray-900 dark:text-white
          placeholder-gray-500 dark:placeholder-gray-400
        `}
        aria-label="Search Pokémon"
        aria-describedby="search-help"
        whileFocus={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      />

      {/* Clear button */}
      {localValue && (
        <motion.button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
          onClick={handleClear}
          aria-label="Clear search"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X 
            size={18} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" 
          />
        </motion.button>
      )}

      {/* Search help text */}
      <div id="search-help" className="sr-only">
        Start typing to search for Pokémon by name. Press Escape to clear the search.
      </div>

      {/* Animated underline effect */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-blue-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: isFocused ? '100%' : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};
