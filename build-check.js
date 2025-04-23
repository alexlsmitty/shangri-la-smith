import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🏨 Starting Shangri-La build verification...');

try {
  // Run lint on frontend code only
  console.log('\n🔍 Running ESLint on frontend code...');
  try {
    execSync('npm run lint:frontend', { stdio: 'inherit' });
    console.log('✅ ESLint passed for frontend code');
  } catch (_) {
    console.error('❌ ESLint failed - please fix the issues before deploying');
    process.exit(1);
  }

  // Run build
  console.log('\n🏗️ Building project...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build successful');
  } catch (_) {
    console.error('❌ Build failed - please fix the issues before deploying');
    process.exit(1);
  }

  // Check build size
  console.log('\n📏 Checking build size...');
  const getTotalSize = (directory) => {
    let totalSize = 0;
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        totalSize += getTotalSize(filePath);
      } else {
        totalSize += stat.size;
      }
    }
    
    return totalSize;
  };

  const distSize = getTotalSize(path.join(__dirname, 'dist'));
  const sizeInMB = (distSize / (1024 * 1024)).toFixed(2);
  
  console.log(`📊 Total bundle size: ${sizeInMB} MB`);
  
  if (sizeInMB > 10) {
    console.warn('⚠️ Warning: Build size is larger than 10MB, consider optimizing');
  } else {
    console.log('✅ Build size is acceptable');
  }

  // Check individual page sizes
  const checkPageSize = () => {
    console.log('\n📄 Checking individual page sizes...');
    
    const assetsDir = path.join(__dirname, 'dist/assets');
    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      let largeFiles = 0;
      
      files.forEach(file => {
        if (file.endsWith('.js') || file.endsWith('.css')) {
          const filePath = path.join(assetsDir, file);
          const stat = fs.statSync(filePath);
          const fileSizeInKB = (stat.size / 1024).toFixed(2);
          const fileSizeInMB = (stat.size / (1024 * 1024)).toFixed(2);
          
          console.log(`   - ${file}: ${fileSizeInKB} KB (${fileSizeInMB} MB)`);
          
          if (stat.size > 1.8 * 1024 * 1024) {
            console.warn(`   ⚠️ Warning: ${file} exceeds 1.8MB limit (${fileSizeInMB} MB)`);
            largeFiles++;
          }
        }
      });
      
      if (largeFiles === 0) {
        console.log('✅ All files are within the 1.8MB per page limit');
      } else {
        console.warn(`⚠️ Warning: ${largeFiles} files exceed the 1.8MB per page limit`);
      }
    }
  };
  
  checkPageSize();

  // All checks passed
  console.log('\n🎉 All build checks passed!');
  console.log('To preview the build, run: npm run preview');
  
} catch (error) {
  console.error('\n❌ Build verification failed:', error.message);
  process.exit(1);
}
