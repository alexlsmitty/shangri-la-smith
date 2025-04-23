<script setup>
import { ref, onMounted } from 'vue';
import { BookingService } from '@/services/api';

// Bookings list
const bookings = ref([]);
const loading = ref(true);
const error = ref(null);
const searchEmail = ref('');
const filteredBookings = ref([]);

// Load bookings on component mount
onMounted(() => {
  // Don't load all bookings automatically - wait for email search
  loading.value = false;
});

// Load bookings by email
async function loadBookingsByEmail() {
  if (!searchEmail.value.trim()) {
    error.value = 'Please enter an email address to search for your bookings';
    return;
  }
  
  loading.value = true;
  error.value = null;
  
  try {
    const email = searchEmail.value.toLowerCase().trim();
    const data = await BookingService.getBookingsByEmail(email);
    
    bookings.value = data;
    filteredBookings.value = [...data];
  } catch (err) {
    console.error('Error loading bookings:', err);
    error.value = err.response?.data?.error || 'Failed to load bookings. Please try again.';
    bookings.value = [];
    filteredBookings.value = [];
  } finally {
    loading.value = false;
  }
}

// Filter bookings by email
function filterBookingsByEmail() {
  loadBookingsByEmail();
}

// Format date for display
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Handle booking cancellation
async function handleCancelBooking(bookingReference) {
  if (confirm('Are you sure you want to cancel this booking?')) {
    try {
      loading.value = true;
      await BookingService.cancelBooking(bookingReference);
      
      alert('Booking cancelled successfully!');
      loadBookingsByEmail(); // Reload bookings to reflect the change
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      loading.value = false;
    }
  }
}

// Computed property for status color
function getStatusColor(status) {
  switch(status) {
    case 'confirmed': return 'success';
    case 'pending': return 'warning';
    case 'cancelled': return 'error';
    default: return 'info';
  }
}
</script>

<template>
  <div class="booking-management">
    <h2 class="text-h5 font-weight-bold mb-6">Manage Your Bookings</h2>
    
    <!-- Search form -->
    <v-card class="mb-6" variant="outlined">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="searchEmail"
              label="Enter your email address"
              variant="outlined"
              density="comfortable"
              hide-details
              append-inner-icon="mdi-magnify"
              @keyup.enter="filterBookingsByEmail"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" class="text-center text-sm-end">
            <v-btn color="primary" @click="filterBookingsByEmail" :loading="loading">
              Search Bookings
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    
    <!-- Error message -->
    <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable>
      {{ error }}
    </v-alert>
    
    <!-- Bookings list -->
    <div v-if="loading" class="text-center py-6">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-3">Loading bookings...</p>
    </div>
    
    <div v-else-if="filteredBookings.length === 0" class="text-center py-6">
      <v-icon icon="mdi-calendar-remove" size="x-large" color="grey"></v-icon>
      <p class="text-body-1 mt-3">No bookings found</p>
      <p class="text-body-2 text-medium-emphasis">
        {{ searchEmail ? 'Try a different email address or check your booking confirmation.' : 'Make a reservation to see your bookings here.' }}
      </p>
    </div>
    
    <div v-else>
      <v-card v-for="booking in filteredBookings" :key="booking.id" class="mb-4" variant="outlined">
        <v-card-title class="d-flex justify-space-between align-center">
          <div>
            <span class="text-h6">{{ booking.room_name }}</span>
            <v-chip
              :color="getStatusColor(booking.status)"
              size="small"
              class="ml-2"
              variant="tonal"
            >
              {{ booking.status }}
            </v-chip>
          </div>
          <div class="text-subtitle-1 font-weight-bold">${{ booking.total_price }}</div>
        </v-card-title>
        
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <div class="booking-detail">
                <v-icon icon="mdi-calendar-range" class="mr-2"></v-icon>
                <span class="font-weight-medium">{{ formatDate(booking.check_in_date) }} - {{ formatDate(booking.check_out_date) }}</span>
              </div>
              
              <div class="booking-detail">
                <v-icon icon="mdi-account-group" class="mr-2"></v-icon>
                <span>{{ booking.adults }} Adults{{ booking.children > 0 ? `, ${booking.children} Children` : '' }}</span>
              </div>
              
              <div class="booking-detail">
                <v-icon icon="mdi-identifier" class="mr-2"></v-icon>
                <span>Booking Reference: {{ booking.booking_reference }}</span>
              </div>
            </v-col>
            
            <v-col cols="12" md="6">
              <div class="booking-detail">
                <v-icon icon="mdi-account" class="mr-2"></v-icon>
                <span>{{ booking.first_name }} {{ booking.last_name }}</span>
              </div>
              
              <div class="booking-detail">
                <v-icon icon="mdi-email" class="mr-2"></v-icon>
                <span>{{ booking.email }}</span>
              </div>
              
              <div class="booking-detail">
                <v-icon icon="mdi-phone" class="mr-2"></v-icon>
                <span>{{ booking.phone }}</span>
              </div>
            </v-col>
          </v-row>
          
          <div v-if="booking.special_requests" class="mt-2">
            <div class="text-subtitle-2 font-weight-medium">Special Requests:</div>
            <p class="text-body-2">{{ booking.special_requests }}</p>
          </div>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="booking.status === 'confirmed'"
            color="error"
            variant="outlined"
            @click="handleCancelBooking(booking.booking_reference)"
          >
            Cancel Booking
          </v-btn>
          <v-btn
            color="primary"
            variant="tonal"
          >
            View Details
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.booking-detail {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
</style>
