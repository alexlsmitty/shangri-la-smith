// Special entry point for GitHub Pages deployment
// This handles module resolution issues specific to GitHub Pages

// Load Vue from CDN if needed
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import Vuetify for GitHub Pages
import vuetify from './plugins/vuetify'

// Import styles last
import './assets/main.css'

console.log('Starting Shangri-La app in GitHub Pages mode...');

// Check if we have a redirect parameter (for GitHub Pages 404 handling)
const handleGitHubPagesRedirect = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const redirectPath = searchParams.get('redirect')
  
  if (redirectPath) {
    console.log('Handling GitHub Pages redirect to:', redirectPath)
    
    // Clean the URL by removing the query parameter
    const basePath = window.location.pathname.split('?')[0]
    window.history.replaceState({}, document.title, basePath)
    
    // Use router to navigate to the correct route
    let formattedPath = redirectPath
    if (!formattedPath.startsWith('/')) {
      formattedPath = '/' + formattedPath
    }
    if (formattedPath.length > 1 && formattedPath.endsWith('/')) {
      formattedPath = formattedPath.slice(0, -1)
    }
    
    // Prevent routing to empty paths
    if (formattedPath && formattedPath !== '/') {
      router.push(formattedPath)
    }
  }
}

// Create the Vue application
const app = createApp(App)

// Use plugins
app.use(router)
app.use(vuetify)

// Mount the app
app.mount('#app')

// Handle GitHub Pages redirects after mount
handleGitHubPagesRedirect()

// Export the app instance for debugging
window.app = app;
