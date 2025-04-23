import { getDb, initDb } from './_utils/db.js';
import { 
  handleError, 
  setCorsHeaders, 
  parseBody, 
  sendSuccessResponse, 
  sendErrorResponse 
} from './_utils/middleware.js';

/**
 * GET /api/booking?reference=ABC-12345
 * Get details for a specific booking
 * 
 * PUT /api/booking?reference=ABC-12345
 * Update a booking (e.g., cancel)
 */
export default async (req, res) => {
  // Set CORS headers
  setCorsHeaders(req, res);
  
  // Initialize database in production environment
  if (process.env.NODE_ENV === 'production') {
    await initDb();
  }

  try {
    const { reference } = req.query;

    if (!reference) {
      return sendErrorResponse(res, 'Booking reference is required', 400);
    }

    // Connect to the database
    const db = await getDb();
    
    // Check authentication if needed
    // (Authentication check can be implemented as needed)

    // GET - Retrieve a specific booking
    if (req.method === 'GET') {
      const booking = await db.get(`
        SELECT 
          b.id,
          b.booking_reference,
          b.room_type_id,
          rt.name AS room_name,
          rt.slug AS room_slug,
          b.check_in_date,
          b.check_out_date,
          b.adults,
          b.children,
          b.first_name,
          b.last_name,
          b.email,
          b.phone,
          b.special_requests,
          b.payment_method,
          b.total_price,
          b.status,
          b.booking_date,
          b.cancelled_date,
          (SELECT image_url FROM room_images WHERE room_type_id = b.room_type_id ORDER BY display_order ASC LIMIT 1) AS room_image
        FROM bookings b
        JOIN room_types rt ON b.room_type_id = rt.id
        WHERE b.booking_reference = ?
      `, [reference]);

      if (!booking) {
        return sendErrorResponse(res, 'Booking not found', 404);
      }

      return sendSuccessResponse(res, booking);
    }

    // PUT - Update a booking (e.g., cancel)
    if (req.method === 'PUT') {
      const body = parseBody(req);

      // Verify the booking exists
      const existingBooking = await db.get(
        'SELECT id, status FROM bookings WHERE booking_reference = ?',
        [reference]
      );

      if (!existingBooking) {
        return sendErrorResponse(res, 'Booking not found', 404);
      }

      // Handle booking cancellation
      if (body.action === 'cancel') {
        // Check if booking can be cancelled
        if (existingBooking.status === 'cancelled') {
          return sendErrorResponse(res, 'Booking is already cancelled', 400);
        }

        // Update booking status
        await db.run(`
          UPDATE bookings
          SET status = 'cancelled', cancelled_date = CURRENT_TIMESTAMP
          WHERE booking_reference = ?
        `, [reference]);

        // Get the updated booking
        const updatedBooking = await db.get(`
          SELECT 
            booking_reference,
            status,
            cancelled_date
          FROM bookings
          WHERE booking_reference = ?
        `, [reference]);

        return sendSuccessResponse(res, {
          ...updatedBooking,
          message: 'Booking cancelled successfully'
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
        return sendErrorResponse(res, 'No valid fields to update', 400);
      }

      // Build the SQL query
      let query = 'UPDATE bookings SET ';
      const values = [];

      Object.entries(updates).forEach(([key, value], index) => {
        query += `${key} = ?`;
        values.push(value);

        if (index < Object.keys(updates).length - 1) {
          query += ', ';
        }
      });

      query += ' WHERE booking_reference = ?';
      values.push(reference);

      // Execute the update
      await db.run(query, values);

      // Get the updated booking
      const updatedBooking = await db.get(
        'SELECT booking_reference, special_requests FROM bookings WHERE booking_reference = ?',
        [reference]
      );

      return sendSuccessResponse(res, {
        ...updatedBooking,
        message: 'Booking updated successfully'
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  } catch (error) {
    return handleError(res, error);
  }
};
