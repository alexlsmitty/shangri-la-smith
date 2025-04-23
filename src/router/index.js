import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { AuthService } from '@/services/api'
import NotFoundView from '../views/NotFoundView.vue'

// Load other views lazily for better performance

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/rooms',
      name: 'rooms',
      component: () => import('../views/RoomsView.vue'),
    },
    {
      path: '/rooms/:roomType',
      name: 'room-details',
      component: () => import('../views/RoomDetailView.vue'),
      props: true,
    },
    {
      path: '/spa',
      name: 'spa',
      component: () => import('../views/SpaView.vue'),
    },
    {
      path: '/dining',
      name: 'dining',
      component: () => import('../views/DiningView.vue'),
    },
    {
      path: '/activities',
      name: 'activities',
      component: () => import('../views/ActivitiesView.vue'),
    },
    {
      path: '/testimonials',
      name: 'testimonials',
      component: () => import('../views/TestimonialsView.vue'),
    },
    {
      path: '/bookings',
      name: 'bookings',
      component: () => import('../views/BookingsView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/my-account',
      name: 'my-account',
      component: () => import('../views/MyAccountView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/booking/:reference',
      name: 'booking-details',
      component: () => import('../views/BookingDetailView.vue'),
      props: true
    },
    {
      path: '/spa/appointment/:reference',
      name: 'spa-appointment-details',
      component: () => import('../views/SpaAppointmentDetailView.vue'),
      props: true
    },
    // Footer link routes that redirect to NotFound
    {
      path: '/about-us',
      name: 'about-us',
      component: NotFoundView
    },
    {
      path: '/contact',
      name: 'contact',
      component: NotFoundView
    },
    {
      path: '/faqs',
      name: 'faqs',
      component: NotFoundView
    },
    {
      path: '/careers',
      name: 'careers',
      component: NotFoundView
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: NotFoundView
    },
    {
      path: '/terms-of-service',
      name: 'terms-of-service',
      component: NotFoundView
    },
    {
      path: '/cookie-policy',
      name: 'cookie-policy',
      component: NotFoundView
    },
    {
      path: '/accessibility',
      name: 'accessibility',
      component: NotFoundView
    },
    // Catch-all route for 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = AuthService.isLoggedIn();
  
  // If route requires authentication and user is not logged in
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  }
  // If route is for guests only and user is logged in
  else if (to.matched.some(record => record.meta.guestOnly) && isAuthenticated) {
    next({ name: 'my-account' });
  }
  // Otherwise, proceed as normal
  else {
    next();
  }
});

export default router
