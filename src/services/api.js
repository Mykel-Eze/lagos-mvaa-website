// src/services/api.js
import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'https://licensetest.permit.org.ng/api/v1';

// ----- Axios Instance -------------------------------------------------------------

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const sessionId = sessionStorage.getItem('portal_session_id');
  if (sessionId) config.headers[ 'X-Portal-Session-Id' ] = sessionId;
  return config;
});

// ----- Storage helpers -------------------------------------------------------------

const AUTH_KEYS = [
  'portal_session_id', 'portal_app_id',
  'user_access_token', 'user_refresh_token',
  'user', 'user_type',
];

export const clearAuthStorage = () => AUTH_KEYS.forEach((k) => sessionStorage.removeItem(k));

const getUser = () => {
  try { return JSON.parse(sessionStorage.getItem('user') || '{}'); } catch { return {}; }
};

// ----- Profile helpers -------------------------------------------------------------

// Unwraps the response envelope, normalises camelCase fields, strips entityId (large base64 photo).
const normalizeProfile = (responseData) => {
  const raw = responseData.data || responseData;
  const profile = { ...raw };
  if (profile.isVerified !== undefined) profile.is_verified = profile.isVerified;
  if (profile.isActivated !== undefined) profile.is_activated = profile.isActivated;
  const { entityId: _entityId, ...safe } = profile;
  return safe;
};

// Merges normalized profile into sessionStorage, preserving a locally-confirmed is_verified.
const saveUserProfile = (profile) => {
  const existing = getUser();
  const merged = { ...existing, ...profile };
  if (existing.is_verified === true) merged.is_verified = true;
  sessionStorage.setItem('user', JSON.stringify(merged));
  return merged;
};

const bearerHeader = () => {
  const token = sessionStorage.getItem('user_access_token');
  if (!token) throw new Error('No authentication token found');
  return { Authorization: `Bearer ${token}` };
};

const throwError = (error) => { throw error.response?.data || { error: 'Network error' }; };

// ----- Auth -----------------------------------------------------------------------------------

const APP_ID = '75e6df2eba1c1875ef359fc95c0f5a1ce5b8';

export const login = async (email, password) => {
  try {
    const response = await api.post('/portal/auth/signin', { email, password });
    const { session_token, access_token, refresh_token } = response.data.data || response.data;

    if (session_token) {
      sessionStorage.setItem('portal_session_id', `${session_token}&${APP_ID}`);
      sessionStorage.setItem('user_type', 'individual');
      if (access_token) sessionStorage.setItem('user_access_token', access_token);
      if (refresh_token) sessionStorage.setItem('user_refresh_token', refresh_token);
      try { await getProfile(); } catch (e) { console.warn('Profile fetch failed post-login:', e); }
    }
    return response.data;
  } catch (error) { throwError(error); }
};

export const loginCompany = async (email, password) => {
  try {
    const response = await api.post('/portal/auth/signin-entity', { email, password });
    const { session_token, access_token, refresh_token } = response.data.data || response.data;

    if (session_token) {
      sessionStorage.setItem('portal_session_id', `${session_token}&${APP_ID}`);
      sessionStorage.setItem('user_type', 'company');
      if (access_token) sessionStorage.setItem('user_access_token', access_token);
      if (refresh_token) sessionStorage.setItem('user_refresh_token', refresh_token);
      try { await getProfile(); } catch (e) { console.warn('Profile fetch failed post-company-login:', e); }
    }
    return response.data;
  } catch (error) { throwError(error); }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/portal/auth/signup', userData);
    return response.data;
  } catch (error) { throwError(error); }
};

export const registerCompany = async (companyData) => {
  try {
    const response = await api.post('/portal/auth/signup-entity', companyData);
    return response.data;
  } catch (error) { throwError(error); }
};

export const getProfile = async () => {
  try {
    if (!sessionStorage.getItem('portal_session_id')) throw new Error('No session found');
    const response = await api.get('/shared/profile');
    return saveUserProfile(normalizeProfile(response.data));
  } catch (error) { throwError(error); }
};

export const logout = async () => {
  try {
    await api.post('/portal/auth/logout', {});
  } catch (error) {
    console.error('Logout server error (clearing storage anyway):', error);
  } finally {
    clearAuthStorage();
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.get(`/portal/accounts/forgot-password/${email}`);
    return response.data;
  } catch (error) { throwError(error); }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await api.patch(`/portal/accounts/reset-password/${token}`, { password });
    return response.data;
  } catch (error) { throwError(error); }
};

export const updateAccount = async (email, userData) => {
  try {
    const response = await api.patch(
      `/portal/accounts/update-account/${email}`,
      userData,
      { headers: bearerHeader() }
    );
    return saveUserProfile(normalizeProfile(response.data));
  } catch (error) { throwError(error); }
};

export const resendVerificationEmail = async (email) => {
  try {
    const token = sessionStorage.getItem('user_access_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.get('/portal/accounts/send-activation', { params: { email }, headers });
    return response.data;
  } catch (error) { throwError(error); }
};

// ----- Verification -------------------------------------------------------------

export const verifyNIN = async (nin, firstname, lastname) => {
  try {
    const response = await api.post(`/shared/verify/nin/${nin}`, { firstname, lastname });
    return response.data;
  } catch (error) { throwError(error); }
};

export const verifyBusinessNIN = async (nin, firstname, lastname) => {
  try {
    const response = await api.post(`/shared/verify/businessNin/${nin}`, { firstname, lastname });
    return response.data;
  } catch (error) { throwError(error); }
};

export const verifyCAC = async (regNumber) => {
  try {
    const response = await api.post('/shared/verify/cac', { regNumber });
    return response.data;
  } catch (error) { throwError(error); }
};

export const verifyBusinessTIN = async (tin) => {
  try {
    const response = await api.post('/shared/verify/businessTin', { tin });
    return response.data;
  } catch (error) { throwError(error); }
};

export const verifyPayerId = async (pid) => {
  try {
    const response = await api.get('/shared/billing/identification', { params: { pid } });
    return response.data;
  } catch (error) { throwError(error); }
};

export const createPayerId = async (dto) => {
  try {
    const response = await api.post('/shared/billing/identification', dto);
    return response.data;
  } catch (error) { throwError(error); }
};

export const submitVerification = async (email, extraFields = {}) => {
  try {
    const response = await api.patch(
      `/portal/accounts/update-account/${email}`,
      { is_verified: true },
      { headers: bearerHeader() }
    );
    sessionStorage.setItem('user', JSON.stringify({ ...getUser(), is_verified: true, ...extraFields }));
    return response.data;
  } catch (error) { throwError(error); }
};

// ----- Transactions -------------------------------------------------------------

export const fetchTransactions = async () => {
  try {
    const response = await api.get('/shared/transaction');
    return response.data;
  } catch (error) { throwError(error); }
};

export const fetchTransaction = async (id) => {
  try {
    const response = await api.get(`/shared/transaction/${id}`);
    return response.data;
  } catch (error) { throwError(error); }
};

export default api;
