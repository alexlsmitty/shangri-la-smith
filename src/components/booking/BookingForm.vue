<script setup>
import { ref, computed, watch } from 'vue';
import { BookingService, RoomService, AuthService } from '@/services/api';
import BookingAuthForm from '@/components/auth/BookingAuthForm.vue';

const props = defineProps({
  room: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['booking-completed']);

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
const bookingReference = ref('');
const isLoggedIn = ref(AuthService.isLoggedIn());
const authError = ref(null);

// check for pre-filled form data (from room details quick booking)
const initialFormData = props.room.formData || {};

// Form fields
const form = ref({
  checkInDate: initialFormData.checkInDate || '',
  checkOutDate: initialFormData.checkOutDate || '',
  adults: initialFormData.adults || 1,
  children: initialFormData.children || 0,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  specialRequests: '',
  paymentMethod: 'credit-card',
  agreeToTerms: false,
  // Auth fields
  createAccount: true,
  username: '',
  password: ''
});

// Check room availability when dates change
const roomAvailable = ref(true);
const checkingAvailability = ref(false);

async function checkRoomAvailability() {
  if (!form.value.checkInDate || !form.value.checkOutDate) return;
  
  try {
    checkingAvailability.value = true;
    const result = await RoomService.checkAvailability(
      props.room.id,
      form.value.checkInDate,
      form.value.checkOutDate
    );
    roomAvailable.value = result.available;
  } catch (err) {
    console.error('Error checking availability:', err);
    roomAvailable.value = false;
  } finally {
    checkingAvailability.value = false;
  }
}

// Watch date changes to check availability
watch([() => form.value.checkInDate, () => form.value.checkOutDate], () => {
  if (form.value.checkInDate && form.value.checkOutDate) {
    checkRoomAvailability();
  }
});

// Calculate number of nights and total price
const numberOfNights = computed(() => {
  if (!form.value.checkInDate || !form.value.checkOutDate) return 0;
  
  const checkIn = new Date(form.value.checkInDate);
  const checkOut = new Date(form.value.checkOutDate);
  
  // Get the time difference in milliseconds
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  
  // Convert to days
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

const pricePerNight = computed(() => {
  return parseInt(props.room.price.replace(/[^0-9]/g, ''));
});

const totalPrice = computed(() => {
  return numberOfNights.value * pricePerNight.value;
});

// Calculated min and max dates for the date pickers
const today = new Date().toISOString().split('T')[0]; // Today in YYYY-MM-DD format
const minCheckOutDate = computed(() => {
  if (!form.value.checkInDate) return today;
  
  const nextDay = new Date(form.value.checkInDate);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay.toISOString().split('T')[0];
});

// Form validation
const isFormValid = computed(() => {
  return (
    form.value.checkInDate &&
    form.value.checkOutDate &&
    form.value.firstName &&
    form.value.lastName &&
    form.value.email &&
    rules.email(form.value.email) === true &&
    form.value.phone &&
    rules.phone(form.value.phone) === true &&
    form.value.agreeToTerms
  );
});

// Function to handle authentication data updates
function handleAuthData(authData) {
  form.value.username = authData.username;
  form.value.password = authData.password;
}

// Handle form submission
async function submitBooking() {
  if (!isFormValid.value) {
    alert('Please fill in all required fields correctly.');
    return;
  }
  
  if (!roomAvailable.value) {
    alert('We\'re sorry, this room is no longer available for the selected dates. Please try different dates.');
    return;
  }
  
  loading.value = true;
  error.value = null;
  authError.value = null;
  
  try {
    // Handle authentication first if user wants to create an account
    let userId = null;
    
    if (form.value.createAccount && form.value.username && form.value.password) {
      try {
        if (isLoggedIn.value) {
          // Get current user ID
          const userInfo = await AuthService.getCurrentUser();
          userId = userInfo.user.id;
        } else {
          // Register new user
          const authData = await AuthService.register({
            email: form.value.email,
            username: form.value.username,
            password: form.value.password
          });
          
          // Save auth token
          AuthService.setAuthToken(authData.token);
          userId = authData.user.id;
          isLoggedIn.value = true;
        }
      } catch (authErr) {
        console.error('Authentication error:', authErr);
        authError.value = authErr.response?.data?.error || 'An error occurred during authentication';
        // Continue with booking without linking to account
      }
    }
    
    // Create booking object
    const bookingData = {
      roomTypeId: props.room.id,
      checkInDate: form.value.checkInDate,
      checkOutDate: form.value.checkOutDate,
      adults: form.value.adults,
      children: form.value.children,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      phone: form.value.phone,
      specialRequests: form.value.specialRequests,
      paymentMethod: form.value.paymentMethod,
      totalPrice: totalPrice.value
    };
    
    // Add user ID if available
    if (userId) {
      bookingData.userId = userId;
    }
    
    // If user is creating an account but there was an auth error,
    // include the username and password to attempt creation during booking
    if (form.value.createAccount && authError.value && form.value.username && form.value.password) {
      bookingData.username = form.value.username;
      bookingData.password = form.value.password;
    }
    
    // Save booking to API
    const response = await BookingService.createBooking(bookingData);
    
    // Set booking reference for confirmation display
    bookingReference.value = response.booking_reference;
    bookingComplete.value = true;
    
    // Emit completion event
    emit('booking-completed');
  } catch (err) {
    console.error('Error creating booking:', err);
    error.value = err.response?.data?.error || 'An unexpected error occurred while processing your booking.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="booking-form">
    <!-- Booking confirmation display -->
    <div v-if="bookingComplete" class="booking-confirmation">
      <v-alert type="success" variant="tonal" class="mb-4">
        <h3 class="text-h5 mb-2">Booking Confirmed!</h3>
        <p class="mb-2">Your booking reference is: <strong>{{ bookingReference }}</strong></p>
        <p>A confirmation email has been sent to <strong>{{ form.email }}</strong>.</p>
      </v-alert>
      
      <v-card class="mb-4" variant="outlined">
        <v-card-text>
          <h3 class="text-h6 mb-3">Booking Details</h3>
          
          <div class="d-flex justify-space-between mb-2">
            <span class="font-weight-medium">Room:</span>
            <span>{{ room.title }}</span>
          </div>
          
          <div class="d-flex justify-space-between mb-2">
            <span class="font-weight-medium">Check-in:</span>
            <span>{{ form.checkInDate }}</span>
          </div>
          
          <div class="d-flex justify-space-between mb-2">
            <span class="font-weight-medium">Check-out:</span>
            <span>{{ form.checkOutDate }}</span>
          </div>
          
          <div class="d-flex justify-space-between mb-2">
            <span class="font-weight-medium">Guests:</span>
            <span>{{ form.adults }} adults, {{ form.children }} children</span>
          </div>
          
          <div class="d-flex justify-space-between mb-2">
            <span class="font-weight-medium">Total Price:</span>
            <span class="font-weight-bold">${{ totalPrice }}</span>
          </div>
        </v-card-text>
      </v-card>
      
      <div class="text-center">
        <v-btn
          color="primary"
          to="/bookings"
          class="ma-2"
        >
          View My Bookings
        </v-btn>
        
        <v-btn
          color="secondary"
          variant="outlined"
          to="/"
          class="ma-2"
        >
          Return to Home
        </v-btn>
      </div>
    </div>

    <!-- Booking form -->
    <v-form v-else @submit.prevent="submitBooking">
      <!-- Display error message if booking failed -->
      <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable>
        {{ error }}
      </v-alert>
      
      <!-- Display availability warning -->
      <v-alert v-if="!roomAvailable && form.checkInDate && form.checkOutDate" type="warning" variant="tonal" class="mb-4" closable>
        This room is not available for the selected dates. Please choose different dates.
      </v-alert>
      <!-- Room summary -->
      <div class="room-summary mb-6">
        <v-row>
          <v-col cols="12" sm="4">
            <v-img :src="room.image" height="150" cover class="rounded"></v-img>
          </v-col>
          <v-col cols="12" sm="8">
            <h3 class="text-h5 font-weight-bold">{{ room.title }}</h3>
            <p class="text-subtitle-2">{{ room.description }}</p>
            <div class="d-flex align-center">
              <span class="text-h6 font-weight-bold text-primary">{{ room.price }}</span>
              <span class="text-body-2 ml-1">per night</span>
            </div>
          </v-col>
        </v-row>
      </div>
      
      <v-divider class="mb-6"></v-divider>
      
      <!-- Dates and guests section -->
      <h3 class="text-h6 font-weight-bold mb-4">Stay Details</h3>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.checkInDate"
            label="Check-in Date"
            type="date"
            :min="today"
            :rules="[rules.required]"
            variant="outlined"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.checkOutDate"
            label="Check-out Date"
            type="date"
            :min="minCheckOutDate"
            :rules="[rules.required]"
            variant="outlined"
            :disabled="!form.checkInDate"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12" sm="6">
          <v-select
            v-model="form.adults"
            label="Adults"
            :items="[1, 2, 3, 4]"
            variant="outlined"
            required
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="form.children"
            label="Children"
            :items="[0, 1, 2, 3, 4]"
            variant="outlined"
          ></v-select>
        </v-col>
      </v-row>
      
      <!-- Price summary -->
      <v-card class="mb-6" variant="outlined" v-if="numberOfNights > 0">
        <v-card-text>
          <div class="d-flex justify-space-between mb-2">
            <span>{{ room.price }} x {{ numberOfNights }} nights</span>
            <span>${{ pricePerNight * numberOfNights }}</span>
          </div>
          <v-divider class="my-2"></v-divider>
          <div class="d-flex justify-space-between text-h6 font-weight-bold">
            <span>Total</span>
            <span>${{ totalPrice }}</span>
          </div>
        </v-card-text>
      </v-card>
      
      <v-divider class="mb-6"></v-divider>
      
      <!-- Guest information -->
      <h3 class="text-h6 font-weight-bold mb-4">Guest Information</h3>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.firstName"
            label="First Name"
            :rules="[rules.required]"
            variant="outlined"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.lastName"
            label="Last Name"
            :rules="[rules.required]"
            variant="outlined"
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
            :rules="[rules.required, rules.email]"
            variant="outlined"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.phone"
            label="Phone"
            :rules="[rules.required, rules.phone]"
            variant="outlined"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      
      <v-textarea
        v-model="form.specialRequests"
        label="Special Requests"
        variant="outlined"
        rows="3"
      ></v-textarea>
      
      <!-- Authentication Section -->
      <v-divider class="my-6"></v-divider>
      
      <h3 class="text-h6 font-weight-bold mb-4">Account Information</h3>
      
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
          Your booking will be linked to your account automatically, allowing you to manage it later.
        </p>
      </v-card>
      
      <template v-else>
        <v-switch
          v-model="form.createAccount"
          color="primary"
          label="Create an account to manage your booking"
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
      
      <v-divider class="mb-6"></v-divider>
      
      <!-- Payment section -->
      <h3 class="text-h6 font-weight-bold mb-4">Payment Method</h3>
      <v-radio-group v-model="form.paymentMethod" inline>
        <v-radio label="Credit Card" value="credit-card"></v-radio>
        <v-radio label="PayPal" value="paypal"></v-radio>
        <v-radio label="Pay at Property" value="at-property"></v-radio>
      </v-radio-group>
      
      <v-divider class="mb-6"></v-divider>
      
      <!-- Terms and conditions -->
      <v-checkbox
        v-model="form.agreeToTerms"
        label="I agree to the terms and conditions"
        :rules="[rules.required]"
        required
      ></v-checkbox>
      
      <!-- Submit button -->
      <v-btn
        color="primary"
        size="large"
        type="submit"
        block
        :loading="loading"
        :disabled="!isFormValid || !roomAvailable || loading"
        class="mt-4"
      >
        Complete Booking
      </v-btn>
    </v-form>
  </div>
</template>

<style scoped>
.booking-form {
  padding: 16px;
}
</style>
