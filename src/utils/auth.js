// src/utils/auth.js
import Cookies from 'js-cookie';

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = Cookies.get('portal_session_id');
  const user = Cookies.get('user');

  console.log('The Token is: ' + token);
  console.log('The User is: ' + user);
  return !!(token && user);
};

// Get current user data
export const getCurrentUser = () => {
  try {
    const userData = Cookies.get('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Get current session token
export const getSessionToken = () => {
  return Cookies.get('portal_session_id');
};

// Clear all authentication data
export const clearAuthData = () => {
  Cookies.remove('portal_session_id');
  Cookies.remove('portal_app_id');
  Cookies.remove('user');
};

// Check if error is authentication related
export const isAuthError = (error) => {
  const status = error?.status || error?.response?.status;
  return status === 401 || status === 403;
};

// Handle authentication errors
export const handleAuthError = (error, navigate) => {
  if (isAuthError(error)) {
    clearAuthData();
    if (navigate) {
      navigate('/login');
    }
    return true;
  }
  return false;
};

// Debug authentication state
export const debugAuthState = () => {
  const token = getSessionToken();
  const user = getCurrentUser();
  
  console.log('=== Auth Debug Info ===');
  console.log('Token exists:', !!token);
  console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'null');
  console.log('User exists:', !!user);
  console.log('User data:', user);
  console.log('Is authenticated:', isAuthenticated());
  console.log('=====================');
  
  return {
    hasToken: !!token,
    hasUser: !!user,
    isAuthenticated: isAuthenticated(),
    tokenPreview: token ? `${token.substring(0, 20)}...` : null,
    user: user
  };
};