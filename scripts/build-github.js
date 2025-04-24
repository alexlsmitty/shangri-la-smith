#!/usr/bin/env node

/**
 * Simple ES Module compatible build script for GitHub Pages
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the repository name
const REPO_NAME = 'shangri-la-smith';

// Define paths
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');

console.log('Starting GitHub Pages build process...');

try {
  // Step 1: Run the Vite build with base path
  console.log('\n🔨 Building the application with Vite...');
  execSync('vite build --base=/shangri-la-smith/', { stdio: 'inherit' });
  
  // Step 2: Create .nojekyll file to disable Jekyll processing
  console.log('\n📄 Creating .nojekyll file...');
  fs.writeFileSync(path.join(DIST_DIR, '.nojekyll'), '');
  
  // Step 3: Create 404.html for SPA routing
  console.log('\n🔄 Creating 404.html for SPA routing...');
  const indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, '404.html'), indexHtml);
  
  // Step 4: Fix any paths in the HTML files
  console.log('\n🔧 Fixing paths in HTML files...');
  
  // Read index.html
  let htmlContent = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');
  
  // Fix various path references
  const fixedContent = htmlContent
    .replace(/"\/(assets\/[^"]+)"/g, `"/${REPO_NAME}/$1"`)   // Fix asset paths
    .replace(/"\/(src\/[^"]+)"/g, `"/${REPO_NAME}/$1"`)      // Fix source paths
    .replace(/"\/assets\//g, `"/${REPO_NAME}/assets/`)       // Fix asset directory
    .replace(/"\/src\//g, `"/${REPO_NAME}/src/`)            // Fix source directory
    .replace(/"\/js\//g, `"/${REPO_NAME}/js/`)              // Fix js directory
    .replace(/"\/css\//g, `"/${REPO_NAME}/css/`)            // Fix css directory
    .replace(/"\/img\//g, `"/${REPO_NAME}/img/`);           // Fix img directory
  
  // Write fixed content back to files
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), fixedContent);
  fs.writeFileSync(path.join(DIST_DIR, '404.html'), fixedContent);
  
  console.log('\n✅ GitHub Pages build completed successfully!');
  console.log(`Built files are in the ${DIST_DIR} directory`);
  
} catch (error) {
  console.error('\n❌ Build failed:', error);
  process.exit(1);
}
