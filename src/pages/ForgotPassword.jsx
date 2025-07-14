// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { forgotPassword } from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const { email } = values;
      await forgotPassword(email);
      setEmailSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      toast.error(error.error || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <AuthLayout title="Check Your Email">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Sent!</h3>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to your email address. 
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              type="primary" 
              className="w-full h-[43px] submit-btn text-white text-[12px] uppercase"
              onClick={() => {
                setEmailSent(false);
                form.resetFields();
              }}
            >
              Send Another Email
            </Button>
            
            <div className="text-center">
              <Link to="/login" className="text-green-600 font-medium hover:text-green-700">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Forgot Password">
      <div className="mb-6">
        <p className="text-gray-600 text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <Form 
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item 
          label="Email Address" 
          name="email"
          rules={[
            { required: true, message: 'Please enter your email address' },
            { type: 'email', message: 'Please enter a valid email address' }
          ]}
          className="mb-6"
        >
          <Input size="large" placeholder="Enter your email address" />
        </Form.Item>
        
        <Form.Item className="mb-6">
          <Button 
            type="primary" 
            htmlType="submit" 
            className="w-full h-[43px] submit-btn text-white text-[12px] uppercase"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size="small" color="#ffffff" className="mx-auto" /> : "Send Reset Link"}
          </Button>
        </Form.Item>
        
        <div className="text-center">
          <Link to="/login" className="text-green-600 font-medium hover:text-green-700">
            Back to Login
          </Link>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default ForgotPassword;