'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonCardProps {
  className?: string;
}

/**
 * SkeletonCard component - loading placeholder for Pokemon cards
 * Features:
 * - Animated shimmer effect
 * - Matches PokemonCard dimensions
 * - Smooth fade-in animation
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => {
  return (
    <motion.div
      className={`
        relative rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700
        shadow-lg ${className}
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-pulse">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Image placeholder */}
      <div className="h-48 flex items-center justify-center p-4">
        <div className="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
      </div>

      {/* Content placeholder */}
      <div className="p-4 space-y-3">
        {/* ID and details placeholder */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        </div>

        {/* Name placeholder */}
        <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />

        {/* Type badges placeholder */}
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
};
