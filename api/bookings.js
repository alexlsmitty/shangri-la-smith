import { getDb, generateBookingReference, isRoomAvailable, formatDateForDb, initDb } from './_utils/db.js';
import { 
  handleError, 
  setCorsHeaders, 
  parseBody, 
  validateRequiredFields,
  sendSuccessResponse, 
  sendErrorResponse,
  getUserFromToken
} from './_utils/middleware.js';

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
  // Set CORS headers
  setCorsHeaders(req, res);
  
  // Initialize database in production environment
  if (process.env.NODE_ENV === 'production') {
    await initDb();
  }

  try {
    // Connect to the database
    const db = await getDb();

    // Handle route paths
    const urlParts = req.url.split('?')[0].split('/');
    const path = urlParts[3]; // Get the third segment of the URL path

    // GET /api/bookings/my-bookings - Get authenticated user's bookings
    if (req.method === 'GET' && path === 'my-bookings') {
      // Get user from auth token
      const user = await getUserFromToken(req, db);
      
      if (!user) {
        return sendErrorResponse(res, 'Authentication required', 401);
      }

      const bookings = await db.all(`
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
        WHERE b.user_id = ?
        ORDER BY b.booking_date DESC
      `, [user.id]);

      return sendSuccessResponse(res, bookings);
    }

    // GET - Retrieve bookings for an email
    if (req.method === 'GET' && !path) {
      const { email } = req.query;

      if (!email) {
        return sendErrorResponse(res, 'Email parameter is required', 400);
      }

      const bookings = await db.all(`
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
        WHERE b.email = ?
        ORDER BY b.booking_date DESC
      `, [email]);

      return sendSuccessResponse(res, bookings);
    }

    // POST - Create a new booking
    if (req.method === 'POST' && !path) {
      const body = parseBody(req);

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
        'paymentMethod',
        'totalPrice'
      ];

      const validation = validateRequiredFields(body, requiredFields);
      if (!validation.valid) {
        return sendErrorResponse(res, validation.message, 400);
      }

      // Get user ID from authentication token (if present)
      let userId = null;
      if (req.headers.authorization) {
        const user = await getUserFromToken(req, db);
        if (user) {
          userId = user.id;
        }
      }

      // If user provided username/password but not authenticated, check if we should create an account
      if (!userId && body.username && body.password) {
        // Check if email already exists in users table
        const existingUser = await db.get(
          'SELECT id FROM users WHERE email = ? OR username = ?',
          [body.email, body.username]
        );

        if (existingUser) {
          return sendErrorResponse(res, 'Email or username already registered. Please login first.', 409);
        }

        // Create a new user
        const crypto = await import('crypto');
        
        // Generate salt and hash for password
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(body.password, salt, 1000, 64, 'sha512').toString('hex');
        
        // Insert the new user
        const userResult = await db.run(
          'INSERT INTO users (email, username, password_hash, salt) VALUES (?, ?, ?, ?)',
          [body.email, body.username, hash, salt]
        );
        
        userId = userResult.lastID;
      }

      // Verify the room type exists
      const roomType = await db.get(
        'SELECT id FROM room_types WHERE id = ?',
        [body.roomTypeId]
      );

      if (!roomType) {
        return sendErrorResponse(res, 'Room type not found', 404);
      }

      // Check if room is available for the requested dates
      const available = await isRoomAvailable(
        db,
        body.roomTypeId,
        body.checkInDate,
        body.checkOutDate
      );

      if (!available) {
        return sendErrorResponse(
          res,
          'Room is not available for the selected dates',
          409
        );
      }

      // Generate a unique booking reference
      const bookingReference = generateBookingReference();

      // Format dates for SQLite
      const formattedCheckIn = formatDateForDb(body.checkInDate);
      const formattedCheckOut = formatDateForDb(body.checkOutDate);

      // Insert the booking
      await db.run(`
        INSERT INTO bookings (
          booking_reference,
          room_type_id,
          check_in_date,
          check_out_date,
          adults,
          children,
          first_name,
          last_name,
          email,
          phone,
          special_requests,
          payment_method,
          total_price,
          status,
          user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        bookingReference,
        body.roomTypeId,
        formattedCheckIn,
        formattedCheckOut,
        body.adults,
        body.children || 0,
        body.firstName,
        body.lastName,
        body.email,
        body.phone,
        body.specialRequests || '',
        body.paymentMethod,
        body.totalPrice,
        'confirmed',
        userId
      ]);

      // Get the created booking
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
          b.user_id
        FROM bookings b
        JOIN room_types rt ON b.room_type_id = rt.id
        WHERE b.booking_reference = ?
      `, [bookingReference]);

      return sendSuccessResponse(res, booking, 201);
    }

    // Method not allowed or route not found
    return res.status(404).json({
      success: false,
      error: 'Route not found'
    });
  } catch (error) {
    return handleError(res, error);
  }
};
