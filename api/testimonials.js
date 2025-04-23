import { selectData } from '../lib/supabase.js';
import { createClient } from '@supabase/supabase-js';

// Testimonials API handler
const testimonialsHandler = async (req, res) => {
  try {
    // Handle different routes based on HTTP method and path
    const path = req.path;
    
    // GET /api/testimonials - Get all approved testimonials
    if (req.method === 'GET' && path === '/api/testimonials') {
      const limit = parseInt(req.query.limit) || 100;
      const featured = req.query.featured === 'true' || req.query.featured === '1';
      const category = req.query.category || null;
      
      // Build filters for Supabase query
      const filters = {
        // Filter for approved testimonials
        approved_at: { operator: 'not.is', value: null }
      };
      
      // Filter by featured if requested
      if (featured) {
        filters.is_featured = true;
      }
      
      // Filter by category if provided
      if (category && category !== 'all') {
        // If using category ID in your system
        if (!isNaN(parseInt(category))) {
          filters.category_id = parseInt(category);
        } else {
          // You might need to join with the categories table if storing by name
          // For now, we'll assume category_id is what's needed
        }
      }
      
      // Query testimonials from Supabase
      const testimonials = await selectData('testimonials', {
        select: `
          id,
          guest_name,
          guest_location,
          rating,
          comment,
          is_featured,
          created_at,
          testimonial_categories (
            id,
            name
          )
        `,
        filters,
        orderBy: 'rating',
        ascending: false,
        limit
      });
      
      // Format the testimonials to match your current API structure
      const formattedTestimonials = testimonials.map(t => ({
        id: t.id,
        name: t.guest_name,
        location: t.guest_location,
        rating: t.rating,
        category: t.testimonial_categories?.[0]?.name || 'General',
        text: t.comment,
        featured: t.is_featured || false,
        created_at: t.created_at
      }));
      
      return res.json(formattedTestimonials);
    }
    
    // GET /api/testimonials/categories - Get all unique categories
    if (req.method === 'GET' && path === '/api/testimonials/categories') {
      const categories = await selectData('testimonial_categories', {
        select: 'id, name',
        orderBy: 'name'
      });
      
      return res.json(categories.map(c => c.name));
    }
    
    // POST /api/testimonials - Submit a new testimonial
    if (req.method === 'POST' && path === '/api/testimonials') {
      const { name, email, location, rating, category, text } = req.body;
      
      // Validate required fields
      if (!name || !rating || !text) {
        return res.status(400).json({ 
          error: 'Missing required fields. Please provide at least name, rating, and text.' 
        });
      }
      
      // Validate rating
      const ratingNum = parseInt(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
      }
      
      // For category, we would ideally look up the category_id
      // But for simplicity, we'll use a default category_id of 1 for now
      // In a real implementation, you'd look up or create the category
      
      // For category, lookup the category_id if category was provided
      let categoryId = 1; // Default to 1 if no category is found
      if (category) {
        try {
          const categories = await selectData('testimonial_categories', {
            select: 'id',
            filters: { name: category }
          });
          
          if (categories && categories.length > 0) {
            categoryId = categories[0].id;
          }
        } catch (catError) {
          console.warn('Error finding category:', catError);
        }
      }
      
      // Insert new testimonial with admin privileges to bypass RLS
      const testimonialData = {
        guest_name: name,
        guest_email: email || null,
        guest_location: location || null,
        rating: ratingNum,
        category_id: categoryId,
        comment: text,
        is_featured: false, // Default to not featured
        created_at: new Date().toISOString()
        // approved_at will be null by default which means not approved
      };
      
      // Create a direct Supabase client
      // If we're on the server, we might be able to use a service role key if available
      const supabaseUrl = process.env.SUPABASE_URL || 'https://cdpoutqhdduzprdobfqt.supabase.co';
      // Try to use service role key if available, otherwise fall back to anon key
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkcG91dHFoZGR1enByZG9iZnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzOTE2NjQsImV4cCI6MjA2MDk2NzY2NH0.ZwDNnQNqQgfm5LOTA6_81g44gqIFRLikPRW_wh87eRI';
      
      // Create Supabase client for direct access
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      try {
        console.log('API inserting testimonial with direct client');
        const { data: insertResult, error: insertError } = await supabase
          .from('testimonials')
          .insert(testimonialData)
          .select();
        
        if (insertError) {
          console.error('API direct insertion error:', insertError);
          return res.status(500).json({ 
            error: 'Failed to submit testimonial', 
            details: insertError.message,
            code: insertError.code
          });
        }
        
        return res.status(201).json({ 
          id: insertResult[0]?.id,
          message: 'Testimonial submitted successfully! It will be reviewed before being published.' 
        });
      } catch (insertError) {
        console.error('API exception during insertion:', insertError);
        return res.status(500).json({ 
          error: 'Exception during testimonial submission', 
          details: insertError.message 
        });
      }
      

    }
    
    // If no routes match
    return res.status(404).json({ error: 'Endpoint not found' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', detail: error.message });
  }
};

export default testimonialsHandler;