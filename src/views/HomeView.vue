<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useIntersectionObserver } from '@vueuse/core'

// Import background images
import resortBgImage from '@/assets/images/compressed/resort-2495217_1920_compressed.webp'
import beachAccessImage from '@/assets/images/compressed/beachpool_compressed.webp'
import infinityPoolImage from '@/assets/images/compressed/beachpool2_compressed.webp'
import spaImage from '@/assets/images/compressed/meditation_compressed.webp'
import diningImage from '@/assets/images/compressed/cooking_compressed.webp'
import room1Image from '@/assets/images/compressed/hotel-room1_compressed.webp'
import room2Image from '@/assets/images/compressed/hotel-room2_compressed.webp'
import room3Image from '@/assets/images/compressed/hotel-room3_compressed.webp'
import activitiesBgImage from '@/assets/images/compressed/nicebeach_compressed.webp'
import avatarImage from '@/assets/images/compressed/single_compressed.webp'
import ctaBgImage from '@/assets/images/compressed/resort-drone_compressed.webp'

// This function can be uncommented if WebP support detection is needed
/*
const checkWebpSupport = async () => {
  try {
    // Create a test WebP image in memory
    const webpData = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=';
    const img = new Image();
    // Set up a promise to check loading
    const webpSupport = await new Promise((resolve) => {
      img.onload = () => resolve(img.width > 0 && img.height > 0);
      img.onerror = () => resolve(false);
      img.src = webpData;
    });
    return webpSupport;
  } catch (error) {
    return false;
  }
};
*/

// Create style object with background images with quality parameters for WebP
const bgStyles = computed(() => ({
  heroBg: { backgroundImage: `url(${resortBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center 40%' },
  beachImg: { backgroundImage: `url(${beachAccessImage})`, backgroundSize: 'cover' },
  poolImg: { backgroundImage: `url(${infinityPoolImage})`, backgroundSize: 'cover' },
  spaImg: { backgroundImage: `url(${spaImage})`, backgroundSize: 'cover' },
  diningImg: { backgroundImage: `url(${diningImage})`, backgroundSize: 'cover' },
  room1Img: { backgroundImage: `url(${room1Image})`, backgroundSize: 'cover' },
  room2Img: { backgroundImage: `url(${room2Image})`, backgroundSize: 'cover' },
  room3Img: { backgroundImage: `url(${room3Image})`, backgroundSize: 'cover' },
  activitiesImg: { backgroundImage: `url(${activitiesBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center 30%' },
  avatarImg: { backgroundImage: `url(${avatarImage})`, backgroundSize: 'cover', backgroundPosition: 'center top' },
  ctaImg: { backgroundImage: `url(${ctaBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center 20%' }
}))

const router = useRouter()

// Ref for animation elements
const featuredSection = ref(null)
const roomsSection = ref(null)
const testimonialsSection = ref(null)
const activitiesSection = ref(null)

// For animated scroll reveal and image loading optimization
onMounted(() => {
  // Preload the critical hero image
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.as = 'image';
  preloadLink.href = resortBgImage;
  document.head.appendChild(preloadLink);
  
  // Helper function to load images only when they're about to be visible
  const lazyLoadImage = (element, imageUrl) => {
    // Create an observer for the element
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If the element is about to be visible
        if (entry.isIntersecting) {
          // Load the image
          const img = new Image();
          img.src = imageUrl;
          // Remove the observer once loaded
          observer.disconnect();
        }
      });
    }, { rootMargin: '200px' }); // Start loading when within 200px of viewport
    
    observer.observe(element);
  };
  
  // Lazy load non-critical images
  setTimeout(() => {
    try {
      const featureCards = document.querySelectorAll('.feature-card');
      if (featureCards[0]) lazyLoadImage(featureCards[0], beachAccessImage);
      if (featureCards[1]) lazyLoadImage(featureCards[1], infinityPoolImage);
      if (featureCards[2]) lazyLoadImage(featureCards[2], spaImage);
      if (featureCards[3]) lazyLoadImage(featureCards[3], diningImage);
    } catch (error) {
      console.warn('Error in lazy loading feature images:', error);
    }
  }, 1000);

  // Animation for featured section
  useIntersectionObserver(featuredSection, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      document.querySelectorAll('.feature-card').forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('feature-visible')
        }, index * 150)
      })
    }
  })

  // Animation for rooms section
  useIntersectionObserver(roomsSection, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      document.querySelectorAll('.room-card').forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('slide-in')
        }, index * 200)
      })
    }
  })

  // Animation for activities section
  useIntersectionObserver(activitiesSection, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      document.querySelector('.activities-content').classList.add('activities-visible')
    }
  })

  // Animation for testimonials section
  useIntersectionObserver(testimonialsSection, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      document.querySelectorAll('.testimonial-card').forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('fade-in')
        }, index * 300)
      })
    }
  })
})

const gotoPage = (path) => {
  router.push(path)
}

// Testimonials data
const testimonials = [
  {
    name: 'Sarah M.',
    rating: 5,
    text: "Our stay at Shangri La was absolutely perfect! The service was impeccable, the food was delicious, and the views were breathtaking. We especially loved relaxing by the infinity pool. We can't wait to return!",
  },
  {
    name: 'John B.',
    rating: 5,
    text: 'The beachfront suite was amazing! Waking up to the sound of the waves and stepping right onto the sand was incredible. The resort offered so many activities, we never had a dull moment. Highly recommend the snorkeling!',
  },
  {
    name: 'Emily K.',
    rating: 5,
    text: "We traveled with our two young children, and the Kids' Club was a lifesaver! The staff were fantastic, and our kids had a blast. This allowed us some much-needed relaxation time. The resort is very family-friendly.",
  },
]
</script>

<template>
  <v-container fluid class="pa-0">
    <!-- Hero Section with Static Background -->
    <section class="hero-section position-relative">
      <!-- Use a direct static image as background with inline style -->
      <div 
        class="hero-background" 
        :style="bgStyles.heroBg"
      >
        <div class="hero-overlay d-flex flex-column justify-center align-center text-center">
          <div class="hero-content">
            <h1 class="text-h2 font-weight-bold mb-4 text-white animate-title">
              Shangri-La Beach Resort
            </h1>
            <h2 class="text-h4 mb-6 text-white animate-subtitle">Your Dream Getaway</h2>
            <v-btn
              class="mt-4 px-6 py-3 animate-button"
              color="primary"
              elevation="4"
              size="x-large"
              rounded
              @click="gotoPage('/rooms')"
            >
              <v-icon left class="mr-2">mdi-calendar-check</v-icon>
              Book Your Escape Now
            </v-btn>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section ref="featuredSection" class="py-12 experience-section">
      <v-container>
        <v-row class="mb-10">
          <v-col cols="12" class="text-center">
            <h2 class="text-h3 font-weight-bold mb-2">Experience Unforgettable Moments</h2>
            <div class="title-underline mx-auto mb-8"></div>
            <p class="text-subtitle-1 mb-8 max-width-text mx-auto">
              Indulge in luxury and breathtaking views at our tropical paradise. Every moment at
              Shangri-La is designed to create lasting memories.
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-card
              class="feature-card elevation-4 rounded-lg h-100 text-center"
              :ripple="false"
              hover
            >
              <div class="icon-container mx-auto mt-6">
                <v-icon size="56" color="primary">mdi-beach</v-icon>
              </div>
              <v-card-title class="justify-center text-h5 font-weight-bold"
                >Private Beach Access</v-card-title
              >
              <v-card-text class="text-body-1">
                Step onto our pristine, white-sand beach with crystal clear waters and breathtaking
                views.
              </v-card-text>
              <!-- Use direct path -->
              <div class="feature-image private-beach-image" :style="bgStyles.beachImg" loading="lazy"></div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card
              class="feature-card elevation-4 rounded-lg h-100 text-center"
              :ripple="false"
              hover
            >
              <div class="icon-container mx-auto mt-6">
                <v-icon size="56" color="primary">mdi-pool</v-icon>
              </div>
              <v-card-title class="justify-center text-h5 font-weight-bold"
                >Infinity Pool</v-card-title
              >
              <v-card-text class="text-body-1">
                Relax by our stunning oceanfront infinity pool with panoramic views of the sparkling
                sea.
              </v-card-text>
              <!-- Use direct path -->
              <div class="feature-image infinity-pool-image" :style="bgStyles.poolImg" loading="lazy"></div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card
              class="feature-card elevation-4 rounded-lg h-100 text-center"
              :ripple="false"
              hover
            >
              <div class="icon-container mx-auto mt-6">
                <v-icon size="56" color="primary">mdi-spa</v-icon>
              </div>
              <v-card-title class="justify-center text-h5 font-weight-bold"
                >World-Class Spa</v-card-title
              >
              <v-card-text class="text-body-1">
                Rejuvenate your mind and body at our spa with treatments inspired by ancient healing
                traditions.
              </v-card-text>
              <!-- Use direct path -->
              <div class="feature-image spa-image" :style="bgStyles.spaImg" loading="lazy"></div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card
              class="feature-card elevation-4 rounded-lg h-100 text-center"
              :ripple="false"
              hover
            >
              <div class="icon-container mx-auto mt-6">
                <v-icon size="56" color="primary">mdi-food-fork-drink</v-icon>
              </div>
              <v-card-title class="justify-center text-h5 font-weight-bold"
                >Exquisite Dining</v-card-title
              >
              <v-card-text class="text-body-1">
                Savor culinary delights at our restaurants, featuring fresh local ingredients and
                international flavors.
              </v-card-text>
              <!-- Use direct path -->
              <div class="feature-image dining-image" :style="bgStyles.diningImg" loading="lazy"></div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Room Showcase Section -->
    <section ref="roomsSection" class="py-12 bg-light-blue rooms-section">
      <v-container>
        <v-row class="mb-10">
          <v-col cols="12" class="text-center">
            <h2 class="text-h3 font-weight-bold mb-2">Our Luxurious Accommodations</h2>
            <div class="title-underline mx-auto mb-8"></div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="4">
            <v-card
              class="room-card elevation-8 rounded-lg h-100"
              hover
              @click="gotoPage('/rooms')"
            >
              <div class="room-img-container">
                <div class="room-image room-1" :style="bgStyles.room1Img" loading="lazy"></div>
                <div class="room-overlay d-flex flex-column justify-end">
                  <div class="pa-4 text-white">
                    <h3 class="text-h5 font-weight-bold">Ocean View Deluxe Room</h3>
                    <p class="mb-2">Enjoy stunning ocean views from your private balcony</p>
                    <v-btn
                      color="primary"
                      variant="tonal"
                      class="mt-2"
                      @click.stop="gotoPage('/rooms')"
                    >
                      View Details
                      <v-icon right class="ml-2">mdi-arrow-right</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card
              class="room-card elevation-8 rounded-lg h-100"
              hover
              @click="gotoPage('/rooms')"
            >
              <div class="room-img-container">
                <div class="room-image room-2" :style="bgStyles.room2Img" loading="lazy"></div>
                <div class="room-overlay d-flex flex-column justify-end">
                  <div class="pa-4 text-white">
                    <h3 class="text-h5 font-weight-bold">Beachfront Suite</h3>
                    <p class="mb-2">Step directly onto the sand from your spacious suite</p>
                    <v-btn
                      color="primary"
                      variant="tonal"
                      class="mt-2"
                      @click.stop="gotoPage('/rooms')"
                    >
                      View Details
                      <v-icon right class="ml-2">mdi-arrow-right</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card
              class="room-card elevation-8 rounded-lg h-100"
              hover
              @click="gotoPage('/rooms')"
            >
              <div class="room-img-container">
                <div class="room-image room-3" :style="bgStyles.room3Img" loading="lazy"></div>
                <div class="room-overlay d-flex flex-column justify-end">
                  <div class="pa-4 text-white">
                    <h3 class="text-h5 font-weight-bold">Garden View Family Room</h3>
                    <p class="mb-2">Perfect for families, with ample space and garden views</p>
                    <v-btn
                      color="primary"
                      variant="tonal"
                      class="mt-2"
                      @click.stop="gotoPage('/rooms')"
                    >
                      View Details
                      <v-icon right class="ml-2">mdi-arrow-right</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-8">
          <v-col cols="12" class="text-center">
            <v-btn
              color="secondary"
              size="large"
              class="px-8 py-3"
              elevation="3"
              rounded
              @click="gotoPage('/rooms')"
            >
              Explore All Accommodations
              <v-icon right class="ml-2">mdi-chevron-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Activities Section -->
    <section ref="activitiesSection" class="py-12 activities-section position-relative">
      <div class="activities-background" :style="bgStyles.activitiesImg" loading="lazy">
        <div class="activities-overlay d-flex align-center">
          <v-container>
            <v-row>
              <v-col cols="12" md="6" lg="5" class="activities-content pa-6 rounded-lg">
                <h2 class="text-h3 font-weight-bold mb-4">Adventure Awaits</h2>
                <p class="text-body-1 mb-6">
                  From sunrise yoga on the beach to thrilling water sports and cultural excursions,
                  there's something for everyone at Shangri-La Beach Resort. Create memories that
                  will last a lifetime with our curated selection of activities.
                </p>
                <div class="d-flex flex-wrap">
                  <v-chip class="ma-1 pa-3" color="primary" size="large">
                    <v-icon left class="mr-1">mdi-diving-scuba</v-icon>
                    Snorkeling & Diving
                  </v-chip>
                  <v-chip class="ma-1 pa-3" color="primary" size="large">
                    <v-icon left class="mr-1">mdi-ferry</v-icon>
                    Island Hopping
                  </v-chip>
                  <v-chip class="ma-1 pa-3" color="primary" size="large">
                    <v-icon left class="mr-1">mdi-yoga</v-icon>
                    Yoga Sessions
                  </v-chip>
                  <v-chip class="ma-1 pa-3" color="primary" size="large">
                    <v-icon left class="mr-1">mdi-kayaking</v-icon>
                    Kayaking
                  </v-chip>
                  <v-chip class="ma-1 pa-3" color="primary" size="large">
                    <v-icon left class="mr-1">mdi-food</v-icon>
                    Cooking Classes
                  </v-chip>
                </div>
                <v-btn
                  color="secondary"
                  size="large"
                  class="mt-6 px-8 py-3"
                  elevation="3"
                  rounded
                  @click="gotoPage('/activities')"
                >
                  Discover Activities
                  <v-icon right class="ml-2">mdi-chevron-right</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section ref="testimonialsSection" class="py-12 testimonials-section">
      <v-container>
        <v-row class="mb-8">
          <v-col cols="12" class="text-center">
            <h2 class="text-h3 font-weight-bold mb-2">What Our Guests Are Saying</h2>
            <div class="title-underline mx-auto mb-8"></div>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="(testimonial, index) in testimonials" :key="index" cols="12" md="4">
            <v-card class="testimonial-card elevation-3 rounded-lg pa-6 h-100">
              <div class="testimonial-avatar mb-4" :style="bgStyles.avatarImg" loading="lazy"></div>
              <div class="mb-4">
                <v-rating
                  :model-value="testimonial.rating"
                  color="amber"
                  density="compact"
                  size="small"
                  readonly
                ></v-rating>
              </div>
              <v-card-text class="text-body-1 font-italic px-0">
                "{{ testimonial.text }}"
              </v-card-text>
              <v-card-title class="px-0 pt-2 pb-0 text-h6">{{ testimonial.name }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-8">
          <v-col cols="12" class="text-center">
            <v-btn
              color="secondary"
              size="large"
              class="px-8 py-3"
              elevation="3"
              rounded
              @click="gotoPage('/testimonials')"
            >
              Read More Testimonials
              <v-icon right class="ml-2">mdi-chevron-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Call to Action Section -->
    <section class="py-12 cta-section">
      <div class="cta-background" :style="bgStyles.ctaImg" loading="lazy">
        <div class="cta-overlay d-flex flex-column justify-center align-center text-center">
          <h2 class="text-h3 font-weight-bold mb-4 text-white">Ready to Experience Paradise?</h2>
          <p class="text-h6 mb-6 text-white max-width-text mx-auto">
            Book your stay at Shangri-La Beach Resort today and discover why our guests return year
            after year.
          </p>
          <v-btn
            color="secondary"
            size="x-large"
            class="px-8 py-3"
            elevation="4"
            rounded
            @click="gotoPage('/rooms')"
          >
            <v-icon left class="mr-2">mdi-beach</v-icon>
            Book Your Stay Now
          </v-btn>
        </div>
      </div>
    </section>
  </v-container>
</template>

<style scoped>
/* Hero Section */
.hero-section {
  height: 100vh;
  width: 100%;
}

.hero-background {
  height: 100%;
  width: 100%;
  background-repeat: no-repeat;
}

.hero-overlay {
  background-color: rgba(0, 0, 0, 0.4);
  height: 100%;
  width: 100%;
}

.hero-content {
  max-width: 800px;
  padding: 0 16px;
  z-index: 10;
}

.animate-title {
  animation: fadeSlideUp 1.2s ease-out;
}

.animate-subtitle {
  animation: fadeSlideUp 1.2s ease-out 0.3s both;
}

.animate-button {
  animation: fadeSlideUp 1.2s ease-out 0.6s both;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Experience Section */
.title-underline {
  width: 80px;
  height: 4px;
  background-color: var(--shangri-la-teal);
}

.max-width-text {
  max-width: 800px;
}

.icon-container {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 166, 156, 0.1);
  margin-bottom: 16px;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.feature-card {
  transform: translateY(30px);
  opacity: 0;
  transition: transform 0.6s ease-out, opacity 0.6s ease-out, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-card:hover .icon-container {
  transform: scale(1.1);
  background-color: rgba(0, 166, 156, 0.2);
}

.feature-visible {
  transform: translateY(0);
  opacity: 1;
}

/* Feature images */
.feature-image {
  height: 160px;
  width: 100%;
  margin-top: 8px;
  transition: opacity 0.5s ease-in;
  animation: fadeIn 0.8s ease-in-out;
}

/* Rooms Section */
.bg-light-blue {
  background-color: #f5f9fd;
}

.room-card {
  opacity: 0;
  transform: translateX(-30px);
  transition: transform 0.5s ease, opacity 0.5s ease, box-shadow 0.3s ease;
}

.room-card:hover {
  transform: translateY(-10px);
}

.room-img-container {
  position: relative;
  height: 260px;
}

.room-image {
  height: 100%;
  width: 100%;
  transition: transform 0.6s ease;
}

.room-card:hover .room-image {
  transform: scale(1.05);
}







.room-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
  height: 100%;
  width: 100%;
  transition: background 0.3s ease;
}

.room-card:hover .room-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.2));
}

.slide-in {
  opacity: 1;
  transform: translateX(0);
}

/* Activities Section */
.activities-section {
  min-height: 500px;
  position: relative;
}

.activities-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* Background now set via :style binding */
}

.activities-overlay {
  background-color: rgba(0, 0, 0, 0.4);
  height: 100%;
  width: 100%;
}

.activities-content {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transform: translateX(-50px);
  opacity: 0;
  transition: transform 0.8s ease, opacity 0.8s ease;
  border-radius: 8px;
}

.activities-visible {
  transform: translateX(0);
  opacity: 1;
}

/* Testimonials Section */
.testimonial-card {
  opacity: 0;
  transform: translateY(30px);
  transition: transform 0.6s ease, opacity 0.6s ease, box-shadow 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-10px);
}

.testimonial-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--shangri-la-teal);
  margin: 0 auto;
  /* Background now set via :style binding */
}

.fade-in {
  opacity: 1;
  transform: translateY(0);
}

/* CTA Section */
.cta-section {
  position: relative;
  height: 400px;
}

.cta-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* Background now set via :style binding */
}

.cta-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 100%;
}

/* Responsive styles */
@media (max-width: 960px) {
  .hero-content {
    padding: 0 24px;
  }

  .animate-title {
    font-size: 2.5rem !important;
  }

  .animate-subtitle {
    font-size: 1.5rem !important;
  }

  .activities-content {
    margin: 0 16px;
  }
}

@media (max-width: 600px) {
  .animate-title {
    font-size: 2rem !important;
  }

  .animate-subtitle {
    font-size: 1.2rem !important;
  }

  .icon-container {
    width: 80px;
    height: 80px;
  }

  .icon-container .v-icon {
    font-size: 40px !important;
  }
}
</style>
