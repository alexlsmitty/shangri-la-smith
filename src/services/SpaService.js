import axios from 'axios';

const API_URL = '/api';

/**
 * Service for spa related API calls
 */
export default {
  /**
   * Get all spa categories
   * @returns {Promise} Promise with the categories data
   */
  getCategories() {
    return axios.get(`${API_URL}/spa/categories`);
  },

  /**
   * Get all spa services
   * @returns {Promise} Promise with the services data
   */
  getAllServices() {
    return axios.get(`${API_URL}/spa/services`);
  },

  /**
   * Get spa services by category
   * @param {number} categoryId - The category ID to filter by
   * @returns {Promise} Promise with the filtered services data
   */
  getServicesByCategory(categoryId) {
    return axios.get(`${API_URL}/spa/services/category/${categoryId}`);
  },

  /**
   * Get a specific spa service by ID
   * @param {number} serviceId - The service ID to retrieve
   * @returns {Promise} Promise with the service data
   */
  getServiceById(serviceId) {
    return axios.get(`${API_URL}/spa/services/${serviceId}`);
  },

  /**
   * Get all featured spa services
   * @returns {Promise} Promise with the featured services data
   */
  getFeaturedServices() {
    return axios.get(`${API_URL}/spa/services/featured`);
  },

  /**
   * Book a spa appointment
   * @param {Object} appointmentData - The appointment data
   * @returns {Promise} Promise with the booking confirmation
   */
  bookAppointment(appointmentData) {
    return axios.post(`${API_URL}/spa/appointments`, appointmentData);
  },

  /**
   * Get available time slots for a specific date and service
   * @param {string} date - The date to check availability for
   * @param {number} serviceId - The service ID
   * @returns {Promise} Promise with the available time slots
   */
  getAvailableTimeSlots(date, serviceId) {
    return axios.get(`${API_URL}/spa/appointments/available?date=${date}&serviceId=${serviceId}`);
  },

  /**
   * Get user's appointments
   * @param {string} email - User's email
   * @returns {Promise} Promise with the user's appointments
   */
  getUserAppointments(email) {
    return axios.get(`${API_URL}/spa/appointments/user/${email}`);
  },
  
  /**
   * Get appointment details by reference
   * @param {string} bookingReference - The booking reference
   * @returns {Promise} Promise with the appointment details
   */
  getAppointmentByReference(bookingReference) {
    return axios.get(`${API_URL}/spa/appointment/${bookingReference}`);
  },

  /**
   * Cancel a spa appointment
   * @param {string} bookingReference - The booking reference to cancel
   * @returns {Promise} Promise with the cancellation confirmation
   */
  cancelAppointment(bookingReference) {
    return axios.put(`${API_URL}/spa/appointments/${bookingReference}/cancel`);
  }
};
