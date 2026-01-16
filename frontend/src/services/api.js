import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Calendar API
export const calendarAPI = {
  getAll: () => api.get('/calendar'),
  getToday: () => api.get('/calendar/today'),
  create: (data) => api.post('/calendar', data),
  update: (id, data) => api.put(`/calendar/${id}`, data),
  delete: (id) => api.delete(`/calendar/${id}`),
};

// Shopping API
export const shoppingAPI = {
  getAll: () => api.get('/shopping'),
  getActive: () => api.get('/shopping/active'),
  create: (data) => api.post('/shopping', data),
  update: (id, data) => api.put(`/shopping/${id}`, data),
  toggle: (id) => api.patch(`/shopping/${id}/toggle`),
  delete: (id) => api.delete(`/shopping/${id}`),
  clearCompleted: () => api.delete('/shopping/completed/clear'),
};

// Chat API
export const chatAPI = {
  sendMessage: (message) => api.post('/chat', { message }),
  getHistory: (limit = 20) => api.get('/chat/history', { params: { limit } }),
  clearHistory: () => api.delete('/chat/history'),
};

export default api;
