import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
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

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/users/me'),
};

export const socialAccountsAPI = {
  getAll: () => api.get('/social-accounts'),
  create: (data) => api.post('/social-accounts', data),
  delete: (id) => api.delete(`/social-accounts/${id}`),
  toggle: (id) => api.patch(`/social-accounts/${id}/toggle`),
};

export const preferencesAPI = {
  get: () => api.get('/preferences'),
  update: (data) => api.put('/preferences', data),
};

export const contentAPI = {
  generate: (data) => api.post('/content/generate', data),
};

export const postsAPI = {
  getAll: () => api.get('/posts'),
  get: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.patch(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  publish: (id) => api.post(`/posts/${id}/publish`),
};

export default api;
