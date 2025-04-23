<script setup>
import BookingManagement from '@/components/booking/BookingManagement.vue';
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-6">My Bookings</h1>
        <p class="text-subtitle-1">View and manage your reservations at Shangri La Beach Resort.</p>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="12">
        <booking-management />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Custom styles for bookings view */
</style>
