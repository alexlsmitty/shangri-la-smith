<script setup>
import RoomCard from '@/components/RoomCard.vue';
import BookingForm from '@/components/booking/BookingForm.vue';
import SpecialOfferBanner from '@/components/booking/SpecialOfferBanner.vue';
import { ref } from 'vue';

// Room data
const rooms = ref([
  {
    id: 1,
    title: 'Ocean View Deluxe Room',
    description: 'Indulge in stunning panoramic views of the ocean from your private balcony. These rooms offer a perfect blend of comfort and style.',
    image: new URL('@/assets/images/hotel-room1.webp', import.meta.url).href,
    price: '$350',
    amenities: [
      'King-sized bed',
      'Private balcony with ocean view',
      'En-suite bathroom with rain shower',
      'Seating area',
      'Complimentary Wi-Fi',
      'Flat-screen TV',
      'Mini-bar'
    ],
    detailsLink: '/rooms/ocean-view-deluxe'
  },
  {
    id: 2,
    title: 'Beachfront Suite',
    description: 'Step directly onto the sand from your spacious suite. Enjoy the ultimate beachfront experience with added luxury and privacy.',
    image: new URL('@/assets/images/hotel-room2.webp', import.meta.url).href,
    price: '$550',
    amenities: [
      'King-sized bed',
      'Separate living area',
      'Private terrace with direct beach access',
      'En-suite bathroom with soaking tub and separate shower',
      'Dining area',
      'Complimentary Wi-Fi',
      'Multiple flat-screen TVs',
      'Mini-bar'
    ],
    detailsLink: '/rooms/beachfront-suite'
  },
  {
    id: 3,
    title: 'Garden View Family Room',
    description: 'Perfect for families, these rooms offer ample space and a tranquil view of our lush gardens.',
    image: new URL('@/assets/images/hotel-room3.webp', import.meta.url).href,
    price: '$420',
    amenities: [
      'Two double beds',
      'Private balcony with garden view',
      'En-suite bathroom',
      'Seating area',
      'Complimentary Wi-Fi',
      'Flat-screen TV',
      'Mini-bar'
    ],
    detailsLink: '/rooms/garden-view-family'
  },
  {
    id: 4,
    title: 'Premium Oceanfront Suite with Plunge Pool',
    description: 'Experience the epitome of luxury. This exclusive suite features a private plunge pool and unparalleled ocean views.',
    image: new URL('@/assets/images/hotel-room4.webp', import.meta.url).href,
    price: '$850',
    amenities: [
      'King-sized bed',
      'Separate living and dining areas',
      'Expansive private terrace with plunge pool and sun loungers',
      'En-suite bathroom with Jacuzzi tub and separate rain shower',
      'Butler service upon request',
      'Complimentary premium Wi-Fi',
      'Multiple smart TVs',
      'Fully stocked mini-bar'
    ],
    detailsLink: '/rooms/premium-oceanfront-suite'
  },
  {
    id: 5,
    title: 'Accessible Room',
    description: 'Designed for guests with mobility needs, these rooms offer comfort and accessibility features.',
    image: new URL('@/assets/images/hotel-room1.webp', import.meta.url).href,
    price: '$320',
    amenities: [
      'King-sized bed',
      'Spacious layout for wheelchair accessibility',
      'Accessible bathroom with grab bars and roll-in shower',
      'Lowered amenities',
      'Visual and auditory alert systems',
      'Complimentary Wi-Fi',
      'Flat-screen TV'
    ],
    detailsLink: '/rooms/accessible-room'
  }
]);

// Booking dialog
const bookingDialog = ref(false);
const selectedRoom = ref(null);

function openBookingDialog(room) {
  selectedRoom.value = room;
  bookingDialog.value = true;
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-6">Our Luxurious Guest Rooms</h1>
        <p class="text-subtitle-1">Experience unparalleled comfort and breathtaking views in our range of elegantly appointed guest rooms and suites.</p>
      </v-col>
    </v-row>
    
    <!-- Special Offer Banner -->
    <special-offer-banner
      title="Summer Paradise Offer"
      description="Book 5+ nights and receive a complimentary spa treatment!"
      promo-code="SUMMER2025"
      expiry-date="Valid until June 30, 2025"
      class="my-6"
    />

    <!-- Hero section -->
    <v-row class="mb-8">
      <v-col cols="12">
        <v-img
          src="@/assets/images/general/pexels-jeffibera-1320761.webp"
          height="300"
          class="rounded-lg"
          gradient="to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)"
        >
          <div class="d-flex flex-column justify-end fill-height pa-6">
            <h2 class="text-h4 text-white font-weight-bold">Find Your Perfect Getaway</h2>
            <p class="text-white text-subtitle-1">Choose from our selection of luxurious accommodations</p>
          </div>
        </v-img>
      </v-col>
    </v-row>
    
    <!-- Room filter -->
    <v-row class="mb-8">
      <v-col cols="12" sm="6" md="4">
        <v-select
          label="Sort by"
          :items="['Price: Low to High', 'Price: High to Low', 'Name']"
          variant="outlined"
          density="comfortable"
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-select
          label="Room Type"
          :items="['All Rooms', 'Ocean View', 'Beachfront', 'Garden View', 'Premium', 'Accessible']"
          variant="outlined"
          density="comfortable"
          hide-details
        ></v-select>
      </v-col>
    </v-row>
    
    <!-- Room cards -->
    <v-row>
      <v-col 
        v-for="room in rooms" 
        :key="room.id" 
        cols="12" 
        sm="6" 
        lg="4"
        class="mb-4"
      >
        <room-card
          :title="room.title"
          :description="room.description"
          :image="room.image"
          :amenities="room.amenities.slice(0, 3)"
          :price="room.price"
          :details-link="room.detailsLink"
          @book-now="openBookingDialog(room)"
        />
      </v-col>
    </v-row>
    
    <!-- Booking dialog -->
    <v-dialog
      v-model="bookingDialog"
      max-width="800px"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Book {{ selectedRoom?.title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="bookingDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        
        <v-card-text class="pa-4">
          <booking-form v-if="selectedRoom" :room="selectedRoom" @booking-completed="bookingDialog = false" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.v-row {
  margin-left: -12px;
  margin-right: -12px;
}

.hero-overlay {
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7));
}
</style>
