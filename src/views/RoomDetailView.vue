<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BookingForm from '@/components/booking/BookingForm.vue';

// Import room images for similar rooms section
import room1Image from '@/assets/images/hotel-room1.webp';
import room2Image from '@/assets/images/hotel-room2.webp';
import room3Image from '@/assets/images/hotel-room3.webp';

// Create an array of similar room images
const similarRoomImages = [room1Image, room2Image, room3Image];

const route = useRoute();
const router = useRouter();
const roomType = computed(() => route.params.roomType);
const loading = ref(true);
const room = ref(null);
const bookingDialog = ref(false);

// Room data map
const roomsData = {
  'ocean-view-deluxe': {
    id: 1,
    title: 'Ocean View Deluxe Room',
    description: 'Indulge in stunning panoramic views of the ocean from your private balcony. These rooms offer a perfect blend of comfort and style.',
    fullDescription: `Experience unparalleled luxury with breathtaking ocean views from your private balcony in our Ocean View Deluxe Room. This meticulously designed accommodation offers the perfect blend of comfort, style, and modern amenities to ensure an unforgettable stay at Shangri La Beach Resort.

Wake up to the gentle sound of waves and enjoy your morning coffee while taking in the spectacular ocean panorama. Our Ocean View Deluxe Rooms feature elegant décor, premium furnishings, and thoughtful touches to create a serene atmosphere for your tropical getaway.`,
    images: [
      new URL('@/assets/images/hotel-room1.webp', import.meta.url).href
    ],
    price: '$350',
    size: '45 sq m / 484 sq ft',
    bedType: 'King-sized bed',
    occupancy: 'Max 2 adults',
    view: 'Ocean view',
    amenities: [
      'King-sized bed',
      'Private balcony with ocean view',
      'En-suite bathroom with rain shower',
      'Seating area',
      'Complimentary Wi-Fi',
      'Flat-screen TV',
      'Mini-bar',
      'Air conditioning',
      'Luxury toiletries',
      'In-room safe',
      'Coffee and tea making facilities',
      'Bathrobes and slippers',
      'Turndown service'
    ]
  },
  'beachfront-suite': {
    id: 2,
    title: 'Beachfront Suite',
    description: 'Step directly onto the sand from your spacious suite. Enjoy the ultimate beachfront experience with added luxury and privacy.',
    fullDescription: `Embrace the ultimate beach lifestyle in our Beachfront Suite, where luxury meets the pristine shoreline. These exclusive suites offer direct access to the soft white sands of our private beach, allowing you to experience true paradise just steps from your door.

Our Beachfront Suites feature spacious layouts with separate living areas, providing ample space to relax and entertain. The private terrace opens directly onto the beach, creating a seamless connection between your luxurious accommodation and the natural beauty of our tropical paradise.`,
    images: [
      new URL('@/assets/images/hotel-room2.webp', import.meta.url).href
    ],
    price: '$550',
    size: '75 sq m / 807 sq ft',
    bedType: 'King-sized bed',
    occupancy: 'Max 2 adults',
    view: 'Beachfront',
    amenities: [
      'King-sized bed',
      'Separate living area',
      'Private terrace with direct beach access',
      'En-suite bathroom with soaking tub and separate shower',
      'Dining area',
      'Complimentary Wi-Fi',
      'Multiple flat-screen TVs',
      'Mini-bar',
      'Air conditioning',
      'Luxury toiletries',
      'In-room safe',
      'Coffee and tea making facilities',
      'Bathrobes and slippers',
      'Turndown service',
      'Outdoor loungers',
      'Priority restaurant reservations'
    ]
  },
  'garden-view-family': {
    id: 3,
    title: 'Garden View Family Room',
    description: 'Perfect for families, these rooms offer ample space and a tranquil view of our lush gardens.',
    fullDescription: `Our Garden View Family Rooms provide the ideal retreat for families seeking comfort, convenience, and connection with nature. Nestled within our lush tropical gardens, these spacious accommodations offer a serene environment where families can relax and create lasting memories.

Designed with families in mind, these rooms feature two comfortable double beds, ample space for children to play, and a private balcony overlooking our meticulously maintained gardens. The soothing green landscapes create a peaceful atmosphere, perfect for unwinding after a day of beach activities and exploration.`,
    images: [
      new URL('@/assets/images/hotel-room3.webp', import.meta.url).href
    ],
    price: '$420',
    size: '55 sq m / 592 sq ft',
    bedType: 'Two double beds',
    occupancy: 'Max 2 adults and 2 children',
    view: 'Garden view',
    amenities: [
      'Two double beds',
      'Private balcony with garden view',
      'En-suite bathroom',
      'Seating area',
      'Complimentary Wi-Fi',
      'Flat-screen TV',
      'Mini-bar',
      'Air conditioning',
      'Luxury toiletries',
      'In-room safe',
      'Coffee and tea making facilities',
      'Bathrobes and slippers',
      'Children\'s amenities',
      'Board games upon request'
    ]
  },
  'premium-oceanfront-suite': {
    id: 4,
    title: 'Premium Oceanfront Suite with Plunge Pool',
    description: 'Experience the epitome of luxury. This exclusive suite features a private plunge pool and unparalleled ocean views.',
    fullDescription: `Discover the pinnacle of luxury in our Premium Oceanfront Suite with Plunge Pool. This exclusive accommodation represents the ultimate Shangri La experience, combining unparalleled ocean views, expansive living spaces, and the indulgence of your own private plunge pool.

Upon entering, you'll be greeted by a stunning panoramic view of the azure ocean through floor-to-ceiling windows. The spacious layout features separate living and dining areas elegantly appointed with designer furnishings and original artwork. Step outside onto your expansive private terrace to find your personal plunge pool overlooking the ocean – the perfect spot for a refreshing dip while enjoying the spectacular sunset.`,
    images: [
      new URL('@/assets/images/hotel-room4.webp', import.meta.url).href
    ],
    price: '$850',
    size: '120 sq m / 1,292 sq ft',
    bedType: 'King-sized bed',
    occupancy: 'Max 2 adults',
    view: 'Panoramic ocean view',
    amenities: [
      'King-sized bed',
      'Separate living and dining areas',
      'Expansive private terrace with plunge pool and sun loungers',
      'En-suite bathroom with Jacuzzi tub and separate rain shower',
      'Butler service upon request',
      'Complimentary premium Wi-Fi',
      'Multiple smart TVs',
      'Fully stocked mini-bar',
      'Premium air conditioning with climate control',
      'Luxury designer toiletries',
      'Walk-in closet',
      'In-room safe',
      'Espresso machine and tea making facilities',
      'Premium bathrobes and slippers',
      'Nightly turndown service with special amenities',
      'Priority access to all resort facilities',
      'Complimentary airport transfers',
      'Welcome champagne'
    ]
  },
  'accessible-room': {
    id: 5,
    title: 'Accessible Room',
    description: 'Designed for guests with mobility needs, these rooms offer comfort and accessibility features.',
    fullDescription: `Our Accessible Rooms are thoughtfully designed to provide a comfortable, convenient, and luxurious experience for guests with mobility needs. We are committed to ensuring that all our guests can enjoy the beauty and amenities of Shangri La Beach Resort with ease and independence.

These spacious rooms feature wider doorways, accessible bathrooms with roll-in showers and grab bars, and carefully considered layouts to allow for easy navigation. All controls and amenities are positioned at appropriate heights for wheelchair users, ensuring a hassle-free stay.`,
    images: [
      new URL('@/assets/images/hotel-room1.webp', import.meta.url).href
    ],
    price: '$320',
    size: '50 sq m / 538 sq ft',
    bedType: 'King-sized bed',
    occupancy: 'Max 2 adults',
    view: 'Resort view',
    amenities: [
      'King-sized bed',
      'Spacious layout for wheelchair accessibility',
      'Accessible bathroom with grab bars and roll-in shower',
      'Lowered amenities',
      'Visual and auditory alert systems',
      'Complimentary Wi-Fi',
      'Flat-screen TV',
      'Mini-bar at accessible height',
      'Air conditioning with accessible controls',
      'Luxury toiletries',
      'In-room safe',
      'Coffee and tea making facilities at accessible height',
      'Wide doorways',
      'Ground floor location',
      'Close proximity to elevator and resort facilities'
    ]
  }
};

// Form fields for the quick booking sidebar
const quickBookForm = ref({
  checkInDate: '',
  checkOutDate: '',
  adults: 1,
  children: 0
});

// Calculate min and max dates for the date pickers
const today = new Date().toISOString().split('T')[0]; // Today in YYYY-MM-DD format
const minCheckOutDate = computed(() => {
  if (!quickBookForm.value.checkInDate) return today;
  
  const nextDay = new Date(quickBookForm.value.checkInDate);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay.toISOString().split('T')[0];
});

// Load room data
onMounted(() => {
  // Get room data based on route parameter
  room.value = roomsData[roomType.value] || null;
  loading.value = false;
  
  // If room not found, redirect to rooms list
  if (!room.value) {
    router.push('/rooms');
  }
});

// Open booking dialog
function openBookingDialog() {
  // Transfer form data from quick booking to main booking form
  room.value.formData = { ...quickBookForm.value };
  bookingDialog.value = true;
}
</script>

<template>
  <v-container v-if="loading">
    <v-row>
      <v-col cols="12" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4">Loading room details...</p>
      </v-col>
    </v-row>
  </v-container>
  
  <v-container v-else-if="room">
    <!-- Room title and navigation -->
    <v-row>
      <v-col cols="12">
        <v-btn
          variant="text"
          prepend-icon="mdi-arrow-left"
          to="/rooms"
          class="mb-4"
        >
          Back to All Rooms
        </v-btn>
        <h1 class="text-h3 font-weight-bold">{{ room.title }}</h1>
      </v-col>
    </v-row>
    
    <!-- Room images -->
    <v-row class="mb-8">
      <v-col cols="12">
        <div class="position-relative">
          <v-img
            :src="room.images[0]"
            height="500"
            cover
            class="rounded-lg"
          ></v-img>
          
          <!-- Accessibility Icon Overlay for the Accessible Room -->
          <div v-if="room.title.includes('Accessible')" class="accessibility-overlay">
            <v-icon icon="mdi-wheelchair-accessibility" size="x-large" color="white"></v-icon>
          </div>
        </div>
      </v-col>
    </v-row>
    
    <!-- Room details and booking -->
    <v-row>
      <v-col cols="12" md="8">
        <h2 class="text-h5 font-weight-bold mb-4">Description</h2>
        <div class="text-body-1 mb-6" style="white-space: pre-line">{{ room.fullDescription }}</div>
        
        <h2 class="text-h5 font-weight-bold mb-4">Room Details</h2>
        <v-row>
          <v-col cols="12" sm="6">
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-ruler-square" class="mr-2"></v-icon>
                </template>
                <v-list-item-title>Size</v-list-item-title>
                <v-list-item-subtitle>{{ room.size }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-bed-king" class="mr-2"></v-icon>
                </template>
                <v-list-item-title>Bed Type</v-list-item-title>
                <v-list-item-subtitle>{{ room.bedType }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-account-group" class="mr-2"></v-icon>
                </template>
                <v-list-item-title>Occupancy</v-list-item-title>
                <v-list-item-subtitle>{{ room.occupancy }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-image-filter-hdr" class="mr-2"></v-icon>
                </template>
                <v-list-item-title>View</v-list-item-title>
                <v-list-item-subtitle>{{ room.view }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
        
        <h2 class="text-h5 font-weight-bold mb-4 mt-4">Amenities</h2>
        <v-row>
          <v-col 
            v-for="(amenity, index) in room.amenities" 
            :key="index" 
            cols="12" 
            sm="6" 
            md="4"
            class="py-1"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-check" color="success" size="small" class="mr-2"></v-icon>
              <span>{{ amenity }}</span>
            </div>
          </v-col>
        </v-row>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card class="booking-card" elevation="3">
          <v-card-text>
            <div class="text-h5 font-weight-bold text-primary mb-2">{{ room.price }}</div>
            <div class="text-body-2 mb-6">per night</div>
            
            <v-divider class="mb-6"></v-divider>
            
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="quickBookForm.checkInDate"
                  label="Check-in Date"
                  type="date"
                  :min="today"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="quickBookForm.checkOutDate"
                  label="Check-out Date"
                  type="date"
                  :min="minCheckOutDate"
                  variant="outlined"
                  density="comfortable"
                  :disabled="!quickBookForm.checkInDate"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="quickBookForm.adults"
                  label="Adults"
                  :items="[1, 2, 3, 4]"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="quickBookForm.children"
                  label="Children"
                  :items="[0, 1, 2, 3, 4]"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
            </v-row>
            
            <v-btn
              color="primary"
              block
              size="large"
              class="mt-4"
              @click="openBookingDialog"
              :disabled="!quickBookForm.checkInDate || !quickBookForm.checkOutDate"
            >
              Book Now
            </v-btn>
            
            <div class="text-center mt-4">
              <p class="text-caption">
                No prepayment needed - pay at the property
              </p>
              <p class="text-caption">
                Free cancellation before 48 hours of check-in
              </p>
            </div>
          </v-card-text>
        </v-card>
        
        <v-card class="mt-6" variant="outlined">
          <v-card-text>
            <h3 class="text-h6 font-weight-bold mb-3">Need Help?</h3>
            <p class="text-body-2 mb-3">Have questions or need assistance with your booking? Our concierge team is here to help.</p>
            <v-btn color="secondary" variant="text" prepend-icon="mdi-phone">
              Contact Us
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Related rooms section -->
    <v-row class="mt-12">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-6">You Might Also Like</h2>
      </v-col>
      
      <!-- This would typically use a component and filter out the current room -->
      <v-col cols="12" sm="6" lg="4" v-for="i in 3" :key="i">
        <v-card class="h-100" elevation="2">
          <v-img
            :src="similarRoomImages[i-1]"
            height="200"
            cover
          ></v-img>
          <v-card-title>Similar Room Type</v-card-title>
          <v-card-text>
            <p>Another luxurious option for your stay at Shangri La Beach Resort.</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="text">View Details</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Booking dialog -->
    <v-dialog
      v-model="bookingDialog"
      max-width="800px"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Book {{ room.title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="bookingDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        
        <v-card-text class="pa-4">
          <booking-form :room="room" @booking-completed="bookingDialog = false" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
  
  <v-container v-else>
    <v-row>
      <v-col cols="12" class="text-center py-12">
        <v-icon icon="mdi-alert-circle" size="64" color="error"></v-icon>
        <h2 class="text-h4 mt-4">Room Not Found</h2>
        <p class="mt-2 mb-6">Sorry, we couldn't find the room you're looking for.</p>
        <v-btn color="primary" to="/rooms">
          View All Rooms
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.booking-card {
  position: sticky;
  top: 24px;
}

@media (max-width: 960px) {
  .booking-card {
    position: static;
  }
}

.position-relative {
  position: relative;
}

.accessibility-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
</style>
