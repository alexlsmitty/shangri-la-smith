/**
 * Script to check GitHub Pages configuration
 */

const fs = require('fs');
const path = require('path');

// Define colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}Checking GitHub Pages configuration...${colors.reset}\n`);

// Check if the repository name is correctly set in vite.config.gh-pages.js
try {
  const configPath = path.join(__dirname, '..', 'vite.config.gh-pages.js');
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Extract base path from the config
  const basePathMatch = configContent.match(/base:\s*['"]([^'"]+)['"]/);
  if (!basePathMatch) {
    console.log(`${colors.red}ERROR: Could not find base path in vite.config.gh-pages.js${colors.reset}`);
  } else {
    const basePath = basePathMatch[1];
    
    // Get repository name from git config
    const gitConfigPath = path.join(__dirname, '..', '.git', 'config');
    const gitConfig = fs.readFileSync(gitConfigPath, 'utf8');
    
    const repoUrlMatch = gitConfig.match(/url\s*=\s*.*[\/:]([^\/]+?)(?:\.git)?$/);
    const repoName = repoUrlMatch ? repoUrlMatch[1] : null;
    
    if (!repoName) {
      console.log(`${colors.yellow}WARNING: Could not determine repository name from git config${colors.reset}`);
    } else {
      const expectedBase = `/${repoName}/`;
      
      if (basePath === expectedBase) {
        console.log(`${colors.green}✓ Base path is correctly set to '${basePath}'${colors.reset}`);
      } else {
        console.log(`${colors.red}ERROR: Base path in vite.config.gh-pages.js is set to '${basePath}', but should be '${expectedBase}'${colors.reset}`);
      }
    }
  }
} catch (error) {
  console.log(`${colors.red}ERROR: Could not read vite.config.gh-pages.js: ${error.message}${colors.reset}`);
}

// Check if .nojekyll file will be created
try {
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'deploy.yml');
  const workflowContent = fs.readFileSync(workflowPath, 'utf8');
  
  if (workflowContent.includes('.nojekyll')) {
    console.log(`${colors.green}✓ GitHub workflow correctly creates .nojekyll file${colors.reset}`);
  } else {
    console.log(`${colors.red}ERROR: GitHub workflow does not create .nojekyll file${colors.reset}`);
  }
} catch (error) {
  console.log(`${colors.red}ERROR: Could not read GitHub workflow file: ${error.message}${colors.reset}`);
}

// Check if 404.html exists in public folder
const notFoundPath = path.join(__dirname, '..', 'public', '404.html');
if (fs.existsSync(notFoundPath)) {
  console.log(`${colors.green}✓ 404.html file exists in public folder${colors.reset}`);
} else {
  console.log(`${colors.red}ERROR: 404.html file does not exist in public folder${colors.reset}`);
}

// Check for environment variables in the workflow
try {
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'deploy.yml');
  const workflowContent = fs.readFileSync(workflowPath, 'utf8');
  
  const envVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'VITE_OPENWEATHER_API_KEY'];
  const missingVars = [];
  
  for (const envVar of envVars) {
    if (!workflowContent.includes(envVar)) {
      missingVars.push(envVar);
    }
  }
  
  if (missingVars.length === 0) {
    console.log(`${colors.green}✓ All required environment variables are set in the workflow${colors.reset}`);
  } else {
    console.log(`${colors.red}ERROR: The following environment variables are missing from the workflow: ${missingVars.join(', ')}${colors.reset}`);
  }
} catch (error) {
  console.log(`${colors.red}ERROR: Could not read GitHub workflow file: ${error.message}${colors.reset}`);
}

console.log(`\n${colors.cyan}GitHub Pages configuration check complete.${colors.reset}`);
console.log(`${colors.yellow}Remember to set your repository secrets in GitHub:${colors.reset}`);
console.log(`${colors.yellow}1. Go to your repository settings${colors.reset}`);
console.log(`${colors.yellow}2. Navigate to "Secrets and variables" -> "Actions"${colors.reset}`);
console.log(`${colors.yellow}3. Add the following secrets:${colors.reset}`);
console.log(`${colors.yellow}   - VITE_SUPABASE_URL${colors.reset}`);
console.log(`${colors.yellow}   - VITE_SUPABASE_ANON_KEY${colors.reset}`);
console.log(`${colors.yellow}   - VITE_OPENWEATHER_API_KEY${colors.reset}`);
