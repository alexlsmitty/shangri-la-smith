import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  // For GitHub Pages, we need to use the repository name as the base path
  // This should match your GitHub repository name exactly, including case
  base: '/shangri-la-smith/',
  
  // GitHub Pages specific settings
  define: {
    // Define the base URL for proper module resolution
    '__BASE_URL__': JSON.stringify('/shangri-la-smith/'),
    '__VUE_OPTIONS_API__': true,
    '__VUE_PROD_DEVTOOLS__': false
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 4096, // Default size for inlining small assets (4kb)
    chunkSizeWarningLimit: 1000, // Increase warning limit
    sourcemap: false, // Disable sourcemaps in production
    minify: 'terser', // Use terser for better minification
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs during troubleshooting
        drop_debugger: true
      }
    },
    // Make modules work correctly on GitHub Pages
    modulePreload: {
      polyfill: true
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Group node_modules code into a vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          // Group Vuetify components together
          if (id.includes('vuetify')) {
            return 'ui-framework'
          }
        },
        // Ensure CSS is extracted
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/styles/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  },
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          base: '/shangri-la-smith/',
          includeAbsolute: false,
        },
      },
    }),
    vueDevTools(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        // Add base tag if it doesn't exist
        if (!html.includes('<base href=')) {
          html = html.replace('<head>', '<head>\n    <base href="/shangri-la-smith/">') 
        }
        
        // Add import map for resolving bare module specifiers
        if (!html.includes('importmap')) {
          html = html.replace('</head>', `  <script type="importmap">
    {
      "imports": {
        "vue": "https://unpkg.com/vue@3.5.13/dist/vue.esm-browser.prod.js",
        "vue-router": "https://unpkg.com/vue-router@4.5.0/dist/vue-router.esm-browser.js",
        "vuetify": "https://unpkg.com/vuetify@3.3.23/dist/vuetify.esm.js",
        "@vueuse/core": "https://unpkg.com/@vueuse/core@10.7.0/index.mjs"
      }
    }
    </script>
</head>`)
        }
        
        // Fix asset paths
        html = html.replace(/src="\//g, 'src="/shangri-la-smith/')
        html = html.replace(/href="\//g, 'href="/shangri-la-smith/')
        
        return html
      }
    },
    {
      name: 'post-build',
      closeBundle() {
        // This runs after the build is complete
        const distDir = path.resolve(__dirname, 'dist')
        const indexPath = path.join(distDir, 'index.html')
        
        // If we have an index.html file
        if (fs.existsSync(indexPath)) {
          // Read its content
          const indexContent = fs.readFileSync(indexPath, 'utf8')
          
          // Create a 404.html file for SPA routing
          fs.writeFileSync(path.join(distDir, '404.html'), indexContent)
          
          // Create a script for client-side redirects
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
})();`
          
          fs.writeFileSync(path.join(distDir, 'gh-pages-redirect.js'), redirectScript)
          
          // Add the redirect script to both index.html and 404.html
          const scriptTag = `<script src="/shangri-la-smith/gh-pages-redirect.js"></script>`
          
          if (!indexContent.includes('gh-pages-redirect.js')) {
            const newIndexContent = indexContent.replace('</body>', `${scriptTag}\n</body>`)
            fs.writeFileSync(indexPath, newIndexContent)
            
            // Update 404.html too
            fs.writeFileSync(path.join(distDir, '404.html'), newIndexContent)
          }
          
          console.log('\u2705 Post-build processing for GitHub Pages completed')
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: ['@import "@/assets/styles/variables.scss"', ''].join('\n'),
      },
    },
  },
})