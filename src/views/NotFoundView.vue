<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const countdown = ref(5)

// Countdown to automatic redirect
onMounted(() => {
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      router.push('/')
    }
  }, 1000)

  // Clear timer if component is unmounted
  return () => clearInterval(timer)
})

// Go back to home page
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <v-container class="not-found-container d-flex flex-column align-center justify-center text-center">
    <v-img
      src="@/assets/shangri-la-logo.svg"
      alt="Shangri-La Beach Resort"
      max-width="200"
      class="mb-8"
    ></v-img>
    
    <h1 class="text-h2 font-weight-bold mb-4 primary--text">404</h1>
    <h2 class="text-h4 mb-6">Page Not Found</h2>
    
    <v-card class="pa-6 rounded-lg mb-8 elevation-3 not-found-card">
      <p class="text-body-1 mb-4">
        We're sorry, but the page you're looking for isn't available or is still under construction.
      </p>
      <p class="text-body-1">
        You will be automatically redirected to our homepage in {{ countdown }} seconds.
      </p>
    </v-card>
    
    <v-btn
      color="secondary"
      size="large"
      rounded="pill"
      @click="goHome"
      class="home-btn"
    >
      Return to Homepage
      <v-icon end class="ml-2">mdi-home</v-icon>
    </v-btn>
  </v-container>
</template>

<style scoped>
.not-found-container {
  min-height: 80vh;
  padding: 60px 20px;
}

.not-found-card {
  max-width: 500px;
  width: 100%;
  background-color: #f8f8f8;
}

.home-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 0 24px !important;
}
</style>
