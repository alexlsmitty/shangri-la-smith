<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  email: {
    type: String,
    required: true
  },
  showRegister: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['auth-data-updated']);

// Form data
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const rememberMe = ref(true);
const acceptTerms = ref(false);

// Form validation
const errors = ref({
  username: '',
  password: '',
  confirmPassword: ''
});

// Computed property to check if form is valid
const isValid = computed(() => {
  if (props.showRegister) {
    return (
      username.value.length >= 3 &&
      password.value.length >= 6 &&
      password.value === confirmPassword.value &&
      acceptTerms.value
    );
  } else {
    return username.value.length >= 3 && password.value.length >= 6;
  }
});

// Validate form
const validateForm = () => {
  let isValid = true;
  errors.value = {
    username: '',
    password: '',
    confirmPassword: ''
  };

  // Validate username
  if (username.value.length < 3) {
    errors.value.username = 'Username must be at least 3 characters';
    isValid = false;
  }

  // Validate password
  if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters';
    isValid = false;
  }

  // Validate confirm password (only for registration)
  if (props.showRegister && password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match';
    isValid = false;
  }

  return isValid;
};

// Handle form submission
const handleAuth = () => {
  if (!validateForm()) return;

  emit('auth-data-updated', {
    username: username.value,
    password: password.value,
    rememberMe: rememberMe.value
  });
};

// Watch for email changes to suggest a username
function suggestUsername(email) {
  if (email && !username.value) {
    // Extract username from email (before the @)
    const suggestedUsername = email.split('@')[0];
    username.value = suggestedUsername;
  }
}

// Call suggestUsername on mount if email is provided
if (props.email) {
  suggestUsername(props.email);
}
</script>

<template>
  <div class="booking-auth-form">
    <v-card variant="outlined" class="mb-4 pa-4">
      <h3 v-if="showRegister" class="text-h6 mb-4">Create Account to Manage Your Booking</h3>
      <h3 v-else class="text-h6 mb-4">Login to Manage Your Booking</h3>
      
      <p class="text-body-2 mb-4">
        <v-icon color="info" class="mr-2">mdi-information</v-icon>
        <span v-if="showRegister">Creating an account allows you to view and manage your bookings easily.</span>
        <span v-else>Login to access and manage your existing bookings.</span>
      </p>
      
      <v-form @submit.prevent="handleAuth">
        <v-text-field
          v-model="username"
          label="Username"
          variant="outlined"
          :error-messages="errors.username"
          required
          dense
        ></v-text-field>
        
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          variant="outlined"
          :error-messages="errors.password"
          required
          dense
        ></v-text-field>
        
        <v-text-field
          v-if="showRegister"
          v-model="confirmPassword"
          label="Confirm Password"
          type="password"
          variant="outlined"
          :error-messages="errors.confirmPassword"
          required
          dense
        ></v-text-field>
        
        <v-checkbox
          v-model="rememberMe"
          label="Remember me"
          density="compact"
          hide-details
          class="mb-2"
        ></v-checkbox>
        
        <v-checkbox
          v-if="showRegister"
          v-model="acceptTerms"
          label="I accept the terms and conditions"
          density="compact"
          hide-details
          required
          class="mb-4"
        ></v-checkbox>
        
        <v-btn
          color="primary"
          type="submit"
          block
          :disabled="!isValid"
          size="large"
          class="mt-4"
          @click="handleAuth"
        >
          {{ showRegister ? 'Create Account' : 'Login' }}
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<style scoped>
.booking-auth-form {
  margin-top: 1rem;
}
</style>
