<script setup>
import { ref, computed, watch } from 'vue';
import { BookingService, RoomService } from '@/services/api';

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
  agreeToTerms: false
});

// Check room availability when dates change
const roomAvailable = ref(true);
const checkingAvailability = ref(false);

// Check room availability when dates change
async function checkRoomAvailability() {
  if (!form.value.checkInDate || !form.value.checkOutDate) return;
  
  try {
    checkingAvailability.value = true;
    
    // Import the Supabase functions
    const { selectData } = await import('@/lib/supabase');
    
    // Generate all dates in the range
    const checkIn = new Date(form.value.checkInDate);
    const checkOut = new Date(form.value.checkOutDate);
    const dates = [];
    
    let currentDate = new Date(checkIn);
    while (currentDate < checkOut) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    console.log('Checking availability for dates:', dates);
    
    // Check availability for each date
    let allDatesAvailable = true;
    
    for (const date of dates) {
      const availabilityData = await selectData('room_availability', {
        select: '*',
        filters: {
          room_type_id: props.room.id,
          date: date
        }
      });
      
      console.log(`Availability for ${date}:`, availabilityData);
      
      // Check if we have availability for this date
      if (!availabilityData || availabilityData.length === 0 || availabilityData[0].available_rooms <= 0) {
        allDatesAvailable = false;
        break;
      }
    }
    
    roomAvailable.value = allDatesAvailable;
    console.log('Room availability result:', roomAvailable.value);
    
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

// Remove handleAuthData function as it's no longer needed

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
  
  try {
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
    
    // Ensure roomTypeId is a number (if it's coming from a string representation)
    bookingData.roomTypeId = parseInt(bookingData.roomTypeId, 10);
    
    // Import the Supabase functions
    const { insertData, updateData, selectData } = await import('@/lib/supabase');
    
    // Generate a reference number
    const reference = `BOOK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Insert booking into database
    const result = await insertData('bookings', {
      reference: reference,
      guest_name: `${bookingData.firstName} ${bookingData.lastName}`,
      guest_email: bookingData.email,
      check_in_date: bookingData.checkInDate,
      check_out_date: bookingData.checkOutDate,
      room_type_id: bookingData.roomTypeId,
      guests_count: bookingData.adults + bookingData.children,
      special_requests: bookingData.specialRequests,
      total_price: bookingData.totalPrice,
      status: 'confirmed'
    });
    
    // Update room availability for all dates between check-in and check-out
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const dates = [];
    
    // Generate all dates in the range
    let currentDate = new Date(checkIn);
    while (currentDate < checkOut) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Log debugging information
    console.log('Booking dates:', dates);
    console.log('Room type ID:', bookingData.roomTypeId);
    
    // For each date, update the room availability
    let availabilitySuccess = true;
    for (const date of dates) {
      try {
        // First, get the current availability for this room on this date
        console.log(`Checking availability for date ${date}`);
        const availabilityData = await selectData('room_availability', {
          select: '*',
          filters: {
            room_type_id: bookingData.roomTypeId,
            date: date
          }
        });
        
        console.log('Availability data:', availabilityData);
        
        // If we found an availability record, update it
        if (availabilityData && availabilityData.length > 0) {
          const currentAvailability = availabilityData[0];
          console.log(`Current available rooms for ${date}:`, currentAvailability.available_rooms);
          
          if (currentAvailability.available_rooms > 0) {
            await updateData('room_availability', 
              { available_rooms: Math.max(0, currentAvailability.available_rooms - 1) },
              { id: currentAvailability.id }
            );
            console.log(`Updated availability for ${date} to ${currentAvailability.available_rooms - 1} rooms`);
          } else {
            console.warn(`No rooms available for ${date}!`);
            availabilitySuccess = false;
          }
        } else {
          console.warn(`No availability record found for ${date}`);
          availabilitySuccess = false;
        }
      } catch (e) {
        console.error(`Error updating availability for ${date}:`, e);
        availabilitySuccess = false;
      }
    }
    
    if (!availabilitySuccess) {
      throw new Error('Some dates are no longer available for booking.');
    }
    
    // Set booking reference for confirmation display
    bookingReference.value = reference;
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
