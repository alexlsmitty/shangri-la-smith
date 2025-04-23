const fs = require('fs');
const path = require('path');

// Your repository name
const REPO_NAME = 'shangri-la-smith';

// Read the index.html file
const indexPath = path.join(__dirname, 'dist', 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

console.log('Fixing GitHub Pages deployment...');

// 1. Add base tag if it doesn't exist
if (!indexContent.includes('<base href=')) {
  console.log('Adding base tag...');
  indexContent = indexContent.replace(
    '<head>',
    `<head>\n    <base href="/${REPO_NAME}/">`
  );
}

// 2. Add import map for resolving bare module specifiers
if (!indexContent.includes('importmap')) {
  console.log('Adding import map...');
  indexContent = indexContent.replace(
    '</head>',
    `  <script type="importmap">
    {
      "imports": {
        "vue": "https://unpkg.com/vue@3.5.13/dist/vue.esm-browser.prod.js",
        "vue-router": "https://unpkg.com/vue-router@4.5.0/dist/vue-router.esm-browser.js",
        "vuetify": "https://unpkg.com/vuetify@3.3.23/dist/vuetify.esm.js",
        "@vueuse/core": "https://unpkg.com/@vueuse/core@10.7.0/index.mjs"
      }
    }
    </script>
</head>`
  );
}

// 3. Fix asset paths to include the repository name
console.log('Fixing asset paths...');
indexContent = indexContent.replace(/src="\//g, `src="/${REPO_NAME}/`);
indexContent = indexContent.replace(/href="\//g, `href="/${REPO_NAME}/`);

// Write the fixed content back
fs.writeFileSync(indexPath, indexContent);

// 4. Create a copy of index.html as 404.html for SPA routing
console.log('Creating 404.html for SPA routing...');
fs.copyFileSync(indexPath, path.join(__dirname, 'dist', '404.html'));

// 5. Create a script for client-side redirects
const redirectScript = `
// Handle GitHub Pages SPA routing
(function() {
  const l = window.location;
  if (l.search) {
    const q = {};
    l.search.slice(1).split('&').forEach(v => {
      const a = v.split('=');
      q[a[0]] = a[1];
    });
    if (q.redirect) {
      const path = q.redirect.replace(/~and~/g, '&');
      history.replaceState(null, null, 
        l.pathname.slice(0, -1) + (path.startsWith('/') ? path : '/' + path) + 
        (q.query ? ('?' + q.query) : '') + 
        l.hash
      );
    }
  }
})();
`;

fs.writeFileSync(path.join(__dirname, 'dist', 'gh-pages-redirect.js'), redirectScript);

// Add the redirect script to index.html and 404.html
let indexWithRedirect = fs.readFileSync(indexPath, 'utf8');
indexWithRedirect = indexWithRedirect.replace(
  '</body>',
  `<script src="/${REPO_NAME}/gh-pages-redirect.js"></script>\n</body>`
);
fs.writeFileSync(indexPath, indexWithRedirect);

// Do the same for 404.html
let notFoundContent = fs.readFileSync(path.join(__dirname, 'dist', '404.html'), 'utf8');
notFoundContent = notFoundContent.replace(
  '</body>',
  `<script src="/${REPO_NAME}/gh-pages-redirect.js"></script>\n</body>`
);
fs.writeFileSync(path.join(__dirname, 'dist', '404.html'), notFoundContent);

console.log('GitHub Pages fixes applied successfully!');
