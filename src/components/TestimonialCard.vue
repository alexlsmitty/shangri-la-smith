<script setup>
import { defineProps } from 'vue'

defineProps({
  quote: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 5,
  },
  authorImage: {
    type: String,
    default: null,
  },
})
</script>

<template>
  <v-card class="testimonial-card pa-4 h-100" elevation="2">
    <div class="d-flex flex-column h-100">
      <!-- Quote Section -->
      <div class="quote-wrapper flex-grow-1">
        <v-icon icon="mdi-format-quote-open" size="40" color="primary" class="quote-icon mb-2" />

        <p class="text-body-1 font-italic mb-4">{{ quote }}</p>
      </div>

      <!-- Rating Stars -->
      <div class="my-2">
        <v-rating
          :model-value="rating"
          color="amber"
          density="compact"
          half-increments
          readonly
          size="small"
        ></v-rating>
      </div>

      <!-- Author Info -->
      <div class="author-section d-flex align-center mt-2">
        <v-avatar v-if="authorImage" size="40" class="mr-3">
          <v-img :src="authorImage" alt="Author" />
        </v-avatar>
        <v-avatar v-else color="primary" size="40" class="mr-3">
          <span class="text-h6 white--text">{{ author.charAt(0) }}</span>
        </v-avatar>

        <div>
          <p class="text-subtitle-1 font-weight-medium mb-0">{{ author }}</p>
        </div>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.testimonial-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s;
}

.testimonial-card:hover {
  transform: translateY(-5px);
}

.quote-icon {
  opacity: 0.2;
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 0;
}

.quote-wrapper {
  position: relative;
  z-index: 1;
}

.font-italic {
  font-style: italic;
}
</style>
