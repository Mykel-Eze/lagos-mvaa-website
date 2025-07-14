// src/pages/Registration.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import RegistrationForm from '../components/RegistrationForm';
import EmailVerificationComponent from '../components/EmailVerificationComponent';
import { register, resendVerificationEmail } from '../services/api';
import { toast } from 'react-toastify';

const Registration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Timer effect for resend button
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(timer => timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleRegistrationSubmit = async (values) => {
    setIsLoading(true);
    try {
      // Format the address object as required by the API
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.countryCode + values.phoneNumber,
        address: {
          street: values.street,
          lga: values.lga,
          state: "Lagos",
        },
        password: values.password,
      };

      // Call the register API
      await register(userData);
      
      // Store email and show verification component
      setUserEmail(values.email);
      setShowVerification(true);
      setResendTimer(59); // Start 59 seconds timer

      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (error) {
      const msg = error.exception_message ? Array.isArray(error.exception_message) 
        ? error.exception_message.join('\n') : error.exception_message : 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!userEmail) {
      toast.error('Email address not found. Please try registering again.');
      return;
    }

    setIsResending(true);
    try {
      await resendVerificationEmail(userEmail);
      toast.success('Verification email sent! Please check your inbox.');
      setResendTimer(59); // Reset timer
    } catch (error) {
      toast.error('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout title={showVerification ? "Verify Your Email" : "Get Started"}>
      {showVerification ? (
        <EmailVerificationComponent 
          userEmail={userEmail}
          onResendVerification={handleResendVerification}
          isResending={isResending}
          resendTimer={resendTimer}
        />
      ) : (
        <RegistrationForm 
          onSubmit={handleRegistrationSubmit}
          isLoading={isLoading}
        />
      )}
    </AuthLayout>
  );
};

export default Registration;