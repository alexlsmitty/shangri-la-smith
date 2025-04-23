import { signUp, signIn, signOut, getCurrentUser, selectData } from '../lib/supabase.js';

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
  try {
    const path = req.url.split('/')[3]; // Get the third segment of the URL path

    // POST /api/auth/register - Create a new user
    if (req.method === 'POST' && path === 'register') {
      const body = req.body;

      // Validate required fields
      const requiredFields = ['email', 'password'];
      const missingFields = requiredFields.filter(field => !body[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      const { email, password } = body;
      const fullName = body.fullName || body.username || email.split('@')[0];

      // User metadata
      const userData = {
        full_name: fullName,
        username: body.username || email.split('@')[0]
      };

      try {
        // Register user with Supabase Auth
        const authData = await signUp(email, password, userData);
        
        if (!authData) {
          return res.status(500).json({
            success: false,
            error: 'Failed to register user'
          });
        }

        return res.status(201).json({
          success: true,
          data: {
            message: 'User registered successfully. Check your email for verification.',
            user: {
              id: authData.user.id,
              email: authData.user.email,
              username: userData.username
            }
          }
        });
      } catch (error) {
        // Handle specific registration errors
        if (error.message?.includes('already registered')) {
          return res.status(409).json({
            success: false,
            error: 'Email is already registered'
          });
        }
        
        throw error;
      }
    }

    // POST /api/auth/login - Login a user
    if (req.method === 'POST' && path === 'login') {
      const body = req.body;

      const { email, password } = body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      try {
        // Login user with Supabase Auth
        const authData = await signIn(email, password);
        
        if (!authData || !authData.user) {
          return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
          });
        }

        return res.status(200).json({
          success: true,
          data: {
            message: 'Login successful',
            user: {
              id: authData.user.id,
              email: authData.user.email,
              username: authData.user.user_metadata?.username || email.split('@')[0]
            },
            session: {
              expires_at: new Date(authData.session.expires_at * 1000).toISOString()
            }
          }
        });
      } catch (error) {
        // Handle specific login errors
        if (error.message?.includes('Invalid login credentials')) {
          return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
          });
        }
        
        throw error;
      }
    }

    // GET /api/auth/user - Get current user info
    if (req.method === 'GET' && path === 'user') {
      // Get user from Supabase Auth
      const user = await getCurrentUser();
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Get user's bookings from Supabase
      const bookings = await selectData('bookings', {
        select: `
          id,
          reference,
          check_in_date,
          check_out_date,
          total_price,
          status,
          room_types (
            id,
            name
          ),
          room_images (
            image_url
          )
        `,
        filters: { user_id: user.id },
        orderBy: 'check_in_date',
        ascending: false
      });

      // Format bookings for response
      const formattedBookings = bookings.map(booking => ({
        id: booking.id,
        booking_reference: booking.reference,
        room_name: booking.room_types?.name || 'Unknown Room',
        check_in_date: booking.check_in_date,
        check_out_date: booking.check_out_date,
        total_price: booking.total_price,
        status: booking.status,
        room_image: booking.room_images?.[0]?.image_url || null
      }));

      // Get user's spa appointments from Supabase
      const spaAppointments = await selectData('spa_appointments', {
        select: `
          id,
          reference,
          appointment_date,
          appointment_time,
          status,
          spa_services (
            id,
            name,
            price
          )
        `,
        filters: { user_id: user.id },
        orderBy: 'appointment_date',
        ascending: false
      });

      // Format spa appointments for response
      const formattedSpaAppointments = spaAppointments.map(appointment => ({
        id: appointment.id,
        booking_reference: appointment.reference,
        service_name: appointment.spa_services?.name || 'Unknown Service',
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time,
        price: appointment.spa_services?.price || 0,
        status: appointment.status,
        image_url: null // Supabase doesn't store images in the service entity
      }));

      // Format user data
      const userData = {
        id: user.id,
        email: user.email,
        username: user.user_metadata?.username || user.email.split('@')[0],
        created_at: user.created_at
      };

      return res.status(200).json({
        success: true,
        data: {
          user: userData,
          bookings: formattedBookings,
          spaAppointments: formattedSpaAppointments
        }
      });
    }

    // POST /api/auth/logout - Logout a user
    if (req.method === 'POST' && path === 'logout') {
      try {
        // Sign out user from Supabase Auth
        await signOut();
        
        return res.status(200).json({
          success: true,
          data: {
            message: 'Logout successful'
          }
        });
      } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to logout'
        });
      }
    }

    // Method not allowed or route not found
    return res.status(404).json({
      success: false,
      error: 'Route not found'
    });
  } catch (error) {
    console.error('Error in auth handler:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
