import { getDb, initDb, generateBookingReference } from './_utils/db.js';
import { getUserFromToken } from './_utils/middleware.js';

// Get all spa categories
export const getCategories = async (req, res) => {
  try {
    // Initialize database in production environment
    if (process.env.NODE_ENV === 'production') {
      await initDb();
    }
    
    const db = await getDb();
    const categories = await db.all('SELECT * FROM spa_categories ORDER BY name');
    await db.close();
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching spa categories:', error);
    res.status(500).json({ error: 'Failed to fetch spa categories' });
  }
};

// Get all spa services
export const getAllServices = async (req, res) => {
  try {
    // Initialize database in production environment
    if (process.env.NODE_ENV === 'production') {
      await initDb();
    }
    
    const db = await getDb();
    const services = await db.all(`
      SELECT s.*, c.name as category_name
      FROM spa_services s
      JOIN spa_categories c ON s.category_id = c.id
      ORDER BY s.category_id, s.name
    `);
    await db.close();
    
    res.json(services);
  } catch (error) {
    console.error('Error fetching spa services:', error);
    res.status(500).json({ error: 'Failed to fetch spa services' });
  }
};

// Get spa services by category
export const getServicesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  
  try {
    // Initialize database in production environment
    if (process.env.NODE_ENV === 'production') {
      await initDb();
    }
    
    const db = await getDb();
    const services = await db.all(`
      SELECT s.*, c.name as category_name
      FROM spa_services s
      JOIN spa_categories c ON s.category_id = c.id
      WHERE s.category_id = ?
      ORDER BY s.name
    `, categoryId);
    await db.close();
    
    res.json(services);
  } catch (error) {
    console.error('Error fetching spa services by category:', error);
    res.status(500).json({ error: 'Failed to fetch spa services by category' });
  }
};

// Get a specific spa service
export const getServiceById = async (req, res) => {
  const { serviceId } = req.params;
  
  try {
    // Initialize database in production environment
    if (process.env.NODE_ENV === 'production') {
      await initDb();
    }
    
    const db = await getDb();
    const service = await db.get(`
      SELECT s.*, c.name as category_name
      FROM spa_services s
      JOIN spa_categories c ON s.category_id = c.id
      WHERE s.id = ?
    `, serviceId);
    
    if (!service) {
      await db.close();
      return res.status(404).json({ error: 'Service not found' });
    }
    
    await db.close();
    res.json(service);
  } catch (error) {
    console.error('Error fetching spa service:', error);
    res.status(500).json({ error: 'Failed to fetch spa service' });
  }
};

// Get featured spa services
export const getFeaturedServices = async (req, res) => {
  try {
    // Initialize database in production environment
    if (process.env.NODE_ENV === 'production') {
      await initDb();
    }
    
    const db = await getDb();
    const services = await db.all(`
      SELECT s.*, c.name as category_name
      FROM spa_services s
      JOIN spa_categories c ON s.category_id = c.id
      WHERE s.featured = 1
      ORDER BY s.category_id, s.name
    `);
    await db.close();
    
    res.json(services);
  } catch (error) {
    console.error('Error fetching featured spa services:', error);
    res.status(500).json({ error: 'Failed to fetch featured spa services' });
  }
};

// Get a specific appointment by reference
export const getAppointmentByReference = async (req, res) => {
  const { reference } = req.params;
  
  try {
    // Initialize database in production environment
    if (process.env.NODE_ENV === 'production') {
      await initDb();
    }
    
    const db = await getDb();
    // Get appointment details
    const appointment = await db.get(`
      SELECT a.*, s.name as service_name, s.duration, s.image_url, c.name as category_name
      FROM spa_appointments a
      JOIN spa_services s ON a.service_id = s.id
      JOIN spa_categories c ON s.category_id = c.id
      WHERE a.booking_reference = ?
    `, reference);
    
    if (!appointment) {
      await db.close();
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Check if user is authenticated and has permission to view this appointment
    if (req.headers.authorization) {
      const user = await getUserFromToken(req, db);
      
      if (user) {
        // If appointment has user_id but doesn't match the authenticated user
        if (appointment.user_id && appointment.user_id !== user.id) {
          await db.close();
          return res.status(403).json({ error: 'You do not have permission to view this appointment' });
        }
      }
    }
    
    await db.close();
    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment details:', error);
    res.status(500).json({ error: 'Failed to fetch appointment details' });
  }
};

// Book a new spa appointment
export const bookAppointment = async (req, res) => {
  const { 
    serviceId,
    appointmentDate,
    appointmentTime,
    guestName,
    guestEmail,
    guestPhone,
    specialRequests,
    username,
    password
  } = req.body;
  
  try {
    // Initialize database in production environment
    if (process.env.NODE_ENV === 'production') {
      await initDb();
    }
    
    const db = await getDb();
    // Check if the service exists and get its price
    const service = await db.get('SELECT * FROM spa_services WHERE id = ?', serviceId);
    if (!service) {
      await db.close();
      return res.status(404).json({ error: 'Service not found' });
    }

    // Check if the time slot is available
    const existingAppointment = await db.get(`
      SELECT * FROM spa_appointments 
      WHERE appointment_date = ? 
      AND appointment_time = ? 
      AND status = 'confirmed'
    `, [appointmentDate, appointmentTime]);

    if (existingAppointment) {
      await db.close();
      return res.status(409).json({ error: 'This time slot is already booked' });
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
    if (!userId && username && password) {
      // Check if email already exists in users table
      const existingUser = await db.get(
        'SELECT id FROM users WHERE email = ? OR username = ?',
        [guestEmail, username]
      );

      if (existingUser) {
        await db.close();
        return res.status(409).json({ error: 'Email or username already registered. Please login first.' });
      }

      // Create a new user
      const crypto = await import('crypto');
      
      // Generate salt and hash for password
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
      
      // Insert the new user
      const userResult = await db.run(
        'INSERT INTO users (email, username, password_hash, salt) VALUES (?, ?, ?, ?)',
        [guestEmail, username, hash, salt]
      );
      
      userId = userResult.lastID;
    }

    // Generate a booking reference
    const bookingReference = generateBookingReference();

    // Insert the appointment
    const result = await db.run(`
      INSERT INTO spa_appointments (
        booking_reference, service_id, appointment_date, appointment_time,
        guest_name, guest_email, guest_phone, special_requests, price, status, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?)
    `, [
      bookingReference, serviceId, appointmentDate, appointmentTime,
      guestName, guestEmail, guestPhone, specialRequests, service.price, userId
    ]);

    // Get the created appointment
    const appointment = await db.get(`
      SELECT a.*, s.name as service_name, s.duration
      FROM spa_appointments a
      JOIN spa_services s ON a.service_id = s.id
      WHERE a.id = ?
    `, result.lastID);

    await db.close();
    
    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Error booking spa appointment:', error);
    res.status(500).json({ error: 'Failed to book spa appointment' });
  }
};

// Get available time slots for a date and service
export const getAvailableTimeSlots = async (req, res) => {
  const { date, serviceId } = req.query;
  
  try {
    // Initialize database in production environment
    if (process.env.NODE_ENV === 'production') {
      await initDb();
    }
    
    const db = await getDb();
    // Get service details to determine duration
    const service = await db.get('SELECT * FROM spa_services WHERE id = ?', serviceId);
    if (!service) {
      await db.close();
      return res.status(404).json({ error: 'Service not found' });
    }

    // Get all booked appointments for the date
    const bookedSlots = await db.all(`
      SELECT appointment_time 
      FROM spa_appointments 
      WHERE appointment_date = ? 
      AND status = 'confirmed'
    `, date);
    
    const bookedTimes = bookedSlots.map(slot => slot.appointment_time);
    
    // Define available time slots (spa operating hours)
    const allTimeSlots = [
      '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
    ];
    
    // Filter out booked slots
    const availableSlots = allTimeSlots.filter(time => !bookedTimes.includes(time));
    
    await db.close();
    
    res.json({
      date,
      serviceId,
      serviceName: service.name,
      serviceDuration: service.duration,
      availableSlots
    });
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    res.status(500).json({ error: 'Failed to fetch available time slots' });
  }
};

// Get appointments for a specific user
export const getUserAppointments = async (req, res) => {
  const { email } = req.params;
  
  try {
    // Initialize database in production environment
    if (process.env.NODE_ENV === 'production') {
      await initDb();
    }
    
    const db = await getDb();
    const appointments = await db.all(`
      SELECT a.*, s.name as service_name, s.duration, s.image_url, c.name as category_name
      FROM spa_appointments a
      JOIN spa_services s ON a.service_id = s.id
      JOIN spa_categories c ON s.category_id = c.id
      WHERE a.guest_email = ?
      ORDER BY a.appointment_date DESC, a.appointment_time
    `, email);
    
    await db.close();
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({ error: 'Failed to fetch user appointments' });
  }
};

// Get authenticated user's appointments
export const getMyAppointments = async (req, res) => {
  try {
    // Initialize database in production environment
    if (process.env.NODE_ENV === 'production') {
      await initDb();
    }
    
    const db = await getDb();
    // Get user from auth token
    const user = await getUserFromToken(req, db);
      
    if (!user) {
      await db.close();
      return res.status(401).json({ error: 'Authentication required' });
    }

    const appointments = await db.all(`
      SELECT a.*, s.name as service_name, s.duration, s.image_url, c.name as category_name
      FROM spa_appointments a
      JOIN spa_services s ON a.service_id = s.id
      JOIN spa_categories c ON s.category_id = c.id
      WHERE a.user_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time
    `, user.id);
    
    await db.close();
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({ error: 'Failed to fetch user appointments' });
  }
};

// Cancel an appointment
export const cancelAppointment = async (req, res) => {
  const { bookingReference } = req.params;
  
  try {
    // Initialize database in production environment
    if (process.env.NODE_ENV === 'production') {
      await initDb();
    }
    
    const db = await getDb();
    // Check if appointment exists
    const appointment = await db.get(
      'SELECT * FROM spa_appointments WHERE booking_reference = ?',
      bookingReference
    );
    
    if (!appointment) {
      await db.close();
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Check if appointment is already cancelled
    if (appointment.status === 'cancelled') {
      await db.close();
      return res.status(400).json({ error: 'Appointment is already cancelled' });
    }

    // If user is authenticated, verify ownership
    if (req.headers.authorization) {
      const user = await getUserFromToken(req, db);
      
      if (user && appointment.user_id && appointment.user_id !== user.id) {
        await db.close();
        return res.status(403).json({ error: 'You do not have permission to cancel this appointment' });
      }
    }
    
    // Cancel the appointment
    await db.run(`
      UPDATE spa_appointments 
      SET status = 'cancelled', cancelled_date = CURRENT_TIMESTAMP 
      WHERE booking_reference = ?
    `, bookingReference);
    
    await db.close();
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
};

// Main handler for spa routes
export default async (req, res) => {
  // Initialize database in production environment
  if (process.env.NODE_ENV === 'production') {
    await initDb();
  }
  
  const { method, url } = req;
  const urlParts = url.split('?')[0].split('/');
  const path = urlParts[3]; // Get the third segment of the URL path
  
  try {
    if (method === 'GET') {
      // GET /api/spa/categories
      if (path === 'categories') {
        return getCategories(req, res);
      }
      // GET /api/spa/services
      else if (path === 'services' && urlParts.length === 4) {
        return getAllServices(req, res);
      }
      // GET /api/spa/services/featured
      else if (path === 'services' && urlParts[4] === 'featured') {
        return getFeaturedServices(req, res);
      }
      // GET /api/spa/services/category/:categoryId
      else if (path === 'services' && urlParts[4] === 'category') {
        req.params = { categoryId: urlParts[5] };
        return getServicesByCategory(req, res);
      }
      // GET /api/spa/services/:serviceId
      else if (path === 'services' && urlParts.length === 5) {
        req.params = { serviceId: urlParts[4] };
        return getServiceById(req, res);
      }
      // GET /api/spa/appointment/:reference
      else if (path === 'appointment' && urlParts.length === 5) {
        req.params = { reference: urlParts[4] };
        return getAppointmentByReference(req, res);
      }
      // GET /api/spa/appointments/available
      else if (path === 'appointments' && urlParts[4] === 'available') {
        const queryParams = new URLSearchParams(url.split('?')[1]);
        req.query = {
          date: queryParams.get('date'),
          serviceId: queryParams.get('serviceId')
        };
        return getAvailableTimeSlots(req, res);
      }
      // GET /api/spa/appointments/my-appointments
      else if (path === 'appointments' && urlParts[4] === 'my-appointments') {
        return getMyAppointments(req, res);
      }
      // GET /api/spa/appointments/user/:email
      else if (path === 'appointments' && urlParts[4] === 'user') {
        req.params = { email: urlParts[5] };
        return getUserAppointments(req, res);
      }
    } 
    else if (method === 'POST') {
      // Parse request body for POST requests
      const body = await new Promise((resolve) => {
        let data = '';
        req.on('data', (chunk) => {
          data += chunk;
        });
        req.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve({});
          }
        });
      });
      
      req.body = body;
      
      // POST /api/spa/appointments
      if (path === 'appointments' && urlParts.length === 4) {
        return bookAppointment(req, res);
      }
    } 
    else if (method === 'PUT' || method === 'DELETE') {
      // PUT /api/spa/appointments/:bookingReference/cancel
      if (path === 'appointments' && urlParts.length === 6 && urlParts[5] === 'cancel') {
        req.params = { bookingReference: urlParts[4] };
        return cancelAppointment(req, res);
      }
    }
    
    // Route not found
    res.status(404).json({ error: 'Route not found' });
  } catch (error) {
    console.error('Error in spa API handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};