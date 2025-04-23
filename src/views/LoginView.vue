<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { AuthService } from '@/services/api';

const router = useRouter();
const route = useRoute();

// Form data
const form = ref({
  identifier: '',
  password: '',
  rememberMe: true
});

// UI state
const isLoading = ref(false);
const error = ref(null);
const showRegisterForm = ref(false);

// Form for registration
const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
});

// Form validation
const formErrors = ref({
  identifier: '',
  password: ''
});

const registerErrors = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// Computed properties for form validation
const isLoginFormValid = computed(() => {
  return form.value.identifier && form.value.password;
});

const isRegisterFormValid = computed(() => {
  return (
    registerForm.value.username &&
    registerForm.value.email &&
    registerForm.value.password &&
    registerForm.value.password === registerForm.value.confirmPassword &&
    registerForm.value.agreeToTerms
  );
});

// Handle login form submission
async function handleLogin() {
  // Reset any previous errors
  formErrors.value = { identifier: '', password: '' };
  error.value = null;
  
  // Validate form
  if (!form.value.identifier) {
    formErrors.value.identifier = 'Username or email is required';
  }
  
  if (!form.value.password) {
    formErrors.value.password = 'Password is required';
  }
  
  if (!isLoginFormValid.value) {
    return;
  }
  
  isLoading.value = true;
  
  try {
    // Attempt to log in
    const response = await AuthService.login({
      identifier: form.value.identifier,
      password: form.value.password
    });
    
    // Store authentication token
    AuthService.setAuthToken(response.token);
    
    // Redirect to intended destination or account page
    const redirectPath = route.query.redirect || '/my-account';
    router.push(redirectPath);
  } catch (err) {
    console.error('Login error:', err);
    error.value = err.response?.data?.error || 'Invalid username or password. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

// Handle registration form submission
async function handleRegister() {
  // Reset any previous errors
  registerErrors.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  error.value = null;
  
  // Validate form
  let valid = true;
  
  if (!registerForm.value.username) {
    registerErrors.value.username = 'Username is required';
    valid = false;
  } else if (registerForm.value.username.length < 3) {
    registerErrors.value.username = 'Username must be at least 3 characters';
    valid = false;
  }
  
  if (!registerForm.value.email) {
    registerErrors.value.email = 'Email is required';
    valid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(registerForm.value.email)) {
    registerErrors.value.email = 'Please enter a valid email address';
    valid = false;
  }
  
  if (!registerForm.value.password) {
    registerErrors.value.password = 'Password is required';
    valid = false;
  } else if (registerForm.value.password.length < 6) {
    registerErrors.value.password = 'Password must be at least 6 characters';
    valid = false;
  }
  
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    registerErrors.value.confirmPassword = 'Passwords do not match';
    valid = false;
  }
  
  if (!registerForm.value.agreeToTerms) {
    error.value = 'You must agree to the terms and conditions';
    valid = false;
  }
  
  if (!valid) {
    return;
  }
  
  isLoading.value = true;
  
  try {
    // Attempt to register
    const response = await AuthService.register({
      username: registerForm.value.username,
      email: registerForm.value.email,
      password: registerForm.value.password
    });
    
    // Store authentication token
    AuthService.setAuthToken(response.token);
    
    // Redirect to account page
    router.push('/my-account');
  } catch (err) {
    console.error('Registration error:', err);
    error.value = err.response?.data?.error || 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

// Toggle between login and register forms
function toggleForm() {
  showRegisterForm.value = !showRegisterForm.value;
  error.value = null;
}
</script>

<template>
  <div class="login-view">
    <v-container class="py-12">
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-card class="pa-6 elevation-3">
            <!-- Card header -->
            <v-card-title class="text-center text-h4 pb-4">
              {{ showRegisterForm ? 'Create Account' : 'Login to Your Account' }}
            </v-card-title>
            
            <!-- Error display -->
            <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable>
              {{ error }}
            </v-alert>
            
            <!-- Login Form -->
            <v-form v-if="!showRegisterForm" @submit.prevent="handleLogin">
              <v-text-field
                v-model="form.identifier"
                label="Username or Email"
                :error-messages="formErrors.identifier"
                variant="outlined"
                prepend-inner-icon="mdi-account"
                required
              ></v-text-field>
              
              <v-text-field
                v-model="form.password"
                label="Password"
                type="password"
                :error-messages="formErrors.password"
                variant="outlined"
                prepend-inner-icon="mdi-lock"
                required
              ></v-text-field>
              
              <div class="d-flex align-center justify-space-between mb-6">
                <v-checkbox
                  v-model="form.rememberMe"
                  label="Remember me"
                  hide-details
                ></v-checkbox>
                
                <v-btn variant="text" color="primary" class="text-caption">
                  Forgot Password?
                </v-btn>
              </div>
              
              <v-btn
                color="primary"
                size="large"
                block
                :loading="isLoading"
                :disabled="!isLoginFormValid"
                type="submit"
              >
                Sign In
              </v-btn>
              
              <div class="text-center mt-6">
                <p class="text-body-2">
                  Don't have an account?
                  <v-btn variant="text" color="primary" class="ml-1" @click="toggleForm">
                    Sign Up
                  </v-btn>
                </p>
              </div>
            </v-form>
            
            <!-- Register Form -->
            <v-form v-else @submit.prevent="handleRegister">
              <v-text-field
                v-model="registerForm.username"
                label="Username"
                :error-messages="registerErrors.username"
                variant="outlined"
                prepend-inner-icon="mdi-account"
                required
              ></v-text-field>
              
              <v-text-field
                v-model="registerForm.email"
                label="Email"
                type="email"
                :error-messages="registerErrors.email"
                variant="outlined"
                prepend-inner-icon="mdi-email"
                required
              ></v-text-field>
              
              <v-text-field
                v-model="registerForm.password"
                label="Password"
                type="password"
                :error-messages="registerErrors.password"
                variant="outlined"
                prepend-inner-icon="mdi-lock"
                required
              ></v-text-field>
              
              <v-text-field
                v-model="registerForm.confirmPassword"
                label="Confirm Password"
                type="password"
                :error-messages="registerErrors.confirmPassword"
                variant="outlined"
                prepend-inner-icon="mdi-lock-check"
                required
              ></v-text-field>
              
              <v-checkbox
                v-model="registerForm.agreeToTerms"
                label="I agree to the Terms and Privacy Policy"
                required
              ></v-checkbox>
              
              <v-btn
                color="primary"
                size="large"
                block
                :loading="isLoading"
                :disabled="!isRegisterFormValid"
                type="submit"
              >
                Create Account
              </v-btn>
              
              <div class="text-center mt-6">
                <p class="text-body-2">
                  Already have an account?
                  <v-btn variant="text" color="primary" class="ml-1" @click="toggleForm">
                    Sign In
                  </v-btn>
                </p>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.login-view {
  background-color: #f8f8f8;
  min-height: calc(100vh - 64px); /* Account for header */
  display: flex;
  align-items: center;
}
</style>
