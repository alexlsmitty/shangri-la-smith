<script setup>
import { ref, computed, onMounted } from 'vue';
import { SpaService, AuthService } from '@/services/api';
import BookingAuthForm from '@/components/auth/BookingAuthForm.vue';

const props = defineProps({
  service: {
    type: Object,
    required: true
  }
});

defineEmits(['booking-completed', 'close']);

// Form data
const form = ref({
  date: '',
  time: '',
  name: '',
  email: '',
  phone: '',
  specialRequests: '',
  createAccount: true,
  username: '',
  password: ''
});

// Form validation rules
const rules = {
  required: value => !!value || 'Required field',
  email: value => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || 'Invalid email address';
  },
  phone: value => {
    const pattern = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return pattern.test(value) || 'Invalid phone number';
  }
};

// Booking status and feedback
const loading = ref(false);
const error = ref(null);
const authError = ref(null);
const bookingComplete = ref(false);
const bookingReference = ref('');
const isLoggedIn = ref(AuthService.isLoggedIn());

// Available time slots
const availableTimeSlots = ref([]);
const loadingTimeSlots = ref(false);

// Fetch available time slots when date changes
async function fetchTimeSlots() {
  if (!form.value.date) return;
  
  loadingTimeSlots.value = true;
  try {
    const response = await SpaService.getAvailableTimeSlots(form.value.date, props.service.id);
    availableTimeSlots.value = response.availableSlots;
  } catch (err) {
    console.error('Error fetching time slots:', err);
    error.value = 'Failed to load available time slots. Please try again.';
  } finally {
    loadingTimeSlots.value = false;
  }
}

// Watch for date changes to update available time slots
function onDateChange() {
  form.value.time = ''; // Reset selected time
  fetchTimeSlots();
}

// Handle authentication data updates from child component
function handleAuthData(authData) {
  form.value.username = authData.username;
  form.value.password = authData.password;
}

// Computed property to check if form is valid
const isFormValid = computed(() => {
  return (
    form.value.date &&
    form.value.time &&
    form.value.name &&
    form.value.email &&
    rules.email(form.value.email) === true &&
    form.value.phone &&
    rules.phone(form.value.phone) === true
  );
});

// Handle form submission
async function submitBooking() {
  if (!isFormValid.value) {
    alert('Please fill in all required fields correctly.');
    return;
  }
  
  loading.value = true;
  error.value = null;
  authError.value = null;
  
  try {
    // Handle authentication first if user wants to create an account
    if (form.value.createAccount && form.value.username && form.value.password) {
      try {
        if (isLoggedIn.value) {
          // User is already logged in
          await AuthService.getCurrentUser();
        } else {
          // Register new user
          const authData = await AuthService.register({
            email: form.value.email,
            username: form.value.username,
            password: form.value.password
          });
          
          // Save auth token
          AuthService.setAuthToken(authData.token);
          isLoggedIn.value = true;
        }
      } catch (authErr) {
        console.error('Authentication error:', authErr);
        authError.value = authErr.response?.data?.error || 'An error occurred during authentication';
        // Continue with booking without linking to account
      }
    }
    
    // Create appointment data object
    const appointmentData = {
      serviceId: props.service.id,
      appointmentDate: form.value.date,
      appointmentTime: form.value.time,
      guestName: form.value.name,
      guestEmail: form.value.email,
      guestPhone: form.value.phone,
      specialRequests: form.value.specialRequests
    };
    
    // Add auth data if creating account
    if (form.value.createAccount && form.value.username && form.value.password) {
      appointmentData.username = form.value.username;
      appointmentData.password = form.value.password;
    }
    
    // Book the appointment
    const response = await SpaService.bookAppointment(appointmentData);
    
    // Set booking reference for confirmation display
    bookingReference.value = response.appointment.booking_reference;
    bookingComplete.value = true;
  } catch (err) {
    console.error('Error booking appointment:', err);
    error.value = err.response?.data?.error || 'An unexpected error occurred while processing your booking.';
  } finally {
    loading.value = false;
  }
}

// Get today's date in YYYY-MM-DD format for min date
const today = new Date().toISOString().split('T')[0];

onMounted(() => {
  // Check authentication status
  isLoggedIn.value = AuthService.isLoggedIn();
});
</script>

<template>
  <div class="spa-booking-form">
    <v-card-title class="d-flex justify-space-between align-center pb-2">
      <span class="text-h5 font-weight-bold">{{ bookingComplete ? 'Booking Confirmed!' : 'Book Your Appointment' }}</span>
      <v-btn icon variant="text" @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    
    <v-divider></v-divider>
    
    <!-- Booking confirmation display -->
    <div v-if="bookingComplete" class="pa-4">
      <v-alert type="success" variant="tonal" class="mb-4">
        <div class="confirmation-icon-container mb-3 d-flex justify-center">
          <v-icon color="success" size="64">mdi-check-circle</v-icon>
        </div>
        <h3 class="text-h6 text-center mb-2">Thank You for Your Booking!</h3>
        <p class="text-body-1 text-center mb-2">Your appointment has been confirmed.</p>
        <p class="text-body-2 text-center mb-2">Booking reference: <strong>{{ bookingReference }}</strong></p>
      </v-alert>
      
      <v-card class="mb-4" variant="outlined">
        <v-card-text>
          <h3 class="text-h6 mb-3">Appointment Details</h3>
          
          <div class="d-flex justify-space-between mb-2">
            <span class="font-weight-medium">Service:</span>
            <span>{{ props.service.name }}</span>
          </div>
          
          <div class="d-flex justify-space-between mb-2">
            <span class="font-weight-medium">Date:</span>
            <span>{{ form.date }}</span>
          </div>
          
          <div class="d-flex justify-space-between mb-2">
            <span class="font-weight-medium">Time:</span>
            <span>{{ form.time }}</span>
          </div>
          
          <div class="d-flex justify-space-between mb-2">
            <span class="font-weight-medium">Duration:</span>
            <span>{{ props.service.duration }}</span>
          </div>
          
          <div class="d-flex justify-space-between mb-2">
            <span class="font-weight-medium">Price:</span>
            <span class="font-weight-bold">${{ props.service.price }}</span>
          </div>
        </v-card-text>
      </v-card>
      
      <div class="text-center">
        <v-btn
          color="primary"
          class="ma-2"
          to="/my-account"
          v-if="isLoggedIn"
        >
          View My Appointments
        </v-btn>
        
        <v-btn
          color="secondary"
          variant="outlined"
          class="ma-2"
          @click="$emit('close')"
        >
          Close
        </v-btn>
      </div>
    </div>

    <!-- Booking form -->
    <v-form v-else class="pa-4" @submit.prevent="submitBooking">
      <!-- Display error message if booking failed -->
      <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable>
        {{ error }}
      </v-alert>
      
      <!-- Service summary -->
      <div class="service-summary mb-4">
        <div class="d-flex align-center">
          <v-icon :icon="props.service.icon || 'mdi-spa'" color="primary" class="mr-2"></v-icon>
          <span class="text-h6">{{ props.service.name }}</span>
        </div>
        <div class="d-flex align-center mt-2">
          <span class="text-subtitle-1 mr-4">{{ props.service.duration }}</span>
          <span class="text-h6 text-primary">${{ props.service.price }}</span>
        </div>
        <p class="text-body-2 mt-2">{{ props.service.description }}</p>
      </div>
      
      <v-divider class="mb-4"></v-divider>
      
      <!-- Appointment details -->
      <h3 class="text-subtitle-1 font-weight-bold mb-3">Appointment Details</h3>
      
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.date"
            label="Date"
            type="date"
            :min="today"
            variant="outlined"
            :rules="[rules.required]"
            required
            @update:model-value="onDateChange"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="form.time"
            label="Time"
            :items="availableTimeSlots"
            variant="outlined"
            :rules="[rules.required]"
            :loading="loadingTimeSlots"
            :disabled="loadingTimeSlots || !form.date || availableTimeSlots.length === 0"
            no-data-text="Please select a date first"
            required
          ></v-select>
        </v-col>
      </v-row>
      
      <!-- Personal information -->
      <h3 class="text-subtitle-1 font-weight-bold mb-3">Personal Information</h3>
      
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="form.name"
            label="Full Name"
            variant="outlined"
            :rules="[rules.required]"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.email"
            label="Email"
            type="email"
            variant="outlined"
            :rules="[rules.required, rules.email]"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.phone"
            label="Phone"
            variant="outlined"
            :rules="[rules.required, rules.phone]"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      
      <v-textarea
        v-model="form.specialRequests"
        label="Special Requests or Notes"
        variant="outlined"
        rows="3"
      ></v-textarea>
      
      <!-- Authentication Section -->
      <v-divider class="my-4"></v-divider>
      
      <h3 class="text-subtitle-1 font-weight-bold mb-3">Account Information</h3>
      
      <div v-if="authError" class="mb-4">
        <v-alert type="error" variant="tonal" closable>
          {{ authError }}
        </v-alert>
      </div>
      
      <v-card v-if="isLoggedIn" variant="outlined" class="mb-4 pa-4">
        <div class="d-flex align-center mb-2">
          <v-icon color="success" class="mr-2">mdi-check-circle</v-icon>
          <span class="text-body-1 font-weight-medium">You are logged in</span>
        </div>
        <p class="text-body-2">
          Your appointment will be linked to your account automatically, allowing you to manage it later.
        </p>
      </v-card>
      
      <template v-else>
        <v-switch
          v-model="form.createAccount"
          color="primary"
          label="Create an account to manage your appointment"
          hide-details
          class="mb-4"
        ></v-switch>
        
        <BookingAuthForm 
          v-if="form.createAccount"
          :email="form.email" 
          :show-register="true"
          @auth-data-updated="handleAuthData"
        />
      </template>
      
      <!-- Submit button -->
      <v-btn
        color="primary"
        size="large"
        type="submit"
        block
        :loading="loading"
        :disabled="!isFormValid || loading"
        class="mt-6"
      >
        Confirm Booking
      </v-btn>
    </v-form>
  </div>
</template>

<style scoped>
.spa-booking-form {
  max-width: 100%;
}

.confirmation-icon-container {
  margin-top: 1rem;
}
</style>
