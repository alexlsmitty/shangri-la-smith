import axios from 'axios';
const API_URL = 'http://localhost:3000/api';

async function testBookingFlow() {
  try {
    console.log('1. Creating a test booking...');
    const booking = await axios.post(`${API_URL}/bookings`, {
      roomTypeId: 1,
      checkInDate: '2023-07-15',
      checkOutDate: '2023-07-20',
      adults: 2,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '555-123-4567',
      paymentMethod: 'credit-card',
      totalPrice: 1750
    });
    
    console.log('Booking created:', booking.data.data);
    const bookingRef = booking.data.data.booking_reference;
    
    console.log('\n2. Checking availability (should be unavailable)...');
    const availability = await axios.get(`${API_URL}/availability`, {
      params: {
        roomTypeId: 1,
        checkIn: '2023-07-16',
        checkOut: '2023-07-18'
      }
    });
    console.log('Availability result:', availability.data.data);
    
    console.log('\n3. Getting bookings by email...');
    const bookings = await axios.get(`${API_URL}/bookings?email=test@example.com`);
    console.log('Bookings found:', bookings.data.data.length);
    
    console.log('\n4. Cancelling the booking...');
    const cancelResult = await axios.put(`${API_URL}/booking?reference=${bookingRef}`, {
      action: 'cancel'
    });
    console.log('Cancel result:', cancelResult.data.data);
    
    console.log('\n5. Checking availability again (should be available after cancel)...');
    const availabilityAfterCancel = await axios.get(`${API_URL}/availability`, {
      params: {
        roomTypeId: 1,
        checkIn: '2023-07-16',
        checkOut: '2023-07-18'
      }
    });
    console.log('Availability result after cancel:', availabilityAfterCancel.data.data);
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testBookingFlow();
