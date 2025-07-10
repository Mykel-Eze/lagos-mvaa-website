// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { getProfile } from '../services/api';
import Cookies from 'js-cookie';
import ServicesLayout from '../components/ServicesLayout';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check if we have a session token
        const token = Cookies.get('portal_session_id');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // First load cached data if available
        const cachedUserData = Cookies.get('user');
        if (cachedUserData) {
          const userData = JSON.parse(cachedUserData);
          setUser(userData);
        }

        // Try to fetch fresh profile data
        try {
          const profileData = await getProfile();
          const userData = profileData.user || profileData;
          setUser(userData);
          setError(null);
        } catch (profileError) {
          console.error('Failed to fetch fresh profile:', profileError);
          
          // Check if it's an authentication error
          if (profileError.status === 403 || profileError.status === 401) {
            setError('Session expired. Please login again.');
            // Don't set user to null here, let them see cached data with warning
          } else {
            setError('Failed to load latest profile data');
          }
        }
      } catch (error) {
        console.error('Failed to initialize profile:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">
          <p>Error: {error}</p>
          <p>Please try logging in again.</p>
        </div>
      </div>
    );
  }

  return (
    <ServicesLayout title="Dashboard">
      <div className="p-6">
        {/* <h1 className="text-2xl font-bold mb-4">Dashboard</h1> */}
        {user && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
              </div>
              <div>
                {user.address && (
                  <>
                    <p><strong>Street:</strong> {user.address.street}</p>
                    <p><strong>LGA:</strong> {user.address.lga}</p>
                    <p><strong>State:</strong> {user.address.state}</p>
                  </>
                )}
              </div>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                <p className="text-sm">Note: Showing cached data. {error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </ServicesLayout>
  );
};

export default Dashboard;