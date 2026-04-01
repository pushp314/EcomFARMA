import API from './axios';

// Auth APIs
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  logout: () => API.post('/auth/logout'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Generic Upload API
export const uploadAPI = {
  uploadImage: (formData) => API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Product APIs (to be used in Phase 2)
export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getById: (id) => API.get(`/products/${id}`),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
  getFarmerProducts: () => API.get('/products/farmer/me'),
  addReview: (id, data) => API.post(`/products/${id}/reviews`, data),
  getReviews: (id) => API.get(`/products/${id}/reviews`),
};

// Order APIs (to be used in Phase 4)
export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/my'),
  getById: (id) => API.get(`/orders/${id}`),
  updateStatus: (id, data) => API.put(`/orders/${id}/status`, data),
  getFarmerOrders: () => API.get('/orders/farmer'),
  getFarmerStats: () => API.get('/orders/farmer/stats'),
};

// Payment APIs
export const paymentAPI = {
  createOrder: (data) => API.post('/payments/create-order', data),
  verify: (data) => API.post('/payments/verify', data),
};

// Admin APIs
export const adminAPI = {
  getUsers: (params) => API.get('/admin/users', { params }),
  toggleApproveFarmer: (id, data) => API.put(`/admin/users/${id}/approve`, data),
  getDashboardStats: () => API.get('/admin/stats'),
  getAllOrders: (params) => API.get('/admin/orders', { params }),
};
