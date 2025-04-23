#!/bin/bash
# Script to properly build for GitHub Pages

# 1. Clear the dist directory first
echo "Clearing dist directory..."
rm -rf dist

# 2. Build specifically using the GitHub Pages config
echo "Building with GitHub Pages configuration..."
npm run build:github

# 3. Ensure correct base tag is present
echo "Verifying build files..."
grep -l "<base href=" dist/index.html || echo "<base> tag missing! Adding it..."

# 4. If base tag is missing, add it
if ! grep -q "<base href=" dist/index.html; then
  echo "Adding base tag to dist/index.html..."
  sed -i 's/<meta charset="UTF-8">/<meta charset="UTF-8">\n    <base href="\/shangri-la-smith\/">/' dist/index.html
fi

# 5. Create a copy of index.html as 404.html for client-side routing
echo "Creating 404.html for SPA routing..."
cp dist/index.html dist/404.html

echo "Build completed. Files ready for GitHub Pages deployment."
