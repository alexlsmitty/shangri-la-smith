import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { AuthService } from '@/services/api'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/rooms',
      name: 'rooms',
      component: NotFoundView,
    },
    {
      path: '/rooms/:roomType',
      name: 'room-details',
      component: NotFoundView,
      props: true,
    },
    {
      path: '/spa',
      name: 'spa',
      component: NotFoundView,
    },
    {
      path: '/dining',
      name: 'dining',
      component: NotFoundView,
    },
    {
      path: '/activities',
      name: 'activities',
      component: NotFoundView,
    },
    {
      path: '/testimonials',
      name: 'testimonials',
      component: NotFoundView,
    },
    {
      path: '/bookings',
      name: 'bookings',
      component: NotFoundView,
    },
    {
      path: '/login',
      name: 'login',
      component: NotFoundView,
      meta: { guestOnly: true }
    },
    {
      path: '/my-account',
      name: 'my-account',
      component: NotFoundView,
      meta: { requiresAuth: true }
    },
    {
      path: '/booking/:reference',
      name: 'booking-details',
      component: NotFoundView,
      props: true
    },
    {
      path: '/spa/appointment/:reference',
      name: 'spa-appointment-details',
      component: NotFoundView,
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
