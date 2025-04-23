<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { RouterLink } from 'vue-router'
import WeatherWidget from './WeatherWidget.vue'

const { mobile, smAndDown, mdAndDown, name, width } = useDisplay()

// Debug reactive display properties
const displayInfo = computed(() => {
  return {
    mobile: mobile.value,
    smAndDown: smAndDown.value,
    mdAndDown: mdAndDown.value,
    breakpointName: name.value,
    currentWidth: width.value,
  }
})

// Log display info when mounted
onMounted(() => {
  console.log('Display info:', displayInfo.value)
})

const drawer = ref(false)

// Menu items array for navigation
const menuItems = [
  { title: 'Home', route: '/', icon: 'mdi-home' },
  { title: 'Guest Rooms', route: '/rooms', icon: 'mdi-bed' },
  { title: 'Dining', route: '/dining', icon: 'mdi-silverware-fork-knife' },
  { title: 'Spa', route: '/spa', icon: 'mdi-spa' },
  { title: 'Activities', route: '/activities', icon: 'mdi-swim' },
  { title: 'Testimonials', route: '/testimonials', icon: 'mdi-comment-quote' },
  { title: 'My Bookings', route: '/bookings', icon: 'mdi-calendar-account' },
]

// Import the logo directly
import logoImage from '@/assets/shangri-la-logo.svg'

// Use the imported logo
const logoPath = logoImage
</script>

<template>
  <!-- Main Header Component with gradient background -->
  <header class="header">
    <!-- Mobile Menu Button (visible on small screens) -->
    <div class="mobile-menu-button" v-if="mdAndDown">
      <v-btn icon="mdi-menu" color="white" @click="drawer = !drawer" variant="text"></v-btn>
    </div>

    <!-- Logo Section -->
    <div class="logo-section">
      <RouterLink to="/">
        <img :src="logoPath" alt="Shangri-La Beach Resort" class="logo" />
      </RouterLink>
    </div>

    <!-- Desktop Navigation (hidden on small screens) -->
    <nav class="desktop-nav" v-if="!mdAndDown">
      <RouterLink 
        v-for="item in menuItems" 
        :key="item.title" 
        :to="item.route" 
        class="nav-link"
        active-class="nav-link-active"
      >
        {{ item.title }}
      </RouterLink>
    </nav>

    <!-- Weather Widget -->
    <div class="weather-widget-container" v-if="!mdAndDown">
      <WeatherWidget />
    </div>

    <!-- Book Now Button -->
    <div class="book-now-container">
      <v-btn 
        color="secondary" 
        rounded="pill" 
        class="book-now-btn" 
        to="/rooms"
        size="large"
        elevation="2"
      >
        <v-icon left class="mr-1">mdi-calendar-check</v-icon>
        Book Now
      </v-btn>
    </div>
  </header>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer v-model="drawer" temporary location="left" width="280">
    <div class="drawer-header">
      <img :src="logoPath" alt="Shangri-La Beach Resort" class="drawer-logo" />
      <div class="drawer-weather mt-2 pa-2 rounded">
        <WeatherWidget />
      </div>
    </div>

    <v-divider class="mb-2"></v-divider>

    <v-list nav>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :to="item.route"
        :prepend-icon="item.icon"
        @click="drawer = false"
        rounded="lg"
        class="mb-1"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
      
      <v-divider class="my-3"></v-divider>
      
      <v-list-item class="mt-2">
        <v-btn 
          color="secondary" 
          block 
          rounded="pill"
          to="/rooms"
          elevation="2"
          class="py-3"
        >
          <v-icon left class="mr-1">mdi-calendar-check</v-icon>
          Book Now
        </v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.header {
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  align-items: center;
  background: linear-gradient(to right, var(--shangri-la-teal-dark), var(--shangri-la-teal));
  color: white;
  padding: 0 2rem;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  max-width: 100%;
  margin: 0;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 80px;
}

.mobile-menu-button {
  grid-column: 1;
  margin-right: 1rem;
}

.logo-section {
  grid-column: 2;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.logo {
  height: 60px;
  width: auto;
  filter: brightness(0) invert(1); /* Make the logo white */
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.desktop-nav {
  grid-column: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
  letter-spacing: 0.02em;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 50%;
  background-color: var(--shangri-la-coral);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after,
.nav-link-active::after {
  width: 70%;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-link-active {
  font-weight: 600;
}

.weather-widget-container {
  grid-column: 4;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  padding: 0.3rem 0.7rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.weather-widget-container:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.book-now-container {
  grid-column: 5;
}

.book-now-btn {
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: none;
  transition: all 0.3s ease !important;
}

.book-now-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
}

.drawer-header {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(to bottom, var(--shangri-la-teal-dark), var(--shangri-la-teal));
}

.drawer-logo {
  width: 180px;
  height: auto;
  filter: brightness(0) invert(1); /* Make the logo white */
}

.drawer-weather {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 500;
}

/* Responsive Styling */
@media (max-width: 960px) {
  .header {
    grid-template-columns: auto 1fr auto;
    padding: 0 1rem;
    height: 70px;
  }

  .logo-section {
    justify-content: center;
  }

  .logo {
    height: 50px;
  }
  
  .book-now-container {
    grid-column: 3;
  }
  
  .book-now-btn {
    font-size: 0.8rem;
    padding: 0 12px !important;
  }
  
  .book-now-btn .v-icon {
    display: none;
  }
}

@media (min-width: 960px) and (max-width: 1279px) {
  .nav-link {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
  
  .book-now-btn {
    font-size: 0.9rem;
  }
}

@media (min-width: 1280px) {
  .header {
    padding: 0 2rem;
    height: 80px;
  }

  .logo {
    height: 60px;
  }

  .nav-link {
    font-size: 1rem;
  }
}

@media (min-width: 1920px) {
  .header {
    padding: 0 3rem;
    grid-template-columns: 1fr auto 1fr auto auto;
    height: 90px;
  }

  .logo-section {
    grid-column: 1;
    justify-content: flex-end;
    margin-right: 2rem;
  }

  .desktop-nav {
    grid-column: 2;
    gap: 2rem;
  }

  .nav-link {
    font-size: clamp(1rem, 0.8vw, 1.2rem);
    padding: 0.6rem 1rem;
  }

  .weather-widget-container {
    grid-column: 4;
    margin-left: 2rem;
    margin-right: 2rem;
  }
  
  .book-now-container {
    grid-column: 5;
  }

  .logo {
    height: 70px;
  }
}

@media (min-width: 2560px) {
  .header {
    padding: 0 4rem;
    height: 100px;
  }

  .logo {
    height: 80px;
  }

  .desktop-nav {
    gap: 2.5rem;
  }

  .nav-link {
    font-size: clamp(1.1rem, 0.7vw, 1.3rem);
    padding: 0.75rem 1.2rem;
  }

  .weather-widget-container {
    transform: scale(1.1);
    margin-left: 3rem;
    margin-right: 3rem;
  }
  
  .book-now-btn {
    padding: 0 24px !important;
    font-size: 1.1rem;
  }
}

@media (min-width: 3000px) {
  .header {
    padding: 0 5rem;
    height: 120px;
  }

  .logo-section {
    margin-right: 3rem;
  }

  .logo {
    height: 90px;
  }

  .desktop-nav {
    gap: 3rem;
  }

  .nav-link {
    font-size: clamp(1.2rem, 0.6vw, 1.4rem);
    padding: 0.85rem 1.4rem;
  }

  .weather-widget-container {
    transform: scale(1.2);
    margin-left: 4rem;
    margin-right: 4rem;
    padding: 0.5rem 1rem;
  }
  
  .book-now-btn {
    padding: 0 28px !important;
    font-size: 1.2rem;
  }
}
</style>