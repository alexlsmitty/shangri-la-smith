import { getDb, initDb } from './_utils/db.js';
import crypto from 'crypto';
import { 
  handleError, 
  setCorsHeaders, 
  parseBody, 
  validateRequiredFields,
  sendSuccessResponse, 
  sendErrorResponse 
} from './_utils/middleware.js';

// Generate a password hash using SHA-256
const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
};

// Verify a password against a stored hash
const verifyPassword = (password, storedHash, storedSalt) => {
  const hash = crypto.pbkdf2Sync(password, storedSalt, 1000, 64, 'sha512').toString('hex');
  return hash === storedHash;
};

// Generate a random auth token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * POST /api/auth/register
 * Register a new user
 * 
 * POST /api/auth/login
 * Login a user
 * 
 * GET /api/auth/user
 * Get current user info
 * 
 * POST /api/auth/logout
 * Logout a user
 */
export default async (req, res) => {
  // Set CORS headers
  setCorsHeaders(req, res);
  
  // Initialize database in production environment
  if (process.env.NODE_ENV === 'production') {
    await initDb();
  }

  try {
    const path = req.url.split('/')[3]; // Get the third segment of the URL path
    const db = await getDb();

    // POST /api/auth/register - Create a new user
    if (req.method === 'POST' && path === 'register') {
      const body = parseBody(req);

      // Validate required fields
      const requiredFields = ['email', 'username', 'password'];
      const missingFields = validateRequiredFields(body, requiredFields);
      
      if (missingFields.length > 0) {
        return sendErrorResponse(res, `Missing required fields: ${missingFields.join(', ')}`, 400);
      }

      const { email, username, password } = body;

      // Check if email or username already exists
      const existingUser = await db.get(
        'SELECT * FROM users WHERE email = ? OR username = ?',
        [email, username]
      );

      if (existingUser) {
        if (existingUser.email === email) {
          return sendErrorResponse(res, 'Email is already registered', 409);
        }
        return sendErrorResponse(res, 'Username is already taken', 409);
      }

      // Hash the password
      const { hash, salt } = hashPassword(password);

      // Insert the new user
      const result = await db.run(
        'INSERT INTO users (email, username, password_hash, salt) VALUES (?, ?, ?, ?)',
        [email, username, hash, salt]
      );

      // Generate auth token
      const token = generateToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // Expires in 30 days

      // Store the token
      await db.run(
        'INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [result.lastID, token, expiresAt.toISOString()]
      );

      // Return success with token
      return sendSuccessResponse(res, {
        message: 'User registered successfully',
        user: {
          id: result.lastID,
          email,
          username
        },
        token,
        expiresAt: expiresAt.toISOString()
      }, 201);
    }

    // POST /api/auth/login - Login a user
    if (req.method === 'POST' && path === 'login') {
      const body = parseBody(req);

      // User can login with either email or username
      const { identifier, password } = body;

      if (!identifier || !password) {
        return sendErrorResponse(res, 'Username/email and password are required', 400);
      }

      // Check if user exists
      const user = await db.get(
        'SELECT * FROM users WHERE email = ? OR username = ?',
        [identifier, identifier]
      );

      if (!user) {
        return sendErrorResponse(res, 'Invalid credentials', 401);
      }

      // Verify password
      const isValid = verifyPassword(password, user.password_hash, user.salt);
      
      if (!isValid) {
        return sendErrorResponse(res, 'Invalid credentials', 401);
      }

      // Generate auth token
      const token = generateToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // Expires in 30 days

      // Store the token
      await db.run(
        'INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [user.id, token, expiresAt.toISOString()]
      );

      // Return success with token
      return sendSuccessResponse(res, {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        },
        token,
        expiresAt: expiresAt.toISOString()
      });
    }

    // GET /api/auth/user - Get current user info
    if (req.method === 'GET' && path === 'user') {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return sendErrorResponse(res, 'Authentication required', 401);
      }

      // Check if token is valid
      const authToken = await db.get(
        'SELECT * FROM auth_tokens WHERE token = ? AND expires_at > datetime("now")',
        [token]
      );

      if (!authToken) {
        return sendErrorResponse(res, 'Invalid or expired token', 401);
      }

      // Get user info
      const user = await db.get(
        'SELECT id, email, username, created_at FROM users WHERE id = ?',
        [authToken.user_id]
      );

      if (!user) {
        return sendErrorResponse(res, 'User not found', 404);
      }

      // Get user's bookings
      const bookings = await db.all(`
        SELECT 
          b.id,
          b.booking_reference,
          rt.name AS room_name,
          b.check_in_date,
          b.check_out_date,
          b.total_price,
          b.status,
          (SELECT image_url FROM room_images WHERE room_type_id = b.room_type_id ORDER BY display_order ASC LIMIT 1) AS room_image
        FROM bookings b
        JOIN room_types rt ON b.room_type_id = rt.id
        WHERE b.user_id = ?
        ORDER BY b.check_in_date DESC
      `, [user.id]);

      // Get user's spa appointments
      const spaAppointments = await db.all(`
        SELECT 
          a.id,
          a.booking_reference,
          s.name AS service_name,
          a.appointment_date,
          a.appointment_time,
          a.price,
          a.status,
          s.image_url
        FROM spa_appointments a
        JOIN spa_services s ON a.service_id = s.id
        WHERE a.user_id = ?
        ORDER BY a.appointment_date DESC, a.appointment_time
      `, [user.id]);

      return sendSuccessResponse(res, {
        user,
        bookings,
        spaAppointments
      });
    }

    // POST /api/auth/logout - Logout a user
    if (req.method === 'POST' && path === 'logout') {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return sendErrorResponse(res, 'Authentication required', 401);
      }

      // Delete the token
      await db.run('DELETE FROM auth_tokens WHERE token = ?', [token]);

      return sendSuccessResponse(res, {
        message: 'Logout successful'
      });
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
