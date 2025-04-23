<script setup>
import { ref, onMounted, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import SectionHeading from '@/components/SectionHeading.vue'

// Unused but kept for documentation purposes
// function getOptimizedImagePath(imagePath) {
//   // The import.meta.url is already part of the imagePath
//   return imagePath
// }

// Cache images for better performance
const imageCache = {}
const preloadImage = (src) => {
  if (!imageCache[src]) {
    const img = new Image()
    img.src = src
    imageCache[src] = img
  }
  return imageCache[src]
}

// Preload featured activity images for better performance
const preloadFeaturedImages = () => {
  activities.value.onsite.filter(a => a.featured).forEach(activity => {
    preloadImage(activity.image)
  })
  activities.value.excursions.filter(a => a.featured).forEach(activity => {
    preloadImage(activity.image)
  })
}

// Activities data
const activities = ref({
  onsite: [
    {
      id: 1,
      category: 'Relaxation & Rejuvenation',
      title: 'Sunrise Yoga on the Beach',
      description: 'Start your day with a peaceful yoga session as the sun rises over the ocean.',
      details: 'Our experienced instructors lead sessions suitable for all levels. Mats and props are provided.',
      schedule: 'Daily, 6:30 AM',
      duration: '60 minutes',
      price: 'Complimentary',
      location: 'Beach Front',
      image: new URL('@/assets/images/general/meditativebeach.webp', import.meta.url).href,
      icon: 'mdi-yoga',
      featured: true
    },
    {
      id: 2,
      category: 'Relaxation & Rejuvenation',
      title: 'Guided Meditation Sessions',
      description: 'Find inner peace and tranquillity with our guided meditation sessions in the serene garden.',
      details: 'Perfect for beginners and experienced practitioners alike. Focus on mindfulness and relaxation techniques.',
      schedule: 'Daily, 5:00 PM',
      duration: '45 minutes',
      price: 'Complimentary',
      location: 'Zen Garden',
      image: new URL('@/assets/images/general/meditation.webp', import.meta.url).href,
      icon: 'mdi-meditation'
    },
    {
      id: 3,
      category: 'Relaxation & Rejuvenation',
      title: 'Beachside Relaxation',
      description: 'Unwind on our pristine private beach with complimentary sun loungers and umbrellas.',
      details: 'Beach attendants are available to assist with setup and provide refreshments throughout the day.',
      schedule: 'Daily, 8:00 AM - 6:00 PM',
      duration: 'As desired',
      price: 'Complimentary',
      location: 'Main Beach',
      image: new URL('@/assets/images/general/nicebeach.webp', import.meta.url).href,
      icon: 'mdi-beach'
    },
    {
      id: 4,
      category: 'Relaxation & Rejuvenation',
      title: 'Infinity Pool Retreat',
      description: 'Take a refreshing dip in our stunning infinity pool with breathtaking ocean views.',
      details: 'Pool attendants provide towels and refreshments. Adult-only hours from 7:00 PM - 10:00 PM.',
      schedule: 'Daily, 7:00 AM - 10:00 PM',
      duration: 'As desired',
      price: 'Complimentary',
      location: 'Main Pool Deck',
      image: new URL('@/assets/images/general/beachpool.webp', import.meta.url).href,
      icon: 'mdi-pool'
    },
    {
      id: 5,
      category: 'Adventure & Recreation',
      title: 'Snorkeling',
      description: 'Discover vibrant coral reefs and marine life just off our private beach.',
      details: 'Guided sessions available for beginners. Equipment provided at the water sports center.',
      schedule: 'Daily, 9:00 AM - 4:00 PM',
      duration: 'As desired',
      price: 'Equipment rental: $15/hour',
      location: 'Water Sports Center',
      image: new URL('@/assets/images/general/snorkeling.webp', import.meta.url).href,
      icon: 'mdi-diving-scuba-mask',
      featured: true
    },
    {
      id: 6,
      category: 'Adventure & Recreation',
      title: 'Kayaking',
      description: 'Paddle along the coastline and explore hidden coves.',
      details: 'Single and tandem kayaks available. Brief instruction provided for beginners.',
      schedule: 'Daily, 9:00 AM - 4:00 PM',
      duration: 'As desired',
      price: 'Rental: $20/hour',
      location: 'Water Sports Center',
      image: new URL('@/assets/images/general/kayaking.webp', import.meta.url).href,
      icon: 'mdi-kayaking'
    },
    {
      id: 7,
      category: 'Adventure & Recreation',
      title: 'Stand-Up Paddleboarding',
      description: 'Enjoy a fun and invigorating workout on the water.',
      details: 'Instruction available for beginners. Great for all fitness levels.',
      schedule: 'Daily, 9:00 AM - 4:00 PM',
      duration: 'As desired',
      price: 'Rental: $25/hour',
      location: 'Water Sports Center',
      image: new URL('@/assets/images/general/marinaboats.webp', import.meta.url).href,
      icon: 'mdi-surfing'
    },
    {
      id: 8,
      category: 'Adventure & Recreation',
      title: 'Beach Volleyball',
      description: 'Gather your friends and family for a friendly game of beach volleyball.',
      details: 'Courts are available on a first-come, first-served basis. Equipment provided.',
      schedule: 'Daily, 8:00 AM - 6:00 PM',
      duration: 'As desired',
      price: 'Complimentary',
      location: 'Beach Sports Area',
      image: new URL('@/assets/images/general/beach-volleyball.webp', import.meta.url).href,
      icon: 'mdi-volleyball'
    },
    {
      id: 9,
      category: 'Adventure & Recreation',
      title: 'Fitness Center',
      description: 'Maintain your fitness routine in our state-of-the-art fitness center.',
      details: 'Equipped with cardio machines, free weights, and multi-functional training equipment. Personal trainers available upon request.',
      schedule: 'Daily, 24/7 access',
      duration: 'As desired',
      price: 'Complimentary',
      location: 'Wellness Center, 2nd Floor',
      image: new URL('@/assets/images/general/beachpool2.webp', import.meta.url).href,
      icon: 'mdi-dumbbell'
    },
    {
      id: 10,
      category: 'Adventure & Recreation',
      title: 'Kids\' Club Activities',
      description: 'Let your children enjoy fun and engaging activities with our supervised Kids\' Club.',
      details: 'Age-appropriate activities including arts and crafts, games, and educational programs. Supervised by trained staff.',
      schedule: 'Daily, 9:00 AM - 5:00 PM',
      duration: 'Flexible',
      price: 'Complimentary',
      location: 'Kids\' Club',
      image: new URL('@/assets/images/general/gardencritter.webp', import.meta.url).href,
      icon: 'mdi-human-child'
    }
  ],
  excursions: [
    {
      id: 11,
      category: 'Natural Beauty',
      title: 'Coral Reef Snorkeling Tour',
      description: 'Embark on a guided snorkeling tour to explore the vibrant coral reefs and encounter diverse marine life.',
      details: 'Transportation to prime snorkeling spots. Professional guides provide safety instructions and information about the local marine ecosystem.',
      schedule: 'Daily, 9:00 AM & 1:00 PM',
      duration: 'Half-day (3 hours)',
      price: '$75 per person',
      location: 'Departs from Marina',
      image: new URL('@/assets/images/general/diving.webp', import.meta.url).href,
      icon: 'mdi-diving-scuba-mask',
      featured: true
    },
    {
      id: 12,
      category: 'Natural Beauty',
      title: 'Island Hopping Adventure',
      description: 'Discover the surrounding islands with a scenic boat tour.',
      details: 'Visit three different islands, each with unique landscapes and attractions. Includes lunch and refreshments.',
      schedule: 'Tuesday, Thursday, Saturday, 9:00 AM',
      duration: 'Full-day (7 hours)',
      price: '$120 per person',
      location: 'Departs from Marina',
      image: new URL('@/assets/images/general/islandhopping.webp', import.meta.url).href,
      icon: 'mdi-ferry'
    },
    {
      id: 13,
      category: 'Natural Beauty',
      title: 'Rainforest Hike & Waterfall Visit',
      description: 'Immerse yourself in the lush rainforest and discover hidden waterfalls.',
      details: 'Guided hike through diverse ecosystems. Opportunity to swim in natural pools beneath waterfalls. Moderate fitness level recommended.',
      schedule: 'Monday, Wednesday, Friday, 8:00 AM',
      duration: 'Half-day (4 hours) or Full-day (6 hours)',
      price: 'Half-day: $85, Full-day: $110 per person',
      location: 'Departs from Resort Lobby',
      image: new URL('@/assets/images/general/rainforesthike.webp', import.meta.url).href,
      icon: 'mdi-forest'
    },
    {
      id: 14,
      category: 'Natural Beauty',
      title: 'Sunset Cruise',
      description: 'Enjoy a romantic sunset cruise along the coastline with breathtaking views.',
      details: 'Includes champagne, canapés, and live music. Perfect for couples and special occasions.',
      schedule: 'Daily, 5:30 PM (varies with sunset time)',
      duration: '2 hours',
      price: '$95 per person',
      location: 'Departs from Marina',
      image: new URL('@/assets/images/general/beachpool.webp', import.meta.url).href,
      icon: 'mdi-sail-boat'
    },
    {
      id: 15,
      category: 'Cultural Experiences',
      title: 'Local Village Visit',
      description: 'Experience the authentic culture and traditions of the local village.',
      details: 'Guided tour through a traditional village. Interact with local artisans and learn about cultural practices. Opportunity to purchase authentic handicrafts.',
      schedule: 'Tuesday, Friday, 10:00 AM',
      duration: 'Half-day (4 hours)',
      price: '$65 per person',
      location: 'Departs from Resort Lobby',
      image: new URL('@/assets/images/general/nicebeach.webp', import.meta.url).href,
      icon: 'mdi-home-group'
    },
    {
      id: 16,
      category: 'Cultural Experiences',
      title: 'Traditional Cooking Class',
      description: 'Learn to prepare local delicacies with a hands-on cooking class.',
      details: 'Led by a local chef. Includes market visit to select fresh ingredients, cooking instruction, and enjoying your prepared meal.',
      schedule: 'Wednesday, Saturday, 10:00 AM',
      duration: 'Half-day (4 hours)',
      price: '$85 per person',
      location: 'Departs from Resort Lobby',
      image: new URL('@/assets/images/general/cooking.webp', import.meta.url).href,
      icon: 'mdi-chef-hat'
    },
    {
      id: 17,
      category: 'Cultural Experiences',
      title: 'Cultural Performance',
      description: 'Enjoy a captivating performance of traditional music and dance.',
      details: 'Authentic cultural showcase featuring local performers. Learn about the history and significance of traditional performances.',
      schedule: 'Monday, Thursday, 8:00 PM',
      duration: '90 minutes',
      price: '$45 per person',
      location: 'Resort Amphitheater',
      image: new URL('@/assets/images/general/culturaldance.webp', import.meta.url).href,
      icon: 'mdi-drama-masks',
      featured: true
    },
    {
      id: 18,
      category: 'Adventure & Wildlife',
      title: 'Diving Excursions',
      description: 'Explore the underwater world with our certified diving instructors.',
      details: 'Various dive sites for all experience levels. PADI-certified instructors. Equipment rental available.',
      schedule: 'Daily, schedules vary by site',
      duration: 'Half-day or Full-day',
      price: 'From $110 per person',
      location: 'Dive Center',
      image: new URL('@/assets/images/general/deepdiving.webp', import.meta.url).href,
      icon: 'mdi-diving-scuba'
    },
    {
      id: 19,
      category: 'Adventure & Wildlife',
      title: 'Wildlife Sanctuary Visit',
      description: 'Encounter exotic wildlife at a nearby sanctuary.',
      details: 'Guided tour of a conservation-focused wildlife sanctuary. Learn about local species and conservation efforts.',
      schedule: 'Monday, Wednesday, Saturday, 9:00 AM',
      duration: 'Half-day (4 hours)',
      price: '$70 per person',
      location: 'Departs from Resort Lobby',
      image: new URL('@/assets/images/general/monkeyeatingcorn.webp', import.meta.url).href,
      icon: 'mdi-paw'
    },
    {
      id: 20,
      category: 'Adventure & Wildlife',
      title: 'Deep-Sea Fishing',
      description: 'Embark on a thrilling deep-sea fishing adventure.',
      details: 'Professional fishing guides and equipment provided. Target species include marlin, tuna, and mahi-mahi.',
      schedule: 'Tuesday, Thursday, Sunday, 6:00 AM',
      duration: 'Half-day (4 hours) or Full-day (8 hours)',
      price: 'Half-day: $150, Full-day: $250 per person',
      location: 'Departs from Marina',
      image: new URL('@/assets/images/general/marinaboats.webp', import.meta.url).href,
      icon: 'mdi-fish'
    }
  ]
})

// For activity filtering
const activeSection = ref('all') // 'all', 'onsite', 'excursions'
const searchQuery = ref('')

// For category accordion
const expandedCategories = ref([])
const showAllActivities = ref(false)
// Track expanded panel indexes
const expandedPanels = ref([])

// Extract all unique categories
const categories = computed(() => {
  const categorySet = new Set()
  
  activities.value.onsite.forEach(activity => {
    categorySet.add(activity.category)
  })
  
  activities.value.excursions.forEach(activity => {
    categorySet.add(activity.category)
  })
  
  return ['all', ...Array.from(categorySet)]
})

// Group activities by category
const activitiesByCategory = computed(() => {
  const grouped = {}
  
  // Initialize categories
  categories.value.forEach(category => {
    if (category !== 'all') {
      grouped[category] = []
    }
  })
  
  // Filter and group activities
  let activitiesToGroup = []
  
  if (activeSection.value === 'all' || activeSection.value === 'onsite') {
    activitiesToGroup = [...activitiesToGroup, ...activities.value.onsite]
  }
  
  if (activeSection.value === 'all' || activeSection.value === 'excursions') {
    activitiesToGroup = [...activitiesToGroup, ...activities.value.excursions]
  }
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    activitiesToGroup = activitiesToGroup.filter(activity => 
      activity.title.toLowerCase().includes(query) || 
      activity.description.toLowerCase().includes(query) ||
      activity.category.toLowerCase().includes(query)
    )
  }
  
  // Group by category
  activitiesToGroup.forEach(activity => {
    grouped[activity.category].push(activity)
  })
  
  return grouped
})

// Categories with activities (for filtering empty categories)
const categoriesWithActivities = computed(() => {
  return Object.entries(activitiesByCategory.value)
    .filter(([_, activities]) => activities.length > 0)
    .map(([category]) => category)
})

// Featured activities across all categories
const featuredActivities = computed(() => {
  return [
    ...activities.value.onsite.filter(activity => activity.featured),
    ...activities.value.excursions.filter(activity => activity.featured)
  ]
})

// Selected activity for detail view
const selectedActivity = ref(null)
const showDetailModal = ref(false)

// Toggle show all activities
function toggleAllActivities() {
  showAllActivities.value = !showAllActivities.value
  if (showAllActivities.value) {
    expandedCategories.value = [...categoriesWithActivities.value]
    // Create array of indices from 0 to categoriesWithActivities.length - 1
    expandedPanels.value = Array.from({ length: categoriesWithActivities.value.length }, (_, i) => i)
  } else {
    expandedCategories.value = []
    expandedPanels.value = []
  }
}

// Open detail modal
function openDetailView(activity) {
  selectedActivity.value = activity
  showDetailModal.value = true
}

// Animation reference elements
const heroSection = ref(null)
const featuredSection = ref(null)
const activitiesSection = ref(null)

// For interactive category display
const getColorForCategory = (category) => {
  const colors = {
    'Relaxation & Rejuvenation': 'indigo',
    'Adventure & Recreation': 'green',
    'Natural Beauty': 'blue',
    'Cultural Experiences': 'amber',
    'Adventure & Wildlife': 'deep-orange'
  }
  
  return colors[category] || 'primary'
}

// Intersection observers for animations
onMounted(() => {
  // Preload featured images for better performance
  preloadFeaturedImages()
  
  // Animation for hero section
  useIntersectionObserver(heroSection, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      document.querySelector('.activities-hero-content').classList.add('hero-visible')
    }
  })

  // Animation for featured section - immediate appearance for better performance
  useIntersectionObserver(featuredSection, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      document.querySelectorAll('.featured-activity-card').forEach(el => {
        el.classList.add('activity-visible')
      })
      
      // Lazy load images for activities that are currently not in view
      setTimeout(() => {
        const visibleActivities = new Set()
        featuredActivities.value.forEach(activity => {
          visibleActivities.add(activity.id)
          preloadImage(activity.image)
        })
      }, 300)
    }
  })

  // Animation for activities section - simplified for better performance
  useIntersectionObserver(activitiesSection, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      document.querySelectorAll('.category-section').forEach(el => {
        el.classList.add('category-visible')
      })
    }
  })
})
</script>

<template>
  <v-container fluid class="pa-0">
    <!-- Hero Section -->
    <section ref="heroSection" class="activities-hero-section position-relative">
      <div class="activities-hero-bg">
        <div class="activities-hero-overlay d-flex flex-column justify-center">
          <v-container>
            <div class="activities-hero-content">
              <h1 class="text-h2 font-weight-bold mb-4 text-white">Activities & Excursions</h1>
              <div class="title-underline bg-white mb-6"></div>
              <p class="text-h6 mb-8 text-white max-width-text">
                Discover the wonders of our tropical paradise and create unforgettable memories with our curated selection of activities and excursions. From relaxation to adventure, there's something for everyone.
              </p>
              <v-btn
                color="secondary"
                size="large"
                class="px-6 py-3"
                elevation="3"
                rounded
                @click="$vuetify.goTo('#featured')"
              >
                Explore Activities
                <v-icon right class="ml-2">mdi-chevron-down</v-icon>
              </v-btn>
            </div>
          </v-container>
        </div>
      </div>
    </section>

    <!-- Activity Showcase Slider -->
    <section id="featured" ref="featuredSection" class="py-12">
      <v-container>
        <SectionHeading
          title="Explore Paradise"
          subtitle="Immerse yourself in unforgettable experiences at Shangri-La"
        />

        <!-- Activity Category Tabs -->
        <v-row class="mt-6 mb-8">
          <v-col cols="12">
            <v-chip-group
              v-model="activeSection"
              mandatory
              selected-class="secondary"
              class="d-flex justify-center"
            >
              <v-chip
                value="all"
                size="large"
                variant="elevated"
                class="ma-2 px-6"
                :color="activeSection === 'all' ? 'secondary' : ''"
              >
                All Activities
              </v-chip>
              <v-chip
                value="onsite"
                size="large"
                variant="elevated"
                class="ma-2 px-6"
                :color="activeSection === 'onsite' ? 'secondary' : ''"
              >
                Resort Activities
              </v-chip>
              <v-chip
                value="excursions"
                size="large"
                variant="elevated"
                class="ma-2 px-6"
                :color="activeSection === 'excursions' ? 'secondary' : ''"
              >
                Local Excursions
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>

        <!-- Search Bar -->
        <v-row class="mb-8">
          <v-col cols="12" md="6" offset-md="3">
            <v-text-field
              v-model="searchQuery"
              label="Search Activities"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-magnify"
              rounded
              clearable
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Featured Activities Carousel -->
        <v-row>
          <v-col cols="12">
            <v-carousel
              height="600"
              hide-delimiters
              show-arrows="hover"
              cycle
              interval="5000"
              class="activity-carousel rounded-lg elevation-3"
            >
              <v-carousel-item
                v-for="activity in featuredActivities"
                :key="activity.id"
                @click="openDetailView(activity)"
                class="cursor-pointer"
              >
                <div class="d-flex fill-height carousel-gradient-overlay">
                  <v-img
                    :src="activity.image"
                    class="fill-height"
                    cover
                    gradient="to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8)"
                    :lazy-src="activity.image"
                    loading="lazy"
                    width="100%"
                    height="100%"
                  >
                    <template v-slot:placeholder>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-progress-circular indeterminate color="white"></v-progress-circular>
                      </div>
                    </template>
                    
                    <div class="d-flex flex-column justify-end fill-height pa-8">
                      <div class="carousel-content">
                        <v-chip
                          size="small"
                          :color="getColorForCategory(activity.category)"
                          class="mb-4"
                        >
                          {{ activity.category }}
                        </v-chip>
                        
                        <h3 class="text-h3 font-weight-bold text-white mb-4">
                          {{ activity.title }}
                        </h3>
                        
                        <p class="text-h6 text-white mb-6 carousel-description">
                          {{ activity.description }}
                        </p>
                        
                        <div class="d-flex flex-wrap">
                          <div class="d-flex align-center me-6 mb-2">
                            <v-icon color="white" size="small" class="mr-2">mdi-clock-outline</v-icon>
                            <span class="text-white text-subtitle-2">{{ activity.duration }}</span>
                          </div>
                          
                          <div class="d-flex align-center me-6 mb-2">
                            <v-icon color="white" size="small" class="mr-2">mdi-map-marker</v-icon>
                            <span class="text-white text-subtitle-2">{{ activity.location }}</span>
                          </div>
                          
                          <div class="d-flex align-center mb-2">
                            <v-icon color="white" size="small" class="mr-2">mdi-cash</v-icon>
                            <span class="text-white text-subtitle-2">{{ activity.price }}</span>
                          </div>
                        </div>
                        
                        <v-btn
                          color="secondary"
                          class="mt-4"
                          elevation="2"
                          @click.stop="openDetailView(activity)"
                        >
                          View Details
                          <v-icon right class="ml-2">mdi-arrow-right</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </v-img>
                </div>
              </v-carousel-item>
            </v-carousel>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Activities Categories Section -->
    <section ref="activitiesSection" class="py-12 bg-surface-variant">
      <v-container>
        <SectionHeading
          title="Discover Our Activities"
          subtitle="Browse through our diverse range of experiences"
        />

        <!-- Category Toggle Button -->
        <div class="text-center mb-8 mt-6">
          <v-btn
            color="primary"
            size="large"
            @click="toggleAllActivities"
            rounded
            class="px-6"
          >
            <v-icon left class="mr-2">{{ showAllActivities ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            {{ showAllActivities ? 'Collapse All Categories' : 'Expand All Categories' }}
          </v-btn>
        </div>

        <!-- Categories Display -->
        <v-row>
          <v-col cols="12">
            <v-expansion-panels
              v-model="expandedPanels"
              multiple
              variant="accordion"
              class="category-panels"
              eager
            >
              <v-expansion-panel
                v-for="(category, index) in categoriesWithActivities"
                :key="category"
                class="category-section mb-4 rounded-lg"
                :class="{ 'panel-expanded': expandedPanels.includes(index) }"
                elevation="2"
              >
                <v-expansion-panel-title 
                  :class="`category-header bg-${getColorForCategory(category)}`"
                >
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                      <v-icon 
                        size="large" 
                        color="white" 
                        class="mr-4"
                      >
                        {{ 
                          category === 'Relaxation & Rejuvenation' ? 'mdi-spa' : 
                          category === 'Adventure & Recreation' ? 'mdi-kayaking' :
                          category === 'Natural Beauty' ? 'mdi-pine-tree' :
                          category === 'Cultural Experiences' ? 'mdi-home-city' :
                          category === 'Adventure & Wildlife' ? 'mdi-dolphin' : 'mdi-star'
                        }}
                      </v-icon>
                      <span class="text-h5 font-weight-bold text-white">{{ category }}</span>
                    </div>
                    <div>
                      <v-chip
                        color="white"
                        variant="flat"
                        size="small"
                        class="font-weight-bold"
                      >
                        {{ activitiesByCategory[category].length }} Activities
                      </v-chip>
                    </div>
                  </div>
                </v-expansion-panel-title>
                
                <v-expansion-panel-text class="py-6" eager>
                  <v-row>
                    <v-col 
                      v-for="activity in activitiesByCategory[category]" 
                      :key="activity.id" 
                      cols="12" md="4" sm="6"
                      class="mb-4"
                    >
                      <v-card 
                        class="activity-card h-100"
                        elevation="3"
                        hover
                        @click="openDetailView(activity)"
                      >
                        <v-img
                          :src="activity.image"
                          height="200"
                          cover
                          class="rounded-t-lg"
                          gradient="to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.4)"
                          :lazy-src="activity.image"
                          loading="lazy"
                          width="100%"
                        >
                          <template v-slot:placeholder>
                            <div class="d-flex align-center justify-center fill-height">
                              <v-progress-circular indeterminate color="primary"></v-progress-circular>
                            </div>
                          </template>
                          
                          <div class="d-flex flex-column fill-height justify-end pa-4">
                            <v-chip
                              size="x-small"
                              :color="getColorForCategory(activity.category)"
                              class="mb-2 category-chip"
                            >
                              {{ 
                                activeSection.value === 'all' ? 
                                (activity.id <= 10 ? 'Resort Activity' : 'Local Excursion') : 
                                ''
                              }}
                            </v-chip>
                          </div>
                        </v-img>
                        
                        <v-card-item>
                          <v-card-title class="pb-1 d-flex align-center">
                            <v-avatar
                              :color="getColorForCategory(activity.category)"
                              class="mr-3 activity-icon-avatar"
                              size="36"
                            >
                              <v-icon color="white" size="20">{{ activity.icon }}</v-icon>
                            </v-avatar>
                            {{ activity.title }}
                          </v-card-title>
                        </v-card-item>
                        
                        <v-card-text class="pt-0">
                          <p class="text-body-2 mb-4">{{ activity.description }}</p>
                          
                          <div class="d-flex align-center mb-1">
                            <v-icon size="small" class="mr-2" color="primary">mdi-clock-outline</v-icon>
                            <span class="text-caption">{{ activity.duration }}</span>
                          </div>
                          
                          <div class="d-flex align-center mb-1">
                            <v-icon size="small" class="mr-2" color="primary">mdi-map-marker</v-icon>
                            <span class="text-caption">{{ activity.location }}</span>
                          </div>
                          
                          <div class="d-flex align-center">
                            <v-icon size="small" class="mr-2" color="primary">mdi-cash</v-icon>
                            <span class="text-caption">{{ activity.price }}</span>
                          </div>
                        </v-card-text>
                        
                        <v-card-actions class="pa-4">
                          <v-btn
                            variant="outlined"
                            color="primary"
                            block
                            @click.stop="openDetailView(activity)"
                          >
                            View Details
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Activity Detail Modal -->
    <v-dialog
      v-model="showDetailModal"
      max-width="800"
      scrollable
    >
      <v-card v-if="selectedActivity" class="activity-detail-card">
        <v-img
          :src="selectedActivity.image"
          height="300"
          cover
          class="activity-detail-image"
          gradient="to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.7)"
          :lazy-src="selectedActivity.image"
          loading="lazy"
          width="100%"
        >
          <div class="d-flex flex-column fill-height justify-end pa-6">
            <v-chip
              size="small"
              :color="getColorForCategory(selectedActivity.category)"
              class="mb-2"
            >
              {{ selectedActivity.category }}
            </v-chip>
            <h2 class="text-h3 font-weight-bold text-white">{{ selectedActivity.title }}</h2>
          </div>
          
          <v-btn
            icon
            class="close-btn"
            @click="showDetailModal = false"
            color="white"
            variant="text"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-img>
        
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12">
              <h3 class="text-h5 font-weight-bold mb-4">
                <v-icon 
                  :color="getColorForCategory(selectedActivity.category)"
                  size="large"
                  class="mr-2"
                >
                  {{ selectedActivity.icon }}
                </v-icon>
                About This Experience
              </h3>
              
              <p class="text-body-1 mb-6">{{ selectedActivity.description }}</p>
              <p class="text-body-1 mb-8">{{ selectedActivity.details }}</p>
              
              <v-divider class="mb-6"></v-divider>
              
              <h4 class="text-h6 font-weight-bold mb-4">Activity Information</h4>
              
              <v-row class="mb-6">
                <v-col cols="12" sm="6" md="3">
                  <div class="detail-info-card pa-4 rounded-lg">
                    <div class="d-flex flex-column align-center">
                      <v-avatar color="primary" class="mb-2" size="48">
                        <v-icon color="white" size="24">mdi-clock-outline</v-icon>
                      </v-avatar>
                      <h5 class="text-subtitle-1 font-weight-bold text-center mb-1">Duration</h5>
                      <span class="text-caption text-center">{{ selectedActivity.duration }}</span>
                    </div>
                  </div>
                </v-col>
                
                <v-col cols="12" sm="6" md="3">
                  <div class="detail-info-card pa-4 rounded-lg">
                    <div class="d-flex flex-column align-center">
                      <v-avatar color="primary" class="mb-2" size="48">
                        <v-icon color="white" size="24">mdi-calendar-range</v-icon>
                      </v-avatar>
                      <h5 class="text-subtitle-1 font-weight-bold text-center mb-1">Schedule</h5>
                      <span class="text-caption text-center">{{ selectedActivity.schedule }}</span>
                    </div>
                  </div>
                </v-col>
                
                <v-col cols="12" sm="6" md="3">
                  <div class="detail-info-card pa-4 rounded-lg">
                    <div class="d-flex flex-column align-center">
                      <v-avatar color="primary" class="mb-2" size="48">
                        <v-icon color="white" size="24">mdi-map-marker</v-icon>
                      </v-avatar>
                      <h5 class="text-subtitle-1 font-weight-bold text-center mb-1">Location</h5>
                      <span class="text-caption text-center">{{ selectedActivity.location }}</span>
                    </div>
                  </div>
                </v-col>
                
                <v-col cols="12" sm="6" md="3">
                  <div class="detail-info-card pa-4 rounded-lg">
                    <div class="d-flex flex-column align-center">
                      <v-avatar color="primary" class="mb-2" size="48">
                        <v-icon color="white" size="24">mdi-cash</v-icon>
                      </v-avatar>
                      <h5 class="text-subtitle-1 font-weight-bold text-center mb-1">Price</h5>
                      <span class="text-caption text-center">{{ selectedActivity.price }}</span>
                    </div>
                  </div>
                </v-col>
              </v-row>
              
              <v-divider class="mb-6"></v-divider>
              
              <h4 class="text-h6 font-weight-bold mb-4">What to Know</h4>
              
              <v-alert
                :color="getColorForCategory(selectedActivity.category)"
                variant="tonal"
                class="mb-4"
                icon="mdi-information"
              >
                <p class="mb-0" v-if="selectedActivity.id <= 10">
                  This is an on-site resort activity. Please check with the concierge or activities desk for current availability.
                </p>
                <p class="mb-0" v-else>
                  This is a local excursion. Advance booking is recommended. Transportation to and from the resort is included.
                </p>
              </v-alert>
              
              <p class="text-body-2">
                Please note that all activities are subject to weather conditions and availability. For more information or to inquire about specific dates, please contact our resort concierge.
              </p>
            </v-col>
          </v-row>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            variant="flat"
            @click="showDetailModal = false"
          >
            Close
          </v-btn>
          <v-btn
            color="primary"
            class="ml-2"
            @click="$vuetify.goTo('#featured'); showDetailModal = false"
          >
            Explore More Activities
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Information Section -->
    <section class="py-12">
      <v-container>
        <v-row>
          <v-col cols="12" md="8" offset-md="2">
            <v-card class="elevation-3 rounded-lg pa-6">
              <h3 class="text-h4 font-weight-bold mb-4 text-center">Activity Information</h3>
              
              <v-list>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary" class="mr-3">mdi-information</v-icon>
                  </template>
                  <v-list-item-title>Our concierge team is available to assist you with booking activities and excursions.</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary" class="mr-3">mdi-information</v-icon>
                  </template>
                  <v-list-item-title>Please inquire about availability and pricing for specific activities.</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary" class="mr-3">mdi-information</v-icon>
                  </template>
                  <v-list-item-title>Transportation to and from excursion locations can be arranged.</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary" class="mr-3">mdi-information</v-icon>
                  </template>
                  <v-list-item-title>Advance bookings are recommended, especially during peak season.</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </v-container>
</template>

<style scoped>
/* Hero Section */
.activities-hero-section {
  height: 60vh;
  min-height: 400px;
}

.activities-hero-bg {
  height: 100%;
  width: 100%;
  background-image: url('@/assets/images/general/meditativebeach.webp');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  will-change: transform; /* Optimization for GPU acceleration */
}

.activities-hero-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 100%;
}

.activities-hero-content {
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
  background-color: var(--v-primary-base);
}

.max-width-text {
  max-width: 800px;
}

/* Carousel */
.activity-carousel {
  overflow: hidden;
}

.carousel-gradient-overlay {
  background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7));
}

.carousel-content {
  max-width: 800px;
}

.carousel-description {
  max-width: 80%;
}

.cursor-pointer {
  cursor: pointer;
}

/* Category Panels */
.category-panels {
  background: transparent;
}

.category-section {
  transform: translateY(10px);
  opacity: 0.9;
  transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.category-visible {
  transform: translateY(0);
  opacity: 1;
}

.category-header {
  padding: 16px;
  border-radius: 8px;
  transition: border-radius 0.3s ease;
}

.panel-expanded .category-header {
  border-radius: 8px 8px 0 0;
}

.category-chip {
  backdrop-filter: blur(5px);
}

/* Activity Cards */
.activity-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  opacity: 1 !important;
  transform: none !important;
  contain: layout style; /* Reduces browser reflow */
  will-change: transform; /* Hints browser to optimize */
}

.activity-card:hover {
  transform: translateY(-5px) !important;
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.activity-icon-avatar {
  transition: transform 0.3s ease;
}

.activity-card:hover .activity-icon-avatar {
  transform: scale(1.1);
}

/* Activity Detail Modal */
.activity-detail-image {
  position: relative;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
}

.detail-info-card {
  background-color: #f5f5f5;
  transition: transform 0.3s ease;
}

.detail-info-card:hover {
  transform: translateY(-5px);
}

/* Responsive styles */
@media (max-width: 960px) {
  .activities-hero-section {
    height: 50vh;
  }
  
  .carousel-description {
    max-width: 100%;
  }
}

@media (max-width: 600px) {
  .activities-hero-section {
    height: auto;
    min-height: 50vh;
  }
  
  /* Smaller images on mobile to save bandwidth */
  .activity-card .v-img,
  .v-carousel .v-img {
    height: 160px !important;
  }
  
  /* Smaller placeholder */
  .v-progress-circular {
    width: 24px !important;
    height: 24px !important;
  }
}
</style>
