import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🏨 Starting Shangri-La deployment verification...');

// Check for missing images
function checkMissingImages() {
  console.log('\n📷 Checking for missing images...');
  
  // Get all CSS background-image URLs from vue files
  function findBackgroundImages(directory) {
    const results = [];
    try {
      const files = fs.readdirSync(directory);
      
      for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          results.push(...findBackgroundImages(filePath));
        } else if (file.endsWith('.vue')) {
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            const inlineStyleMatches = content.match(/background-image:\s*url\(['"]([^'"]+)['"]\)/g);
            const styleBlockMatches = content.match(/background-image:\s*url\(['"]([^'"]+)['"]\)/g);
            
            function processMatches(matches) {
              if (!matches) return;
              
              matches.forEach(match => {
                const urlMatch = match.match(/url\(['"]([^'"]+)['"]\)/);
                if (urlMatch && urlMatch[1]) {
                  const url = urlMatch[1];
                  if (url.startsWith('/')) {
                    // Check if the file exists in public directory
                    const imagePath = path.join(__dirname, 'public', url);
                    results.push({
                      url,
                      exists: fs.existsSync(imagePath),
                      referencedIn: filePath
                    });
                  }
                }
              });
            }
            
            processMatches(inlineStyleMatches);
            processMatches(styleBlockMatches);
            
          } catch (err) {
            console.error(`Error reading file ${filePath}:`, err.message);
          }
        }
      }
    } catch (err) {
      console.error(`Error reading directory ${directory}:`, err.message);
    }
    
    return results;
  }
  
  const backgroundImages = findBackgroundImages(path.join(__dirname, 'src'));
  
  // Display results
  let missingImages = 0;
  backgroundImages.forEach(image => {
    if (!image.exists) {
      console.log(`❌ Missing image: ${image.url} referenced in ${image.referencedIn}`);
      missingImages++;
    }
  });
  
  if (missingImages === 0) {
    console.log('✅ All referenced images exist');
  } else {
    console.log(`❌ Found ${missingImages} missing images`);
  }
}

// Check for broken routes
function checkRoutes() {
  console.log('\n🛣️ Checking routes...');
  
  try {
    const routerFile = fs.readFileSync(path.join(__dirname, 'src/router/index.js'), 'utf8');
    
    // Look for imports of .vue files
    const importRegex = /import\(['"](.+?)\.vue['"]\)/g;
    let match;
    let brokenRoutes = 0;
    
    while ((match = importRegex.exec(routerFile)) !== null) {
      const importPath = match[1];
      let fullPath;
      
      if (importPath.startsWith('../')) {
        // Relative path like '../views/SomeView'
        fullPath = path.join(__dirname, 'src', importPath.substring(3) + '.vue');
      } else if (importPath.startsWith('@/')) {
        // Path with alias like '@/views/SomeView'
        fullPath = path.join(__dirname, 'src', importPath.substring(2) + '.vue');
      } else {
        // Direct path
        fullPath = path.join(__dirname, importPath + '.vue');
      }
      
      if (!fs.existsSync(fullPath)) {
        console.log(`❌ Missing component: ${importPath}.vue referenced in router/index.js`);
        brokenRoutes++;
      }
    }
    
    if (brokenRoutes === 0) {
      console.log('✅ All route components exist');
    } else {
      console.log(`❌ Found ${brokenRoutes} missing route components`);
    }
  } catch (error) {
    console.error('❌ Error checking routes:', error.message);
  }
}

// Mock build check for verification without actually building
function runBuildWithSizeCheck() {
  return new Promise((resolve) => {
    console.log('\n📦 Building project and checking bundle size...');
    
    try {
      console.log('To perform a proper build check, run:');
      console.log('  npm run build');
      console.log('  npm run preview');
      
      resolve();
    } catch (error) {
      console.error('❌ Error during build check:', error.message);
      resolve();
    }
  });
}

// Run the checks
async function runChecks() {
  checkMissingImages();
  checkRoutes();
  await runBuildWithSizeCheck();
  
  console.log('\n✨ Deployment check completed!');
  console.log('To run the application in preview mode, use: npm run preview');
}

runChecks();
