/**
 * BookingService - Handles operations related to room bookings
 * Using localStorage for simplicity in this demo
 */

// Storage key for bookings
const STORAGE_KEY = 'shangriLaBookings';

/**
 * Get all saved bookings
 * @returns {Array} Array of booking objects
 */
export function getAllBookings() {
  const bookingsJSON = localStorage.getItem(STORAGE_KEY);
  return bookingsJSON ? JSON.parse(bookingsJSON) : [];
}

/**
 * Get a specific booking by ID
 * @param {number|string} id Booking ID
 * @returns {Object|null} Booking object or null if not found
 */
export function getBookingById(id) {
  const bookings = getAllBookings();
  return bookings.find(booking => booking.id == id) || null;
}

/**
 * Get bookings for a specific guest email
 * @param {string} email Guest email
 * @returns {Array} Array of booking objects
 */
export function getBookingsByEmail(email) {
  const bookings = getAllBookings();
  return bookings.filter(booking => booking.email.toLowerCase() === email.toLowerCase());
}

/**
 * Check if a room is available for the specified dates
 * @param {number} roomId Room ID
 * @param {string} checkInDate Check-in date (YYYY-MM-DD)
 * @param {string} checkOutDate Check-out date (YYYY-MM-DD)
 * @returns {boolean} True if room is available, false otherwise
 */
export function isRoomAvailable(roomId, checkInDate, checkOutDate) {
  const bookings = getAllBookings();
  
  // Convert dates to timestamps for comparison
  const checkIn = new Date(checkInDate).getTime();
  const checkOut = new Date(checkOutDate).getTime();
  
  // Check for overlapping bookings
  const overlappingBooking = bookings.find(booking => {
    if (booking.roomId !== roomId) return false;
    
    const bookedCheckIn = new Date(booking.checkInDate).getTime();
    const bookedCheckOut = new Date(booking.checkOutDate).getTime();
    
    // Check if dates overlap
    return (
      (checkIn >= bookedCheckIn && checkIn < bookedCheckOut) ||
      (checkOut > bookedCheckIn && checkOut <= bookedCheckOut) ||
      (checkIn <= bookedCheckIn && checkOut >= bookedCheckOut)
    );
  });
  
  return !overlappingBooking;
}

/**
 * Save a new booking
 * @param {Object} booking Booking object
 * @returns {Object} Saved booking with generated ID
 */
export function saveBooking(booking) {
  const bookings = getAllBookings();
  
  // Generate ID if not provided
  if (!booking.id) {
    booking.id = Date.now();
  }
  
  // Add booking date if not provided
  if (!booking.bookingDate) {
    booking.bookingDate = new Date().toISOString();
  }
  
  // Set status to confirmed if not provided
  if (!booking.status) {
    booking.status = 'confirmed';
  }
  
  // Add to bookings array
  bookings.push(booking);
  
  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  
  return booking;
}

/**
 * Update an existing booking
 * @param {Object} updatedBooking Updated booking object
 * @returns {Object|null} Updated booking or null if not found
 */
export function updateBooking(updatedBooking) {
  const bookings = getAllBookings();
  const index = bookings.findIndex(booking => booking.id == updatedBooking.id);
  
  if (index === -1) return null;
  
  // Update booking
  bookings[index] = { ...bookings[index], ...updatedBooking };
  
  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  
  return bookings[index];
}

/**
 * Cancel a booking
 * @param {number|string} id Booking ID
 * @returns {boolean} True if booking was cancelled, false if not found
 */
export function cancelBooking(id) {
  const bookings = getAllBookings();
  const index = bookings.findIndex(booking => booking.id == id);
  
  if (index === -1) return false;
  
  // Set status to cancelled
  bookings[index].status = 'cancelled';
  bookings[index].cancelledDate = new Date().toISOString();
  
  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  
  return true;
}

/**
 * Delete a booking (for admin purposes)
 * @param {number|string} id Booking ID
 * @returns {boolean} True if booking was deleted, false if not found
 */
export function deleteBooking(id) {
  const bookings = getAllBookings();
  const filteredBookings = bookings.filter(booking => booking.id != id);
  
  if (filteredBookings.length === bookings.length) return false;
  
  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredBookings));
  
  return true;
}

/**
 * Clear all bookings (for testing/development)
 */
export function clearAllBookings() {
  localStorage.removeItem(STORAGE_KEY);
}

export default {
  getAllBookings,
  getBookingById,
  getBookingsByEmail,
  isRoomAvailable,
  saveBooking,
  updateBooking,
  cancelBooking,
  deleteBooking,
  clearAllBookings
};
