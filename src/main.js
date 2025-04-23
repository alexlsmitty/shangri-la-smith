import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

// Create the Vue application
const app = createApp(App)

// Use plugins
app.use(router)
app.use(vuetify)

// Mount the app
app.mount('#app')
