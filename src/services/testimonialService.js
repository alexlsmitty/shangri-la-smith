// eslint-disable-next-line no-unused-vars
import { selectData, insertData } from '@/lib/supabase';

/**
 * Testimonials service to interact with the Supabase testimonials database
 */
const testimonialService = {
  /**
   * Get all testimonials with optional filtering
   * @param {Object} options - Filter options
   * @param {number} options.limit - Maximum number of testimonials to retrieve
   * @param {boolean} options.featured - Filter by featured testimonials only
   * @param {string} options.category - Filter by category
   * @returns {Promise<Array>} - Array of testimonials
   */
  async getTestimonials(options = {}) {
    try {
      const { limit = 100, featured = false, category = 'all' } = options;
      
      // Create filters object for the query
      const filters = {};
      
      // Filter by approved status - only get approved testimonials
      filters.approved_at = { gt: '1970-01-01' }; // Only get approved testimonials
      
      // Filter by featured if requested
      if (featured) {
        filters.is_featured = true;
      }
      
      // Set up the query - avoid using nested select for related data
      let query = {
        select: '*',
        filters,
        orderBy: 'created_at',
        ascending: false,
        limit
      };
      
      // If category is specified and not 'all', filter by category ID
      if (category !== 'all') {
        // First, get the category ID from the name
        try {
          const categories = await this.getCategories();
          const categoryObj = categories.find(cat => cat.name === category);
          if (categoryObj) {
            filters.category_id = categoryObj.id;
          }
        } catch (error) {
          console.warn('Error fetching categories for filtering:', error);
        }
      }
      
      // Execute the query
      const data = await selectData('testimonials', query);
      
      // Transform data to match component expectations
      // Get categories separately to avoid relying on foreign key relationship
      let categoryMap = {};
      try {
        const categories = await this.getCategories();
        categories.forEach(cat => {
          categoryMap[cat.id] = cat.name;
        });
      } catch (catErr) {
        console.warn('Could not load categories, using default categories', catErr);
      }
      
      return data.map(item => ({
        id: item.id,
        name: item.guest_name,
        location: item.guest_location,
        rating: item.rating,
        text: item.comment,
        category: item.category_id && categoryMap[item.category_id] ? categoryMap[item.category_id] : 'General',
        featured: item.is_featured || false,
        created_at: item.created_at,
        approved_at: item.approved_at
      }));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Return empty array instead of throwing to avoid crashing the app
      return [];
    }
  },

  /**
   * Get all testimonial categories
   * @returns {Promise<Array>} - Array of category objects
   */
  async getCategories() {
    try {
      const data = await selectData('testimonial_categories', {
        select: '*',
        orderBy: 'name'
      });
      
      return data;
    } catch (error) {
      console.error('Error fetching testimonial categories:', error);
      return []; // Return empty array instead of throwing
    }
  },
  
  /**
   * Get category names only
   * @returns {Promise<Array>} - Array of category names
   */
  async getCategoryNames() {
    try {
      const categories = await this.getCategories();
      return categories.map(cat => cat.name);
    } catch (error) {
      console.error('Error fetching category names:', error);
      return []; // Return empty array instead of throwing
    }
  },

  /**
   * Submit a new testimonial
   * @param {Object} testimonial - The testimonial data
   * @param {string} testimonial.name - Guest name
   * @param {string} testimonial.location - Guest location (City, Country)
   * @param {number} testimonial.rating - Rating (1-5)
   * @param {string} testimonial.category - Experience category
   * @param {string} testimonial.text - Testimonial text
   * @returns {Promise<Object>} - Submission result
   */
  async submitTestimonial(testimonial) {
    try {
      // First, get the category ID from the name
      let categoryId = null;
      if (testimonial.category) {
        try {
          const categories = await this.getCategories();
          const categoryObj = categories.find(cat => cat.name === testimonial.category);
          if (categoryObj) {
            categoryId = categoryObj.id;
          }
        } catch (error) {
          console.warn('Error fetching categories for submission:', error);
        }
      }
      
      // Create the testimonial record
      const testimonialRecord = {
        guest_name: testimonial.name,
        guest_location: testimonial.location || null,
        rating: testimonial.rating,
        comment: testimonial.text,
        category_id: categoryId,
        created_at: new Date().toISOString(),
        is_featured: false
        // approved_at will be null by default which means not approved
      };
      
      console.log('Submitting testimonial to database:', testimonialRecord);
      
      // Insert the testimonial with Supabase
      const { getSupabase } = await import('@/lib/supabase');
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('testimonials')
        .insert(testimonialRecord)
        .select();
      
      if (error) {
        console.error('Error submitting testimonial:', error);
        throw error;
      }
      
      console.log('Testimonial submitted successfully:', data);
      return {
        success: true,
        message: 'Thank you for your testimonial! It will be reviewed and published soon.',
        data
      };
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      return {
        success: false,
        message: 'There was an error submitting your testimonial. Please try again later.'
      };
    }
  }
};

export default testimonialService;