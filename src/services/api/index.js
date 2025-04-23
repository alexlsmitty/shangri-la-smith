import axios from 'axios'

// Create a fallback event bus for notifying components about database fallbacks
export const fallbackState = {
  active: false,
  listeners: new Set(),

  // Set fallback state and notify listeners
  setFallback(isActive) {
    if (this.active !== isActive) {
      this.active = isActive
      this.notifyListeners()
    }
  },

  // Add a listener function
  addListener(callback) {
    this.listeners.add(callback)
    return () => this.removeListener(callback)
  },

  // Remove a listener function
  removeListener(callback) {
    this.listeners.delete(callback)
  },

  // Notify all listeners about state change
  notifyListeners() {
    for (const listener of this.listeners) {
      try {
        listener(this.active)
      } catch (error) {
        console.error('Error in fallback listener:', error)
      }
    }
  },
}

// Helper function to fix image paths from the API
function fixImagePaths(data) {
  // If it's an array of rooms
  if (Array.isArray(data)) {
    return data.map((room) => {
      return {
        ...room,
        // Map the API image paths to the correct assets path
        images: room.images.map((imagePath) => {
          // Map to the corresponding hotel-room*.webp file
          if (room.id === 1 || room.id === 5) {
            return new URL('@/assets/images/hotel-room1.webp', import.meta.url).href
          } else if (room.id === 2) {
            return new URL('@/assets/images/hotel-room2.webp', import.meta.url).href
          } else if (room.id === 3) {
            return new URL('@/assets/images/hotel-room3.webp', import.meta.url).href
          } else if (room.id === 4) {
            return new URL('@/assets/images/hotel-room4.webp', import.meta.url).href
          }
          return imagePath // fallback
        }),
      }
    })
  }
  // If it's a single room
  else if (data && data.images) {
    return {
      ...data,
      // Map the API image paths to the correct assets path
      images: data.images.map((imagePath) => {
        // Map to the corresponding hotel-room*.webp file
        if (data.id === 1 || data.id === 5) {
          return new URL('@/assets/images/hotel-room1.webp', import.meta.url).href
        } else if (data.id === 2) {
          return new URL('@/assets/images/hotel-room2.webp', import.meta.url).href
        } else if (data.id === 3) {
          return new URL('@/assets/images/hotel-room3.webp', import.meta.url).href
        } else if (data.id === 4) {
          return new URL('@/assets/images/hotel-room4.webp', import.meta.url).href
        }
        return imagePath // fallback
      }),
    }
  }
  return data
}

// API base URL - use environment variable or default URL
const API_URL = import.meta.env.VITE_API_URL || '/api'

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add a timeout to fail gracefully
  timeout: 5000,
})

// Common error handler for API requests
function handleApiError(error) {
  console.error('API Error:', error)

  // Check if the response indicates a fallback is active
  if (error.response?.data?.fallback) {
    fallbackState.setFallback(true)
  }

  // Rethrow the error for the caller to handle
  throw error
}

// Common response handler to check for fallback mode
function handleApiResponse(response) {
  // Check if the response indicates a fallback is active
  if (response.data?.fallback) {
    fallbackState.setFallback(true)
  } else {
    fallbackState.setFallback(false)
  }

  return response.data?.data || response.data
}

// Room-related API services
export const RoomService = {
  // Get all rooms
  async getAllRooms() {
    try {
      const response = await apiClient.get('/rooms')
      return fixImagePaths(handleApiResponse(response))
    } catch (err) {
      return handleApiError(err)
    }
  },

  // Get room details by slug
  async getRoomBySlug(slug) {
    try {
      const response = await apiClient.get(`/room?slug=${slug}`)
      return fixImagePaths(handleApiResponse(response))
    } catch (err) {
      return handleApiError(err)
    }
  },

  // Check room availability
  async checkAvailability(roomTypeId, checkIn, checkOut) {
    try {
      const response = await apiClient.get('/availability', {
        params: { roomTypeId, checkIn, checkOut },
      })
      return handleApiResponse(response)
    } catch {
      return { available: true, fallback: true } // Optimistic fallback
    }
  },
}

// Booking-related API services
export const BookingService = {
  // Create a new booking
  async createBooking(bookingData) {
    try {
      const response = await apiClient.post('/bookings', bookingData)
      return handleApiResponse(response)
    } catch (err) {
      return handleApiError(err)
    }
  },

  // Get bookings by email
  async getBookingsByEmail(email) {
    try {
      const response = await apiClient.get(`/bookings?email=${email}`)
      return handleApiResponse(response)
    } catch {
      return [] // Empty fallback
    }
  },

  // Get booking by reference
  async getBookingByReference(reference) {
    try {
      const response = await apiClient.get(`/booking?reference=${reference}`)
      return handleApiResponse(response)
    } catch (err) {
      return handleApiError(err)
    }
  },

  // Cancel a booking
  async cancelBooking(reference) {
    try {
      const response = await apiClient.put(`/booking?reference=${reference}`, {
        action: 'cancel',
      })
      return handleApiResponse(response)
    } catch (err) {
      return handleApiError(err)
    }
  },

  // Update booking special requests
  async updateBookingRequests(reference, specialRequests) {
    try {
      const response = await apiClient.put(`/booking?reference=${reference}`, {
        special_requests: specialRequests,
      })
      return handleApiResponse(response)
    } catch (err) {
      return handleApiError(err)
    }
  },
}

// Spa-related API services
export const SpaService = {
  // Get all spa services
  async getAllServices() {
    try {
      const response = await apiClient.get('/spa/services')
      return handleApiResponse(response)
    } catch (err) {
      return handleApiError(err)
    }
  },

  // Get spa service details by id
  async getServiceById(id) {
    try {
      const response = await apiClient.get(`/spa/services/${id}`)
      return handleApiResponse(response)
    } catch (err) {
      return handleApiError(err)
    }
  },

  // Get spa services by category
  async getServicesByCategory(categoryId) {
    try {
      const response = await apiClient.get(`/spa/services/category/${categoryId}`)
      return handleApiResponse(response)
    } catch (err) {
      return handleApiError(err)
    }
  },

  // Check spa appointment availability
  async checkAvailability(serviceId, date) {
    try {
      const response = await apiClient.get('/spa/appointments/available', {
        params: { serviceId, date },
      })
      return handleApiResponse(response)
    } catch {
      return { available: true, fallback: true } // Optimistic fallback
    }
  },

  // Create a new spa appointment
  async createAppointment(appointmentData) {
    try {
      const response = await apiClient.post('/spa/appointments', appointmentData)
      return handleApiResponse(response)
    } catch (err) {
      return handleApiError(err)
    }
  },

  // Get spa appointment by reference
  async getAppointmentByReference(reference) {
    try {
      const response = await apiClient.get(`/spa/appointment?reference=${reference}`)
      return handleApiResponse(response)
    } catch (err) {
      return handleApiError(err)
    }
  },

  // Cancel a spa appointment
  async cancelAppointment(reference) {
    try {
      const response = await apiClient.put(`/spa/appointment?reference=${reference}`, {
        action: 'cancel',
      })
      return handleApiResponse(response)
    } catch (err) {
      return handleApiError(err)
    }
  },

  // Update special requests for a spa appointment
  async updateAppointmentRequests(reference, specialRequests) {
    try {
      const response = await apiClient.put(`/spa/appointment?reference=${reference}`, {
        special_requests: specialRequests,
      })
      return handleApiResponse(response)
    } catch (err) {
      return handleApiError(err)
    }
  },
}

// Authentication-related API services
export const AuthService = {
  // Register a new user
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData)
      return handleApiResponse(response)
    } catch (err) {
      return handleApiError(err)
    }
  },

  // Login a user
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials)
      return handleApiResponse(response)
    } catch (err) {
      return handleApiError(err)
    }
  },

  // Get current user info
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/user')
      return handleApiResponse(response)
    } catch (error) {
      // For user info, return a special offline fallback
      if (!navigator.onLine || error.code === 'ECONNABORTED') {
        return {
          user: this.getOfflineUserData(),
          bookings: [],
          spaAppointments: [],
          fallback: true,
        }
      }
      return handleApiError(error)
    }
  },

  // Logout a user
  async logout() {
    try {
      const response = await apiClient.post('/auth/logout')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      return handleApiResponse(response)
    } catch {
      // Even if server request fails, clear local storage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      return { message: 'Logged out' }
    }
  },

  // Check if the user is authenticated
  isLoggedIn() {
    return localStorage.getItem('auth_token') !== null
  },

  // Set auth token in localStorage and axios headers
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('auth_token', token)
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      localStorage.removeItem('auth_token')
      delete apiClient.defaults.headers.common['Authorization']
    }
  },

  // Get user bookings (authenticated)
  async getMyBookings() {
    try {
      const response = await apiClient.get('/bookings/my-bookings')
      return handleApiResponse(response)
    } catch {
      return [] // Empty fallback
    }
  },

  // Get user spa appointments (authenticated)
  async getMySpaAppointments() {
    try {
      const response = await apiClient.get('/spa/appointments/my-appointments')
      return handleApiResponse(response)
    } catch {
      return [] // Empty fallback
    }
  },

  // Get offline user data (when in fallback mode)
  getOfflineUserData() {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        console.error('Error parsing user data from localStorage')
      }
    }
    return null
  },
}

export default {
  RoomService,
  BookingService,
  SpaService,
  AuthService,
  fallbackState,
}
