/**
 * This script checks if each page of the site exceeds the maximum file size limit (1.8MB)
 * Run it after building the site with 'npm run build' command
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const MAX_PAGE_SIZE_MB = 1.8;
const MAX_PAGE_SIZE_BYTES = MAX_PAGE_SIZE_MB * 1024 * 1024;
const DIST_DIR = path.join(__dirname, '../dist');
const PAGES = [
  { route: '/', name: 'Home Page' },
  { route: '/rooms', name: 'Rooms Page' },
  { route: '/dining', name: 'Dining Page' },
  { route: '/spa', name: 'Spa Page' },
  { route: '/activities', name: 'Activities Page' },
  { route: '/testimonials', name: 'Testimonials Page' },
];

// Mapping of file extensions to their respective asset types
const ASSET_TYPES = {
  '.html': 'HTML',
  '.js': 'JavaScript',
  '.css': 'CSS',
  '.webp': 'Image', 
  '.jpg': 'Image',
  '.jpeg': 'Image',
  '.png': 'Image',
  '.svg': 'SVG',
  '.woff': 'Font',
  '.woff2': 'Font',
  '.ttf': 'Font',
};

// Helper function to get all static assets for a route
function getAssetsForPage(indexContent) {
  const assets = {
    js: [],
    css: [],
    images: [],
    fonts: [],
    other: [],
  };
  
  // Extract script tags
  const scriptRegex = /<script[^>]*src="([^"]+)"[^>]*>/g;
  let match;
  while ((match = scriptRegex.exec(indexContent)) !== null) {
    assets.js.push(match[1]);
  }
  
  // Extract link tags (CSS, fonts, etc.)
  const linkRegex = /<link[^>]*href="([^"]+)"[^>]*>/g;
  while ((match = linkRegex.exec(indexContent)) !== null) {
    const href = match[1];
    if (href.endsWith('.css')) {
      assets.css.push(href);
    } else if (href.endsWith('.woff') || href.endsWith('.woff2') || href.endsWith('.ttf')) {
      assets.fonts.push(href);
    }
  }
  
  // Extract image sources
  const imgRegex = /<img[^>]*src="([^"]+)"[^>]*>/g;
  while ((match = imgRegex.exec(indexContent)) !== null) {
    assets.images.push(match[1]);
  }
  
  // Extract background images from inline styles
  const bgRegex = /background-image:\s*url\(['"]?([^'"]+)['"]?\)/g;
  while ((match = bgRegex.exec(indexContent)) !== null) {
    assets.images.push(match[1]);
  }
  
  return assets;
}

// Helper function to calculate file size
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err.message);
    return 0;
  }
}

// Helper function to convert bytes to MB
function bytesToMB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2);
}

// Helper function to format asset report
function formatAssetReport(assets, assetSizes) {
  let report = '';
  let totalSize = 0;
  
  // Group by asset type and calculate sizes
  const groupedAssets = {};
  
  for (const [path, size] of Object.entries(assetSizes)) {
    const ext = path.substring(path.lastIndexOf('.'));
    const type = ASSET_TYPES[ext] || 'Other';
    
    if (!groupedAssets[type]) {
      groupedAssets[type] = { count: 0, size: 0, paths: [] };
    }
    
    groupedAssets[type].count++;
    groupedAssets[type].size += size;
    groupedAssets[type].paths.push({ path, size });
    totalSize += size;
  }
  
  // Generate report
  report += `\nTotal page size: ${bytesToMB(totalSize)}MB / ${MAX_PAGE_SIZE_MB}MB (${(totalSize / MAX_PAGE_SIZE_BYTES * 100).toFixed(1)}%)\n`;
  
  // Report by asset type
  for (const [type, data] of Object.entries(groupedAssets)) {
    report += `\n${type} assets (${data.count}): ${bytesToMB(data.size)}MB (${(data.size / totalSize * 100).toFixed(1)}%)\n`;
    
    // List large assets
    const largeAssets = data.paths
      .filter(a => a.size > 100 * 1024) // Assets larger than 100KB
      .sort((a, b) => b.size - a.size);
    
    if (largeAssets.length > 0) {
      report += '  Large assets:\n';
      largeAssets.forEach(a => {
        report += `  - ${a.path}: ${bytesToMB(a.size)}MB\n`;
      });
    }
  }
  
  return { report, totalSize };
}

// Main function to check page sizes
async function checkPageSizes() {
  console.log(`Checking page sizes (maximum allowed: ${MAX_PAGE_SIZE_MB}MB per page)...\n`);
  
  let pagesExceedingLimit = 0;
  let indexHtml;
  
  try {
    indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');
   
  } catch {
  console.error('Error: Could not read built index.html file. Make sure to run "npm run build" first.');
  process.exit(1);
  }
  
  // Get initial assets from index.html
  const baseAssets = getAssetsForPage(indexHtml);
  
  for (const page of PAGES) {
    console.log(`Analyzing ${page.name} (${page.route})...`);
    
    // For SPA, we assume all routes use the same base assets
    const pageAssets = { ...baseAssets };
    const assetSizes = {};
    
    // Calculate HTML size
    assetSizes['index.html'] = Buffer.byteLength(indexHtml, 'utf8');
    
    // Calculate JS sizes
    for (const js of pageAssets.js) {
      const jsPath = js.startsWith('/') ? js.substring(1) : js;
      const filePath = path.join(DIST_DIR, jsPath);
      assetSizes[jsPath] = getFileSize(filePath);
    }
    
    // Calculate CSS sizes
    for (const css of pageAssets.css) {
      const cssPath = css.startsWith('/') ? css.substring(1) : css;
      const filePath = path.join(DIST_DIR, cssPath);
      assetSizes[cssPath] = getFileSize(filePath);
    }
    
    // Calculate Font sizes
    for (const font of pageAssets.fonts) {
      const fontPath = font.startsWith('/') ? font.substring(1) : font;
      const filePath = path.join(DIST_DIR, fontPath);
      assetSizes[fontPath] = getFileSize(filePath);
    }
    
    // Calculate Image sizes - for SPA we need to consider view-specific images
    // This is a simplification - in a real app you'd need to analyze which images are used per route
    const assetsDir = path.join(DIST_DIR, 'assets');
    if (fs.existsSync(assetsDir)) {
      const imageExtensions = ['.webp', '.jpg', '.jpeg', '.png', '.svg'];
      const processDirectory = (directory) => {
        const files = fs.readdirSync(directory);
        
        for (const file of files) {
          const filePath = path.join(directory, file);
          const relativePath = path.relative(DIST_DIR, filePath).replace(/\\/g, '/');
          
          if (fs.statSync(filePath).isDirectory()) {
            processDirectory(filePath);
          } else {
            const ext = path.extname(file).toLowerCase();
            if (imageExtensions.includes(ext)) {
              // Only include images that might be related to this route
              // This is a simplified approach - ideally you'd have a more accurate way 
              // to determine which images are used on each page
              const pageNameLower = page.name.toLowerCase();
              const fileNameLower = file.toLowerCase();
              
              // Include the asset if it's a global asset or seems related to the current page
              const isGlobalAsset = fileNameLower.includes('logo') || 
                                   fileNameLower.includes('icon') || 
                                   fileNameLower.includes('background') ||
                                   fileNameLower.includes('common');
                                   
              const isPageSpecificAsset = page.route === '/' || 
                                         fileNameLower.includes(pageNameLower) ||
                                         (page.route !== '/' && 
                                          page.route.substring(1) && 
                                          fileNameLower.includes(page.route.substring(1)));
              
              if (isGlobalAsset || isPageSpecificAsset) {
                assetSizes[relativePath] = getFileSize(filePath);
              }
            }
          }
        }
      };
      
      processDirectory(assetsDir);
    }
    
    // Format and display the report
    const { report, totalSize } = formatAssetReport(pageAssets, assetSizes);
    console.log(report);
    
    // Check if page exceeds the limit
    if (totalSize > MAX_PAGE_SIZE_BYTES) {
      console.log(`⚠️ WARNING: ${page.name} exceeds the ${MAX_PAGE_SIZE_MB}MB size limit!`);
      console.log(`   Current size: ${bytesToMB(totalSize)}MB (${(totalSize - MAX_PAGE_SIZE_BYTES) / 1024} KB over limit)`);
      pagesExceedingLimit++;
    } else {
      console.log(`✅ ${page.name} is within the size limit (${bytesToMB(totalSize)}MB)`);
    }
    
    console.log('\n' + '-'.repeat(80) + '\n');
  }
  
  // Summary
  if (pagesExceedingLimit > 0) {
    console.log(`⚠️ ${pagesExceedingLimit} page(s) exceed the ${MAX_PAGE_SIZE_MB}MB size limit.`);
    console.log('Consider optimizing assets to reduce page size:');
    console.log('1. Further compress images or use WebP format');
    console.log('2. Load non-critical resources lazily');
    console.log('3. Consider code splitting for JavaScript');
    console.log('4. Use a CDN for large assets');
    return 1;
  } else {
    console.log(`✅ All pages are within the ${MAX_PAGE_SIZE_MB}MB size limit.`);
    return 0;
  }
}

// Run the check
const exitCode = await checkPageSizes();
process.exit(exitCode);
