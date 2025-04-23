<script setup>
import { ref, onMounted, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

// Spa services and categories from API
const services = ref({
  massages: [],
  facials: [],
  bodyTreatments: [],
  nailServices: [],
  enhancements: [],
  wellness: []
})

const isLoading = ref(true)
const loadingError = ref(null)

// Icons for each category to enhance visual experience
const categoryIcons = {
  'Massages': 'mdi-hand-heart',
  'Facials': 'mdi-face-woman',
  'Body Treatments': 'mdi-human',
  'Nail Services': 'mdi-hand-back-right',
  'Enhancements': 'mdi-plus-circle',
  'Wellness': 'mdi-yoga'
}

// Service type icons to use with individual services
const serviceIcons = {
  'massage': 'mdi-hand-heart',
  'facial': 'mdi-face-woman', 
  'wrap': 'mdi-human',
  'scrub': 'mdi-lotion',
  'manicure': 'mdi-hand',
  'pedicure': 'mdi-foot-print',
  'yoga': 'mdi-yoga',
  'meditation': 'mdi-meditation',
  'scalp': 'mdi-head',
  'eye': 'mdi-eye',
  'foot': 'mdi-foot-print',
  'stone': 'mdi-stone',
  'aromatherapy': 'mdi-flower',
  'couples': 'mdi-heart',
  'swedish': 'mdi-hand-wave',
  'deep tissue': 'mdi-arm-flex',
  'signature': 'mdi-star',
  'anti-aging': 'mdi-restore',
  'hydrating': 'mdi-water',
  'purifying': 'mdi-air-purifier',
  'relief': 'mdi-sun',
  'reflexology': 'mdi-foot-print',
  'classic': 'mdi-gesture-tap',
  'deluxe': 'mdi-crown',
  'private': 'mdi-account',
  'group': 'mdi-account-group'
}

// Function to determine the most appropriate icon for a service based on its name
const getServiceIcon = (service) => {
  const nameLower = service.name.toLowerCase()
  
  // Check for matches in the service name
  for (const [keyword, icon] of Object.entries(serviceIcons)) {
    if (nameLower.includes(keyword.toLowerCase())) {
      return icon
    }
  }
  
  // Default icon based on category
  return categoryIcons[service.category_name] || 'mdi-spa'
}

// Fetch all spa services from the API and organize by category
const fetchServices = async () => {
  try {
    isLoading.value = true
    loadingError.value = null
    
    // In a development environment without the API, we'll simulate the data
    // In production, uncomment the API call and comment out the mockData section
    
    /*
    const response = await SpaService.getAllServices()
    const allServices = response.data
    */
    
    // Mock data for development - this simulates the API response
    // This would be replaced by the actual API call in production
    const allServices = [
      { 
        id: 1,
        name: 'Shangri La Signature Massage',
        duration: '90 minutes',
        price: 250,
        description: 'A customized massage using a blend of techniques to release tension and promote deep relaxation.',
        image_url: '@/assets/images/pexels-polina-tankilevitch-3736520.webp',
        featured: 1,
        category_id: 1,
        category_name: 'Massages'
      },
      { 
        id: 2,
        name: 'Deep Tissue Massage',
        duration: '60 minutes',
        price: 180,
        description: 'Targeted massage to relieve chronic muscle tension and pain.',
        image_url: '@/assets/images/general/pexels-hameen-31714651.webp',
        featured: 0,
        category_id: 1,
        category_name: 'Massages'
      },
      { 
        id: 3,
        name: 'Hot Stone Massage',
        duration: '75 minutes',
        price: 220,
        description: 'Soothing massage using warm basalt stones to melt away stress and improve circulation.',
        image_url: '@/assets/images/general/pexels-maahidphotos-16604579.webp',
        featured: 0,
        category_id: 1,
        category_name: 'Massages'
      },
      { 
        id: 4,
        name: 'Aromatherapy Massage',
        duration: '60 minutes',
        price: 190,
        description: 'Relaxing massage using essential oils to enhance mood and well-being.',
        image_url: '@/assets/images/general/pexels-samma97-31741082.webp',
        featured: 0,
        category_id: 1,
        category_name: 'Massages'
      },
      { 
        id: 5,
        name: 'Swedish Massage',
        duration: '60 minutes',
        price: 170,
        description: 'A classic relaxation massage.',
        image_url: '@/assets/images/general/pexels-vince-2265875.webp',
        featured: 0,
        category_id: 1,
        category_name: 'Massages'
      },
      { 
        id: 6,
        name: 'Couples Massage',
        duration: '60 Minutes',
        price: 350,
        description: 'Relax with a partner in a private room.',
        image_url: '@/assets/images/general/pexels-conojeghuo-127673.webp',
        featured: 0,
        category_id: 1,
        category_name: 'Massages'
      },
      { 
        id: 7,
        name: 'Shangri La Radiance Facial',
        duration: '75 minutes',
        price: 210,
        description: 'A luxurious facial tailored to your skin type, leaving your complexion glowing.',
        image_url: '@/assets/images/general/pexels-alexander-bobrov-390088-1036864.webp',
        featured: 1,
        category_id: 2,
        category_name: 'Facials'
      },
      { 
        id: 8,
        name: 'Hydrating Facial',
        duration: '60 minutes',
        price: 180,
        description: 'Deeply nourishing facial to replenish moisture and restore skin\'s vitality.',
        image_url: '@/assets/images/general/pexels-hasintha-sirimanna-1650797452-31694304.webp',
        featured: 0,
        category_id: 2,
        category_name: 'Facials'
      },
      { 
        id: 9,
        name: 'Anti-Aging Facial',
        duration: '90 minutes',
        price: 270,
        description: 'Advanced facial treatment to reduce fine lines and wrinkles.',
        image_url: '@/assets/images/general/pexels-nazlisanova-2148517169-31741646.webp',
        featured: 0,
        category_id: 2,
        category_name: 'Facials'
      },
      { 
        id: 10,
        name: 'Purifying Facial',
        duration: '60 minutes',
        price: 160,
        description: 'Cleansing facial designed to remove impurities and leave a fresh feeling.',
        image_url: '@/assets/images/general/pexels-asadphoto-1268869.webp',
        featured: 0,
        category_id: 2,
        category_name: 'Facials'
      },
      { 
        id: 11,
        name: 'Sea Salt Body Scrub',
        duration: '45 minutes',
        price: 150,
        description: 'Exfoliating treatment to remove dead skin cells and reveal smoother skin.',
        image_url: '@/assets/images/general/pexels-pixabay-158465.webp',
        featured: 0,
        category_id: 3,
        category_name: 'Body Treatments'
      },
      { 
        id: 12,
        name: 'Tropical Body Wrap',
        duration: '60 minutes',
        price: 200,
        description: 'Hydrating and nourishing body wrap using natural ingredients.',
        image_url: '@/assets/images/general/pexels-mvdheuvel-2284166.webp',
        featured: 1,
        category_id: 3,
        category_name: 'Body Treatments'
      },
      { 
        id: 13,
        name: 'Sun Relief Wrap',
        duration: '60 Minutes',
        price: 170,
        description: 'Soothing treatment to cool and hydrate skin after sun exposure.',
        image_url: '@/assets/images/general/pexels-jmendezrf-3076431.webp',
        featured: 0,
        category_id: 3,
        category_name: 'Body Treatments'
      },
      { 
        id: 14,
        name: 'Shangri La Deluxe Manicure',
        duration: '60 minutes',
        price: 90,
        description: 'Luxurious hand and nail treatment with premium products.',
        image_url: '@/assets/images/pexels-valeriya-31235402.webp',
        featured: 0,
        category_id: 4,
        category_name: 'Nail Services'
      },
      { 
        id: 15,
        name: 'Shangri La Deluxe Pedicure',
        duration: '75 minutes',
        price: 110,
        description: 'Revitalizing foot and nail treatment with exfoliation and massage.',
        image_url: '@/assets/images/general/pexels-richard-segal-732340-1645028.webp',
        featured: 0,
        category_id: 4,
        category_name: 'Nail Services'
      },
      { 
        id: 16,
        name: 'Classic Manicure',
        duration: '45 minutes',
        price: 70,
        description: 'Traditional nail care and polish application.',
        image_url: '@/assets/images/general/pexels-akshay-moncy-1724518-3285746.webp',
        featured: 0,
        category_id: 4,
        category_name: 'Nail Services'
      },
      { 
        id: 17,
        name: 'Classic Pedicure',
        duration: '60 minutes',
        price: 90,
        description: 'Traditional foot care, exfoliation, and polish application.',
        image_url: '@/assets/images/pexels-noz-thumb.webp',
        featured: 0,
        category_id: 4,
        category_name: 'Nail Services'
      },
      { 
        id: 18,
        name: 'Scalp Massage',
        duration: '15 minutes',
        price: 40,
        description: 'Relaxing scalp massage to release tension and promote relaxation.',
        image_url: '@/assets/images/pexels-olly-3757657.webp',
        featured: 0,
        category_id: 5,
        category_name: 'Enhancements'
      },
      { 
        id: 19,
        name: 'Eye Treatment',
        duration: '15 minutes',
        price: 35,
        description: 'Soothing treatment to reduce puffiness and dark circles.',
        image_url: '@/assets/images/pexels-john-tekeridis-21837-3212164.webp',
        featured: 0,
        category_id: 5,
        category_name: 'Enhancements'
      },
      { 
        id: 20,
        name: 'Foot Reflexology',
        duration: '15 minutes',
        price: 40,
        description: 'Pressure point massage on the feet to promote overall wellness.',
        image_url: '@/assets/images/general/pexels-jeffibera-1320761.webp',
        featured: 0,
        category_id: 5,
        category_name: 'Enhancements'
      },
      { 
        id: 21,
        name: 'Yoga Session (Group)',
        duration: '60 minutes',
        price: 50,
        description: 'Guided yoga session to improve flexibility, strength, and mental clarity.',
        image_url: '@/assets/images/leigh-bettencourt.webp',
        featured: 0,
        category_id: 6,
        category_name: 'Wellness'
      },
      { 
        id: 22,
        name: 'Yoga Session (Private)',
        duration: '60 minutes',
        price: 120,
        description: 'Private guided yoga session customized to your needs and level.',
        image_url: '@/assets/images/leigh-bettencourt.webp',
        featured: 0,
        category_id: 6,
        category_name: 'Wellness'
      },
      { 
        id: 23,
        name: 'Meditation Session (Group)',
        duration: '30 minutes',
        price: 40,
        description: 'Guided meditation to promote relaxation and mindfulness.',
        image_url: '@/assets/images/palm-tree.webp',
        featured: 0,
        category_id: 6,
        category_name: 'Wellness'
      },
      { 
        id: 24,
        name: 'Meditation Session (Private)',
        duration: '30 minutes',
        price: 100,
        description: 'Private guided meditation tailored to your personal goals.',
        image_url: '@/assets/images/ishan-seefromthesky-gtt803WswnA-unsplash.webp',
        featured: 1,
        category_id: 6,
        category_name: 'Wellness'
      }
    ]
    
    // Create a mapping between category names and our reactive object keys
    const categoryMapping = {
      'Massages': 'massages',
      'Facials': 'facials',
      'Body Treatments': 'bodyTreatments',
      'Nail Services': 'nailServices',
      'Enhancements': 'enhancements',
      'Wellness': 'wellness'
    }
    
    // Group services by category
    for (const service of allServices) {
      // Add icon to service
      service.icon = getServiceIcon(service)
      
      // Convert to the format expected by our UI
      const formattedService = {
        id: service.id,
        name: service.name,
        duration: service.duration,
        price: service.price,
        description: service.description,
        image: service.image_url, // Map to existing template
        featured: service.featured === 1,
        icon: service.icon,
        category: service.category_name
      }
      
      // Add to the appropriate category in our reactive services object
      const categoryKey = categoryMapping[service.category_name]
      if (categoryKey) {
        services.value[categoryKey].push(formattedService)
      }
    }
    
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching spa services:', error)
    loadingError.value = 'Failed to load spa services. Please try again later.'
    isLoading.value = false
  }
}

// Important spa notes
const spaInfo = [
  'Prices are subject to change without notice.',
  'Reservations are highly recommended.',
  'Please arrive 15 minutes prior to your scheduled appointment.',
  'A 24-hour cancellation policy applies.',
  'Gratuity not included.'
]

// For service category tabs
const activeTab = ref(0)
const tabs = [
  { title: 'Massages', icon: 'mdi-hand-heart', category: 'massages' },
  { title: 'Facials', icon: 'mdi-face-woman', category: 'facials' },
  { title: 'Body Treatments', icon: 'mdi-human', category: 'bodyTreatments' },
  { title: 'Mani & Pedi', icon: 'mdi-hand-back-right', category: 'nailServices' },
  { title: 'Enhancements', icon: 'mdi-plus-circle', category: 'enhancements' },
  { title: 'Wellness', icon: 'mdi-yoga', category: 'wellness' }
]

// For booking modal
const showBookingModal = ref(false)
const selectedService = ref(null)

// For featured services carousel
const featuredServices = computed(() => {
  const featured = []
  for (const category in services.value) {
    featured.push(...services.value[category].filter(service => service.featured))
  }
  return featured
})

// For current tab services
const currentTabServices = computed(() => {
  return services.value[tabs[activeTab.value].category] || []
})

// Animation reference elements
const heroSection = ref(null)
const featuredSection = ref(null)
const servicesSection = ref(null)

// Open booking modal with selected service
const openBookingModal = (service) => {
  selectedService.value = service
  showBookingModal.value = true
}

// Handle booking completed event
const handleBookingCompleted = () => {
  // Handle any additional logic after booking is completed
  console.log('Booking completed successfully');
}

// Function to close booking modal
const closeBookingModal = () => {
  showBookingModal.value = false
}

// For scroll reveal animations and data loading
onMounted(() => {
  // Fetch spa services data
  fetchServices()
  
  // Animation for hero section
  useIntersectionObserver(heroSection, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      document.querySelector('.spa-hero-content').classList.add('hero-visible')
    }
  })

  // Animation for featured section
  useIntersectionObserver(featuredSection, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      document.querySelectorAll('.featured-card').forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('featured-visible')
        }, index * 200)
      })
    }
  })

  // Animation for services section
  useIntersectionObserver(servicesSection, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      document.querySelectorAll('.service-card').forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('service-visible')
        }, index * 100)
      })
    }
  })
})
</script>

<template>
  <v-container fluid class="pa-0">
    <!-- Hero Section -->
    <section ref="heroSection" class="spa-hero-section position-relative">
      <div class="spa-hero-bg">
        <div class="spa-hero-overlay d-flex flex-column justify-center">
          <v-container>
            <div class="spa-hero-content">
              <h1 class="text-h2 font-weight-bold mb-4 text-white">The Serenity Sanctuary</h1>
              <div class="title-underline bg-white mb-6"></div>
              <p class="text-h6 mb-8 text-white max-width-text">
                Indulge in a world of relaxation and rejuvenation at our award-winning spa. Our expert therapists combine ancient healing traditions with modern techniques to create a truly transformative experience.
              </p>
              <v-btn
                color="secondary"
                size="large"
                class="px-6 py-3"
                elevation="3"
                rounded
                @click="$vuetify.goTo('#featured')"
              >
                Explore Our Services
                <v-icon right class="ml-2">mdi-chevron-down</v-icon>
              </v-btn>
            </div>
          </v-container>
        </div>
      </div>
    </section>

    <!-- Featured Services Section -->
    <section id="featured" ref="featuredSection" class="py-12">
      <v-container>
        <v-row class="mb-10">
          <v-col cols="12" class="text-center">
            <h2 class="text-h3 font-weight-bold mb-2">Featured Treatments</h2>
            <div class="title-underline mx-auto mb-8"></div>
            <p class="text-subtitle-1 mb-8 max-width-text mx-auto">
              Experience our most popular and luxurious spa treatments, carefully crafted to provide the ultimate relaxation and rejuvenation experience.
            </p>
          </v-col>
        </v-row>

        <v-row>
          <!-- Loading State -->
          <v-col v-if="isLoading" cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="mt-4">Loading featured treatments...</p>
          </v-col>
          
          <!-- Error State -->
          <v-col v-else-if="loadingError" cols="12">
            <v-alert type="error" variant="tonal" border="start">
              {{ loadingError }}
              <v-btn class="mt-3" color="primary" @click="fetchServices">Try Again</v-btn>
            </v-alert>
          </v-col>
          
          <!-- No Featured Services -->
          <v-col v-else-if="featuredServices.length === 0" cols="12" class="text-center">
            <v-alert type="info" variant="tonal" border="start">
              No featured treatments available at the moment. Please check back later or explore all our treatments below.
            </v-alert>
          </v-col>
          
          <!-- Featured Services Content -->
          <v-col v-else v-for="service in featuredServices" :key="service.id" cols="12" md="6" lg="3">
            <v-card
              class="featured-card elevation-4 rounded-lg h-100"
              hover
              @click="openBookingModal(service)"
            >
              <div class="featured-img-container">
                <v-img 
                  :src="service.image" 
                  height="200" 
                  cover 
                  class="rounded-t-lg"
                ></v-img>
                <div class="featured-badge">Featured</div>
              </div>
              <v-card-title class="text-h5 pt-4 d-flex align-center">
                  <v-icon :icon="service.icon" color="primary" class="mr-2" size="24"></v-icon>
                  {{ service.name }}
                </v-card-title>
              <v-card-subtitle class="pt-2">
                {{ service.duration }} | ${{ service.price }}
              </v-card-subtitle>
              <v-card-text class="text-body-1">
                {{ service.description }}
              </v-card-text>
              <v-card-actions class="pa-4 pt-0">
                <v-btn 
                  block 
                  color="primary" 
                  class="elevation-2"
                  @click.stop="openBookingModal(service)"
                >
                  Book Now
                  <v-icon right class="ml-2">mdi-calendar-plus</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Services Section with Tabs -->
    <section ref="servicesSection" class="py-12 bg-spa-light">
      <v-container>
        <v-row class="mb-8">
          <v-col cols="12" class="text-center">
            <h2 class="text-h3 font-weight-bold mb-2">Spa Services & Price List</h2>
            <div class="title-underline mx-auto mb-8"></div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card class="elevation-3 rounded-lg overflow-hidden">
              <!-- Services Tabs -->
              <v-tabs
                v-model="activeTab"
                fixed-tabs
                bg-color="primary"
                centered
                grow
              >
                <v-tab v-for="(tab, index) in tabs" :key="index" :value="index">
                  <v-icon :icon="categoryIcons[tab.title] || tab.icon" class="mr-2"></v-icon>
                  <span class="hidden-sm-and-down">{{ tab.title }}</span>
                </v-tab>
              </v-tabs>

              <!-- Tab Content -->
              <v-window v-model="activeTab">
                <!-- Loading State -->
                <v-row v-if="isLoading" class="pa-4">
                  <v-col cols="12" class="text-center">
                    <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
                    <p class="mt-4">Loading spa services...</p>
                  </v-col>
                </v-row>
                
                <!-- Error State -->
                <v-row v-else-if="loadingError" class="pa-4">
                  <v-col cols="12">
                    <v-alert type="error" variant="tonal" border="start">
                      {{ loadingError }}
                      <v-btn class="mt-3" color="primary" @click="fetchServices">Try Again</v-btn>
                    </v-alert>
                  </v-col>
                </v-row>
                
                <!-- Services Content -->
                <v-window-item 
                  v-else
                  v-for="(tab, index) in tabs" 
                  :key="index" 
                  :value="index"
                  class="pa-4"
                >
                  <v-row>
                    <v-col 
                      v-for="service in currentTabServices" 
                      :key="service.id" 
                      cols="12" sm="6" lg="4"
                    >
                      <v-card 
                        class="service-card elevation-1 rounded-lg h-100 mb-4"
                        hover
                        @click="openBookingModal(service)"
                      >
                        <div class="d-flex align-start">
                          <v-avatar 
                            class="ma-3" 
                            size="64" 
                            rounded
                          >
                            <v-img 
                              :src="service.image" 
                              cover
                            ></v-img>
                          </v-avatar>
                          <div class="grow pt-3 pr-3">
                            <v-card-title class="text-subtitle-1 px-0 py-1 d-flex align-center">
                              <v-icon :icon="service.icon" color="primary" class="mr-2" size="small"></v-icon>
                              {{ service.name }}
                            </v-card-title>
                            <v-card-subtitle class="px-0 py-1">
                              {{ service.duration }}
                            </v-card-subtitle>
                            <div class="text-primary font-weight-bold mb-1">
                              ${{ service.price }}
                            </div>
                          </div>
                        </div>
                        
                        <v-card-text class="pt-0">
                          <p class="text-body-2">{{ service.description }}</p>
                        </v-card-text>
                        
                        <v-card-actions class="pa-4 pt-0">
                          <v-btn 
                            block 
                            variant="outlined" 
                            color="primary"
                            @click.stop="openBookingModal(service)"
                          >
                            Book Appointment
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Important Information Section -->
    <section class="py-12">
      <v-container>
        <v-row>
          <v-col cols="12" md="8" offset-md="2">
            <v-card class="elevation-3 rounded-lg pa-6">
              <h3 class="text-h4 font-weight-bold mb-4 text-center">Important Notes</h3>
              
              <v-list>
                <v-list-item v-for="(note, index) in spaInfo" :key="index">
                  <template v-slot:prepend>
                    <v-icon color="primary" class="mr-3">mdi-information</v-icon>
                  </template>
                  <v-list-item-title>{{ note }}</v-list-item-title>
                </v-list-item>
              </v-list>

              <div class="text-center mt-6">
                <v-btn
                  size="large"
                  class="px-6"
                  color="secondary"
                  @click="$vuetify.goTo('#featured')"
                >
                  Book Your Spa Experience
                  <v-icon right class="ml-2">mdi-spa</v-icon>
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Booking Dialog -->
    <v-dialog v-model="showBookingModal" max-width="600" persistent>
      <SpaBookingForm 
        v-if="selectedService" 
        :service="selectedService" 
        @booking-completed="handleBookingCompleted" 
        @close="closeBookingModal" 
      />
    </v-dialog>
  </v-container>
</template>

<style scoped>
/* Hero Section */
.spa-hero-section {
  height: 60vh;
  min-height: 400px;
}

.spa-hero-bg {
  height: 100%;
  width: 100%;
  background-image: url('@/assets/images/pexels-polina-tankilevitch-3736520.webp');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.spa-hero-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 100%;
}

.spa-hero-content {
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

/* Featured cards */
.featured-card {
  transform: translateY(30px);
  opacity: 0;
  transition: transform 0.6s ease-out, opacity 0.6s ease-out, box-shadow 0.3s ease;
}

.featured-visible {
  transform: translateY(0);
  opacity: 1;
}

.featured-card:hover {
  transform: translateY(-10px);
}

.featured-img-container {
  position: relative;
}

.featured-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

/* Service cards */
.bg-spa-light {
  background-color: #f9f5f7;
}

.service-card {
  transform: translateY(20px);
  opacity: 0;
  transition: transform 0.5s ease-out, opacity 0.5s ease-out, box-shadow 0.3s ease;
}

.service-visible {
  transform: translateY(0);
  opacity: 1;
}

.service-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

/* Service Icons */
.service-icon-background {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(0, 105, 92, 0.1);
  margin-right: 8px;
}

/* Booking confirmation icon */
.confirmation-icon-container {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 80px;
}

.check-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.service-icon {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: white;
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Loading Animation */
@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 105, 92, 0.5);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(0, 105, 92, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 105, 92, 0);
  }
}

.v-progress-circular {
  animation: pulse 2s infinite;
}

/* Responsive styles */
@media (max-width: 960px) {
  .spa-hero-section {
    height: 50vh;
  }
}

@media (max-width: 600px) {
  .spa-hero-section {
    height: auto;
    min-height: 50vh;
  }
}
</style>
