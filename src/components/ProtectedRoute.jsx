// src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import Cookies from 'js-cookie';

const ProtectedRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is authenticated using cookies
  const isAuthenticated = !!Cookies.get('portal_session_id');

  useEffect(() => {
    // Simulate a delay for checking authentication
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullScreen="true" />; // Show a loading spinner while checking authentication
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;