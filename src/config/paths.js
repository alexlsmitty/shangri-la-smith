/**
 * Path configuration for the application
 * This centralizes path settings for both development and production environments
 */

// Repository name for GitHub Pages
const REPO_NAME = 'shangri-la-smith';

// Base path detection - matches Vite's base path in production
export const getBasePath = () => {
  // For GitHub Pages deployment
  if (import.meta.env.PROD) {
    return `/${REPO_NAME}/`;
  }
  
  // For local development
  return '/';
};

// Export constants for use throughout the application
export const BASE_PATH = getBasePath();
export const ASSETS_PATH = BASE_PATH + 'assets/';
