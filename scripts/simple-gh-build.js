#!/usr/bin/env node

/**
 * Super simple GitHub Pages build script
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log('Starting simple GitHub Pages build...');

try {
  // Run the standard Vite build with base path
  console.log('Building application...');
  execSync('vite build --base=/shangri-la-smith/', { 
    stdio: 'inherit',
    cwd: rootDir
  });
  
  // Create .nojekyll file
  console.log('Creating .nojekyll file...');
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
  
  // Copy index.html to 404.html
  console.log('Creating 404.html for SPA routing...');
  const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  fs.writeFileSync(path.join(distDir, '404.html'), indexHtml);
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
