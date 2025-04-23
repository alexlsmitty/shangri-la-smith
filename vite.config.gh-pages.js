import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

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
        drop_console: false, // Keep console logs during deployment testing
        drop_debugger: true
      }
    },
    // Make modules work correctly on GitHub Pages
    modulePreload: {
      polyfill: true
    },
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
      },
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
        },
        // Ensure proper paths in JS files
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
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
        // Add base tag
        html = html.replace(
          '<head>',
          '<head>\n    <base href="/shangri-la-smith/">'
        );
        
        // Fix asset paths - ensure they start with the base path
        html = html.replace(
          /src="\//g,
          'src="/shangri-la-smith/'
        );
        html = html.replace(
          /href="\//g,
          'href="/shangri-la-smith/'
        );
        
        // Add importmap for external modules
        html = html.replace(
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
        
        return html;
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
