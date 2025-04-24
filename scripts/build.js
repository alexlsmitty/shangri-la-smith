/**
 * Custom build script that ensures all asset paths are correctly set for GitHub Pages
 */
import { build } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the current file's directory using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildForGitHubPages() {
  console.log('Starting custom build for GitHub Pages...');
  
  try {
    // Run the Vite build
    await build({
      root: path.resolve(__dirname, '..'),
      base: '/shangri-la-smith/',
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
          output: {
            entryFileNames: 'assets/[name].[hash].js',
            chunkFileNames: 'assets/[name].[hash].js',
            assetFileNames: 'assets/[name].[hash].[ext]'
          }
        }
      }
    });
    
    console.log('Vite build completed');
    
    // Now fix any path issues in the generated HTML
    await import('./fix-paths.js');
    
    // Create the necessary files for GitHub Pages
    const distDir = path.resolve(__dirname, '../dist');
    
    // Create .nojekyll
    fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
    console.log('Created .nojekyll file');
    
    // Copy index.html to 404.html
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
    fs.writeFileSync(path.join(distDir, '404.html'), indexHtml);
    console.log('Created 404.html file');
    
    console.log('Build for GitHub Pages completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildForGitHubPages();
