'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * ErrorDisplay component - user-friendly error messages with retry functionality
 * Features:
 * - Clear error messaging
 * - Retry button for failed requests
 * - Smooth animations
 * - Accessibility features
 * - Responsive design
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  message, 
  onRetry, 
  className = '' 
}) => {
  return (
    <motion.div
      className={`
        flex flex-col items-center justify-center p-8
        text-center ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Error icon */}
      <motion.div
        className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full 
                   flex items-center justify-center mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <AlertTriangle 
          size={32} 
          className="text-red-500 dark:text-red-400"
        />
      </motion.div>

      {/* Error message */}
      <motion.h3
        className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        Oops! Something went wrong
      </motion.h3>

      <motion.p
        className="text-gray-600 dark:text-gray-300 mb-6 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        {message}
      </motion.p>

      {/* Retry button */}
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="
            flex items-center gap-2 px-6 py-3
            bg-blue-500 hover:bg-blue-600
            text-white font-medium rounded-full
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500/20
          "
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Retry request"
        >
          <RefreshCw size={18} />
          Try Again
        </motion.button>
      )}

      {/* Fun Pokemon-themed error message */}
      <motion.p
        className="text-sm text-gray-500 dark:text-gray-400 mt-6 italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        Even the best trainers encounter wild errors sometimes!
      </motion.p>
    </motion.div>
  );
};
