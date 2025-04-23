import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

// Import styles last
import './assets/main.css'

// Check if we have a redirect parameter (for GitHub Pages 404 handling)
const handleGitHubPagesRedirect = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const redirectPath = searchParams.get('redirect')
  
  if (redirectPath) {
    // Clean the URL by removing the query parameter
    const newURL = window.location.pathname + window.location.hash
    window.history.replaceState({}, document.title, newURL)
    
    // Use router to navigate to the correct route
    router.push(redirectPath)
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
