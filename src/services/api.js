// src/services/api.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://licensetest.permit.org.ng/api/v1';

// Create axios instance with credentials for cookie-based auth
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies to be sent with requests
});

// Debug function to log request details
const debugRequest = (config) => {
  console.log('=== API Request Debug ===');
  console.log('URL:', config.url);
  console.log('Method:', config.method);
  console.log('Headers:', config.headers);
  console.log('Base URL:', config.baseURL);
  console.log('Full URL:', `${config.baseURL}${config.url}`);
  console.log('Cookies:', document.cookie); // Log cookies being sent
  console.log('========================');
};

// API functions
export const login = async (email, password) => {
  try {
    const response = await api.post('/portal/auth/signin', { email, password });
    
    // Store tokens in cookies instead of localStorage
    if (response.data.session_token) {
      Cookies.set('portal_session_id', response.data.session_token, { 
        secure: window.location.protocol === 'https:',
        // sameSite: 'strict'
        sameSite: 'none',
      });
    }
    
    if (response.data.user) {
      Cookies.set('user', JSON.stringify(response.data.user), { 
        secure: window.location.protocol === 'https:',
        // sameSite: 'strict' 
        sameSite: 'none',
      });
    }


    console.log('Login API response:', response.data);

    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/portal/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export const getProfile = async () => {
  try {
    const token = Cookies.get('portal_session_id');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Debug the request - no Authorization header needed since we're using cookies
    debugRequest({
      url: '/shared/profile',
      method: 'GET',
      headers: {}, // No auth header needed
      baseURL: API_BASE_URL
    });
    
    // Make request without Authorization header - rely on cookies
    const response = await api.get('/shared/profile');
    
    console.log('Profile API response:', response.data);
    console.log('document.cookie:', document.cookie);
    console.log('Cookies.get:', Cookies.get('portal_session_id'));
    
    // Update the user cookie with fresh data from the server
    if (response.data.user) {
      Cookies.set('user', JSON.stringify(response.data.user), { 
        secure: window.location.protocol === 'https:' ? true : false,
        // sameSite: 'strict' 
        sameSite: 'none',
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('getProfile error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // If token is invalid or access denied, clear cookies
    // if (error.response?.status === 401 || error.response?.status === 403) {
    //   console.log('Authentication failed, clearing cookies');
    //   Cookies.remove('portal_session_id');
    //   Cookies.remove('portal_app_id');
    //   Cookies.remove('user');
    // }
    throw error.response?.data || { error: 'Network error' };
  }
};

export const logout = async () => {
  try {
    const token = Cookies.get('portal_session_id');
    // Use cookie-based auth instead of Authorization header
    const response = await api.post('/portal/auth/logout', {});
    
    // Clear cookies
    Cookies.remove('portal_session_id');
    // Cookies.remove('portal_app_id');
    Cookies.remove('user');
    
    return response.data;
  } catch (error) {
    // Clear cookies even if the server request fails
    Cookies.remove('portal_session_id');
    // Cookies.remove('portal_app_id');
    Cookies.remove('user');
    
    throw error.response?.data || { error: 'Network error' };
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.get(`/portal/accounts/forgot-password/${email}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await api.patch(`/portal/accounts/reset-password/${token}`, {
      password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export const updateAccount = async (email, userData) => {
  try {
    const token = Cookies.get('portal_session_id');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Use cookie-based auth instead of Authorization header
    const response = await api.patch(`/portal/accounts/update-account/${email}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export default api;