import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 4096, // Default size for inlining small assets (4kb)
    chunkSizeWarningLimit: 1000, // Increase warning limit
    sourcemap: false, // Disable sourcemaps in production
    minify: 'esbuild', // Use esbuild (built-in) instead of terser
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
  base: '/', // Using root path for better compatibility with Vercel
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),
    vueDevTools(),
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
