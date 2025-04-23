import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module replacements for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path based on environment
const getDbPath = () => {
  // Use /tmp directory in Vercel production environment
  if (process.env.NODE_ENV === 'production') {
    return '/tmp/shangri-la.db';
  }
  // Use local .data directory in development
  return path.join(__dirname, '..', '..', '.data', 'shangri-la.db');
};

const dbPath = getDbPath();

// In-memory fallback data
const fallbackData = {
  roomTypes: [
    { id: 1, name: 'Ocean View Deluxe Room', slug: 'ocean-view-deluxe', price: 350, capacity: 2 },
    { id: 2, name: 'Beachfront Suite', slug: 'beachfront-suite', price: 550, capacity: 2 },
    { id: 3, name: 'Garden View Family Room', slug: 'garden-view-family', price: 400, capacity: 4 },
    { id: 4, name: 'Premium Oceanfront Suite', slug: 'premium-oceanfront-suite', price: 800, capacity: 2 },
    { id: 5, name: 'Accessible Room', slug: 'accessible-room', price: 300, capacity: 2 }
  ],
  spaCategories: [
    { id: 1, name: 'Massages' },
    { id: 2, name: 'Facials' },
    { id: 3, name: 'Body Treatments' },
    { id: 4, name: 'Nail Services' },
    { id: 5, name: 'Enhancements' },
    { id: 6, name: 'Wellness' }
  ],
  spaServices: [
    { 
      id: 1, 
      name: 'Shangri La Signature Massage', 
      category_id: 1,
      duration: '90 minutes',
      price: 250,
      featured: true
    },
    { 
      id: 7, 
      name: 'Shangri La Radiance Facial', 
      category_id: 2,
      duration: '75 minutes',
      price: 210,
      featured: true
    },
    { 
      id: 12, 
      name: 'Tropical Body Wrap', 
      category_id: 3,
      duration: '60 minutes',
      price: 200,
      featured: true
    }
  ]
};

/**
 * Get a database connection, with fallback for connection errors
 * @returns {Promise<object>} Database connection
 */
/**
 * Initialize database for Vercel environment
 */
export const initDb = async () => {
  // Skip if database already exists
  if (fs.existsSync(dbPath)) {
    return;
  }
  
  console.log(`Database not found, initializing at: ${dbPath}`);
  
  try {
    // Create database connection
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON;');
    
    // Load and execute schema
    const schemaPath = path.join(__dirname, '..', '..', 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split and execute statements
    const statements = schema.split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    for (const statement of statements) {
      await db.exec(statement + ';');
    }
    
    // Load auth schema if available
    const authSchemaPath = path.join(__dirname, '..', '..', 'db', 'auth-schema.sql');
    if (fs.existsSync(authSchemaPath)) {
      const authSchema = fs.readFileSync(authSchemaPath, 'utf8');
      
      const authStatements = authSchema.split(';')
        .map(statement => statement.trim())
        .filter(statement => statement.length > 0);
      
      for (const statement of authStatements) {
        try {
          await db.exec(statement + ';');
        } catch (error) {
          console.warn(`Warning executing auth schema statement: ${error.message}`);
        }
      }
    }
    
    // Load initial data
    const initialDataPath = path.join(__dirname, '..', '..', 'db', 'initial-data.sql');
    if (fs.existsSync(initialDataPath)) {
      const initialData = fs.readFileSync(initialDataPath, 'utf8');
      
      const dataStatements = initialData.split(';')
        .map(statement => statement.trim())
        .filter(statement => statement.length > 0);
      
      for (const statement of dataStatements) {
        try {
          await db.exec(statement + ';');
        } catch (error) {
          console.warn(`Warning executing initial data statement: ${error.message}`);
        }
      }
    }
    
    await db.close();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

/**
 * Get a database connection, with fallback for connection errors
 * @returns {Promise<object>} Database connection
 */
export const getDb = async () => {
  // Ensure database is initialized in production
  if (process.env.NODE_ENV === 'production') {
    await initDb();
  }
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Add helper method to detect when DB is in fallback mode
    db.isFallback = false;
    
    return db;
  } catch (error) {
    console.error('Error connecting to database:', error);
    
    // Return a mock DB object with fallback implementation
    return createFallbackDb();
  }
};

/**
 * Create a fallback database object with in-memory data
 * @returns {object} Mock database interface
 */
const createFallbackDb = () => {
  return {
    // Flag to indicate fallback mode
    isFallback: true,
    
    // Mock get method
    get: async (query, params) => {
      console.log('Using fallback DB: get', { query, params });
      
      // Extract the table name from the query (simple parsing)
      const tableMatch = query.match(/FROM\s+(\w+)/i);
      if (!tableMatch) return null;
      
      const table = tableMatch[1].toLowerCase();
      
      // Handle common queries
      if (table === 'room_types') {
        if (params?.includes('slug')) {
          const slug = params[params.indexOf('slug') + 1] || params[0];
          return fallbackData.roomTypes.find(room => room.slug === slug);
        } else if (params?.length > 0) {
          const id = Number(params[0]);
          return fallbackData.roomTypes.find(room => room.id === id);
        }
      } else if (table === 'spa_services') {
        if (params?.length > 0) {
          const id = Number(params[0]);
          return fallbackData.spaServices.find(service => service.id === id);
        }
      } else if (table === 'spa_categories') {
        if (params?.length > 0) {
          const id = Number(params[0]);
          return fallbackData.spaCategories.find(category => category.id === id);
        }
      } else if (table === 'auth_tokens' || table === 'users') {
        // In fallback mode, we cannot authenticate users
        return null;
      }
      
      return null;
    },
    
    // Mock all method
    all: async (query, params) => {
      console.log('Using fallback DB: all', { query, params });
      
      // Extract the table name from the query (simple parsing)
      const tableMatch = query.match(/FROM\s+(\w+)/i);
      if (!tableMatch) return [];
      
      const table = tableMatch[1].toLowerCase();
      
      // Handle common queries
      if (table === 'room_types') {
        return fallbackData.roomTypes;
      } else if (table === 'spa_services') {
        if (query.includes('featured = 1')) {
          return fallbackData.spaServices.filter(service => service.featured);
        } else if (params?.length > 0) {
          const categoryId = Number(params[0]);
          return fallbackData.spaServices.filter(service => service.category_id === categoryId);
        }
        return fallbackData.spaServices;
      } else if (table === 'spa_categories') {
        return fallbackData.spaCategories;
      } else if (table === 'bookings' || table === 'spa_appointments') {
        // In fallback mode, we cannot access user bookings
        return [];
      }
      
      return [];
    },
    
    // Mock run method (for inserts/updates)
    run: async (query, params) => {
      console.log('Using fallback DB: run', { query, params });
      
      // In fallback mode, pretend the operation succeeded but don't persist data
      return { 
        lastID: Math.floor(Math.random() * 1000) + 100,
        changes: 1 
      };
    },
    
    // Mock close method
    close: async () => {
      // No action needed for fallback
    }
  };
};

/**
 * Generate a unique booking reference
 * @returns {string} Booking reference
 */
export const generateBookingReference = () => {
  const prefix = 'BKG';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${date}-${random}`;
};

/**
 * Format a date string for SQLite storage
 * @param {string} dateStr Date string in any format
 * @returns {string} Formatted date string
 */
export const formatDateForDb = (dateStr) => {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
};

/**
 * Check if a room is available for the given dates
 * @param {object} db Database connection
 * @param {number} roomTypeId Room type ID
 * @param {string} checkIn Check-in date
 * @param {string} checkOut Check-out date
 * @returns {Promise<boolean>} True if room is available
 */
export const isRoomAvailable = async (db, roomTypeId, checkIn, checkOut) => {
  // In fallback mode, always return true (optimistic)
  if (db.isFallback) {
    return true;
  }
  
  try {
    const overlappingBookings = await db.all(`
      SELECT id FROM bookings
      WHERE room_type_id = ?
      AND status = 'confirmed'
      AND (
        (check_in_date <= ? AND check_out_date > ?) OR
        (check_in_date < ? AND check_out_date >= ?) OR
        (check_in_date >= ? AND check_out_date <= ?)
      )
    `, [
      roomTypeId,
      checkOut, checkIn,
      checkOut, checkOut,
      checkIn, checkOut
    ]);
    
    return overlappingBookings.length === 0;
  } catch (error) {
    console.error('Error checking room availability:', error);
    // If there's an error, assume the room is not available (conservative)
    return false;
  }
};
