import React, { useEffect, useState } from 'react';
import { getProfile } from '../services/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const profile = await getProfile(token);
          setUser(profile);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {user && (
        <div>
          <p>Welcome, {user.firstName} {user.lastName}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;