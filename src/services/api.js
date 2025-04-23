/**
 * API Service for authentication and data operations
 * This is a simplified version for deployment purposes
 */

// Simple state management for API fallback mode
export const fallbackState = {
  listeners: [],
  isActive: false,
  
  // Set fallback state
  setActive(active) {
    this.isActive = active;
    this.notifyListeners();
  },
  
  // Add listener function
  addListener(callback) {
    this.listeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  },
  
  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.isActive));
  }
};

// Mock Authentication Service
export const AuthService = {
  // Check if user is logged in
  isLoggedIn() {
    return false; // Always return false for deployment
  },
  
  // Mock login function
  login(credentials) {
    console.log('Login attempted with:', credentials);
    return Promise.resolve({ success: false, message: 'Demo mode: Authentication not available' });
  },
  
  // Mock logout function
  logout() {
    console.log('Logout attempted');
    return Promise.resolve({ success: true });
  },
  
  // Mock register function
  register(userData) {
    console.log('Registration attempted with:', userData);
    return Promise.resolve({ success: false, message: 'Demo mode: Registration not available' });
  },
  
  // Mock set auth token function
  setAuthToken(token) {
    console.log('Setting auth token:', token);
    // No-op for demo
  },
  
  // Mock get current user function
  getCurrentUser() {
    console.log('Getting current user');
    return Promise.resolve({
      user: {
        username: 'Demo User',
        email: 'demo@example.com',
        created_at: new Date().toISOString()
      },
      bookings: [],
      spaAppointments: []
    });
  }
};

// Room service mock
export const RoomService = {
  // Get all room types
  getRoomTypes() {
    return Promise.resolve([]);
  },
  
  // Get specific room details
  getRoomDetails(roomType) {
    console.log(`Getting details for room: ${roomType}`);
    return Promise.resolve(null);
  }
};

// Booking service mock
export const BookingService = {
  // Create booking
  createBooking(bookingData) {
    console.log('Booking attempted with:', bookingData);
    return Promise.resolve({ success: false, message: 'Demo mode: Booking not available' });
  },
  
  // Get bookings
  getBookings() {
    return Promise.resolve([]);
  },
  
  // Get a specific booking by reference
  getBookingByReference(reference) {
    console.log(`Getting booking with reference: ${reference}`);
    return Promise.resolve({
      id: '123',
      booking_reference: reference,
      room_name: 'Ocean View Deluxe Room',
      room_image: '/img/rooms/ocean-view-deluxe.jpg',
      check_in_date: new Date().toISOString(),
      check_out_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      adults: 2,
      children: 0,
      total_price: 750,
      payment_method: 'Credit Card',
      booking_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'confirmed',
      special_requests: '',
      first_name: 'Demo',
      last_name: 'User',
      email: 'demo@example.com',
      phone: '+1 (555) 123-4567'
    });
  },
  
  // Cancel booking
  cancelBooking(bookingReference) {
    console.log(`Cancelling booking: ${bookingReference}`);
    return Promise.resolve({ success: false, message: 'Demo mode: Cancellation not available' });
  }
};

// Spa service mock
export const SpaService = {
  // Get all spa services
  getServices() {
    return Promise.resolve([]);
  },
  
  // Book a spa appointment
  bookAppointment(appointmentData) {
    console.log('Spa appointment booking attempted with:', appointmentData);
    return Promise.resolve({ success: false, message: 'Demo mode: Booking not available' });
  },
  
  // Get spa appointments
  getAppointments() {
    return Promise.resolve([]);
  },
  
  // Get a specific appointment by reference
  getAppointmentByReference(reference) {
    console.log(`Getting spa appointment with reference: ${reference}`);
    return Promise.resolve({
      id: '123',
      booking_reference: reference,
      service_name: 'Shangri La Signature Massage',
      category_name: 'Massages',
      appointment_date: new Date().toISOString(),
      appointment_time: '10:00 AM',
      duration: '90 minutes',
      price: 250,
      status: 'confirmed',
      image_url: '/img/spa/massage.jpg',
      special_requests: '',
      guest_name: 'Demo User',
      guest_email: 'demo@example.com',
      guest_phone: '+1 (555) 123-4567'
    });
  },
  
  // Cancel spa appointment
  cancelAppointment(bookingReference) {
    console.log(`Cancelling spa appointment: ${bookingReference}`);
    return Promise.resolve({ success: false, message: 'Demo mode: Cancellation not available' });
  }
};

// Export a default API service
export default {
  auth: AuthService,
  rooms: RoomService,
  bookings: BookingService,
  spa: SpaService
};
