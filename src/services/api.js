/**
 * API Service for authentication and data operations
 * This is a simplified version for deployment purposes
 */

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
  }
};

// Export a default API service
export default {
  auth: AuthService,
  rooms: RoomService,
  bookings: BookingService
};
