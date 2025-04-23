import { selectData, updateData } from '../lib/supabase.js';

/**
 * GET /api/booking?reference=ABC-12345
 * Get details for a specific booking
 * 
 * PUT /api/booking?reference=ABC-12345
 * Update a booking (e.g., cancel)
 */
export default async (req, res) => {
  try {
    const { reference } = req.query;

    if (!reference) {
      return res.status(400).json({
        success: false,
        error: 'Booking reference is required'
      });
    }

    // GET - Retrieve a specific booking
    if (req.method === 'GET') {
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
        filters: { reference }
      });

      if (!bookings || bookings.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Booking not found'
        });
      }

      const booking = bookings[0];
      
      // Format the booking data to match the expected structure
      const formattedBooking = {
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
        cancelled_date: booking.status === 'cancelled' ? booking.updated_at : null,
        room_image: booking.room_images?.[0]?.image_url || null
      };

      return res.status(200).json({
        success: true,
        data: formattedBooking
      });
    }

    // PUT - Update a booking (e.g., cancel)
    if (req.method === 'PUT') {
      const body = req.body;

      // Verify the booking exists
      const bookings = await selectData('bookings', {
        select: 'id, status',
        filters: { reference }
      });

      if (!bookings || bookings.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Booking not found'
        });
      }

      const existingBooking = bookings[0];

      // Handle booking cancellation
      if (body.action === 'cancel') {
        // Check if booking can be cancelled
        if (existingBooking.status === 'cancelled') {
          return res.status(400).json({
            success: false,
            error: 'Booking is already cancelled'
          });
        }

        // Update booking status
        const updatedBooking = await updateData('bookings', 
          { status: 'cancelled' }, 
          { reference }
        );

        if (!updatedBooking || updatedBooking.length === 0) {
          return res.status(500).json({
            success: false,
            error: 'Failed to cancel booking'
          });
        }

        return res.status(200).json({
          success: true,
          data: {
            booking_reference: reference,
            status: 'cancelled',
            cancelled_date: new Date().toISOString(),
            message: 'Booking cancelled successfully'
          }
        });
      }

      // If not cancelling, we're updating other booking details
      const allowedUpdates = ['special_requests'];
      const updates = {};

      // Filter only allowed fields
      for (const field of allowedUpdates) {
        if (body[field] !== undefined) {
          updates[field] = body[field];
        }
      }

      // If no valid updates, return error
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No valid fields to update'
        });
      }

      // Execute the update
      const updatedBooking = await updateData('bookings', updates, { reference });

      if (!updatedBooking || updatedBooking.length === 0) {
        return res.status(500).json({
          success: false,
          error: 'Failed to update booking'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          booking_reference: reference,
          special_requests: updates.special_requests,
          message: 'Booking updated successfully'
        }
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  } catch (error) {
    console.error('Error handling booking:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
