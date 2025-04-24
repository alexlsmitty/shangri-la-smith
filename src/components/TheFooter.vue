<script setup>
// Import the logo and background image
// We'll use direct paths instead of imports
//import logoImage from '@/assets/shangri-la-logo.svg'
//import resortDroneImage from '@/assets/images/resort-drone.webp'
import { ref, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const currentYear = new Date().getFullYear()
const footerRef = ref(null)

// Social media links with hover colors
const socialLinks = [
  { icon: 'mdi-facebook', url: '#', label: 'Facebook', color: '#1877F2' },
  { icon: 'mdi-twitter', url: '#', label: 'Twitter', color: '#1DA1F2' },
  { icon: 'mdi-instagram', url: '#', label: 'Instagram', color: '#E4405F' },
  { icon: 'mdi-pinterest', url: '#', label: 'Pinterest', color: '#BD081C' },
  { icon: 'mdi-youtube', url: '#', label: 'YouTube', color: '#FF0000' },
]

// Footer navigation links
const quickLinks = [
  { title: 'About Us', route: '/about-us' },
  { title: 'Contact', route: '/contact' },
  { title: 'FAQs', route: '/faqs' },
  { title: 'Careers', route: '/careers' },
]

const legalLinks = [
  { title: 'Privacy Policy', route: '/privacy-policy' },
  { title: 'Terms of Service', route: '/terms-of-service' },
  { title: 'Cookie Policy', route: '/cookie-policy' },
  { title: 'Accessibility', route: '/accessibility' },
]

const exploreLinks = [
  { title: 'Guest Rooms', route: '/rooms' },
  { title: 'Dining', route: '/dining' },
  { title: 'Spa', route: '/spa' },
  { title: 'Activities', route: '/activities' },
  { title: 'Testimonials', route: '/testimonials' },
]

// Date for copyright information
const newsletterEmail = ref('')

onMounted(() => {
  // Animation for footer elements when they come into view
  useIntersectionObserver(footerRef, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      document.querySelectorAll('.footer-animated').forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('footer-visible')
        }, index * 100)
      })
    }
  })
})

const subscribeToNewsletter = () => {
  // This would typically send the email to a server
  alert(`Thank you for subscribing with ${newsletterEmail.value}!`)
  newsletterEmail.value = ''
}
</script>

<template>
  <v-footer ref="footerRef" class="footer-container pa-0" color="transparent">
    <!-- Resort Information and Image Footer -->
    <div class="footer-image-container">
      <div class="footer-image-overlay">
        <v-container>
          <!-- Top Section -->
          <v-row>
            <!-- Resort Logo and Info -->
            <v-col cols="12" md="4" class="footer-animated">
              <div class="mb-6 d-flex justify-center justify-md-start">
                <v-img
                  src="/shangri-la-logo.svg"
                  alt="Shangri-La Beach Resort"
                  max-width="200"
                  class="footer-logo"
                ></v-img>
              </div>
              <p class="text-white text-center text-md-left mb-4 content-text">
                Escape to paradise at our luxurious beach resort, where every moment is designed to
                create unforgettable memories against the backdrop of pristine beaches and
                crystal-clear waters.
              </p>
              <div class="d-flex justify-center justify-md-start">
                <v-btn
                  v-for="link in socialLinks"
                  :key="link.label"
                  :icon="link.icon"
                  :aria-label="link.label"
                  variant="text"
                  class="social-btn mx-1"
                  :style="`--hover-color: ${link.color}`"
                ></v-btn>
              </div>
            </v-col>

            <!-- Quick Links -->
            <v-col cols="12" md="2" class="footer-animated">
              <h3
                class="text-h6 text-white mb-4 font-weight-bold text-center text-md-left footer-heading"
              >
                Quick Links
              </h3>
              <v-list bg-color="transparent" class="pa-0 footer-list text-center text-md-left">
                <v-list-item
                  v-for="link in quickLinks"
                  :key="link.title"
                  :to="link.route"
                  class="pa-0 mb-2 footer-link-item"
                  density="compact"
                >
                  <v-list-item-title class="text-white footer-link">
                    {{ link.title }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>

            <!-- Legal Links -->
            <v-col cols="12" md="2" class="footer-animated">
              <h3
                class="text-h6 text-white mb-4 font-weight-bold text-center text-md-left footer-heading"
              >
                Legal
              </h3>
              <v-list bg-color="transparent" class="pa-0 footer-list text-center text-md-left">
                <v-list-item
                  v-for="link in legalLinks"
                  :key="link.title"
                  :to="link.route"
                  class="pa-0 mb-2 footer-link-item"
                  density="compact"
                >
                  <v-list-item-title class="text-white footer-link">
                    {{ link.title }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>

            <!-- Explore Links -->
            <v-col cols="12" md="2" class="footer-animated">
              <h3
                class="text-h6 text-white mb-4 font-weight-bold text-center text-md-left footer-heading"
              >
                Explore
              </h3>
              <v-list bg-color="transparent" class="pa-0 footer-list text-center text-md-left">
                <v-list-item
                  v-for="link in exploreLinks"
                  :key="link.title"
                  :to="link.route"
                  class="pa-0 mb-2 footer-link-item"
                  density="compact"
                >
                  <v-list-item-title class="text-white footer-link">
                    {{ link.title }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>

            <!-- Newsletter Signup -->
            <v-col cols="12" md="2" class="footer-animated">
              <h3
                class="text-h6 text-white mb-4 font-weight-bold text-center text-md-left footer-heading"
              >
                Newsletter
              </h3>
              <p class="text-white mb-3 text-center text-md-left content-text">
                Subscribe to receive special offers and updates.
              </p>
              <v-form @submit.prevent="subscribeToNewsletter" class="newsletter-form">
                <v-text-field
                  v-model="newsletterEmail"
                  label="Your Email"
                  variant="outlined"
                  color="white"
                  bg-color="rgba(255, 255, 255, 0.1)"
                  class="mb-3 newsletter-input"
                  hide-details
                ></v-text-field>
                <v-btn
                  color="secondary"
                  block
                  type="submit"
                  class="mt-2 py-6 subscribe-btn"
                  elevation="2"
                  rounded="pill"
                >
                  Subscribe
                  <v-icon right class="ml-2">mdi-send</v-icon>
                </v-btn>
              </v-form>
            </v-col>
          </v-row>

          <!-- Address & Contact Info -->
          <v-row class="mt-6 footer-animated">
            <v-col cols="12" class="text-center">
              <div class="d-flex flex-column flex-md-row justify-center align-center contact-info">
                <div class="contact-item d-flex align-center mx-3 mb-3 mb-md-0">
                  <v-icon color="secondary" size="small" class="mr-2">mdi-map-marker</v-icon>
                  <span class="text-white">Playa Paraiso, Cancun, Mexico</span>
                </div>
                <div class="contact-item d-flex align-center mx-3 mb-3 mb-md-0">
                  <v-icon color="secondary" size="small" class="mr-2">mdi-phone</v-icon>
                  <span class="text-white">+52 998 555 1234</span>
                </div>
                <div class="contact-item d-flex align-center mx-3 mb-3 mb-md-0">
                  <v-icon color="secondary" size="small" class="mr-2">mdi-email</v-icon>
                  <span class="text-white">info@shangrilaresort.com</span>
                </div>
              </div>
            </v-col>
          </v-row>

          <!-- Copyright Row -->
          <v-row class="mt-6 footer-animated">
            <v-col cols="12" class="text-center">
              <v-divider class="mb-4" color="rgba(255,255,255,0.2)"></v-divider>
              <p class="text-white text-body-2 mb-0 copyright-text">
                &copy; {{ currentYear }} Shangri-La Beach Resort. All rights reserved.
                <span class="footer-attribution ml-2">
                  <span class="footer-dot mx-2">•</span> Designed with
                  <v-icon size="small" color="secondary" class="mx-1">mdi-heart</v-icon> by
                  Alexander Smith
                </span>
              </p>
              <p class="text-white text-body-2 mt-2 photo-attribution">
                All photographs were taken on resort or provided by Pexels, a repository for images which allows free, unlimited use of their images under specific guidelines of their license.
              </p>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </v-footer>
</template>

<style scoped>
.footer-container {
  width: 100%;
}

.footer-image-container {
  width: 100%;
  background-image: url('/images/resort-aerial.webp');
  background-size: cover;
  background-position: center;
  position: relative;
}

.footer-image-overlay {
  background: linear-gradient(to top, rgba(0, 42, 40, 0.95), rgba(0, 70, 67, 0.9));
  width: 100%;
  padding: 60px 0 40px;
}

.footer-logo {
  filter: brightness(0) invert(1);
  transition: transform 0.3s ease;
}

.footer-logo:hover {
  transform: scale(1.05);
}

.social-btn {
  background-color: rgba(255, 255, 255, 0.1) !important;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
  margin: 0 5px;
}

.social-btn:hover {
  background-color: var(--hover-color) !important;
  transform: translateY(-3px);
}

.footer-heading {
  position: relative;
  padding-bottom: 10px;
}

.footer-heading:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 40px;
  height: 2px;
  background-color: var(--shangri-la-coral);
  transform: translateX(-50%);
  transition: width 0.3s ease;
}

@media (min-width: 960px) {
  .footer-heading:after {
    left: 0;
    transform: none;
  }
}

.footer-heading:hover:after {
  width: 60px;
}

.footer-list {
  background-color: transparent !important;
}

.footer-link-item {
  transition: transform 0.3s ease;
}

.footer-link-item:hover {
  transform: translateX(5px);
}

.footer-link {
  position: relative;
  display: inline-block;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.footer-link:after {
  content: '';
  position: absolute;
  width: 0;
  height: 1px;
  bottom: -2px;
  left: 0;
  background-color: var(--shangri-la-coral);
  transition: width 0.3s ease;
}

.footer-link:hover {
  color: var(--shangri-la-coral) !important;
}

.footer-link:hover:after {
  width: 100%;
}

.content-text {
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.9;
}

.newsletter-input :deep(.v-field__outline) {
  color: rgba(255, 255, 255, 0.3) !important;
}

.newsletter-input :deep(.v-field__input) {
  color: white !important;
}

.newsletter-input :deep(.v-label) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.subscribe-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.03em;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease !important;
}

.subscribe-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3) !important;
}

.contact-info {
  flex-wrap: wrap;
}

.contact-item {
  transition: transform 0.3s ease;
}

.contact-item:hover {
  transform: translateY(-3px);
}

.copyright-text {
  font-size: 0.85rem;
  opacity: 0.8;
}

.footer-dot {
  display: inline-block;
  opacity: 0.5;
}

.footer-attribution {
  opacity: 0.7;
}

.photo-attribution {
  font-size: 0.8rem;
  opacity: 0.6;
  max-width: 80%;
  margin: 10px auto 0;
}

/* Animation classes */
.footer-animated {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.footer-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 959px) {
  .footer-image-overlay {
    padding: 40px 0 30px;
  }

  .footer-heading {
    margin-top: 30px;
  }

  .contact-item {
    margin-bottom: 15px;
  }
}
</style>
