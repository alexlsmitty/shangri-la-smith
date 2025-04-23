<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  amenities: {
    type: Array,
    default: () => []
  },
  price: {
    type: String,
    default: ''
  },
  detailsLink: {
    type: String,
    default: '/rooms'
  }
})
</script>

<template>
  <v-card class="room-card h-100" elevation="3">
    <div class="position-relative">
      <v-img 
        :src="image" 
        height="250" 
        cover 
      />
      <!-- Accessibility Icon Overlay for the Accessible Room -->
      <div v-if="title.includes('Accessible')" class="accessibility-overlay">
        <v-icon icon="mdi-wheelchair-accessibility" size="x-large" color="white"></v-icon>
      </div>
    </div>

    <v-card-title class="text-h5 font-weight-medium">{{ title }}</v-card-title>

    <v-card-text>
      <p class="mb-4">{{ description }}</p>

      <div v-if="amenities.length > 0" class="amenities mb-4">
        <v-chip 
          v-for="(amenity, index) in amenities" 
          :key="index"
          size="small"
          class="mr-1 mb-1"
          color="primary"
          variant="outlined"
        >
          {{ amenity }}
        </v-chip>
      </div>

      <div v-if="price" class="price-section text-right">
        <div class="text-primary text-h6 font-weight-bold">{{ price }}</div>
        <div class="text-caption">per night</div>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <router-link :to="detailsLink">
        <v-btn color="primary" variant="tonal">
          View Details
        </v-btn>
      </router-link>
      <v-btn color="secondary" @click="$emit('book-now')">
        Book Now
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.room-card {
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
}

.room-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.amenities {
  margin-top: 15px;
}

.price-section {
  margin-top: 10px;
}

.position-relative {
  position: relative;
}

.accessibility-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
