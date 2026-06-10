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

// Every key that holds auth state or cached PII. Logout / session-expiry must wipe
// all of these. `company_profile` is no longer written (PII is not cached client-side)
// but is kept here so any legacy value from an older session is purged on logout.
const AUTH_KEYS = [
  'portal_session_id', 'portal_app_id',
  'user_access_token',
  'user', 'user_type',
  'company_profile',
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

// Merges normalized profile into sessionStorage.
// On a fresh login (no existing session data) the server value for is_verified is trusted.
// On subsequent fetches the local value wins — only submitVerification may flip it to true.
const saveUserProfile = (profile) => {
  const existing = getUser();
  const merged = { ...existing, ...profile };
  if (existing.is_verified !== undefined) merged.is_verified = existing.is_verified;
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

// The backend no longer returns plaintext session_token / access_token / refresh_token.
// Login now responds with a single server-encrypted envelope under `data`
// (e.g. {"iv":...,"txt":...,"tag":...,"used":0,"purpose":"login"}). We treat it as an
// opaque credential: store it verbatim and hand it straight back to the backend, which
// decrypts it server-side. We never decrypt it on the client.
const extractSessionToken = (responseData) => {
  const raw = responseData?.data;
  if (raw == null || raw === '') return null;
  // `data` arrives as a JSON string; keep it exactly as received.
  return typeof raw === 'string' ? raw : JSON.stringify(raw);
};

// Persists the opaque session credential. The backend now reads the session header as the
// raw envelope (it JSON-parses/decrypts it directly), so we store it verbatim — no
// `&<appId>` suffix, which would otherwise trail the JSON and break parsing server-side.
const persistSession = (sessionToken, userType) => {
  sessionStorage.setItem('portal_session_id', sessionToken);
  sessionStorage.setItem('user_type', userType);
  // The opaque envelope is now the only credential we have — reuse it where a bearer
  // token was previously sent.
  sessionStorage.setItem('user_access_token', sessionToken);
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/portal/auth/signin', { email, password });
    const sessionToken = extractSessionToken(response.data);

    if (sessionToken) {
      persistSession(sessionToken, 'individual');
      try { await getProfile(); } catch (e) { console.warn('Profile fetch failed post-login:', e); }
    }
    return response.data;
  } catch (error) { throwError(error); }
};

export const loginCompany = async (email, password) => {
  try {
    const response = await api.post('/portal/auth/signin-entity', { email, password });
    const sessionToken = extractSessionToken(response.data);

    if (sessionToken) {
      persistSession(sessionToken, 'company');
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

// Individuals and companies have separate update endpoints. By default we route by the
// account type recorded at login (user_type), but callers in a known context may override.
const isCompanyAccount = () => sessionStorage.getItem('user_type') === 'company';

const accountUpdatePath = (email, isCompany) =>
  (isCompany ?? isCompanyAccount())
    ? `/portal/accounts/update-company-account/${email}`
    : `/portal/accounts/update-account/${email}`;

export const updateAccount = async (email, userData, isCompany) => {
  try {
    const response = await api.patch(
      accountUpdatePath(email, isCompany),
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

// ----- Service handoff (v2 session handshake) ----------------------------------

// Issues a short-lived (180s) one-time token to hand the session off to an external service
// module. Authenticates the same way as v1 endpoints — via the session header added by the
// request interceptor (no `sid` needed; the backend guards it server-side). `redirect=false`
// makes it return JSON ({ url, oht, expiresIn }) instead of a 302; navigate the browser to `url`.
export const issueServiceToken = async ({ email, url, userType }) => {
  try {
    const origin = new URL(API_BASE_URL).origin;
    const response = await api.get(`${origin}/api/v2/session/auth/issuetoken`, {
      params: { email, url, userType, redirect: 'false' },
    });
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

export const verifyBusinessTIN = async (tinNumber) => {
  try {
    const response = await api.post('/shared/verify/businessTin', { tinNumber });
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
    const response = await api.post('/shared/billing/identification', dto, { headers: bearerHeader() });
    return response.data;
  } catch (error) { throwError(error); }
};

export const submitVerification = async (email, extraFields = {}, isCompany) => {
  try {
    const response = await api.patch(
      accountUpdatePath(email, isCompany),
      { is_verified: true, ...extraFields },
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
