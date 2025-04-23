// src/plugins/vuetify.js
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Define custom colors for Shangri-La Beach Resort
const customTheme = {
  dark: false,
  colors: {
    // Primary Teal Colors (Ocean Theme)
    primary: '#00a69c',
    'primary-darken-1': '#00756e',
    'primary-lighten-1': '#4dccc2',
    
    // Secondary Coral Colors (Sunset Theme)
    secondary: '#ff7d5e',
    'secondary-darken-1': '#d45e44',
    'secondary-lighten-1': '#ffa48e',
    
    // Accent/Highlight Colors
    accent: '#e6c75c', // Gold
    'accent-darken-1': '#c4a73e',
    'accent-lighten-1': '#f3d97e',
    
    // Neutral Colors
    'neutral-sand': '#f5f0e6',
    'neutral-sand-dark': '#e0d6c4',
    'neutral-deep-blue': '#0d2e4d',
    
    // Status Colors
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    success: '#4caf50',
    
    // UI Surface Colors
    background: '#ffffff',
    surface: '#ffffff',
    'surface-variant': '#f8f9fa',
    
    // Text Colors
    'on-background': '#0d2e4d',
    'on-surface': '#0d2e4d',
    'on-primary': '#ffffff',
    'on-secondary': '#ffffff',
    'on-accent': '#0d2e4d',
    'on-error': '#ffffff',
    'on-warning': '#0d2e4d',
    'on-info': '#ffffff',
    'on-success': '#ffffff'
  }
}

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme
    }
  },
  defaults: {
    VBtn: {
      variant: 'flat',
      style: 'text-transform: none; font-weight: 600; letter-spacing: 0.03em;'
    },
    VCard: {
      elevation: 3,
      rounded: 'lg'
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable'
    },
    VChip: {
      elevation: 1
    }
  }
})