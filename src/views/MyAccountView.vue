<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService, BookingService, SpaService } from '@/services/api';

const router = useRouter();
const isLoading = ref(true);
const loadError = ref(null);
const user = ref(null);
const bookings = ref([]);
const spaAppointments = ref([]);
const activeTab = ref(0);

// Computed properties for data display
const upcomingBookings = computed(() => {
  return bookings.value.filter(booking => {
    return booking.status === 'confirmed' && new Date(booking.check_out_date) >= new Date();
  });
});

const pastBookings = computed(() => {
  return bookings.value.filter(booking => {
    return booking.status === 'confirmed' && new Date(booking.check_out_date) < new Date();
  });
});

const cancelledBookings = computed(() => {
  return bookings.value.filter(booking => booking.status === 'cancelled');
});

const upcomingAppointments = computed(() => {
  return spaAppointments.value.filter(appt => {
    return appt.status === 'confirmed' && new Date(appt.appointment_date) >= new Date();
  });
});

const pastAppointments = computed(() => {
  return spaAppointments.value.filter(appt => {
    return appt.status === 'confirmed' && new Date(appt.appointment_date) < new Date();
  });
});

const cancelledAppointments = computed(() => {
  return spaAppointments.value.filter(appt => appt.status === 'cancelled');
});

// Fetch user account and reservation data
async function fetchUserData() {
  isLoading.value = true;
  loadError.value = null;

  try {
    // Get user account info and reservations
    const userData = await AuthService.getCurrentUser();
    
    user.value = userData.user;
    bookings.value = userData.bookings || [];
    spaAppointments.value = userData.spaAppointments || [];
  } catch (error) {
    console.error('Error fetching user data:', error);
    loadError.value = 'Failed to load account information. Please try again later.';
    
    // If authentication error, redirect to login
    if (error.response && error.response.status === 401) {
      router.push('/login');
    }
  } finally {
    isLoading.value = false;
  }
}

// Cancel a hotel booking
async function cancelBooking(bookingReference) {
  if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
    return;
  }
  
  try {
    await BookingService.cancelBooking(bookingReference);
    await fetchUserData(); // Refresh data
  } catch (error) {
    console.error('Error cancelling booking:', error);
    alert('Failed to cancel booking. Please try again later.');
  }
}

// Cancel a spa appointment
async function cancelAppointment(bookingReference) {
  if (!confirm('Are you sure you want to cancel this appointment? This action cannot be undone.')) {
    return;
  }
  
  try {
    await SpaService.cancelAppointment(bookingReference);
    await fetchUserData(); // Refresh data
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    alert('Failed to cancel appointment. Please try again later.');
  }
}

// Handle logout
async function handleLogout() {
  try {
    await AuthService.logout();
    router.push('/');
  } catch (error) {
    console.error('Error logging out:', error);
    alert('Failed to log out. Please try again later.');
  }
}

// Format date for display
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Check if user is authenticated on component mount
onMounted(async () => {
  if (!AuthService.isLoggedIn()) {
    router.push('/login');
    return;
  }
  
  await fetchUserData();
});
</script>

<template>
  <v-container class="my-account-view py-8">
    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="text-body-1 mt-4">Loading your account information...</p>
    </div>
    
    <!-- Error state -->
    <div v-else-if="loadError" class="text-center py-8">
      <v-alert type="error" variant="tonal" class="mb-4">
        {{ loadError }}
      </v-alert>
      <v-btn color="primary" @click="fetchUserData">Try Again</v-btn>
    </div>
    
    <!-- Account content -->
    <div v-else>
      <!-- Account header -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="pa-6">
            <div class="d-flex flex-column flex-sm-row justify-space-between align-center">
              <div>
                <h1 class="text-h4 font-weight-bold mb-2">My Account</h1>
                <p class="text-subtitle-1 mb-0">Welcome back, {{ user.username }}!</p>
              </div>
              <v-btn 
                color="error" 
                variant="outlined" 
                @click="handleLogout" 
                class="mt-4 mt-sm-0"
              >
                <v-icon left class="mr-2">mdi-logout</v-icon>
                Log Out
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Account details and reservations tabs -->
      <v-card>
        <v-tabs v-model="activeTab" grow>
          <v-tab value="0">
            <v-icon start>mdi-account</v-icon>
            Account Details
          </v-tab>
          <v-tab value="1">
            <v-icon start>mdi-bed</v-icon>
            Hotel Bookings
          </v-tab>
          <v-tab value="2">
            <v-icon start>mdi-spa</v-icon>
            Spa Appointments
          </v-tab>
        </v-tabs>
        
        <v-window v-model="activeTab">
          <!-- Account Details -->
          <v-window-item value="0">
            <v-card-text class="py-6">
              <h2 class="text-h5 font-weight-bold mb-4">Account Information</h2>
              <v-row>
                <v-col cols="12" md="6">
                  <v-list>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary" class="mr-3">mdi-account</v-icon>
                      </template>
                      <v-list-item-title class="font-weight-medium">Username</v-list-item-title>
                      <v-list-item-subtitle>{{ user.username }}</v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary" class="mr-3">mdi-email</v-icon>
                      </template>
                      <v-list-item-title class="font-weight-medium">Email Address</v-list-item-title>
                      <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary" class="mr-3">mdi-calendar</v-icon>
                      </template>
                      <v-list-item-title class="font-weight-medium">Account Created</v-list-item-title>
                      <v-list-item-subtitle>{{ formatDate(user.created_at) }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                  
                  <div class="mt-6">
                    <v-btn color="primary" prepend-icon="mdi-pencil" variant="outlined">
                      Edit Profile
                    </v-btn>
                    <v-btn color="error" prepend-icon="mdi-lock-reset" variant="outlined" class="ml-2">
                      Change Password
                    </v-btn>
                  </div>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-card variant="outlined" class="pa-4">
                    <h3 class="text-h6 mb-3">Account Summary</h3>
                    <div class="d-flex mb-2">
                      <div class="text-primary mr-4">
                        <v-icon size="32">mdi-bed</v-icon>
                      </div>
                      <div>
                        <div class="text-h5 font-weight-bold">{{ upcomingBookings.length }}</div>
                        <div class="text-subtitle-2">Upcoming Hotel Reservations</div>
                      </div>
                    </div>
                    
                    <div class="d-flex">
                      <div class="text-primary mr-4">
                        <v-icon size="32">mdi-spa</v-icon>
                      </div>
                      <div>
                        <div class="text-h5 font-weight-bold">{{ upcomingAppointments.length }}</div>
                        <div class="text-subtitle-2">Upcoming Spa Appointments</div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-window-item>
          
          <!-- Hotel Bookings -->
          <v-window-item value="1">
            <v-card-text class="py-6">
              <v-tabs color="primary" v-model="bookingTab">
                <v-tab value="upcoming">Upcoming ({{ upcomingBookings.length }})</v-tab>
                <v-tab value="past">Past ({{ pastBookings.length }})</v-tab>
                <v-tab value="cancelled">Cancelled ({{ cancelledBookings.length }})</v-tab>
              </v-tabs>
              
              <v-window v-model="bookingTab">
                <!-- Upcoming bookings -->
                <v-window-item value="upcoming">
                  <div v-if="upcomingBookings.length === 0" class="text-center py-8">
                    <v-icon color="grey" size="64">mdi-calendar-blank</v-icon>
                    <p class="text-h6 mt-4">No upcoming bookings</p>
                    <v-btn color="primary" to="/rooms" class="mt-2">Book a Room</v-btn>
                  </div>
                  
                  <v-card 
                    v-for="booking in upcomingBookings" 
                    :key="booking.id" 
                    class="mt-4"
                    variant="outlined"
                  >
                    <v-row>
                      <v-col cols="12" sm="4" md="3">
                        <v-img 
                          :src="booking.room_image" 
                          height="150" 
                          cover
                          class="rounded-s"
                        ></v-img>
                      </v-col>
                      <v-col cols="12" sm="8" md="9">
                        <v-card-item>
                          <v-card-title>{{ booking.room_name }}</v-card-title>
                          <v-card-subtitle>Booking Ref: {{ booking.booking_reference }}</v-card-subtitle>
                        </v-card-item>
                        
                        <v-card-text>
                          <div class="d-flex flex-wrap">
                            <div class="mr-6 mb-2">
                              <div class="text-caption">Check-in</div>
                              <div class="font-weight-medium">{{ formatDate(booking.check_in_date) }}</div>
                            </div>
                            <div class="mr-6 mb-2">
                              <div class="text-caption">Check-out</div>
                              <div class="font-weight-medium">{{ formatDate(booking.check_out_date) }}</div>
                            </div>
                            <div class="mr-6 mb-2">
                              <div class="text-caption">Guests</div>
                              <div class="font-weight-medium">{{ booking.adults }} adults, {{ booking.children }} children</div>
                            </div>
                            <div class="mb-2">
                              <div class="text-caption">Total</div>
                              <div class="font-weight-medium">${{ booking.total_price }}</div>
                            </div>
                          </div>
                        </v-card-text>
                        
                        <v-card-actions>
                          <v-btn 
                            variant="text" 
                            color="primary"
                            :to="`/booking/${booking.booking_reference}`"
                          >
                            View Details
                          </v-btn>
                          <v-btn 
                            variant="text" 
                            color="error"
                            @click="cancelBooking(booking.booking_reference)"
                          >
                            Cancel Booking
                          </v-btn>
                        </v-card-actions>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-window-item>
                
                <!-- Past bookings -->
                <v-window-item value="past">
                  <div v-if="pastBookings.length === 0" class="text-center py-8">
                    <v-icon color="grey" size="64">mdi-calendar-check</v-icon>
                    <p class="text-h6 mt-4">No past bookings</p>
                  </div>
                  
                  <v-card 
                    v-for="booking in pastBookings" 
                    :key="booking.id" 
                    class="mt-4"
                    variant="outlined"
                  >
                    <!-- Similar layout as upcoming bookings -->
                    <v-row>
                      <v-col cols="12" sm="4" md="3">
                        <v-img 
                          :src="booking.room_image" 
                          height="150" 
                          cover
                          class="rounded-s"
                        ></v-img>
                      </v-col>
                      <v-col cols="12" sm="8" md="9">
                        <v-card-item>
                          <v-card-title>{{ booking.room_name }}</v-card-title>
                          <v-card-subtitle>Booking Ref: {{ booking.booking_reference }}</v-card-subtitle>
                        </v-card-item>
                        
                        <v-card-text>
                          <div class="d-flex flex-wrap">
                            <div class="mr-6 mb-2">
                              <div class="text-caption">Check-in</div>
                              <div class="font-weight-medium">{{ formatDate(booking.check_in_date) }}</div>
                            </div>
                            <div class="mr-6 mb-2">
                              <div class="text-caption">Check-out</div>
                              <div class="font-weight-medium">{{ formatDate(booking.check_out_date) }}</div>
                            </div>
                            <div class="mr-6 mb-2">
                              <div class="text-caption">Guests</div>
                              <div class="font-weight-medium">{{ booking.adults }} adults, {{ booking.children }} children</div>
                            </div>
                            <div class="mb-2">
                              <div class="text-caption">Total</div>
                              <div class="font-weight-medium">${{ booking.total_price }}</div>
                            </div>
                          </div>
                        </v-card-text>
                        
                        <v-card-actions>
                          <v-btn 
                            variant="text" 
                            color="primary"
                            :to="`/booking/${booking.booking_reference}`"
                          >
                            View Details
                          </v-btn>
                        </v-card-actions>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-window-item>
                
                <!-- Cancelled bookings -->
                <v-window-item value="cancelled">
                  <div v-if="cancelledBookings.length === 0" class="text-center py-8">
                    <v-icon color="grey" size="64">mdi-calendar-remove</v-icon>
                    <p class="text-h6 mt-4">No cancelled bookings</p>
                  </div>
                  
                  <v-card 
                    v-for="booking in cancelledBookings" 
                    :key="booking.id" 
                    class="mt-4"
                    variant="outlined"
                  >
                    <!-- Similar layout with cancelled status -->
                    <v-row>
                      <v-col cols="12" sm="4" md="3">
                        <v-img 
                          :src="booking.room_image" 
                          height="150" 
                          cover
                          class="rounded-s"
                        ></v-img>
                      </v-col>
                      <v-col cols="12" sm="8" md="9">
                        <v-card-item>
                          <v-card-title>{{ booking.room_name }}</v-card-title>
                          <v-card-subtitle>
                            Booking Ref: {{ booking.booking_reference }}
                            <v-chip color="error" size="small" class="ml-2">Cancelled</v-chip>
                          </v-card-subtitle>
                        </v-card-item>
                        
                        <v-card-text>
                          <div class="d-flex flex-wrap">
                            <div class="mr-6 mb-2">
                              <div class="text-caption">Check-in</div>
                              <div class="font-weight-medium">{{ formatDate(booking.check_in_date) }}</div>
                            </div>
                            <div class="mr-6 mb-2">
                              <div class="text-caption">Check-out</div>
                              <div class="font-weight-medium">{{ formatDate(booking.check_out_date) }}</div>
                            </div>
                            <div class="mb-2">
                              <div class="text-caption">Cancelled on</div>
                              <div class="font-weight-medium">{{ formatDate(booking.cancelled_date) }}</div>
                            </div>
                          </div>
                        </v-card-text>
                        
                        <v-card-actions>
                          <v-btn 
                            variant="text" 
                            color="primary"
                            :to="`/booking/${booking.booking_reference}`"
                          >
                            View Details
                          </v-btn>
                        </v-card-actions>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-window-item>
          
          <!-- Spa Appointments -->
          <v-window-item value="2">
            <v-card-text class="py-6">
              <v-tabs color="primary" v-model="spaTab">
                <v-tab value="upcoming">Upcoming ({{ upcomingAppointments.length }})</v-tab>
                <v-tab value="past">Past ({{ pastAppointments.length }})</v-tab>
                <v-tab value="cancelled">Cancelled ({{ cancelledAppointments.length }})</v-tab>
              </v-tabs>
              
              <v-window v-model="spaTab">
                <!-- Upcoming appointments -->
                <v-window-item value="upcoming">
                  <div v-if="upcomingAppointments.length === 0" class="text-center py-8">
                    <v-icon color="grey" size="64">mdi-calendar-blank</v-icon>
                    <p class="text-h6 mt-4">No upcoming spa appointments</p>
                    <v-btn color="primary" to="/spa" class="mt-2">Book a Spa Treatment</v-btn>
                  </div>
                  
                  <v-card 
                    v-for="appointment in upcomingAppointments" 
                    :key="appointment.id" 
                    class="mt-4"
                    variant="outlined"
                  >
                    <v-row>
                      <v-col cols="12" sm="4" md="3">
                        <v-img 
                          :src="appointment.image_url" 
                          height="150" 
                          cover
                          class="rounded-s"
                        ></v-img>
                      </v-col>
                      <v-col cols="12" sm="8" md="9">
                        <v-card-item>
                          <v-card-title>{{ appointment.service_name }}</v-card-title>
                          <v-card-subtitle>Booking Ref: {{ appointment.booking_reference }}</v-card-subtitle>
                        </v-card-item>
                        
                        <v-card-text>
                          <div class="d-flex flex-wrap">
                            <div class="mr-6 mb-2">
                              <div class="text-caption">Date</div>
                              <div class="font-weight-medium">{{ formatDate(appointment.appointment_date) }}</div>
                            </div>
                            <div class="mr-6 mb-2">
                              <div class="text-caption">Time</div>
                              <div class="font-weight-medium">{{ appointment.appointment_time }}</div>
                            </div>
                            <div class="mr-6 mb-2">
                              <div class="text-caption">Duration</div>
                              <div class="font-weight-medium">{{ appointment.duration }}</div>
                            </div>
                            <div class="mb-2">
                              <div class="text-caption">Price</div>
                              <div class="font-weight-medium">${{ appointment.price }}</div>
                            </div>
                          </div>
                        </v-card-text>
                        
                        <v-card-actions>
                          <v-btn 
                            variant="text" 
                            color="primary"
                            :to="`/spa/appointment/${appointment.booking_reference}`"
                          >
                            View Details
                          </v-btn>
                          <v-btn 
                            variant="text" 
                            color="error"
                            @click="cancelAppointment(appointment.booking_reference)"
                          >
                            Cancel Appointment
                          </v-btn>
                        </v-card-actions>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-window-item>
                
                <!-- Past appointments -->
                <v-window-item value="past">
                  <div v-if="pastAppointments.length === 0" class="text-center py-8">
                    <v-icon color="grey" size="64">mdi-calendar-check</v-icon>
                    <p class="text-h6 mt-4">No past spa appointments</p>
                  </div>
                  
                  <v-card 
                    v-for="appointment in pastAppointments" 
                    :key="appointment.id" 
                    class="mt-4"
                    variant="outlined"
                  >
                    <!-- Similar layout as upcoming appointments -->
                    <v-row>
                      <v-col cols="12" sm="4" md="3">
                        <v-img 
                          :src="appointment.image_url" 
                          height="150" 
                          cover
                          class="rounded-s"
                        ></v-img>
                      </v-col>
                      <v-col cols="12" sm="8" md="9">
                        <v-card-item>
                          <v-card-title>{{ appointment.service_name }}</v-card-title>
                          <v-card-subtitle>Booking Ref: {{ appointment.booking_reference }}</v-card-subtitle>
                        </v-card-item>
                        
                        <v-card-text>
                          <div class="d-flex flex-wrap">
                            <div class="mr-6 mb-2">
                              <div class="text-caption">Date</div>
                              <div class="font-weight-medium">{{ formatDate(appointment.appointment_date) }}</div>
                            </div>
                            <div class="mr-6 mb-2">
                              <div class="text-caption">Time</div>
                              <div class="font-weight-medium">{{ appointment.appointment_time }}</div>
                            </div>
                            <div class="mr-6 mb-2">
                              <div class="text-caption">Duration</div>
                              <div class="font-weight-medium">{{ appointment.duration }}</div>
                            </div>
                            <div class="mb-2">
                              <div class="text-caption">Price</div>
                              <div class="font-weight-medium">${{ appointment.price }}</div>
                            </div>
                          </div>
                        </v-card-text>
                        
                        <v-card-actions>
                          <v-btn 
                            variant="text" 
                            color="primary"
                            :to="`/spa/appointment/${appointment.booking_reference}`"
                          >
                            View Details
                          </v-btn>
                        </v-card-actions>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-window-item>
                
                <!-- Cancelled appointments -->
                <v-window-item value="cancelled">
                  <div v-if="cancelledAppointments.length === 0" class="text-center py-8">
                    <v-icon color="grey" size="64">mdi-calendar-remove</v-icon>
                    <p class="text-h6 mt-4">No cancelled spa appointments</p>
                  </div>
                  
                  <v-card 
                    v-for="appointment in cancelledAppointments" 
                    :key="appointment.id" 
                    class="mt-4"
                    variant="outlined"
                  >
                    <!-- Similar layout with cancelled status -->
                    <v-row>
                      <v-col cols="12" sm="4" md="3">
                        <v-img 
                          :src="appointment.image_url" 
                          height="150" 
                          cover
                          class="rounded-s"
                        ></v-img>
                      </v-col>
                      <v-col cols="12" sm="8" md="9">
                        <v-card-item>
                          <v-card-title>{{ appointment.service_name }}</v-card-title>
                          <v-card-subtitle>
                            Booking Ref: {{ appointment.booking_reference }}
                            <v-chip color="error" size="small" class="ml-2">Cancelled</v-chip>
                          </v-card-subtitle>
                        </v-card-item>
                        
                        <v-card-text>
                          <div class="d-flex flex-wrap">
                            <div class="mr-6 mb-2">
                              <div class="text-caption">Date</div>
                              <div class="font-weight-medium">{{ formatDate(appointment.appointment_date) }}</div>
                            </div>
                            <div class="mr-6 mb-2">
                              <div class="text-caption">Time</div>
                              <div class="font-weight-medium">{{ appointment.appointment_time }}</div>
                            </div>
                            <div class="mb-2">
                              <div class="text-caption">Cancelled on</div>
                              <div class="font-weight-medium">{{ formatDate(appointment.cancelled_date) }}</div>
                            </div>
                          </div>
                        </v-card-text>
                        
                        <v-card-actions>
                          <v-btn 
                            variant="text" 
                            color="primary"
                            :to="`/spa/appointment/${appointment.booking_reference}`"
                          >
                            View Details
                          </v-btn>
                        </v-card-actions>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-window-item>
        </v-window>
      </v-card>
    </div>
  </v-container>
</template>

<script>
// Setup tab models outside of setup function to avoid reactivity issues
export default {
  data() {
    return {
      bookingTab: 'upcoming',
      spaTab: 'upcoming'
    }
  }
}
</script>

<style scoped>
.my-account-view {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
