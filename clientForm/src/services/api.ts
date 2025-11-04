import axios from 'axios';

const API_URL = 'https://sirz-be.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: async (email: string, password: string) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },

  verifyOTP: async (userId: string, otp: string) => {
    const response = await api.post('/auth/verify-otp', { userId, otp });
    return response.data;
  },

  resendOTP: async (userId: string) => {
    const response = await api.post('/auth/resend-otp', { userId });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
   // 🚀 Added function to fetch user data by ID
   getUser: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
  
  // Update user profile
  updateUser: async (userId: string, userData: {
    first_name?: string;
    last_name?: string;
    image?: string;
  }) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },
}; 