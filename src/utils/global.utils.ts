/**
 * Get the current environment from .env file
 * Returns 'production' if VITE_ENV is set to 'production', otherwise 'development'
 */
export const getEnv = (): 'production' | 'development' => {
  const env = import.meta.env.VITE_ENV;
  
  if (env === 'production') {
    return 'production';
  }
  
  return 'development';
};

/**
 * Get the API base URL
 * Priority:
 * 1. Use VITE_BASE_URL from .env if provided
 * 2. Otherwise, use default URL based on environment (production vs development)
 */
export const getBaseUrl = (): string => {
  // Check if BASE_URL is explicitly set in .env
  const baseUrlFromEnv = import.meta.env.VITE_BASE_URL;
  if (baseUrlFromEnv) {
    return baseUrlFromEnv;
  }
  
  // If not set, use default based on environment
  const env = getEnv();
  
  // Default for development
  return 'http://localhost:3000';
};

/**
 * Base URL for all API calls
 * Import this constant wherever you need to make API requests
 */
export const BASE_URL = getBaseUrl();

