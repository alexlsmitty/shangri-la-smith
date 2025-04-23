<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  service: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['booking-completed', 'close']);

// Form data
const form = ref({
  date: '',
  time: '',
  name: '',
  email: '',
  phone: '',
  specialRequests: '',
  createAccount: false
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
const bookingComplete = ref(false);
const bookingReference = ref('SB-' + Math.floor(Math.random() * 10000));

// Available time slots (will be populated based on date selection)
const availableTimeSlots = ref([]);

// Function to get available time slots for a specific date
async function getAvailableTimeSlots(date) {
  try {
    const { selectData } = await import('@/lib/supabase');
    
    // Get all booked appointments for this date
    const bookedAppointments = await selectData('spa_appointments', {
      select: 'appointment_time',
      filters: {
        appointment_date: date,
        service_id: props.service.id
      }
    });
    
    // Generate all possible time slots (9 AM - 5 PM)
    const allTimeSlots = generateTimeSlots(9, 17);
    
    // Filter out booked slots
    const bookedTimes = bookedAppointments.map(a => a.appointment_time);
    return allTimeSlots.filter(time => !bookedTimes.includes(time));
  } catch (err) {
    console.error('Error getting available time slots:', err);
    // Return a default set of time slots if there's an error
    return ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
  }
}

// Generate time slots for a given range
function generateTimeSlots(startHour, endHour) {
  const slots = [];
  
  for (let hour = startHour; hour <= endHour; hour++) {
    const amPm = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    
    slots.push(`${displayHour}:00 ${amPm}`);
    if (hour < endHour) {
      slots.push(`${displayHour}:30 ${amPm}`);
    }
  }
  
  return slots;
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
  
  try {
    // Create the appointment data object
    const appointmentData = {
      serviceId: props.service.id,
      date: form.value.date,
      time: form.value.time,
      guestName: form.value.name,
      guestEmail: form.value.email,
      phone: form.value.phone,
      notes: form.value.specialRequests
    };
    
    // Import the Supabase functions
    const { insertData } = await import('@/lib/supabase');
    
    // Insert the appointment into the database
    const result = await insertData('spa_appointments', {
      service_id: appointmentData.serviceId,
      guest_name: appointmentData.guestName,
      guest_email: appointmentData.guestEmail,
      appointment_date: appointmentData.date,
      appointment_time: appointmentData.time,
      status: 'confirmed',
      reference: 'SPA-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000)
    });
    
    // Set booking reference for confirmation display
    bookingReference.value = result[0].reference;
    bookingComplete.value = true;
    
    // Emit completion event
    emit('booking-completed');
  } catch (err) {
    console.error('Error booking appointment:', err);
    error.value = 'An unexpected error occurred while processing your booking.';
  } finally {
    loading.value = false;
  }
}

// Get today's date in YYYY-MM-DD format for min date
const today = new Date().toISOString().split('T')[0];

// Function to update available time slots when date changes
async function updateAvailableTimeSlots() {
  if (form.value.date) {
    form.value.time = ''; // Reset the selected time
    availableTimeSlots.value = await getAvailableTimeSlots(form.value.date);
  }
}
</script>

<template>
  <v-card>
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
            @update:model-value="updateAvailableTimeSlots"
        ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="form.time"
            label="Time"
            :items="availableTimeSlots"
            variant="outlined"
            :rules="[rules.required]"
            :disabled="!form.date"
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
  </v-card>
</template>

<style scoped>
.confirmation-icon-container {
  margin-top: 1rem;
}
</style>