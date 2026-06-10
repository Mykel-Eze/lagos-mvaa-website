// src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { getProfile, clearAuthStorage } from '../services/api';
import { isAuthError } from '../utils/auth';

// NOTE: this is a UX gate, not the security boundary. The backend must still enforce
// authorization on every protected endpoint. Here we validate the session against the
// server (rather than trusting a local sessionStorage value) so a forged or expired
// portal_session_id is rejected before the protected UI renders.
const ProtectedRoute = () => {
  const hasSession = !!sessionStorage.getItem('portal_session_id');
  const [status, setStatus] = useState(hasSession ? 'checking' : 'denied');

  useEffect(() => {
    if (!hasSession) return undefined;

    let active = true;
    (async () => {
      try {
        await getProfile();
        if (active) setStatus('authed');
      } catch (error) {
        if (isAuthError(error)) {
          // Session is invalid/expired — clear it and bounce to login.
          clearAuthStorage();
          if (active) setStatus('denied');
        } else if (active) {
          // Transient/non-auth failure (network, 5xx): fail open so a flaky
          // connection doesn't log the user out. Protected endpoints still
          // enforce auth server-side.
          setStatus('authed');
        }
      }
    })();

    return () => { active = false; };
  }, [hasSession]);

  if (status === 'checking') {
    return <LoadingSpinner fullScreen="true" />;
  }

  if (status === 'denied') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;