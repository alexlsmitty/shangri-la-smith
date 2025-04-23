import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

// Import styles last
import './assets/main.css'

// Check if we're on GitHub Pages
const isGitHubPages = window.location.hostname.includes('github.io');
const basePath = isGitHubPages ? '/shangri-la-smith/' : '/';

// Handle GitHub Pages base path
if (isGitHubPages) {
  console.log('Running on GitHub Pages with base path:', basePath);
  
  // Add base path to router
  router.options.history.base = basePath;
  
  // Handle GitHub Pages SPA routing
  const handleGitHubPagesRedirect = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const redirectPath = searchParams.get('redirect');
    
    if (redirectPath) {
      console.log('Handling GitHub Pages redirect to:', redirectPath);
      
      // Clean the URL by removing the query parameter
      const currentPath = window.location.pathname.split('?')[0];
      window.history.replaceState({}, document.title, currentPath);
      
      // Format the path correctly
      let formattedPath = redirectPath;
      if (formattedPath.startsWith(basePath)) {
        formattedPath = formattedPath.substring(basePath.length);
      }
      if (!formattedPath.startsWith('/')) {
        formattedPath = '/' + formattedPath;
      }
      
      // Use router to navigate
      if (formattedPath && formattedPath !== '/') {
        router.push(formattedPath);
      }
    }
  };
  
  // Run after app is mounted
  setTimeout(handleGitHubPagesRedirect, 0);
}

// Create the Vue application
const app = createApp(App);

// Use plugins
app.use(router);
app.use(vuetify);

// Mount the app
app.mount('#app');
