<script setup>
import { ref, onMounted } from 'vue';
import { BookingService } from '@/services/api';

const props = defineProps({
  reference: {
    type: String,
    required: true
  }
});
const booking = ref(null);
const isLoading = ref(true);
const error = ref(null);

// Fetch booking details
async function fetchBookingDetails() {
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await BookingService.getBookingByReference(props.reference);
    booking.value = response;
  } catch (err) {
    console.error('Error fetching booking details:', err);
    error.value = err.response?.data?.error || 'Unable to load booking details. Please try again later.';
  } finally {
    isLoading.value = false;
  }
}

// Cancel a booking
async function cancelBooking() {
  if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
    return;
  }
  
  try {
    await BookingService.cancelBooking(props.reference);
    await fetchBookingDetails(); // Refresh booking data
  } catch (err) {
    console.error('Error cancelling booking:', err);
    alert('Failed to cancel booking. Please try again later.');
  }
}

// Format date for display
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Call API on component mount
onMounted(() => {
  fetchBookingDetails();
});
</script>

<template>
  <v-container class="booking-detail-view py-8">
    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="text-body-1 mt-4">Loading booking details...</p>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8">
      <v-alert type="error" variant="tonal" class="mb-4">
        {{ error }}
      </v-alert>
      <div class="d-flex justify-center">
        <v-btn color="primary" @click="fetchBookingDetails" class="mr-2">Try Again</v-btn>
        <v-btn color="secondary" to="/my-account">Back to Account</v-btn>
      </div>
    </div>
    
    <!-- Booking details -->
    <div v-else-if="booking">
      <div class="d-flex justify-space-between align-center mb-6">
        <h1 class="text-h4 font-weight-bold">Booking Details</h1>
        <v-btn variant="text" color="primary" to="/my-account" prepend-icon="mdi-arrow-left">
          Back to Account
        </v-btn>
      </div>
      
      <v-row>
        <!-- Booking summary card -->
        <v-col cols="12" md="8">
          <v-card class="mb-6">
            <v-card-item>
              <v-card-title class="text-h5 font-weight-bold d-flex align-center">
                {{ booking.room_name }}
                <v-chip 
                  :color="booking.status === 'confirmed' ? 'success' : 'error'" 
                  class="ml-3"
                >
                  {{ booking.status === 'confirmed' ? 'Confirmed' : 'Cancelled' }}
                </v-chip>
              </v-card-title>
              <v-card-subtitle>Booking Reference: {{ booking.booking_reference }}</v-card-subtitle>
            </v-card-item>
            
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-img 
                    :src="booking.room_image" 
                    height="250" 
                    cover 
                    class="rounded-lg mb-4"
                  ></v-img>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <div class="py-2 booking-details">
                    <h3 class="text-subtitle-1 font-weight-bold mb-3">Stay Details</h3>
                    
                    <div class="detail-item">
                      <div class="detail-label">Check-in:</div>
                      <div class="detail-value">{{ formatDate(booking.check_in_date) }}</div>
                    </div>
                    
                    <div class="detail-item">
                      <div class="detail-label">Check-out:</div>
                      <div class="detail-value">{{ formatDate(booking.check_out_date) }}</div>
                    </div>
                    
                    <div class="detail-item">
                      <div class="detail-label">Guests:</div>
                      <div class="detail-value">{{ booking.adults }} adults, {{ booking.children }} children</div>
                    </div>
                    
                    <div class="detail-item">
                      <div class="detail-label">Total Price:</div>
                      <div class="detail-value font-weight-bold">${{ booking.total_price }}</div>
                    </div>
                    
                    <div class="detail-item">
                      <div class="detail-label">Payment Method:</div>
                      <div class="detail-value">{{ booking.payment_method }}</div>
                    </div>
                    
                    <div class="detail-item">
                      <div class="detail-label">Booking Date:</div>
                      <div class="detail-value">{{ formatDate(booking.booking_date) }}</div>
                    </div>
                    
                    <div v-if="booking.status === 'cancelled'" class="detail-item">
                      <div class="detail-label">Cancelled Date:</div>
                      <div class="detail-value">{{ formatDate(booking.cancelled_date) }}</div>
                    </div>
                  </div>
                </v-col>
              </v-row>
              
              <v-divider class="my-4"></v-divider>
              
              <div class="special-requests">
                <h3 class="text-subtitle-1 font-weight-bold mb-3">Special Requests</h3>
                <p v-if="booking.special_requests">{{ booking.special_requests }}</p>
                <p v-else class="text-body-2 text-grey">No special requests</p>
              </div>
            </v-card-text>
            
            <v-card-actions v-if="booking.status === 'confirmed'">
              <v-btn 
                color="error" 
                variant="outlined"
                @click="cancelBooking"
              >
                Cancel Booking
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        
        <!-- Guest information card -->
        <v-col cols="12" md="4">
          <v-card>
            <v-card-item>
              <v-card-title class="text-h6 font-weight-bold">Guest Information</v-card-title>
            </v-card-item>
            
            <v-card-text>
              <div class="detail-item">
                <div class="detail-label">Name:</div>
                <div class="detail-value">{{ booking.first_name }} {{ booking.last_name }}</div>
              </div>
              
              <div class="detail-item">
                <div class="detail-label">Email:</div>
                <div class="detail-value">{{ booking.email }}</div>
              </div>
              
              <div class="detail-item">
                <div class="detail-label">Phone:</div>
                <div class="detail-value">{{ booking.phone }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>
.booking-detail-view {
  max-width: 1200px;
  margin: 0 auto;
}

.detail-item {
  display: flex;
  margin-bottom: 0.75rem;
}

.detail-label {
  font-weight: 500;
  width: 40%;
  color: rgba(0, 0, 0, 0.6);
}

.detail-value {
  width: 60%;
}
</style>
