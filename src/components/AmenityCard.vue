<script setup>
import { defineProps } from 'vue'

defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  link: {
    type: String,
    default: null,
  },
})
</script>

<template>
  <v-card class="amenity-card h-100" elevation="2">
    <!-- Image (if provided) -->
    <v-img
      v-if="image"
      :src="image"
      height="180"
      cover
      gradient="to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)"
      class="amenity-image"
    >
      <v-card-title class="text-white">{{ title }}</v-card-title>
    </v-img>

    <!-- No image version -->
    <v-card-title v-else class="pt-4 d-flex align-center">
      <v-icon :icon="icon" size="24" color="primary" class="mr-2"></v-icon>
      {{ title }}
    </v-card-title>

    <v-card-text class="py-3">
      <p>{{ description }}</p>
    </v-card-text>

    <!-- Link if provided -->
    <v-card-actions v-if="link">
      <v-spacer></v-spacer>
      <router-link :to="link">
        <v-btn color="primary" variant="text">
          Learn More
          <v-icon icon="mdi-arrow-right" class="ml-1"></v-icon>
        </v-btn>
      </router-link>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.amenity-card {
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  height: 100%;
}

.amenity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.amenity-image {
  position: relative;
}
</style>
