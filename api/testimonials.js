import { getDb, initDb } from './_utils/db.js';

// Testimonials API handler
const testimonialsHandler = async (req, res) => {
  try {
    // Initialize database in production environment
    if (process.env.NODE_ENV === 'production') {
      await initDb();
    }
    
    // Get database connection
    const db = await getDb();
    
    // Handle different routes based on HTTP method and path
    const path = req.path;
    
    // GET /api/testimonials - Get all approved testimonials
    if (req.method === 'GET' && path === '/api/testimonials') {
      const limit = parseInt(req.query.limit) || 100;
      const featured = req.query.featured || false;
      const category = req.query.category || null;
      
      let query = 'SELECT * FROM testimonials WHERE approved = 1';
      const params = [];
      
      // Filter by featured
      if (featured === 'true' || featured === '1') {
        query += ' AND featured = 1';
      }
      
      // Filter by category
      if (category && category !== 'all') {
        query += ' AND category = ?';
        params.push(category);
      }
      
      // Sort by rating and date
      query += ' ORDER BY rating DESC, created_at DESC LIMIT ?';
      params.push(limit);
      
      const testimonials = await db.all(query, params);
      await db.close();
      return res.json(testimonials);
    }
    
    // GET /api/testimonials/categories - Get all unique categories
    if (req.method === 'GET' && path === '/api/testimonials/categories') {
      const categories = await db.all(
        'SELECT DISTINCT category FROM testimonials WHERE approved = 1 ORDER BY category'
      );
      await db.close();
      return res.json(categories.map(c => c.category));
    }
    
    // POST /api/testimonials - Submit a new testimonial
    if (req.method === 'POST' && path === '/api/testimonials') {
      const { name, email, location, rating, category, text } = req.body;
      
      // Validate required fields
      if (!name || !email || !location || !rating || !category || !text) {
        await db.close();
        return res.status(400).json({ 
          error: 'Missing required fields. Please provide name, email, location, rating, category, and text.' 
        });
      }
      
      // Validate rating
      const ratingNum = parseInt(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        await db.close();
        return res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
      }
      
      // Insert new testimonial with default values for image_url, featured, and approved
      const result = await db.run(
        `INSERT INTO testimonials (name, email, location, rating, category, text) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, location, ratingNum, category, text]
      );
      
      await db.close();
      return res.status(201).json({ 
        id: result.lastID,
        message: 'Testimonial submitted successfully! It will be reviewed before being published.' 
      });
    }
    
    // If no routes match
    await db.close();
    return res.status(404).json({ error: 'Endpoint not found' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default testimonialsHandler;