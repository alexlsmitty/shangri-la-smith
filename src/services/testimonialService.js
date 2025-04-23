import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Testimonials service to interact with the testimonials API
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
      const response = await axios.get(`${API_URL}/testimonials`, {
        params: { limit, featured, category }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
  },

  /**
   * Get all testimonial categories
   * @returns {Promise<Array>} - Array of category names
   */
  async getCategories() {
    try {
      const response = await axios.get(`${API_URL}/testimonials/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching testimonial categories:', error);
      throw error;
    }
  },

  /**
   * Submit a new testimonial
   * @param {Object} testimonial - The testimonial data
   * @param {string} testimonial.name - Guest name
   * @param {string} testimonial.email - Guest email
   * @param {string} testimonial.location - Guest location (City, Country)
   * @param {number} testimonial.rating - Rating (1-5)
   * @param {string} testimonial.category - Experience category
   * @param {string} testimonial.text - Testimonial text
   * @returns {Promise<Object>} - Submission result
   */
  async submitTestimonial(testimonial) {
    try {
      const response = await axios.post(`${API_URL}/testimonials`, testimonial);
      return response.data;
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      throw error;
    }
  }
};

export default testimonialService;