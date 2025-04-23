<script setup>
import { ref, computed, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import testimonialService from '@/services/testimonialService'
import SectionHeading from '@/components/SectionHeading.vue'
import EmptyAvatar from '@/components/EmptyAvatar.vue'

// Testimonials data from API
const testimonials = ref([])
const categories = ref(['all'])
const isLoading = ref(true)
const loadError = ref(null)

// For testimonial filtering
const activeCategory = ref('all')
const activeRating = ref(0) // 0 means all ratings
const searchQuery = ref('')
const sortOption = ref('newest')
const page = ref(1)
const itemsPerPage = 6

// For fixed categories while we wait for API
const fallbackCategories = [
  'all',
  'Overall Experience',
  'Accommodations',
  'Dining',
  'Spa Services',
  'Family Experience',
  'Activities',
  'Special Occasions',
  'Amenities',
]

// For testimonial submission
const showSubmissionForm = ref(false)
const userRating = ref(5)
const userName = ref('')
const userLocation = ref('')
const userCategory = ref('')
const userComment = ref('')
const submissionSuccess = ref(false)
const isSubmitting = ref(false)
const submissionError = ref(null)

// Filtered and sorted testimonials
const filteredTestimonials = computed(() => {
  let result = [...testimonials.value]

  // Filter by category
  if (activeCategory.value !== 'all') {
    result = result.filter((t) => t.category === activeCategory.value)
  }

  // Filter by rating
  if (activeRating.value > 0) {
    result = result.filter((t) => t.rating >= activeRating.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.text.toLowerCase().includes(query) ||
        t.location.toLowerCase().includes(query),
    )
  }

  // Sort testimonials
  if (sortOption.value === 'newest') {
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } else if (sortOption.value === 'highest') {
    result.sort((a, b) => b.rating - a.rating || new Date(b.created_at) - new Date(a.created_at))
  } else if (sortOption.value === 'lowest') {
    result.sort((a, b) => a.rating - b.rating || new Date(b.created_at) - new Date(a.created_at))
  }

  return result
})

// Featured testimonials
const featuredTestimonials = computed(() => {
  return testimonials.value.filter((t) => t.featured === true)
})

// Paginated testimonials
const paginatedTestimonials = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTestimonials.value.slice(start, end)
})

// Animation reference elements
const heroSection = ref(null)
const featuredSection = ref(null)
const testimonialSection = ref(null)

// Function to load testimonials from API
const loadTestimonials = async () => {
  try {
    isLoading.value = true
    loadError.value = null

    // Fetch testimonials
    const data = await testimonialService.getTestimonials()
    testimonials.value = data

    // Fetch categories
    try {
      const categoryData = await testimonialService.getCategoryNames()
      categories.value = ['all', ...categoryData]
    } catch (catError) {
      console.warn('Error loading categories, using fallbacks:', catError)
      categories.value = fallbackCategories
    }

    isLoading.value = false
  } catch (error) {
    console.error('Error loading testimonials:', error)
    loadError.value = 'Failed to load testimonials. Please try again later.'
    isLoading.value = false

    // Set fallback categories when testimonials fail to load
    categories.value = fallbackCategories
  }
}

// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return ''

  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Handle testimonial submission
const submitTestimonial = async () => {
  try {
    isSubmitting.value = true
    submissionError.value = null

    // Create testimonial object based on the actual database schema
    const testimonialData = {
      name: userName.value,
      location: userLocation.value,
      category: userCategory.value,
      rating: userRating.value,
      text: userComment.value,
    }

    // Submit testimonial to API
    const result = await testimonialService.submitTestimonial(testimonialData)
    console.log('Testimonial submitted:', result)

    isSubmitting.value = false
    submissionSuccess.value = true

    // Reset form after submission
    setTimeout(() => {
      userName.value = ''
      userLocation.value = ''
      userCategory.value = ''
      userRating.value = 5
      userComment.value = ''
      submissionSuccess.value = false
      showSubmissionForm.value = false
    }, 3000)
  } catch (error) {
    console.error('Error submitting testimonial:', error)
    submissionError.value = 'Failed to submit testimonial. Please try again later.'
    isSubmitting.value = false
  }
}

// Function to reset all filters
const resetFilters = () => {
  activeCategory.value = 'all';
  activeRating.value = 0;
  searchQuery.value = '';
  sortOption.value = 'newest';
  page.value = 1;
}

// For scroll reveal animations
onMounted(() => {
  // Load testimonials data
  loadTestimonials()

  // Set up fallback testimonials if API fails
  setTimeout(() => {
    if (isLoading.value && testimonials.value.length === 0) {
      console.log('Setting up fallback testimonials')
      const fallbackTestimonials = [
        {
          id: 1,
          name: 'Sarah M.',
          location: 'New York, USA',
          rating: 5,
          text: "Our stay at Shangri La was absolutely perfect! The service was impeccable, the food was delicious, and the views were breathtaking. We especially loved relaxing by the infinity pool. We can't wait to return!",
          category: 'Overall Experience',
          featured: true,
          created_at: '2025-03-15T14:23:00.000Z',
        },
        {
          id: 2,
          name: 'John B.',
          location: 'London, UK',
          rating: 5,
          text: 'The beachfront suite was amazing! Waking up to the sound of the waves and stepping right onto the sand was incredible. The resort offered so many activities, we never had a dull moment. Highly recommend the snorkeling!',
          category: 'Accommodations',
          featured: true,
          created_at: '2025-03-10T09:45:00.000Z',
        },
        {
          id: 3,
          name: 'Emily K.',
          location: 'Toronto, Canada',
          rating: 5,
          text: "We traveled with our two young children, and the Kids' Club was a lifesaver! The staff were fantastic, and our kids had a blast. This allowed us some much-needed relaxation time. The resort is very family-friendly.",
          category: 'Family Experience',
          featured: true,
          created_at: '2025-02-28T16:30:00.000Z',
        },
      ]

      testimonials.value = fallbackTestimonials
      isLoading.value = false
      loadError.value = null
    }
  }, 3000) // Wait 3 seconds before showing fallbacks

  // Animation for hero section
  useIntersectionObserver(heroSection, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      document.querySelector('.testimonials-hero-content').classList.add('hero-visible')
    }
  })

  // Animation for featured section
  useIntersectionObserver(featuredSection, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      document.querySelectorAll('.featured-testimonial-card').forEach((el) => {
        el.classList.add('testimonial-visible')
      })
    }
  })

  // Animation for testimonials section
  useIntersectionObserver(testimonialSection, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      document.querySelectorAll('.testimonial-card').forEach((el) => {
        el.classList.add('testimonial-visible')
      })
    }
  })
})
</script>

<template>
  <v-container fluid class="pa-0">
    <!-- Hero Section -->
    <section ref="heroSection" class="testimonials-hero-section position-relative">
      <div class="testimonials-hero-bg">
        <div class="testimonials-hero-overlay d-flex flex-column justify-center">
          <v-container>
            <div class="testimonials-hero-content">
              <h1 class="text-h2 font-weight-bold mb-4 text-white">What Our Guests Are Saying</h1>
              <div class="title-underline bg-white mb-6"></div>
              <p class="text-h6 mb-8 text-white max-width-text">
                Read about the wonderful experiences our guests have had at Shangri La Beach Resort.
                We are committed to creating unforgettable memories for every visitor.
              </p>
              <v-btn
                color="secondary"
                size="large"
                class="px-6 py-3 me-3"
                elevation="3"
                rounded
                @click="$vuetify.goTo('#featured')"
              >
                Read Testimonials
                <v-icon right class="ml-2">mdi-chevron-down</v-icon>
              </v-btn>
              <v-btn
                color="primary"
                size="large"
                class="px-6 py-3"
                elevation="3"
                rounded
                @click="showSubmissionForm = true"
              >
                Share Your Experience
                <v-icon right class="ml-2">mdi-pencil</v-icon>
              </v-btn>
            </div>
          </v-container>
        </div>
      </div>
    </section>

    <!-- Featured Testimonials Section -->
    <section id="featured" ref="featuredSection" class="py-12">
      <v-container>
        <SectionHeading
          title="Featured Guest Reviews"
          subtitle="Discover what makes Shangri La Beach Resort a favorite destination for travelers around the world"
        />

        <v-row v-if="isLoading" class="mt-8">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="mt-4 text-body-1">Loading testimonials...</p>
          </v-col>
        </v-row>

        <v-row v-else-if="loadError" class="mt-8">
          <v-col cols="12" class="text-center">
            <v-alert
              type="error"
              variant="tonal"
              icon="mdi-alert-circle"
              class="mx-auto"
              max-width="500"
            >
              {{ loadError }}
              <div class="mt-4">
                <v-btn color="primary" @click="loadTestimonials"> Try Again </v-btn>
              </div>
            </v-alert>
          </v-col>
        </v-row>

        <v-row v-else-if="featuredTestimonials.length === 0" class="mt-8">
          <v-col cols="12" class="text-center">
            <v-alert
              type="info"
              variant="tonal"
              icon="mdi-information"
              class="mx-auto"
              max-width="500"
            >
              No featured testimonials available at the moment.
            </v-alert>
          </v-col>
        </v-row>

        <v-row v-else class="mt-8">
          <v-col v-for="testimonial in featuredTestimonials" :key="testimonial.id" cols="12" md="4">
            <v-card class="featured-testimonial-card elevation-4 rounded-lg h-100 pa-6">
              <div class="d-flex align-center mb-4">
                <v-avatar size="60" class="me-4">
                  <EmptyAvatar :name="testimonial.name" :size="60" />
                </v-avatar>
                <div>
                  <div class="text-h6 font-weight-bold">{{ testimonial.name }}</div>
                  <div class="text-subtitle-2">{{ testimonial.location }}</div>
                </div>
              </div>

              <div class="mb-4">
                <v-rating
                  :model-value="testimonial.rating"
                  color="amber"
                  density="compact"
                  half-increments
                  readonly
                  size="small"
                ></v-rating>
                <span class="text-caption ms-2">{{ formatDate(testimonial.created_at) }}</span>
              </div>

              <v-chip size="small" color="primary" variant="flat" class="mb-4">
                {{ testimonial.category }}
              </v-chip>

              <v-card-text class="text-body-1 font-italic px-0">
                "{{ testimonial.text }}"
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- All Testimonials Section -->
    <section ref="testimonialSection" class="py-12 bg-light-blue">
      <v-container>
        <SectionHeading
          title="All Guest Reviews"
          subtitle="Browse through experiences shared by our valued guests"
        />

        <!-- Filters -->
        <v-row class="mb-6 mt-8">
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="activeCategory"
              label="Filter by Experience"
              :items="categories"
              variant="outlined"
              density="comfortable"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="activeRating"
              label="Filter by Rating"
              :items="[
                { title: 'All Ratings', value: 0 },
                { title: '5 Stars and Up', value: 5 },
                { title: '4 Stars and Up', value: 4 },
                { title: '3 Stars and Up', value: 3 },
              ]"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="comfortable"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="sortOption"
              label="Sort By"
              :items="[
                { title: 'Newest First', value: 'newest' },
                { title: 'Highest Rating', value: 'highest' },
                { title: 'Lowest Rating', value: 'lowest' },
              ]"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="comfortable"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="searchQuery"
              label="Search Reviews"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Loading State -->
        <v-row v-if="isLoading" class="my-8">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="mt-4 text-body-1">Loading testimonials...</p>
          </v-col>
        </v-row>

        <!-- Error State -->
        <v-row v-else-if="loadError" class="my-8">
          <v-col cols="12" class="text-center">
            <v-alert
              type="error"
              variant="tonal"
              icon="mdi-alert-circle"
              class="mx-auto"
              max-width="500"
            >
              {{ loadError }}
              <div class="mt-4">
                <v-btn color="primary" @click="loadTestimonials"> Try Again </v-btn>
              </div>
            </v-alert>
          </v-col>
        </v-row>

        <!-- Testimonials Grid -->
        <v-row v-else-if="paginatedTestimonials.length > 0">
          <v-col
            v-for="testimonial in paginatedTestimonials"
            :key="testimonial.id"
            cols="12"
            sm="6"
            lg="4"
            class="mb-4"
          >
            <v-card class="testimonial-card elevation-2 h-100 pa-4">
              <div class="d-flex align-center mb-3">
                <v-avatar size="50" class="me-3">
                  <EmptyAvatar :name="testimonial.name" :size="50" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">{{ testimonial.name }}</div>
                  <div class="text-caption">{{ testimonial.location }}</div>
                </div>
              </div>

              <div class="mb-3 d-flex align-center">
                <v-rating
                  :model-value="testimonial.rating"
                  color="amber"
                  density="compact"
                  half-increments
                  readonly
                  size="x-small"
                ></v-rating>
                <span class="text-caption ms-2">{{ formatDate(testimonial.created_at) }}</span>
              </div>

              <v-chip size="x-small" color="primary" variant="flat" class="mb-3">
                {{ testimonial.category }}
              </v-chip>

              <div class="text-body-2 font-italic">"{{ testimonial.text }}"</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- No Results Message -->
        <v-row v-else>
          <v-col cols="12" class="text-center py-8">
            <v-icon size="64" color="grey">mdi-emoticon-sad-outline</v-icon>
            <h3 class="text-h5 mt-4 mb-2">No Reviews Found</h3>
            <p class="text-body-1">Please try changing your filters or search query.</p>
            <v-btn
              color="primary"
              class="mt-4"
              @click="resetFilters"
            >
              Reset Filters
            </v-btn>
          </v-col>
        </v-row>

        <!-- Pagination -->
        <v-row v-if="filteredTestimonials.length > itemsPerPage" class="mt-6">
          <v-col cols="12" class="text-center">
            <v-pagination
              v-model="page"
              :length="Math.ceil(filteredTestimonials.length / itemsPerPage)"
              rounded
              color="primary"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Share Your Experience CTA -->
    <section class="py-12">
      <v-container>
        <v-row>
          <v-col cols="12" md="8" offset-md="2" class="text-center">
            <v-card class="elevation-3 rounded-lg pa-6">
              <h3 class="text-h4 font-weight-bold mb-4">Share Your Experience</h3>
              <p class="text-body-1 mb-6">
                Have you enjoyed your stay at Shangri La Beach Resort? We would love to hear from
                you! Share your experience and help future guests plan their perfect getaway.
              </p>
              <v-btn
                color="secondary"
                size="large"
                class="px-6 py-3"
                @click="showSubmissionForm = true"
              >
                Write a Review
                <v-icon right class="ml-2">mdi-pencil</v-icon>
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Testimonial Submission Dialog -->
    <v-dialog v-model="showSubmissionForm" max-width="600" persistent>
      <v-card class="pa-4">
        <v-card-title class="text-h4 font-weight-bold">
          <v-btn icon variant="text" @click="showSubmissionForm = false" class="float-right">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          {{ submissionSuccess ? 'Thank You!' : 'Share Your Experience' }}
        </v-card-title>

        <v-card-text v-if="!submissionSuccess">
          <p class="text-subtitle-1 mb-4">
            We appreciate your feedback. Your review will help us improve and assist future guests.
          </p>

          <!-- Error Message -->
          <v-alert
            v-if="submissionError"
            type="error"
            variant="tonal"
            icon="mdi-alert-circle"
            class="mb-4"
          >
            {{ submissionError }}
          </v-alert>

          <v-form @submit.prevent="submitTestimonial">
            <v-row>
              <v-col cols="12">
                <label class="text-subtitle-2 font-weight-bold mb-2 d-block">Your Rating</label>
                <div class="d-flex align-center">
                  <v-rating v-model="userRating" color="amber" hover size="large"></v-rating>
                  <span class="text-subtitle-1 ms-2">{{ userRating }} / 5</span>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-text-field v-model="userName" label="Your Name" required></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="userLocation"
                  label="Location (City, Country)"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="userCategory"
                  label="Experience Type"
                  :items="categories.filter((c) => c !== 'all')"
                  required
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="userComment"
                  label="Your Review"
                  rows="5"
                  required
                  counter="500"
                  hint="Share your experience at Shangri La Beach Resort"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-checkbox
                  label="I confirm that this is an honest review based on my own experience"
                  required
                ></v-checkbox>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="text-center">
                <v-btn
                  color="primary"
                  size="large"
                  class="px-8"
                  type="submit"
                  :loading="isSubmitting"
                  :disabled="!userName || !userLocation || !userCategory || !userComment"
                >
                  Submit Review
                  <v-icon right class="ml-2">mdi-send</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-text v-else class="text-center pa-6">
          <v-icon color="success" size="64" class="mb-4">mdi-check-circle</v-icon>
          <h3 class="text-h5 mb-4">Thank You for Your Review!</h3>
          <p class="text-body-1 mb-6">
            We appreciate you taking the time to share your experience at Shangri La Beach Resort.
            Your feedback is valuable to us and helps other travelers make informed decisions.
          </p>
          <p class="text-body-2 mb-6">
            Your review has been submitted and will be published after a quick review by our team.
          </p>
          <v-btn color="primary" @click="showSubmissionForm = false"> Close </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
/* Hero Section */
.testimonials-hero-section {
  height: 60vh;
  min-height: 400px;
}

.testimonials-hero-bg {
  height: 100%;
  width: 100%;
  background-image: url('@/assets/images/resort-drone.webp');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.testimonials-hero-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 100%;
}

.testimonials-hero-content {
  max-width: 800px;
  transform: translateY(30px);
  opacity: 0;
  transition:
    transform 0.8s ease,
    opacity 0.8s ease;
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

/* Featured testimonials */
.featured-testimonial-card,
.testimonial-card {
  transform: translateY(10px);
  opacity: 0.9;
  transition:
    transform 0.3s ease-out,
    opacity 0.3s ease-out,
    box-shadow 0.2s ease;
}

.testimonial-visible {
  transform: translateY(0) !important;
  opacity: 1 !important;
}

.featured-testimonial-card:hover,
.testimonial-card:hover {
  transform: translateY(-5px) !important;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

/* Testimonials section */
.bg-light-blue {
  background-color: #f5f9fd;
}

/* Responsive styles */
@media (max-width: 960px) {
  .testimonials-hero-section {
    height: 50vh;
  }
}

@media (max-width: 600px) {
  .testimonials-hero-section {
    height: auto;
    min-height: 50vh;
  }
}
</style>
