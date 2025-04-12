// src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner'; // Create a loading spinner component

const ProtectedRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = localStorage.getItem('access_token');

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