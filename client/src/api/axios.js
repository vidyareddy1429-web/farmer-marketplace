import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Interceptor to attach JWT token to every outgoing request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('farmer_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
