import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// ES module replacements for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if we're running in production (Vercel)
const isProduction = process.env.NODE_ENV === 'production';

// Ensure .data directory exists for SQLite database
const dataDir = path.join(__dirname, '.data');
if (!fs.existsSync(dataDir)) {
  console.log(`Creating data directory: ${dataDir}`);
  fs.mkdirSync(dataDir, { recursive: true });
}

// Import API handlers
import roomsHandler from './api/rooms.js';
import roomHandler from './api/room.js';
import availabilityHandler from './api/availability.js';
import bookingsHandler from './api/bookings.js';
import bookingHandler from './api/booking.js';
import spaHandler from './api/spa.js';
import testimonialsHandler from './api/testimonials.js';
import authHandler from './api/auth.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Make API handlers available
const apiHandlers = {
  rooms: roomsHandler,
  room: roomHandler,
  availability: availabilityHandler,
  bookings: bookingsHandler,
  booking: bookingHandler,
  spa: spaHandler,
  testimonials: testimonialsHandler,
  auth: authHandler
};

// Error handling middleware
app.use((err, req, res, _) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    fallback: true
  });
});

// Serve static files from dist
app.use(express.static('dist'));

// API Routes
app.get('/api/rooms', (req, res) => apiHandlers.rooms(req, res));
app.get('/api/room', (req, res) => apiHandlers.room(req, res));
app.get('/api/availability', (req, res) => apiHandlers.availability(req, res));
app.get('/api/bookings', (req, res) => apiHandlers.bookings(req, res));
app.get('/api/bookings/my-bookings', (req, res) => apiHandlers.bookings(req, res));
app.post('/api/bookings', (req, res) => apiHandlers.bookings(req, res));
app.get('/api/booking', (req, res) => apiHandlers.booking(req, res));
app.put('/api/booking', (req, res) => apiHandlers.booking(req, res));

// Spa API Routes
app.get('/api/spa/categories', (req, res) => apiHandlers.spa(req, res));
app.get('/api/spa/services', (req, res) => apiHandlers.spa(req, res));
app.get('/api/spa/services/featured', (req, res) => apiHandlers.spa(req, res));
app.get('/api/spa/services/category/:categoryId', (req, res) => apiHandlers.spa(req, res));
app.get('/api/spa/services/:serviceId', (req, res) => apiHandlers.spa(req, res));
app.get('/api/spa/appointment/:reference', (req, res) => apiHandlers.spa(req, res));
app.get('/api/spa/appointments/available', (req, res) => apiHandlers.spa(req, res));
app.get('/api/spa/appointments/my-appointments', (req, res) => apiHandlers.spa(req, res));
app.get('/api/spa/appointments/user/:email', (req, res) => apiHandlers.spa(req, res));
app.post('/api/spa/appointments', (req, res) => apiHandlers.spa(req, res));
app.put('/api/spa/appointments/:bookingReference/cancel', (req, res) => apiHandlers.spa(req, res));

// Testimonials API Routes
app.get('/api/testimonials', (req, res) => apiHandlers.testimonials(req, res));
app.get('/api/testimonials/categories', (req, res) => apiHandlers.testimonials(req, res));
app.post('/api/testimonials', (req, res) => apiHandlers.testimonials(req, res));

// Authentication API Routes
app.post('/api/auth/register', (req, res) => apiHandlers.auth(req, res));
app.post('/api/auth/login', (req, res) => apiHandlers.auth(req, res));
app.get('/api/auth/user', (req, res) => apiHandlers.auth(req, res));
app.post('/api/auth/logout', (req, res) => apiHandlers.auth(req, res));

// Catch-all route to serve the SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Only start the server if not running in Vercel
if (!isProduction) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Rooms API available at http://localhost:${port}/api/rooms`);
    console.log(`Spa API available at http://localhost:${port}/api/spa/services`);
    console.log(`Testimonials API available at http://localhost:${port}/api/testimonials`);
    console.log(`Frontend available at http://localhost:${port}`);
  });
} else {
  console.log('Running in Vercel environment');
}

// Export the Express API for Vercel
export default app;
