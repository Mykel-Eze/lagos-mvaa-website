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

    const app_id = '75e6df2eba1c1875ef359fc95c0f5a1ce5b8'

    if (sessionToken) {
      // Set the session token cookie
      Cookies.set('portal_session_id', `${sessionToken}&${app_id}`, {
        secure: window.location.protocol === 'https:',
        sameSite: 'lax'
      });

      // Set the access token cookie
      Cookies.set('user_access_token', accessToken, {
        secure: window.location.protocol === 'https:',
        sameSite: 'lax'
      });

      console.log('Cookies set. Fetching profile...');

      try {
        const decodedToken = parseJwt(accessToken);
        const userId = decodedToken?.sub || decodedToken?.id;
        if (userId) {
          await getProfile(userId, accessToken);
          console.log('Profile fetched successfully');
        } else {
          console.error('Could not extract user ID from token');
        }
      } catch (profileError) {
        console.warn('Failed to fetch profile after login:', profileError);
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

export const loginCompany = async (email, password) => {
  try {
    const response = await api.post('/portal/auth/signin-entity', { email, password });

    const data = response.data.data || response.data;
    const sessionToken = data.session_token || response.data.session_token;
    const accessToken = data.access_token || response.data.access_token;

    const app_id = '75e6df2eba1c1875ef359fc95c0f5a1ce5b8';

    if (sessionToken) {
      Cookies.set('portal_session_id', `${sessionToken}&${app_id}`, {
        secure: window.location.protocol === 'https:',
        sameSite: 'lax'
      });
      Cookies.set('user_access_token', accessToken, {
        secure: window.location.protocol === 'https:',
        sameSite: 'lax'
      });

      try {
        const decodedToken = parseJwt(accessToken);
        const userId = decodedToken?.sub || decodedToken?.id;
        if (userId) {
          await getProfile(userId, accessToken);
        }
      } catch (profileError) {
        console.warn('Failed to fetch profile after company login:', profileError);
      }
    }

    return response.data;
  } catch (error) {
    console.error('Company login error:', error);
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

    const response = await api.get(`/portal/accounts/${finalUserId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    Cookies.set('user', JSON.stringify(response.data), {
      secure: window.location.protocol === 'https:',
      sameSite: 'lax'
    });

    return response.data;
  } catch (error) {
    console.error('getProfile error:', error.response?.data || error.message);

    if (error.response?.status === 401 || error.response?.status === 403) {
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

    // Debug logging
    console.log('Logout attempt:', { token: !!token, sessionId });

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

export const registerCompany = async (companyData) => {
  try {
    const response = await api.post('/portal/auth/signup-entity', companyData);
    return response.data;
  } catch (error) {
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
    const response = await api.get('/portal/accounts/send-activation', {
      params: { email }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

// ─── Verification Functions ────────────────────────────────────────────────

/**
 * Verify NIN (National Identification Number).
 * Endpoint: POST /api/v1/shared/verify/nin/{idNumber}
 * Auth: cookie (portal_session_id)
 * Body: { firstname, lastname } — matched against the NIN record
 */
export const verifyNIN = async (nin, firstname, lastname) => {
  try {
    const response = await api.post(`/shared/verify/nin/${nin}`, { firstname, lastname });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

/**
 * Verify CAC (Corporate Affairs Commission) registration number.
 * Endpoint: POST /api/v1/shared/verify/cac
 * Auth: cookie (portal_session_id)
 * Body: { regNumber } — format: RC1234, BN1234, IT1234 etc.
 */
export const verifyCAC = async (regNumber) => {
  try {
    const response = await api.post('/shared/verify/cac', { regNumber });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

/**
 * Verify Payer ID (Tax Identification).
 * Endpoint: GET /api/v2/shared/billing/identification?pid=
 * Auth: Bearer user_access_token (v2 resource)
 */
export const verifyPayerId = async (pid) => {
  try {
    const token = Cookies.get('user_access_token');
    const v2Api = axios.create({
      baseURL: 'https://licensetest.permit.org.ng/api/v2',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: false,
    });
    const response = await v2Api.get('/shared/billing/identification', { params: { pid } });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

/**
 * Submit final verification — marks the user as verified on the backend.
 * Uses the existing update-account endpoint with is_verified: true.
 * Adjust the payload field name if your backend uses a different key.
 */
export const submitVerification = async (email) => {
  try {
    const token = Cookies.get('user_access_token');
    const authApi = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: false,
    });
    const response = await authApi.patch(`/portal/accounts/update-account/${email}`, {
      is_verified: true,
    });
    // Update user cookie to reflect verified status
    const currentUser = JSON.parse(Cookies.get('user') || '{}');
    Cookies.set('user', JSON.stringify({ ...currentUser, is_verified: true }), {
      secure: window.location.protocol === 'https:',
      sameSite: 'strict',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export default api;

