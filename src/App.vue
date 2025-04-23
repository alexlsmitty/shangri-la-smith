<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterView } from 'vue-router';
import TheHeader from './components/TheHeader.vue';
import TheFooter from './components/TheFooter.vue';
import FallbackNotification from './components/shared/FallbackNotification.vue';
import { fallbackState } from './services/api';

// Fallback notification state
const showFallbackAlert = ref(false);
let fallbackUnsubscribe = null;

// Subscribe to fallback state changes
onMounted(() => {
  fallbackUnsubscribe = fallbackState.addListener((isActive) => {
    showFallbackAlert.value = isActive;
  });
});

// Clean up subscription
onUnmounted(() => {
  if (fallbackUnsubscribe) {
    fallbackUnsubscribe();
  }
});

// Handle fallback notification dismissal
const handleFallbackDismiss = () => {
  showFallbackAlert.value = false;
};
</script>

<template>
  <v-app>
    <!-- Header Component -->
    <TheHeader />

    <!-- Main Content -->
    <v-main class="main-content">
      <v-container fluid class="pa-0">
        <RouterView />
      </v-container>
    </v-main>

    <!-- Footer Component -->
    <TheFooter />
    
    <!-- Fallback Notification -->
    <FallbackNotification 
      :show="showFallbackAlert" 
      @dismiss="handleFallbackDismiss" 
    />
  </v-app>
</template>

<style>
/* Global styles */
:root {
  --primary-color: #00695c; /* Teal-based color for primary */
  --secondary-color: #ffa000; /* Amber/gold for secondary */
  --accent-color: #ff7043; /* Coral-like accent */
  --text-color: #37474f; /* Dark blue-grey for text */
  --light-text: #f9f9f9; /* Off-white for light text */
  --dark-bg: #004d40; /* Darker teal for backgrounds */
  --light-bg: #f5f5f5; /* Off-white background */
  --success-color: #4caf50; /* Green for success messages */
  --error-color: #f44336; /* Red for errors */
  --info-color: #2196f3; /* Blue for information */
  --warning-color: #ff9800; /* Orange for warnings */
}

body {
  font-family: 'Montserrat', sans-serif;
  color: var(--text-color);
  background-color: var(--light-bg);
  line-height: 1.6;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.v-application {
  font-family: 'Montserrat', sans-serif !important;
}

/* Ensure Vuetify app bar takes full width */
.v-app-bar {
  width: 100% !important;
  max-width: 100% !important;
}

/* Add custom styles for theme consistency */
.primary {
  background-color: var(--primary-color) !important;
  color: white !important;
}

.secondary {
  background-color: var(--secondary-color) !important;
}

.accent {
  background-color: var(--accent-color) !important;
}

/* Typography */
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 700;
  margin-bottom: 1rem;
}

/* Add transition for smooth navigation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Ensure main content takes up minimum viewport height and centers content */
.main-content {
  min-height: calc(100vh - 200px); /* Subtract approximate header and footer height */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centers content vertically */
  align-items: center; /* Centers content horizontally */
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
}

/* Ensure the app container takes full width */
.v-container.fluid {
  width: 100% !important;
  max-width: 100% !important;
  padding: 0 !important;
}
</style>
