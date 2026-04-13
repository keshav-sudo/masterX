import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post('/api/v1/auth/refresh-token', { refreshToken });
          Cookies.set('accessToken', data.accessToken, { expires: 7 });
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch {
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          if (typeof window !== 'undefined') window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  sendOtp: (data) => api.post('/auth/send-otp', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  loginPhone: (data) => api.post('/auth/login/phone', data),
  loginEmail: (data) => api.post('/auth/login/email', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: (data) => api.post('/auth/refresh-token', data),
};

// User APIs
export const userAPI = {
  getMe: () => api.get('/users/me'),
  profileSetup: (data) => api.put('/users/profile-setup', data),
  updateMe: (data) => api.put('/users/me', data),
  updateLocation: (data) => api.put('/users/me/location', data),
  getStats: () => api.get('/users/me/stats'),
  getUser: (id) => api.get(`/users/${id}`),
};

// Property APIs
export const propertyAPI = {
  browse: (params) => api.get('/properties', { params }),
  create: (data) => api.post('/properties', data),
  getMyListings: (params) => api.get('/properties/my-listings', { params }),
  getSaved: () => api.get('/properties/saved'),
  compare: (ids) => api.get('/properties/compare', { params: { ids } }),
  getAlerts: () => api.get('/properties/alerts'),
  createAlert: (data) => api.post('/properties/alerts', data),
  getOwnerDashboard: () => api.get('/properties/owner/dashboard'),
  getById: (id) => api.get(`/properties/${id}`),
  update: (id, data) => api.put(`/properties/${id}`, data),
  updateStatus: (id, data) => api.patch(`/properties/${id}/status`, data),
  delete: (id) => api.delete(`/properties/${id}`),
  save: (id) => api.post(`/properties/${id}/save`),
  inquiry: (id, data) => api.post(`/properties/${id}/inquiry`, data),
  getInquiries: (id) => api.get(`/properties/${id}/inquiries`),
  showNumber: (id) => api.post(`/properties/${id}/show-number`),
};

// Location APIs
export const locationAPI = {
  getCities: () => api.get('/location/cities'),
  getAreas: (city) => api.get(`/location/cities/${encodeURIComponent(city)}/areas`),
  detect: (data) => api.post('/location/detect', data),
};

// Mess APIs
export const messAPI = {
  browse: (params) => api.get('/mess', { params }),
  register: (data) => api.post('/mess/register', data),
  getSaved: () => api.get('/mess/saved'),
  getDashboard: () => api.get('/mess/dashboard'),
  getById: (id) => api.get(`/mess/${id}`),
  update: (id, data) => api.put(`/mess/${id}`, data),
  getMenu: (id) => api.get(`/mess/${id}/menu`),
  updateMenu: (data) => api.post('/mess/menu', data),
  save: (id) => api.post(`/mess/${id}/save`),
};

// Cook APIs
export const cookAPI = {
  browse: (params) => api.get('/cook', { params }),
  register: (data) => api.post('/cook/register', data),
  getSaved: () => api.get('/cook/saved'),
  getDashboard: () => api.get('/cook/dashboard'),
  getById: (id) => api.get(`/cook/${id}`),
  update: (id, data) => api.put(`/cook/${id}`, data),
  save: (id) => api.post(`/cook/${id}/save`),
};

// Roommate APIs
export const roommateAPI = {
  browse: (params) => api.get('/roommate', { params }),
  createProfile: (data) => api.post('/roommate/profile', data),
  updateProfile: (data) => api.put('/roommate/profile', data),
  deleteProfile: () => api.delete('/roommate/profile'),
  getInterests: () => api.get('/roommate/interests'),
  getConnections: () => api.get('/roommate/connections'),
  getById: (id) => api.get(`/roommate/${id}`),
  sendInterest: (id, data) => api.post(`/roommate/${id}/interest`, data),
  respondInterest: (id, data) => api.put(`/roommate/interests/${id}/respond`, data),
};

// Review APIs
export const reviewAPI = {
  getReviews: (type, targetId) => api.get(`/reviews/${type}/${targetId}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Notification APIs
export const notificationAPI = {
  getAll: (filter) => api.get('/notifications', { params: { filter } }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

// Coming Soon APIs
export const comingSoonAPI = {
  getServices: () => api.get('/coming-soon/services'),
  getService: (id) => api.get(`/coming-soon/services/${id}`),
  notify: (id, data) => api.post(`/coming-soon/services/${id}/notify`, data),
};

export default api;
