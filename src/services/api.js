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
// const debugRequest = (config) => {
//   console.log('=== API Request Debug ===');
//   console.log('URL:', config.url);
//   console.log('Method:', config.method);
//   console.log('Headers:', config.headers);
//   console.log('Base URL:', config.baseURL);
//   console.log('Full URL:', `${config.baseURL}${config.url}`);
//   console.log('Cookies:', document.cookie);
//   console.log('========================');
// };

// API functions
// Helper to decode JWT
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[ 1 ]));
  } catch (e) {
    return null;
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/portal/auth/signin', { email, password });

    const data = response.data.data || response.data;
    const sessionToken = data.session_token || response.data.session_token;
    const accessToken = data.access_token || response.data.access_token;

    console.log('Extracted tokens:', { sessionToken, accessToken });

    if (sessionToken) {
      // Set the session token cookie
      Cookies.set('portal_session_id', sessionToken, {
        secure: window.location.protocol === 'https:',
        sameSite: 'lax'
      });

      // Set the access token cookie
      Cookies.set('user_access_token', accessToken, {
        secure: window.location.protocol === 'https:',
        sameSite: 'lax'
      });

      console.log('Cookies set. Fetching profile...');

      // Fetch user profile and set user cookie
      try {
        // Extract user ID from token
        const decodedToken = parseJwt(accessToken);
        const userId = decodedToken?.sub || decodedToken?.id; // strict checking on claim name might be needed

        if (userId) {
          await getProfile(userId, accessToken);
          console.log('Profile fetched successfully');
        } else {
          console.error('Could not extract user ID from token');
        }
      } catch (profileError) {
        console.warn('Failed to fetch profile after login:', profileError);
        // Don't throw here - login was successful even if profile fetch failed
      }
    } else {
      console.error('No session token found in response!');
    }

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
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

export const getProfile = async (userId, manualToken = null) => {
  try {
    const token = manualToken || Cookies.get('user_access_token') || Cookies.get('portal_session_id');

    // If no userId provided, try to extract from token (fallback)
    let finalUserId = userId;
    if (!finalUserId && token) {
      const decoded = parseJwt(token);
      finalUserId = decoded?.sub || decoded?.id;
    }

    if (!token) {
      throw new Error('No authentication token found');
    }

    if (!finalUserId) {
      throw new Error('User ID not found');
    }

    // Make request - explicitly attach Authorization header for robustness
    const response = await api.get(`/portal/accounts/${finalUserId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // console.log('Profile API response:', response.data);
    // console.log('document.cookie:', document.cookie);
    // console.log('Cookies.get portal_session_id:', Cookies.get('portal_session_id'));

    Cookies.set('user', JSON.stringify(response.data), {
      secure: window.location.protocol === 'https:',
      sameSite: 'lax'
    });

    return response.data;
  } catch (error) {
    console.error('getProfile error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    // If token is invalid or access denied, clear cookies
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Authentication failed, clearing cookies');
      // Clear all cookies
      Cookies.remove('portal_session_id');
      Cookies.remove('portal_app_id');
      Cookies.remove('user_access_token');
      Cookies.remove('user');
    }

    throw error.response?.data || { error: 'Network error' };
  }
};

export const logout = async (manualToken = null) => {
  try {
    const token = manualToken || Cookies.get('user_access_token');
    const sessionId = Cookies.get('portal_session_id');
    // console.log('Logging out with token:', token);

    const config = {
      headers: {}
    };

    if (token) {
      config.headers[ 'Authorization' ] = `Bearer ${token}`;
    }

    if (sessionId) {
      config.headers[ 'portal_session_id' ] = sessionId;
    }

    // Make logout request
    const response = await api.post('/portal/auth/logout', {}, config);

    // Clear all cookies
    Cookies.remove('portal_session_id');
    Cookies.remove('portal_app_id');
    Cookies.remove('user_access_token');
    Cookies.remove('user');

    // console.log('Logout successful, all cookies cleared');

    return response.data;
  } catch (error) {
    console.error('Logout error:', error);

    // Clear cookies even if the server request fails
    Cookies.remove('portal_session_id');
    Cookies.remove('user_access_token');
    Cookies.remove('portal_app_id');
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
    const token = Cookies.get('user_access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Create a separate axios instance for this request with token auth
    const authApi = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: false // Don't send cookies
    });

    const response = await authApi.patch(`/portal/accounts/update-account/${email}`, userData);

    // Update user cookie with new data
    Cookies.set('user', JSON.stringify(response.data), {
      secure: window.location.protocol === 'https:',
      sameSite: 'strict'
    });

    // Emit profile update event (if you're using the event system)
    // emitAuthEvent('profile_updated', response.data);

    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export const resendVerificationEmail = async (email) => {
  try {
    const response = await api.get(`/portal/accounts/send-activation/${email}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export default api;