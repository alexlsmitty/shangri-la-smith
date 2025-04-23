<script setup>
import { ref, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

// Import images
import heroBgImage from '@/assets/images/general/cooking.webp'
import import1 from '@/assets/images/general/beachpool.webp'
import import2 from '@/assets/images/general/beachpool2.webp'
import import3 from '@/assets/images/general/islandhopping.webp'
import import4 from '@/assets/images/general/culturaldance.webp'

// Restaurant data with detailed information
const restaurants = ref([
  {
    id: 1,
    name: 'The Beach House',
    subtitle: 'Fine Dining with Ocean Views',
    description: 'Experience the epitome of culinary excellence at The Beach House. Our signature restaurant offers breathtaking panoramic ocean views, creating a romantic and sophisticated ambiance. Our talented chefs craft exquisite dishes using the freshest locally-sourced seafood and premium international ingredients.',
    details: 'Indulge in innovative flavor combinations and impeccable service for a truly memorable fine dining experience. The Beach House is perfect for special occasions or a luxurious evening out.',
    cuisine: 'Fine Dining, Seafood, International',
    ambiance: 'Elegant, Romantic, Oceanfront',
    dressCode: 'Smart Casual',
    reservations: 'Recommended',
    image: import1,
    hours: '6:00 PM - 10:00 PM',
    specialties: ['Grilled Mahi-Mahi', 'Lobster Risotto', 'Pan-Seared Scallops', 'Surf & Turf'],
    expanded: false
  },
  {
    id: 2,
    name: 'The Sand Bar',
    subtitle: 'Relaxed Beachfront Grill',
    description: 'For a more casual and laid-back dining experience, head to The Sand Bar. Situated right on the beach, this vibrant grill offers a relaxed atmosphere where you can enjoy delicious food with your toes in the sand.',
    details: 'Savor grilled specialties, fresh salads, and satisfying sandwiches, all while soaking in the sun and enjoying the ocean breeze. The Sand Bar is the perfect spot for a casual lunch, a refreshing afternoon snack, or a relaxed dinner under the stars.',
    cuisine: 'Casual, Grill, Seafood, American',
    ambiance: 'Relaxed, Beachfront, Informal',
    dressCode: 'Casual',
    reservations: 'Not Required',
    image: import2,
    hours: '11:00 AM - 9:00 PM',
    specialties: ['Fish Tacos', 'Grilled Catch of the Day', 'Beach Burger', 'Tropical Cocktails'],
    expanded: false
  },
  {
    id: 3,
    name: 'The Poolside Cafe',
    subtitle: 'Refreshments and Light Bites',
    description: 'Stay refreshed and energized without leaving the poolside at The Poolside Cafe. This convenient and casual spot offers a variety of light bites, including salads, wraps, and snacks, as well as a wide selection of refreshing beverages.',
    details: 'From tropical cocktails to chilled juices, it\'s the perfect place to grab a quick and tasty meal or a cool drink while enjoying the sun and the pool.',
    cuisine: 'Casual, Light Bites, Snacks, Beverages',
    ambiance: 'Relaxed, Poolside, Informal',
    dressCode: 'Casual',
    reservations: 'Not Required',
    image: import3,
    hours: '9:00 AM - 6:00 PM',
    specialties: ['Fresh Fruit Smoothies', 'Club Sandwich', 'Ceviche', 'Tropical Salads'],
    expanded: false
  },
  {
    id: 4,
    name: 'The Lobby Lounge',
    subtitle: 'Sophisticated Cocktails and Ambiance',
    description: 'Unwind and socialize in the elegant setting of The Lobby Lounge. This sophisticated lounge offers a curated selection of handcrafted cocktails, fine wines, and premium spirits.',
    details: 'Enjoy light appetizers and small plates in a stylish atmosphere, often accompanied by live music in the evenings. The Lobby Lounge is the perfect place to start your evening, enjoy a nightcap, or simply relax and soak in the refined ambiance.',
    cuisine: 'Beverages, Light Appetizers',
    ambiance: 'Sophisticated, Relaxed, Live Music (select evenings)',
    dressCode: 'Smart Casual',
    reservations: 'Not Required',
    image: import4,
    hours: '4:00 PM - 12:00 AM',
    specialties: ['Signature Cocktails', 'Tapas', 'Charcuterie Board', 'Fine Whiskeys'],
    expanded: false
  }
])

// Additional dining options
const additionalOptions = [
  {
    title: 'Room Service',
    description: 'Enjoy the convenience of dining in the comfort and privacy of your own room with our extensive room service menu, available 24 hours a day.',
    icon: 'mdi-room-service'
  },
  {
    title: 'Buffet Breakfast',
    description: 'Start your day with a sumptuous buffet breakfast featuring a wide array of hot and cold dishes, fresh fruits, pastries, and more.',
    icon: 'mdi-food-croissant'
  },
  {
    title: 'Special Dietary Options',
    description: 'We are committed to accommodating your dietary needs. Please inform us of any allergies or dietary restrictions, and our chefs will be happy to prepare customized meals for you.',
    icon: 'mdi-food-variant'
  }
]

// Track which menu items to show based on restaurant
const selectedRestaurant = ref(null)
const showMenu = ref(false)
const menuItems = ref([])

// Animation reference elements
const heroSection = ref(null)
const restaurantsSection = ref(null)
const additionalSection = ref(null)

// For menu modal
const toggleMenu = (restaurant) => {
  selectedRestaurant.value = restaurant
  showMenu.value = true
  
  // Generate sample menu items based on restaurant specialties
  menuItems.value = restaurant.specialties.map(item => {
    // Create price between $18-$45 based on restaurant fanciness
    const basePrice = restaurant.id === 1 ? 30 : (restaurant.id === 4 ? 25 : 20)
    const variance = Math.floor(Math.random() * 15)
    const price = basePrice + variance
    
    return {
      name: item,
      description: `Our chef's signature ${item.toLowerCase()} prepared with the finest ingredients and local flavors.`,
      price: price
    }
  })
  
  // Add a few more generic items
  menuItems.value.push(
    {
      name: 'Seasonal Salad',
      description: 'Fresh greens and seasonal vegetables with house dressing.',
      price: 16
    },
    {
      name: 'Dessert of the Day',
      description: 'Ask your server about our daily dessert special.',
      price: 12
    }
  )
}

// Toggle restaurant details expanded state
const toggleExpand = (restaurant) => {
  restaurants.value.forEach(r => {
    if (r.id === restaurant.id) {
      r.expanded = !r.expanded
    }
  })
}

// For scroll reveal animations
onMounted(() => {
  // Animation for hero section
  useIntersectionObserver(heroSection, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      document.querySelector('.dining-hero-content').classList.add('hero-visible')
    }
  })

  // Animation for restaurants section
  useIntersectionObserver(restaurantsSection, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      document.querySelectorAll('.restaurant-card').forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('restaurant-visible')
        }, index * 200)
      })
    }
  })

  // Animation for additional options section
  useIntersectionObserver(additionalSection, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      document.querySelectorAll('.option-card').forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('option-visible')
        }, index * 150)
      })
    }
  })
})
</script>

<template>
  <v-container fluid class="pa-0">
    <!-- Hero Section -->
    <section ref="heroSection" class="dining-hero-section position-relative">
      <div class="dining-hero-bg">
        <div class="dining-hero-overlay d-flex flex-column justify-center">
          <v-container>
            <div class="dining-hero-content">
              <h1 class="text-h2 font-weight-bold mb-4 text-white">A Culinary Journey</h1>
              <div class="title-underline bg-white mb-6"></div>
              <p class="text-h6 mb-8 text-white max-width-text">
                Indulge in a diverse range of dining experiences at Shangri La Beach Resort. From elegant fine dining to casual beachfront bites, our restaurants and bars offer something to tantalize every taste bud and create unforgettable culinary moments.
              </p>
              <v-btn
                color="secondary"
                size="large"
                class="px-6 py-3"
                elevation="3"
                rounded
                @click="$vuetify.goTo('#restaurants')"
              >
                Explore Our Restaurants
                <v-icon right class="ml-2">mdi-chevron-down</v-icon>
              </v-btn>
            </div>
          </v-container>
        </div>
      </div>
    </section>

    <!-- Restaurants Section -->
    <section id="restaurants" ref="restaurantsSection" class="py-12">
      <v-container>
        <v-row class="mb-10">
          <v-col cols="12" class="text-center">
            <h2 class="text-h3 font-weight-bold mb-2">Our Dining Venues</h2>
            <div class="title-underline mx-auto mb-8"></div>
            <p class="text-subtitle-1 mb-8 max-width-text mx-auto">
              Each of our dining venues offers a unique experience, from romantic ocean-view dining to casual beachside fare, ensuring there's something to satisfy every palate.
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="restaurant in restaurants" :key="restaurant.id" cols="12" class="mb-8">
            <v-card
              class="restaurant-card elevation-6 rounded-lg overflow-hidden"
              :ripple="false"
              hover
            >
              <v-row no-gutters>
                <v-col cols="12" md="5" class="restaurant-img-col" :style="`background-image: url(${restaurant.image})`">
                  <div class="restaurant-overlay"></div>
                </v-col>
                <v-col cols="12" md="7">
                  <v-card-item>
                    <v-card-title class="text-h4 font-weight-bold">
                      {{ restaurant.name }}
                    </v-card-title>
                    <v-card-subtitle class="text-subtitle-1 mt-2">
                      {{ restaurant.subtitle }}
                    </v-card-subtitle>
                  </v-card-item>

                  <v-card-text>
                    <p class="text-body-1 mb-4">{{ restaurant.description }}</p>
                    
                    <v-expand-transition>
                      <div v-if="restaurant.expanded">
                        <p class="text-body-1 mb-4">{{ restaurant.details }}</p>
                        
                        <v-row>
                          <v-col cols="12" sm="6">
                            <p class="text-body-1">
                              <strong>Cuisine:</strong> {{ restaurant.cuisine }}
                            </p>
                            <p class="text-body-1">
                              <strong>Ambiance:</strong> {{ restaurant.ambiance }}
                            </p>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <p class="text-body-1">
                              <strong>Dress Code:</strong> {{ restaurant.dressCode }}
                            </p>
                            <p class="text-body-1">
                              <strong>Reservations:</strong> {{ restaurant.reservations }}
                            </p>
                            <p class="text-body-1">
                              <strong>Hours:</strong> {{ restaurant.hours }}
                            </p>
                          </v-col>
                        </v-row>

                        <v-divider class="my-4"></v-divider>
                        
                        <div>
                          <p class="text-body-1 font-weight-bold mb-2">Signature Dishes:</p>
                          <v-chip-group>
                            <v-chip
                              v-for="specialty in restaurant.specialties"
                              :key="specialty"
                              color="primary"
                              variant="outlined"
                              class="ma-1"
                            >
                              {{ specialty }}
                            </v-chip>
                          </v-chip-group>
                        </div>
                      </div>
                    </v-expand-transition>

                    <v-row class="mt-4">
                      <v-col cols="12" sm="6">
                        <v-btn
                          block
                          variant="text"
                          color="primary"
                          @click="toggleExpand(restaurant)"
                        >
                          {{ restaurant.expanded ? 'Show Less' : 'Show More' }}
                          <v-icon right>
                            {{ restaurant.expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                          </v-icon>
                        </v-btn>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-btn
                          block
                          color="secondary"
                          @click="toggleMenu(restaurant)"
                        >
                          View Sample Menu
                          <v-icon right class="ml-2">mdi-silverware-fork-knife</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Additional Dining Options -->
    <section ref="additionalSection" class="py-12 bg-light-blue">
      <v-container>
        <v-row class="mb-8">
          <v-col cols="12" class="text-center">
            <h2 class="text-h3 font-weight-bold mb-2">Other Dining Options</h2>
            <div class="title-underline mx-auto mb-8"></div>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="(option, index) in additionalOptions" :key="index" cols="12" md="4">
            <v-card class="option-card elevation-3 rounded-lg h-100 pa-6 text-center">
              <div class="icon-circle mb-4 mx-auto">
                <v-icon size="40" color="primary">{{ option.icon }}</v-icon>
              </div>
              <v-card-title class="text-h5 font-weight-bold justify-center">
                {{ option.title }}
              </v-card-title>
              <v-card-text class="text-body-1">
                {{ option.description }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Sample Menu Dialog -->
    <v-dialog v-model="showMenu" max-width="600">
      <v-card class="pa-4">
        <v-card-title class="text-h4 font-weight-bold">
          {{ selectedRestaurant?.name }} - Sample Menu
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="(item, index) in menuItems" :key="index" class="mb-4">
              <template v-slot:prepend>
                <v-icon color="primary" class="mr-2">mdi-silverware-variant</v-icon>
              </template>
              <v-list-item-title class="text-h6 d-flex justify-space-between">
                <span>{{ item.name }}</span>
                <span class="text-primary">${{ item.price }}</span>
              </v-list-item-title>
              <v-list-item-subtitle class="text-body-2 mt-1">
                {{ item.description }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <p class="text-caption mt-4">
            * This is a sample menu. Actual offerings may vary. Please contact the restaurant for the current menu.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="showMenu = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
/* Hero Section */
.dining-hero-section {
  height: 60vh;
  min-height: 400px;
}

.dining-hero-bg {
  height: 100%;
  width: 100%;
  background-image: url('@/assets/images/general/cooking.webp');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.dining-hero-overlay {
  background-color: rgba(0, 0, 0, 0.6);
  height: 100%;
  width: 100%;
}

.dining-hero-content {
  max-width: 800px;
  transform: translateY(30px);
  opacity: 0;
  transition: transform 0.8s ease, opacity 0.8s ease;
}

.hero-visible {
  transform: translateY(0);
  opacity: 1;
}

/* Shared styles */
.title-underline {
  width: 80px;
  height: 4px;
  background-color: var(--primary-color);
}

.max-width-text {
  max-width: 800px;
}

/* Restaurant cards */
.restaurant-card {
  transform: translateY(30px);
  opacity: 0;
  transition: transform 0.6s ease-out, opacity 0.6s ease-out, box-shadow 0.3s ease;
}

.restaurant-visible {
  transform: translateY(0);
  opacity: 1;
}

.restaurant-img-col {
  min-height: 300px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.restaurant-overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1));
}

/* Additional options */
.bg-light-blue {
  background-color: #f5f9fd;
}

.option-card {
  transform: translateY(30px);
  opacity: 0;
  transition: transform 0.6s ease-out, opacity 0.6s ease-out, box-shadow 0.3s ease;
}

.option-visible {
  transform: translateY(0);
  opacity: 1;
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(0, 105, 92, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.option-card:hover .icon-circle {
  transform: scale(1.1);
}

/* Responsive styles */
@media (max-width: 960px) {
  .dining-hero-section {
    height: 50vh;
  }
}

@media (max-width: 600px) {
  .dining-hero-section {
    height: auto;
    min-height: 50vh;
  }
  
  .restaurant-img-col {
    min-height: 200px;
  }
}
</style>
