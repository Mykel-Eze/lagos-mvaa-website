// src/services/api.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://licensetest.permit.org.ng/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: This allows cookies to be sent with requests
});

// API functions
export const login = async (email, password) => {
  try {
    const response = await api.post('/portal/auth/signin', { email, password });
    // Cookies will be automatically set by the browser from the response
    // Store user data if needed
    if (response.data.user) {
      Cookies.set('user', JSON.stringify(response.data.user), { sameSite: 'strict' });
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/portal/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getProfile = async () => {
  try {
    // Token is sent via cookies automatically
    const response = await api.get('/shared/profile');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const refreshToken = async () => {
  try {
    // Refresh token is sent via cookies automatically
    const response = await api.post('/portal/auth/refresh');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/portal/auth/logout');
    // Clear cookies
    Cookies.remove('portal_session_id');
    Cookies.remove('portal_app_id');
    Cookies.remove('user');
    return response.data;
  } catch (error) {
    // Clear cookies even if the server request fails
    Cookies.remove('portal_session_id');
    Cookies.remove('portal_app_id');
    Cookies.remove('user');
    throw error.response.data;
  }
};

// Interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired token (401) and it's not a retry request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token - cookies are sent automatically
        await refreshToken();
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refreshing the token fails, log the user out
        Cookies.remove('portal_session_id');
        Cookies.remove('portal_app_id');
        Cookies.remove('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;