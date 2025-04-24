/**
 * This script fixes the asset paths in the generated HTML files 
 * to properly reference the GitHub Pages repository base path
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Repository name - this needs to match your GitHub repo name
const REPO_NAME = 'shangri-la-smith';

// Entry point: The HTML file to process
const DIST_DIR = path.resolve(__dirname, '../dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');
const FOUR_OH_FOUR_HTML = path.join(DIST_DIR, '404.html');

console.log('Running post-build script to fix paths for GitHub Pages...');

// Read the index.html file
let htmlContent = fs.readFileSync(INDEX_HTML, 'utf8');

// Fix script tags
// These are the two most common issues:
// 1. Change "/assets/..." to "/repo-name/assets/..."
htmlContent = htmlContent.replace(/"\/(assets\/[^"]+)"/g, `"/${REPO_NAME}/$1"`);

// 2. Fix script modules directly
htmlContent = htmlContent.replace(/"\/(src\/[^"]+)"/g, `"/${REPO_NAME}/$1"`);

// 3. Handle various types of assets
htmlContent = htmlContent.replace(/"\/src\//g, `"/${REPO_NAME}/src/`);
htmlContent = htmlContent.replace(/"\/dist\//g, `"/${REPO_NAME}/dist/`);
htmlContent = htmlContent.replace(/"\/public\//g, `"/${REPO_NAME}/public/`);
htmlContent = htmlContent.replace(/"\/assets\//g, `"/${REPO_NAME}/assets/`);
htmlContent = htmlContent.replace(/"\/img\//g, `"/${REPO_NAME}/img/`);

// Write the updated content back to the file
fs.writeFileSync(INDEX_HTML, htmlContent);
console.log('Fixed paths in index.html');

// Also copy to 404.html with the same fixes
fs.writeFileSync(FOUR_OH_FOUR_HTML, htmlContent);
console.log('Created 404.html with fixed paths');

console.log('Path fixing completed successfully.');

// Export a default function for ESM compatibility
export default function fixPaths() {
  console.log('Fix paths function called');
  // Function wrapper to allow import
}
