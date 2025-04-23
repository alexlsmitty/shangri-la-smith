import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Simplest possible config for GitHub Pages
export default defineConfig({
  base: '/shangri-la-smith/',
  plugins: [vue()]
})
