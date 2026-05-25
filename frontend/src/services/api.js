import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // Increased to 120 seconds to accommodate Render free tier cold starts
});

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out');
    } else if (!error.response) {
      console.error('Network error — is the backend running?');
    }
    return Promise.reject(error);
  }
);

export default API;