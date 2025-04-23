/**
 * Path configuration for the application
 * This centralizes path settings for both development and production environments
 */

// Repository name for GitHub Pages
const REPO_NAME = 'shangri-la-smith';

// Base path - hardcoded for GitHub Pages deployment
// This works because we're only using GitHub Pages for deployment
export const BASE_PATH = `/${REPO_NAME}/`;
export const ASSETS_PATH = BASE_PATH + 'assets/';
