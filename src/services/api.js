// src/services/api.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'https://licensetest.permit.org.ng/api/v1';
const API_V2_BASE_URL =
  process.env.REACT_APP_API_V2_BASE_URL || 'https://licensetest.permit.org.ng/api/v2';

// ─── Axios Instances ───────────────────────────────────────────────────────────

// v1 — cookie-based auth (withCredentials sends portal_session_id automatically)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// v2 — Bearer token auth (portal uses user_access_token as bearer)
// NOTE: The swagger describes v2 endpoints as requiring a "handshake_token".
// That token is specifically for EXTERNAL MODULES that receive a redirect from
// the portal via the issuetoken → connect handshake flow. The portal itself,
// as the token issuer, uses user_access_token directly for v2 billing calls.
const api_v2 = axios.create({
  baseURL: API_V2_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Auto-inject Bearer token on every v2 request
api_v2.interceptors.request.use((config) => {
  const token = Cookies.get('user_access_token');
  if (token) config.headers[ 'Authorization' ] = `Bearer ${token}`;
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

/**
 * Fetch the authenticated user's profile.
 * Endpoint: GET /api/v1/shared/profile
 * Auth: Bearer user_access_token (confirmed by backend team as the correct auth
 * method for this endpoint — same pattern as updateAccount).
 *
 * The backend wraps the profile in { status, message, data: { ... } }. We unwrap
 * it and normalise the backend's camelCase `isVerified` to the frontend's
 * snake_case `is_verified` so all components see a consistent field name.
 */
export const getProfile = async () => {
  try {
    const sessionId = Cookies.get('portal_session_id');
    if (!sessionId) throw new Error('No session found');

    const accessToken = Cookies.get('user_access_token');
    const response = await api.get('/shared/profile', {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });

    // Unwrap the envelope — backend returns { status, message, data: { ... } }
    const profileData = { ...(response.data.data || response.data) };

    // Normalise camelCase fields from backend to snake_case used by frontend components
    if (profileData.isVerified !== undefined) profileData.is_verified = profileData.isVerified;
    if (profileData.isActivated !== undefined) profileData.is_activated = profileData.isActivated;

    const existing = (() => {
      try { return JSON.parse(Cookies.get('user') || '{}'); } catch { return {}; }
    })();

    const merged = { ...existing, ...profileData };
    // Preserve a locally-confirmed is_verified written by submitVerification() against
    // any future profile response where the backend might not yet reflect the update.
    if (existing.is_verified === true) merged.is_verified = true;

    Cookies.set('user', JSON.stringify(merged), COOKIE_OPTS);
    return merged;
  } catch (error) {
    // Do NOT call clearAuthCookies() here. A failed profile fetch does not mean the
    // session is invalid — doing so would destroy tokens set by a successful login,
    // causing silent logouts. Let each caller decide how to handle auth errors.
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

/**
 * Reset password via token from email link.
 * Endpoint: PATCH /portal/accounts/reset-password/{token}
 * Body: { password }  ← matches PasswordResetDto
 *
 * NOTE: This endpoint is not documented in the current swagger spec. It supports
 * the email-based forgot-password flow. The swagger equivalent for logged-in users
 * is PATCH /portal/accounts/update-password/{email}. If the backend team documents
 * or changes this endpoint, update accordingly.
 */
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
    const existing = (() => { try { return JSON.parse(Cookies.get('user') || '{}'); } catch { return {}; } })();
    const merged = { ...existing, ...profileData };
    if (existing.is_verified === true) merged.is_verified = true;
    Cookies.set('user', JSON.stringify(merged), COOKIE_OPTS_STRICT);
    return merged;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

/**
 * Resend account activation / verification email.
 * Endpoint: GET /api/v1/portal/accounts/send-activation?email=
 * Auth: Bearer access_token (swagger requirement).
 *
 * FIX: Previously called without auth header. Now sends Bearer token when
 * available. This is called right after registration (before first login), so
 * user_access_token may not exist yet — the token is sent if present and omitted
 * otherwise. Adjust if the backend requires it unconditionally.
 */
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

/** Verify individual NIN. POST /shared/verify/nin/{nin} */
export const verifyNIN = async (nin, firstname, lastname) => {
  try {
    const response = await api.post(`/shared/verify/nin/${nin}`, { firstname, lastname });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

/** Verify business owner NIN. POST /shared/verify/businessNin/{nin} */
export const verifyBusinessNIN = async (nin, firstname, lastname) => {
  try {
    const response = await api.post(`/shared/verify/businessNin/${nin}`, { firstname, lastname });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

/** Verify CAC registration number. POST /shared/verify/cac */
export const verifyCAC = async (regNumber) => {
  try {
    const response = await api.post('/shared/verify/cac', { regNumber });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

/**
 * Verify business TIN. POST /shared/verify/businessTin
 * NOTE: swagger shows no requestBody for this endpoint. Sending { tin } based
 * on the TIN response shape. Adjust key name if backend expects differently.
 */
export const verifyBusinessTIN = async (tin) => {
  try {
    const response = await api.post('/shared/verify/businessTin', { tin });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

/** Verify Payer ID. GET /v1/shared/billing/identification?pid= */
export const verifyPayerId = async (pid) => {
  try {
    const response = await api.get('/shared/billing/identification', { params: { pid } });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

/** Create a new Payer ID (tax payer registration). POST /api/v1/shared/billing/identification */
export const createPayerId = async (dto) => {
  try {
    const response = await api.post('/shared/billing/identification', dto);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

/** Mark user as verified. Persists is_verified, nin, and payerId to the user cookie. */
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

// ─── Session / Service Redirect ────────────────────────────────────────────────

/**
 * Issue a one-time handshake token for redirecting to an external service module.
 * Endpoint: GET /api/v2/session/auth/issuetoken
 *
 * The external module then calls GET /session/auth/connect/{oht} to exchange
 * the temp token for a proper handshake_token it uses for its own billing calls.
 *
 * Returns { oht, url, expiresIn } — `url` is the targetUrl with token appended,
 * ready for window.location.href. Token expires in 180 seconds.
 */
export const issueServiceToken = async ({ email, sid, targetUrl, userType }) => {
  try {
    const response = await api_v2.get('/session/auth/issuetoken', {
      params: { email, sid, redirect: true, url: targetUrl, userType },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

// ─── Billing / Payments ────────────────────────────────────────────────────────

/**
 * Generate a new billing order.
 * Endpoint: POST /api/v2/shared/payment/generate
 * Required DTO fields: pid, amount, agencyCode, revCode, assessmentReference,
 *                      appliedDate, currency, country, state, gateway
 */
export const generateOrder = async (dto) => {
  try {
    const response = await api_v2.post('/shared/payment/generate', dto);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

/**
 * Generate billing receipt — updates order status to CONFIRMED.
 * Endpoint: POST /api/v2/shared/billing/receipt/{orderId}
 */
export const generateBillingReceipt = async (orderId) => {
  try {
    const response = await api_v2.post(`/shared/billing/receipt/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

/**
 * Initialize payment — returns authorizationUrl to redirect user to gateway.
 * Endpoint: POST /api/v2/shared/payment/initialize
 * Body: { order_id }
 */
export const initializePayment = async (orderId) => {
  try {
    const response = await api_v2.post('/shared/payment/initialize', { order_id: orderId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

/**
 * Verify a completed transaction after payment gateway callback.
 * Endpoint: POST /api/v2/shared/payment/transaction/verify
 * Body: { ref } — order_id or payment reference from the gateway
 */
export const verifyTransaction = async (ref) => {
  try {
    const response = await api_v2.post('/shared/payment/transaction/verify', { ref });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

/**
 * Fetch all transactions for the authenticated user.
 * Endpoint: GET /api/v2/shared/transaction
 * Auth: Bearer user_access_token (injected automatically by api_v2 interceptor).
 */
export const fetchTransactions = async () => {
  const token = Cookies.get('user_access_token');
  if (!token) throw new Error('Session expired. Please log in again.');
  try {
    const response = await api.get('/shared/transaction');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

/**
 * Fetch a single transaction by ID.
 * Endpoint: GET /api/v2/shared/transaction/{id}
 * Auth: Bearer user_access_token (injected automatically by api_v2 interceptor).
 */
export const fetchTransaction = async (id) => {
  try {
    const response = await api.get(`/shared/transaction/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};


export default api;
