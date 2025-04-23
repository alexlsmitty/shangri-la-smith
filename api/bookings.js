import { selectData, insertData, getCurrentUser } from '../lib/supabase.js';
import { randomBytes } from 'crypto';

/**
 * Generate a unique booking reference
 * @returns {string} A unique booking reference code
 */
function generateBookingReference() {
  // Generate a random string and take the first 8 characters
  return randomBytes(4).toString('hex').toUpperCase();
}

/**
 * Check if a room is available for the specified dates
 * @param {number} roomTypeId - The room type ID
 * @param {string} checkInDate - Check-in date in ISO format
 * @param {string} checkOutDate - Check-out date in ISO format
 * @returns {Promise<boolean>} True if the room is available
 */
async function isRoomAvailable(roomTypeId, checkInDate, checkOutDate) {
  // Look for any overlapping bookings
  const bookings = await selectData('bookings', {
    select: 'id',
    filters: { 
      room_type_id: roomTypeId,
      status: 'confirmed'
    }
  });

  // Parse dates
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  // Filter bookings that overlap with the requested date range
  const overlappingBookings = bookings.filter(booking => {
    const bookingCheckIn = new Date(booking.check_in_date);
    const bookingCheckOut = new Date(booking.check_out_date);

    // Check if there's an overlap
    return (
      (checkIn >= bookingCheckIn && checkIn < bookingCheckOut) ||
      (checkOut > bookingCheckIn && checkOut <= bookingCheckOut) ||
      (checkIn <= bookingCheckIn && checkOut >= bookingCheckOut)
    );
  });

  // Room is available if there are no overlapping bookings
  return overlappingBookings.length === 0;
}

/**
 * GET /api/bookings?email=user@example.com
 * Get bookings for a specific email address
 * 
 * GET /api/bookings/my-bookings
 * Get bookings for the authenticated user
 * 
 * POST /api/bookings
 * Create a new booking
 */
export default async (req, res) => {
  try {
    // Handle route paths
    const urlParts = req.url.split('?')[0].split('/');
    const path = urlParts[3]; // Get the third segment of the URL path

    // GET /api/bookings/my-bookings - Get authenticated user's bookings
    if (req.method === 'GET' && path === 'my-bookings') {
      // Get user from auth token
      const user = await getCurrentUser();
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Get bookings for this user
      const bookings = await selectData('bookings', {
        select: `
          id,
          reference,
          room_type_id,
          check_in_date,
          check_out_date,
          guest_count,
          guest_name,
          guest_email,
          special_requests,
          total_price,
          status,
          created_at,
          updated_at,
          room_types (
            id, 
            name,
            slug
          ),
          room_images (
            image_url
          )
        `,
        filters: { user_id: user.id }
      });
      
      // Format the bookings data
      const formattedBookings = bookings.map(booking => ({
        id: booking.id,
        booking_reference: booking.reference,
        room_type_id: booking.room_type_id,
        room_name: booking.room_types?.name || 'Unknown Room',
        room_slug: booking.room_types?.slug || '',
        check_in_date: booking.check_in_date,
        check_out_date: booking.check_out_date,
        adults: booking.guest_count || 1,
        children: 0, // Default if not available
        first_name: booking.guest_name?.split(' ')[0] || '',
        last_name: booking.guest_name?.split(' ')[1] || '',
        email: booking.guest_email,
        special_requests: booking.special_requests || '',
        total_price: booking.total_price,
        status: booking.status,
        booking_date: booking.created_at,
        room_image: booking.room_images?.[0]?.image_url || null
      }));

      return res.status(200).json({
        success: true,
        data: formattedBookings
      });
    }

    // GET - Retrieve bookings for an email
    if (req.method === 'GET' && !path) {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email parameter is required'
        });
      }

      // Get bookings for this email
      const bookings = await selectData('bookings', {
        select: `
          id,
          reference,
          room_type_id,
          check_in_date,
          check_out_date,
          guest_count,
          guest_name,
          guest_email,
          special_requests,
          total_price,
          status,
          created_at,
          updated_at,
          room_types (
            id, 
            name,
            slug
          ),
          room_images (
            image_url
          )
        `,
        filters: { guest_email: email }
      });
      
      // Format the bookings data
      const formattedBookings = bookings.map(booking => ({
        id: booking.id,
        booking_reference: booking.reference,
        room_type_id: booking.room_type_id,
        room_name: booking.room_types?.name || 'Unknown Room',
        room_slug: booking.room_types?.slug || '',
        check_in_date: booking.check_in_date,
        check_out_date: booking.check_out_date,
        adults: booking.guest_count || 1,
        children: 0, // Default if not available
        first_name: booking.guest_name?.split(' ')[0] || '',
        last_name: booking.guest_name?.split(' ')[1] || '',
        email: booking.guest_email,
        special_requests: booking.special_requests || '',
        total_price: booking.total_price,
        status: booking.status,
        booking_date: booking.created_at,
        room_image: booking.room_images?.[0]?.image_url || null
      }));

      return res.status(200).json({
        success: true,
        data: formattedBookings
      });
    }

    // POST - Create a new booking
    if (req.method === 'POST' && !path) {
      const body = req.body;

      // Validate required fields
      const requiredFields = [
        'roomTypeId',
        'checkInDate',
        'checkOutDate',
        'adults',
        'firstName',
        'lastName',
        'email',
        'phone',
        'totalPrice'
      ];

      // Check for missing fields
      const missingFields = requiredFields.filter(field => !body[field]);
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      // Get user ID from authentication token (if present)
      let userId = null;
      try {
        const user = await getCurrentUser();
        if (user) {
          userId = user.id;
        }
      } catch (error) {
        console.log('No authenticated user');
      }

      // Verify the room type exists
      const roomTypes = await selectData('room_types', {
        select: 'id',
        filters: { id: parseInt(body.roomTypeId) }
      });

      if (!roomTypes || roomTypes.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Room type not found'
        });
      }

      // Check if room is available for the requested dates
      const available = await isRoomAvailable(
        parseInt(body.roomTypeId),
        body.checkInDate,
        body.checkOutDate
      );

      if (!available) {
        return res.status(409).json({
          success: false,
          error: 'Room is not available for the selected dates'
        });
      }

      // Generate a unique booking reference
      const bookingReference = generateBookingReference();

      // Create the booking data object
      const bookingData = {
        reference: bookingReference,
        room_type_id: parseInt(body.roomTypeId),
        check_in_date: body.checkInDate,
        check_out_date: body.checkOutDate,
        guest_count: parseInt(body.adults) + (parseInt(body.children) || 0),
        guest_name: `${body.firstName} ${body.lastName}`,
        guest_email: body.email,
        special_requests: body.specialRequests || '',
        total_price: parseFloat(body.totalPrice),
        status: 'confirmed',
        user_id: userId
      };

      // Insert the booking
      const newBooking = await insertData('bookings', bookingData);

      if (!newBooking || newBooking.length === 0) {
        return res.status(500).json({
          success: false,
          error: 'Failed to create booking'
        });
      }

      // Get the room details to include in the response
      const roomType = await selectData('room_types', {
        select: 'name, slug',
        filters: { id: parseInt(body.roomTypeId) }
      });

      // Format the response booking object
      const booking = {
        id: newBooking[0].id,
        booking_reference: bookingReference,
        room_type_id: parseInt(body.roomTypeId),
        room_name: roomType[0]?.name || 'Unknown Room',
        room_slug: roomType[0]?.slug || '',
        check_in_date: body.checkInDate,
        check_out_date: body.checkOutDate,
        adults: parseInt(body.adults),
        children: parseInt(body.children) || 0,
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        phone: body.phone,
        special_requests: body.specialRequests || '',
        total_price: parseFloat(body.totalPrice),
        status: 'confirmed',
        booking_date: newBooking[0].created_at,
        user_id: userId
      };

      return res.status(201).json({
        success: true,
        data: booking
      });
    }

    // Method not allowed or route not found
    return res.status(404).json({
      success: false,
      error: 'Route not found'
    });
  } catch (error) {
    console.error('Error handling bookings:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
