// src/services/api.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://licensetest.permit.org.ng/api/v1';

// Create axios instance without credentials for all requests
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // No withCredentials flag to avoid CORS issues
});

// API functions
export const login = async (email, password) => {
  try {
    const response = await api.post('/portal/auth/signin', { email, password });
    
    // Store tokens in cookies instead of localStorage
    if (response.data.session_token) {
      Cookies.set('portal_session_id', response.data.session_token, { 
        secure: window.location.protocol === 'https:',
        sameSite: 'strict'
      });
    }
    
    // if (response.data.refresh_token) {
    //   Cookies.set('portal_refresh_token', response.data.refresh_token, { 
    //     secure: window.location.protocol === 'https:',
    //     sameSite: 'strict'
    //   });
    // }
    
    if (response.data.user) {
      Cookies.set('user', JSON.stringify(response.data.user), { 
        secure: window.location.protocol === 'https:',
        sameSite: 'strict' 
      });
    }
    
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
    const response = await api.get('/shared/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

// export const refreshToken = async () => {
//   try {
//     const refreshToken = Cookies.get('portal_refresh_token');
//     const response = await api.post('/portal/auth/refresh', {}, {
//       headers: { Authorization: `Bearer ${refreshToken}` },
//     });
    
//     if (response.data.access_token) {
//       Cookies.set('portal_session_id', response.data.access_token, { 
//         secure: window.location.protocol === 'https:',
//         sameSite: 'strict'
//       });
//     }
    
//     if (response.data.refresh_token) {
//       Cookies.set('portal_refresh_token', response.data.refresh_token, { 
//         secure: window.location.protocol === 'https:',
//         sameSite: 'strict'
//       });
//     }
    
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { error: 'Network error' };
//   }
// };

export const logout = async () => {
  try {
    const token = Cookies.get('portal_session_id');
    const response = await api.post('/portal/auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Clear cookies
    Cookies.remove('portal_session_id');
    // Cookies.remove('portal_refresh_token');
    Cookies.remove('portal_app_id');
    Cookies.remove('user');
    
    return response.data;
  } catch (error) {
    // Clear cookies even if the server request fails
    Cookies.remove('portal_session_id');
    // Cookies.remove('portal_refresh_token');
    Cookies.remove('portal_app_id');
    Cookies.remove('user');
    
    throw error.response?.data || { error: 'Network error' };
  }
};

// Interceptor to handle token refresh
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If the error is due to an expired token (401) and it's not a retry request
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Attempt to refresh the token
//         await refreshToken();
        
//         // Update the original request with the new token
//         const newToken = Cookies.get('portal_session_id');
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
//         // Retry the original request
//         return api(originalRequest);
//       } catch (refreshError) {
//         // If refreshing the token fails, log the user out
//         Cookies.remove('portal_session_id');
//         Cookies.remove('portal_refresh_token');
//         Cookies.remove('portal_app_id');
//         Cookies.remove('user');
//         window.location.href = '/login';
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;