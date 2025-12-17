import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5050/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token when available
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only auto-logout on 401 if it's an authentication token issue
    // NOT for incorrect password on profile updates or other validation errors
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message?.toLowerCase() || '';
      
      // Don't logout for password verification failures
      if (errorMessage.includes('incorrect password') || 
          errorMessage.includes('password is incorrect') ||
          errorMessage.includes('current password')) {
        return Promise.reject(error);
      }
      
      // Logout for actual authentication failures (invalid/expired token)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
