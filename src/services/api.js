// src/services/api.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'https://licensetest.permit.org.ng/api/v1';

// ─── Axios Instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Auto-inject X-Portal-Session-Id on every v1 request
api.interceptors.request.use((config) => {
  const sessionId = Cookies.get('portal_session_id');
  if (sessionId) config.headers[ 'X-Portal-Session-Id' ] = sessionId;
  return config;
});

// ─── Cookie helpers ────────────────────────────────────────────────────────────

const COOKIE_OPTS = {
  secure: window.location.protocol === 'https:',
  sameSite: 'lax',
};

const COOKIE_OPTS_STRICT = {
  secure: window.location.protocol === 'https:',
  sameSite: 'strict',
};

const AUTH_COOKIES = [ 'portal_session_id', 'portal_app_id', 'user_access_token', 'user_refresh_token', 'user', 'user_type' ];
const clearAuthCookies = () => AUTH_COOKIES.forEach((k) => Cookies.remove(k));

// ─── Auth ──────────────────────────────────────────────────────────────────────

export const login = async (email, password) => {
  try {
    const response = await api.post('/portal/auth/signin', { email, password });
    const data = response.data.data || response.data;
    const sessionToken = data.session_token;
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;

    if (sessionToken) {
      Cookies.set('portal_session_id', sessionToken, COOKIE_OPTS);
      Cookies.set('user_type', 'individual', COOKIE_OPTS);
      if (accessToken) Cookies.set('user_access_token', accessToken, COOKIE_OPTS);
      if (refreshToken) Cookies.set('user_refresh_token', refreshToken, COOKIE_OPTS);
      try { await getProfile(); } catch (e) { console.warn('Profile fetch failed post-login:', e); }
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export const loginCompany = async (email, password) => {
  try {
    const response = await api.post('/portal/auth/signin-entity', { email, password });
    const data = response.data.data || response.data;
    const sessionToken = data.session_token;
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;
    const app_id = '75e6df2eba1c1875ef359fc95c0f5a1ce5b8';

    if (sessionToken) {
      Cookies.set('portal_session_id', `${sessionToken}&${app_id}`, COOKIE_OPTS);
      Cookies.set('user_type', 'company', COOKIE_OPTS);
      if (accessToken) Cookies.set('user_access_token', accessToken, COOKIE_OPTS);
      if (refreshToken) Cookies.set('user_refresh_token', refreshToken, COOKIE_OPTS);
      try { await getProfile(); } catch (e) { console.warn('Profile fetch failed post-company-login:', e); }
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

export const registerCompany = async (companyData) => {
  try {
    const response = await api.post('/portal/auth/signup-entity', companyData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export const getProfile = async () => {
  try {
    const sessionId = Cookies.get('portal_session_id');
    if (!sessionId) throw new Error('No session found');

    const response = await api.get('/shared/profile');

    // Unwrap the envelope — backend returns { status, message, data: { ... } }
    const profileData = { ...(response.data.data || response.data) };

    // Normalise camelCase fields from backend to snake_case used by frontend components
    if (profileData.isVerified !== undefined) profileData.is_verified = profileData.isVerified;
    if (profileData.isActivated !== undefined) profileData.is_activated = profileData.isActivated;

    const existing = (() => {
      try { return JSON.parse(Cookies.get('user') || '{}'); } catch { return {}; }
    })();

    // Strip entityId — contains raw base64 photo (~200 KB) that exceeds the 4 KB cookie limit
    const { entityId: _entityId, ...cookieSafeProfile } = profileData;

    const merged = { ...existing, ...cookieSafeProfile };
    // Preserve a locally-confirmed is_verified against any backend response lag
    if (existing.is_verified === true) merged.is_verified = true;

    Cookies.set('user', JSON.stringify(merged), COOKIE_OPTS);
    return merged;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export const logout = async () => {
  try {
    await api.post('/portal/auth/logout', {});
  } catch (error) {
    console.error('Logout server error (clearing cookies anyway):', error);
  } finally {
    clearAuthCookies();
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
    const response = await api.patch(`/portal/accounts/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export const updateAccount = async (email, userData) => {
  try {
    const token = Cookies.get('user_access_token');
    if (!token) throw new Error('No authentication token found');
    const response = await api.patch(
      `/portal/accounts/update-account/${email}`,
      userData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const profileData = { ...(response.data.data || response.data) };
    if (profileData.isVerified !== undefined) profileData.is_verified = profileData.isVerified;
    if (profileData.isActivated !== undefined) profileData.is_activated = profileData.isActivated;
    const { entityId: _entityId, ...cookieSafeProfile } = profileData;
    const existing = (() => { try { return JSON.parse(Cookies.get('user') || '{}'); } catch { return {}; } })();
    const merged = { ...existing, ...cookieSafeProfile };
    if (existing.is_verified === true) merged.is_verified = true;
    Cookies.set('user', JSON.stringify(merged), COOKIE_OPTS_STRICT);
    return merged;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export const resendVerificationEmail = async (email) => {
  try {
    const token = Cookies.get('user_access_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.get('/portal/accounts/send-activation', {
      params: { email },
      headers,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

// ─── Verification ──────────────────────────────────────────────────────────────

export const verifyNIN = async (nin, firstname, lastname) => {
  try {
    const response = await api.post(`/shared/verify/nin/${nin}`, { firstname, lastname });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export const verifyBusinessNIN = async (nin, firstname, lastname) => {
  try {
    const response = await api.post(`/shared/verify/businessNin/${nin}`, { firstname, lastname });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export const verifyCAC = async (regNumber) => {
  try {
    const response = await api.post('/shared/verify/cac', { regNumber });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export const verifyBusinessTIN = async (tin) => {
  try {
    const response = await api.post('/shared/verify/businessTin', { tin });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export const verifyPayerId = async (pid) => {
  try {
    const response = await api.get('/shared/billing/identification', { params: { pid } });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export const createPayerId = async (dto) => {
  try {
    const response = await api.post('/shared/billing/identification', dto);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export const submitVerification = async (email, extraFields = {}) => {
  try {
    const token = Cookies.get('user_access_token');
    const response = await api.patch(
      `/portal/accounts/update-account/${email}`,
      { is_verified: true },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const existing = (() => { try { return JSON.parse(Cookies.get('user') || '{}'); } catch { return {}; } })();
    Cookies.set('user', JSON.stringify({ ...existing, is_verified: true, ...extraFields }), COOKIE_OPTS_STRICT);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

// ─── Transactions ──────────────────────────────────────────────────────────────

export const fetchTransactions = async () => {
  try {
    const response = await api.get('/shared/transaction');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export const fetchTransaction = async (id) => {
  try {
    const response = await api.get(`/shared/transaction/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export default api;
