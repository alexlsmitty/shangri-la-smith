import crypto from 'crypto';

/**
 * Sets CORS headers for API responses
 * @param {object} req - Request object
 * @param {object} res - Response object
 */
export const setCorsHeaders = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  
  return false;
};

/**
 * Handles API errors gracefully
 * @param {object} res - Response object
 * @param {Error} error - Error object
 * @returns {object} Response with error message
 */
export const handleError = (res, error) => {
  console.error('API Error:', error);
  
  // Return a user-friendly error response
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  
  return res.status(statusCode).json({
    success: false,
    error: message,
    fallback: true
  });
};

/**
 * Parse request body JSON
 * @param {object} req - Request object
 * @returns {object} Parsed body
 */
export const parseBody = (req) => {
  try {
    return JSON.parse(req.body);
  } catch (_) {
    return {};
  }
};

/**
 * Validate required fields in request body
 * @param {object} body - Request body
 * @param {string[]} fields - Required field names
 * @returns {object} Validation result
 */
export const validateRequiredFields = (body, fields) => {
  const missingFields = fields.filter(field => {
    return body[field] === undefined || body[field] === null || body[field] === '';
  });
  
  return {
    valid: missingFields.length === 0,
    message: missingFields.length > 0 
      ? `Missing required fields: ${missingFields.join(', ')}` 
      : ''
  };
};

/**
 * Send a success response
 * @param {object} res - Response object
 * @param {*} data - Response data
 * @param {number} statusCode - HTTP status code
 * @returns {object} Success response
 */
export const sendSuccessResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    fallback: false
  });
};

/**
 * Send a fallback success response (when using mock data)
 * @param {object} res - Response object
 * @param {*} data - Response data
 * @param {number} statusCode - HTTP status code
 * @returns {object} Success response with fallback flag
 */
export const sendFallbackResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    fallback: true
  });
};

/**
 * Send an error response
 * @param {object} res - Response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {object} Error response
 */
export const sendErrorResponse = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error: message
  });
};

/**
 * Get user from authorization token
 * @param {object} req - Request object
 * @param {object} db - Database connection
 * @returns {Promise<object|null>} User object or null
 */
export const getUserFromToken = async (req, db) => {
  try {
    // Check if token exists in Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
      return null;
    }
    
    // In fallback mode, we cannot authenticate users
    if (db.isFallback) {
      return null;
    }
    
    // Get token from database
    const authToken = await db.get(
      'SELECT * FROM auth_tokens WHERE token = ? AND expires_at > datetime("now")',
      [token]
    );
    
    if (!authToken) {
      return null;
    }
    
    // Get user from database
    const user = await db.get(
      'SELECT id, email, username, created_at FROM users WHERE id = ?',
      [authToken.user_id]
    );
    
    return user || null;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
};

/**
 * Generate secure encryption keys
 * Used for tokens and password resets
 * @returns {string} Random hex string
 */
export const generateSecureToken = () => {
  return crypto.randomBytes(32).toString('hex');
};
