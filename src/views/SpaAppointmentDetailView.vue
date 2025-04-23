<script setup>
import { ref, onMounted } from 'vue';
import { SpaService } from '@/services/api';

const props = defineProps({
  reference: {
    type: String,
    required: true
  }
});

const appointment = ref(null);
const isLoading = ref(true);
const error = ref(null);

// Fetch appointment details
async function fetchAppointmentDetails() {
  isLoading.value = true;
  error.value = null;
  
  try {
    // This will need to be implemented in the SpaService API
    const response = await SpaService.getAppointmentByReference(props.reference);
    appointment.value = response;
  } catch (err) {
    console.error('Error fetching appointment details:', err);
    error.value = err.response?.data?.error || 'Unable to load appointment details. Please try again later.';
  } finally {
    isLoading.value = false;
  }
}

// Cancel an appointment
async function cancelAppointment() {
  if (!confirm('Are you sure you want to cancel this appointment? This action cannot be undone.')) {
    return;
  }
  
  try {
    await SpaService.cancelAppointment(props.reference);
    await fetchAppointmentDetails(); // Refresh appointment data
  } catch (err) {
    console.error('Error cancelling appointment:', err);
    alert('Failed to cancel appointment. Please try again later.');
  }
}

// Format date for display
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Call API on component mount
onMounted(() => {
  fetchAppointmentDetails();
});
</script>

<template>
  <v-container class="appointment-detail-view py-8">
    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="text-body-1 mt-4">Loading appointment details...</p>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8">
      <v-alert type="error" variant="tonal" class="mb-4">
        {{ error }}
      </v-alert>
      <div class="d-flex justify-center">
        <v-btn color="primary" @click="fetchAppointmentDetails" class="mr-2">Try Again</v-btn>
        <v-btn color="secondary" to="/my-account">Back to Account</v-btn>
      </div>
    </div>
    
    <!-- Appointment details -->
    <div v-else-if="appointment">
      <div class="d-flex justify-space-between align-center mb-6">
        <h1 class="text-h4 font-weight-bold">Spa Appointment Details</h1>
        <v-btn variant="text" color="primary" to="/my-account" prepend-icon="mdi-arrow-left">
          Back to Account
        </v-btn>
      </div>
      
      <v-row>
        <!-- Appointment summary card -->
        <v-col cols="12" md="8">
          <v-card class="mb-6">
            <v-card-item>
              <v-card-title class="text-h5 font-weight-bold d-flex align-center">
                {{ appointment.service_name }}
                <v-chip 
                  :color="appointment.status === 'confirmed' ? 'success' : 'error'" 
                  class="ml-3"
                >
                  {{ appointment.status === 'confirmed' ? 'Confirmed' : 'Cancelled' }}
                </v-chip>
              </v-card-title>
              <v-card-subtitle>Booking Reference: {{ appointment.booking_reference }}</v-card-subtitle>
            </v-card-item>
            
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-img 
                    :src="appointment.image_url" 
                    height="250" 
                    cover 
                    class="rounded-lg mb-4"
                  ></v-img>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <div class="py-2 appointment-details">
                    <h3 class="text-subtitle-1 font-weight-bold mb-3">Appointment Details</h3>
                    
                    <div class="detail-item">
                      <div class="detail-label">Date:</div>
                      <div class="detail-value">{{ formatDate(appointment.appointment_date) }}</div>
                    </div>
                    
                    <div class="detail-item">
                      <div class="detail-label">Time:</div>
                      <div class="detail-value">{{ appointment.appointment_time }}</div>
                    </div>
                    
                    <div class="detail-item">
                      <div class="detail-label">Duration:</div>
                      <div class="detail-value">{{ appointment.duration }}</div>
                    </div>
                    
                    <div class="detail-item">
                      <div class="detail-label">Service Category:</div>
                      <div class="detail-value">{{ appointment.category_name }}</div>
                    </div>
                    
                    <div class="detail-item">
                      <div class="detail-label">Price:</div>
                      <div class="detail-value font-weight-bold">${{ appointment.price }}</div>
                    </div>
                    
                    <div v-if="appointment.status === 'cancelled'" class="detail-item">
                      <div class="detail-label">Cancelled Date:</div>
                      <div class="detail-value">{{ formatDate(appointment.cancelled_date) }}</div>
                    </div>
                  </div>
                </v-col>
              </v-row>
              
              <v-divider class="my-4"></v-divider>
              
              <div class="special-requests">
                <h3 class="text-subtitle-1 font-weight-bold mb-3">Special Requests</h3>
                <p v-if="appointment.special_requests">{{ appointment.special_requests }}</p>
                <p v-else class="text-body-2 text-grey">No special requests</p>
              </div>
            </v-card-text>
            
            <v-card-actions v-if="appointment.status === 'confirmed'">
              <v-btn 
                color="error" 
                variant="outlined"
                @click="cancelAppointment"
              >
                Cancel Appointment
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
                <div class="detail-value">{{ appointment.guest_name }}</div>
              </div>
              
              <div class="detail-item">
                <div class="detail-label">Email:</div>
                <div class="detail-value">{{ appointment.guest_email }}</div>
              </div>
              
              <div class="detail-item">
                <div class="detail-label">Phone:</div>
                <div class="detail-value">{{ appointment.guest_phone }}</div>
              </div>
            </v-card-text>
          </v-card>
          
          <v-card class="mt-4">
            <v-card-item>
              <v-card-title class="text-h6 font-weight-bold">Appointment Policy</v-card-title>
            </v-card-item>
            
            <v-card-text>
              <p class="text-body-2 mb-2">
                <v-icon start size="small" color="info">mdi-information</v-icon>
                Please arrive 15 minutes prior to your scheduled appointment time.
              </p>
              <p class="text-body-2 mb-2">
                <v-icon start size="small" color="info">mdi-information</v-icon>
                Cancellations must be made at least 24 hours in advance to avoid charges.
              </p>
              <p class="text-body-2">
                <v-icon start size="small" color="info">mdi-information</v-icon>
                Gratuity is not included in the service price.
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>
.appointment-detail-view {
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
