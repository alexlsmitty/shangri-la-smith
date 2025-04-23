import axios from 'axios';

// API base URL - use environment variable or default URL
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AuthService = {
  // Register a new user
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login a user
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Get current user info
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/user');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      // Clear local storage on auth error
      if (error.response && error.response.status === 401) {
        this.logout();
      }
      throw error;
    }
  },

  // Logout the user
  async logout() {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await apiClient.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  // Check if user is logged in
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  // Get current user from localStorage
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get auth token
  getToken() {
    return localStorage.getItem('auth_token');
  }
};

export default AuthService;
